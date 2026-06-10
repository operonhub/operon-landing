"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Tuning knobs ──────────────────────────────────────────────────────────
   Todos los valores "mágicos" del efecto viven acá arriba para ajustar rápido. */
const DOT_COLOR = "#EAB308";
const HEAD_RADIUS = 10; // radio del punto (el core es 20px de diámetro)
const EXIT_THRESHOLD = 80; // px de scroll antes de que el punto escape
const DOCK_FRACTION = 0.5; // dónde, en el viewport, se acopla al footer (0.5 = centro)
const SCRUB = 2; // suavizado/inercia de ScrollTrigger
const RESIZE_DEBOUNCE = 200; // ms para recalcular el path en resize

const TRAIL_LIFETIME = 28; // frames que vive cada partícula
const TRAIL_MAX_RADIUS = 7; // radio de la partícula nueva
const TRAIL_MIN_RADIUS = 1; // radio de la partícula vieja
const TRAIL_MAX_ALPHA = 0.7;
const JITTER = 2; // ±px de ruido para que la estela no sea rígida

// Visibilidad adaptativa según el fondo bajo el punto
const LUMINANCE_CHECK_INTERVAL = 10; // cada cuántos frames muestreo el fondo
const LIGHT_THRESHOLD = 0.7; // luminancia por encima = fondo claro
const SHADOW_LIGHT = "#92670A"; // sombra cálida oscura sobre fondo claro
const SHADOW_DARK = DOT_COLOR; // glow amarillo sobre fondo oscuro
const RING_OFFSET = 3; // px que el ring exterior sobresale del punto
const RING_COLOR = "rgba(0,0,0,0.15)";
const RING_WIDTH = 1.5;

const MERGE_AT = 0.992; // progress en el que el punto se acopla
const UNMERGE_AT = 0.95; // progress por debajo del cual se desacopla (reversible)

const lerp = (a, b, t) => a + (b - a) * t;
const jitter = () => (Math.random() * 2 - 1) * JITTER;

function parseRGB(str) {
  const m = str && str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((s) => parseFloat(s.trim()));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}

export default function CosmicDot() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null); // lo movemos por el path en cada update del scroll
  const coreRef = useRef(null); // escala/opacidad (la maneja GSAP en el acople)
  const pathSvgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    // 1) Guardas: nada de esto se monta en mobile ni con reduced-motion.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduce) return;

    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    const coreEl = coreRef.current;
    const pathSvg = pathSvgRef.current;
    const pathEl = pathRef.current;
    if (!canvas || !wrapEl || !coreEl || !pathSvg || !pathEl) return;
    const ctx = canvas.getContext("2d");

    // Estado vivo del efecto
    let heroDot = null;
    let footerDot = null;
    let raf = 0;
    let tween = null;
    let mergeTl = null;
    let pendingTimeout = 0;
    let resizeTimer = 0;
    let destroyed = false;

    let traveling = false;
    let merged = false;
    let particles = [];
    let frameCount = 0;
    let currentLum = 0.97; // arranca asumiendo fondo claro (#FBF9F4)

    const head = { x: 0, y: 0 };
    let startDoc = { x: 0, y: 0 };
    let endDoc = { x: 0, y: 0 };
    let pathLen = 0; // longitud de arco del path (para getPointAtLength)
    let dpr = 1;

    /* ── Canvas sizing (retina-aware) ──────────────────────────────────── */
    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ── Geometría: centros del hero y footer en coords de documento ───── */
    function measure() {
      if (!heroDot || !footerDot) return;
      const hr = heroDot.getBoundingClientRect();
      const fr = footerDot.getBoundingClientRect();
      const sy = window.scrollY;
      startDoc = { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2 + sy };
      endDoc = { x: fr.left + fr.width / 2, y: fr.top + fr.height / 2 + sy };
    }

    /* ── Path orgánico: serpentina amplia con un loop en el medio ──────────
       Coordenadas en espacio de viewport (1 unidad SVG = 1px). El inicio y el
       final se anclan a la posición real del hero-dot y del footer-dot; los
       puntos de control intermedios barren de ~8% a ~90% del ancho, asimétricos. */
    function buildPathD() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = startDoc.x; // hero-dot, viewport @ scroll 0
      const sy = startDoc.y;
      const ex = endDoc.x; // footer-dot x (no cambia con scroll)
      const ey = vh * DOCK_FRACTION; // punto de acople en el viewport
      return [
        `M ${sx} ${sy}`,
        // arco amplio hacia la derecha y cruce brusco a la izquierda
        `C ${vw * 0.85} ${vh * 0.15}, ${vw * 0.9} ${vh * 0.28}, ${vw * 0.15} ${vh * 0.32}`,
        // pegado al borde izquierdo, vuelve hacia el centro
        `C ${vw * 0.08} ${vh * 0.36}, ${vw * 0.12} ${vh * 0.44}, ${vw * 0.55} ${vh * 0.48}`,
        // loop/enrollamiento orgánico a mitad de página
        `C ${vw * 0.75} ${vh * 0.52}, ${vw * 0.45} ${vh * 0.5}, ${vw * 0.3} ${vh * 0.54}`,
        // gran barrido de izquierda a derecha
        `C ${vw * 0.1} ${vh * 0.62}, ${vw * 0.08} ${vh * 0.72}, ${vw * 0.8} ${vh * 0.78}`,
        // descenso final hacia el footer-dot
        `C ${vw * 0.88} ${vh * 0.84}, ${vw * 0.6} ${vh * 0.9}, ${ex} ${ey}`,
      ].join(" ");
    }

    /* ── Luminancia del fondo bajo el punto (sube por el DOM hasta hallar
          un background no transparente) ─────────────────────────────────── */
    function bgLuminanceAt(x, y) {
      let el = document.elementFromPoint(x, y);
      let guard = 0;
      while (el && guard < 12) {
        const rgb = parseRGB(getComputedStyle(el).backgroundColor);
        if (rgb && rgb.a > 0.5) {
          return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        }
        el = el.parentElement;
        guard += 1;
      }
      return 0.97; // default: fondo claro del body
    }

    /* ── Mostrar/ocultar el punto libre y fundir el dot del hero ───────── */
    function setTraveling(on) {
      if (on === traveling) return;
      traveling = on;
      gsap.to(heroDot, { opacity: on ? 0 : 1, duration: 0.3, overwrite: "auto" });
      wrapEl.style.opacity = on ? "1" : "0";
    }

    /* ── Acople final: el punto se funde en el logo del footer ─────────── */
    function doMerge() {
      merged = true;
      if (mergeTl) mergeTl.kill();
      mergeTl = gsap
        .timeline()
        .to(coreEl, { scale: 1.5, duration: 0.18, ease: "power2.out" })
        .to(coreEl, { scale: 0, opacity: 0, duration: 0.32, ease: "power3.in" });
      gsap.fromTo(
        footerDot,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
          svgOrigin: "28 24",
          onComplete: () => gsap.to(footerDot, { scale: 1, duration: 0.3, svgOrigin: "28 24" }),
        }
      );
      footerDot.style.filter = `drop-shadow(0 0 6px ${DOT_COLOR})`;
    }

    function unMerge() {
      merged = false;
      if (mergeTl) mergeTl.kill();
      gsap.set(coreEl, { scale: 1, opacity: 1 });
      gsap.set(footerDot, { scale: 1, svgOrigin: "28 24" });
      footerDot.style.filter = "";
    }

    /* ── Trayectoria: muestreo el path por longitud de arco (velocidad
          constante) y posiciono el punto. Llamado por el proxy-tween. ───── */
    function updateHead(p) {
      setTraveling(window.scrollY >= EXIT_THRESHOLD);

      if (!merged && pathLen > 0) {
        const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
        const pt = pathEl.getPointAtLength(clamped * pathLen);
        head.x = pt.x;
        head.y = pt.y;
        wrapEl.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
        if (traveling) {
          particles.push({ x: pt.x + jitter(), y: pt.y + jitter(), life: TRAIL_LIFETIME });
        }
      }

      if (!merged && p >= MERGE_AT) doMerge();
      else if (merged && p < UNMERGE_AT) unMerge();
    }

    /* ── Loop de render del canvas (siempre activo mientras existe) ────── */
    function frame() {
      if (destroyed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Muestreo el fondo bajo el punto para adaptar el glow de la estela.
      if (traveling && frameCount % LUMINANCE_CHECK_INTERVAL === 0) {
        currentLum = bgLuminanceAt(head.x, head.y);
      }
      frameCount += 1;

      // Estela: el glow se adapta al fondo para tener mordida siempre.
      const light = currentLum > LIGHT_THRESHOLD;
      ctx.save();
      ctx.shadowColor = light ? SHADOW_LIGHT : SHADOW_DARK;
      ctx.shadowBlur = light ? 8 : 16;
      ctx.fillStyle = DOT_COLOR;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life -= 1;
        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const t = pt.life / TRAIL_LIFETIME; // 1 nueva → 0 vieja
        const radius = lerp(TRAIL_MIN_RADIUS, TRAIL_MAX_RADIUS, t);
        ctx.globalAlpha = t * TRAIL_MAX_ALPHA;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Ring exterior: da "mordida" al punto sobre fondos claros sin teñirlo.
      if (traveling && !merged) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(head.x, head.y, HEAD_RADIUS + RING_OFFSET, 0, Math.PI * 2);
        ctx.strokeStyle = RING_COLOR;
        ctx.lineWidth = RING_WIDTH;
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }

    /* ── (Re)construye el path y la animación MotionPath ───────────────── */
    function buildAndAnimate() {
      if (!heroDot || !footerDot) return;
      measure();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // El SVG mapea 1 unidad = 1px de viewport (fijo, full-screen).
      pathSvg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
      pathSvg.setAttribute("width", String(vw));
      pathSvg.setAttribute("height", String(vh));
      pathEl.setAttribute("d", buildPathD());
      pathLen = pathEl.getTotalLength();

      if (tween) {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      }

      // Proxy-tween: ScrollTrigger scrubbea proxy.p de 0→1 y en cada update
      // muestreamos el path. end = scroll donde el footer-dot llega al acople.
      const proxy = { p: 0 };
      tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: Math.max(1, endDoc.y - vh * DOCK_FRACTION),
          scrub: SCRUB,
        },
        onUpdate: () => updateHead(proxy.p),
      });
    }

    function onResize() {
      resizeCanvas();
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildAndAnimate();
        ScrollTrigger.refresh();
      }, RESIZE_DEBOUNCE);
    }

    function onLoad() {
      // El alto del documento puede cambiar al cargar fuentes/imágenes.
      buildAndAnimate();
      ScrollTrigger.refresh();
    }

    /* ── Arranque ──────────────────────────────────────────────────────── */
    function start() {
      resizeCanvas();
      gsap.set(coreEl, { scale: 1, opacity: 1 });
      buildAndAnimate();
      ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      window.addEventListener("load", onLoad);
      raf = requestAnimationFrame(frame);
    }

    /* ── Init con reintentos por si el SVG aún no montó ────────────────── */
    function init(attempt = 0) {
      if (destroyed) return;
      heroDot = document.querySelector("[data-hero-dot]");
      footerDot = document.querySelector("[data-footer-logo]");
      if ((!heroDot || !footerDot) && attempt < 5) {
        pendingTimeout = window.setTimeout(() => init(attempt + 1), 200);
        return;
      }
      if (!heroDot || !footerDot) return; // no encontró anclajes → no monta
      start();
    }

    init();

    /* ── Cleanup ───────────────────────────────────────────────────────── */
    return () => {
      destroyed = true;
      if (pendingTimeout) clearTimeout(pendingTimeout);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      if (mergeTl) mergeTl.kill();
      if (tween) {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      if (heroDot) gsap.set(heroDot, { opacity: 1 });
      if (footerDot) {
        gsap.set(footerDot, { scale: 1 });
        footerDot.style.filter = "";
      }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cosmic-canvas" aria-hidden="true" />
      <svg ref={pathSvgRef} className="cosmic-path-svg" aria-hidden="true">
        <path ref={pathRef} fill="none" />
      </svg>
      <div ref={wrapRef} className="cosmic-dot-wrap" aria-hidden="true">
        <div ref={coreRef} className="cosmic-dot-core" />
      </div>
    </>
  );
}
