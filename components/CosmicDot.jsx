"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Tuning knobs ──────────────────────────────────────────────────────────
   Todos los valores "mágicos" del efecto viven acá arriba para ajustar rápido. */
const DOT_COLOR = "#EAB308";
const EXIT_THRESHOLD = 80; // px de scroll antes de que el punto escape
const WAVE_AMPLITUDE = 100; // px de oscilación horizontal
const WAVE_CYCLES = 3; // ciclos sin() a lo largo de la página
const TRAIL_LIFETIME = 28; // frames que vive cada partícula
const TRAIL_MAX_RADIUS = 7; // radio de la partícula nueva
const TRAIL_MIN_RADIUS = 1; // radio de la partícula vieja
const TRAIL_MAX_ALPHA = 0.7;
const JITTER = 2; // ±px de ruido para que la estela no sea rígida
const MERGE_AT = 0.992; // progress en el que el punto se acopla
const UNMERGE_AT = 0.95; // progress por debajo del cual se desacopla (reversible)
const SCRUB = 1.5; // suavizado/inercia de ScrollTrigger

const lerp = (a, b, t) => a + (b - a) * t;
const jitter = () => (Math.random() * 2 - 1) * JITTER;

export default function CosmicDot() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null); // posición (la movemos cada frame)
  const coreRef = useRef(null); // escala/opacidad (la maneja GSAP en el acople)

  useEffect(() => {
    // 1) Guardas: nada de esto se monta en mobile ni con reduced-motion.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduce) return;

    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    const coreEl = coreRef.current;
    if (!canvas || !wrapEl || !coreEl) return;
    const ctx = canvas.getContext("2d");

    // Estado vivo del efecto
    let heroDot = null;
    let footerDot = null;
    let raf = 0;
    let tween = null;
    let mergeTl = null;
    let pendingTimeout = 0;
    let destroyed = false;

    let traveling = false;
    let merged = false;
    let particles = [];

    const head = { x: 0, y: 0, emit: false };
    let startDoc = { x: 0, y: 0 };
    let endDoc = { x: 0, y: 0 };
    let maxScroll = 1;
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
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
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
      head.emit = false;
      if (mergeTl) mergeTl.kill();
      // El punto viajero: pulso y desaparición.
      mergeTl = gsap
        .timeline()
        .to(coreEl, { scale: 1.5, duration: 0.18, ease: "power2.out" })
        .to(coreEl, { scale: 0, opacity: 0, duration: 0.32, ease: "power3.in" });
      // El dot del logo del footer: pulso elástico + glow permanente.
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

    /* ── Trayectoria, llamada por ScrollTrigger (progress scrubbeado) ──── */
    function updateHead(p) {
      const shouldTravel = window.scrollY >= EXIT_THRESHOLD;
      setTraveling(shouldTravel);

      if (!shouldTravel) {
        head.emit = false;
        if (merged) unMerge();
        return;
      }

      if (!merged) {
        const baseX = lerp(startDoc.x, endDoc.x, p);
        const baseY = lerp(startDoc.y, endDoc.y - maxScroll, p);
        const envelope = Math.sin(p * Math.PI); // 0 en extremos, 1 en el medio
        const waveX = Math.sin(p * Math.PI * 2 * WAVE_CYCLES) * WAVE_AMPLITUDE * envelope;
        head.x = baseX + waveX;
        head.y = baseY;
        head.emit = true;
      }

      if (!merged && p >= MERGE_AT) doMerge();
      else if (merged && p < UNMERGE_AT) unMerge();
    }

    /* ── Loop de render del canvas (siempre activo mientras existe) ────── */
    function frame() {
      if (destroyed) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (traveling) {
        wrapEl.style.transform = `translate3d(${head.x}px, ${head.y}px, 0) translate(-50%, -50%)`;
        if (head.emit) {
          particles.push({ x: head.x + jitter(), y: head.y + jitter(), life: TRAIL_LIFETIME });
        }
      }

      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = DOT_COLOR;
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

      raf = requestAnimationFrame(frame);
    }

    /* ── Arranque (con reintentos por si el SVG aún no montó) ──────────── */
    function start() {
      resizeCanvas();
      measure();
      gsap.set(coreEl, { scale: 1, opacity: 1 });

      const proxy = { p: 0 };
      tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB,
          onRefresh: measure,
        },
        onUpdate: () => updateHead(proxy.p),
      });

      window.addEventListener("resize", onResize);
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      resizeCanvas();
      ScrollTrigger.refresh();
    }

    function init(attempt = 0) {
      if (destroyed) return;
      heroDot = document.querySelector("[data-hero-dot]");
      footerDot = document.querySelector("[data-footer-logo]");
      if ((!heroDot || !footerDot) && attempt < 5) {
        pendingTimeout = window.setTimeout(() => init(attempt + 1), 200);
        return;
      }
      if (!heroDot || !footerDot) return; // no encontró los anclajes → no monta
      start();
    }

    init();

    /* ── Cleanup ───────────────────────────────────────────────────────── */
    return () => {
      destroyed = true;
      if (pendingTimeout) clearTimeout(pendingTimeout);
      if (raf) cancelAnimationFrame(raf);
      if (mergeTl) mergeTl.kill();
      if (tween) {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      }
      window.removeEventListener("resize", onResize);
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
      <div ref={wrapRef} className="cosmic-dot-wrap" aria-hidden="true">
        <div ref={coreRef} className="cosmic-dot-core" />
      </div>
    </>
  );
}
