"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./IntroReservas.module.css";

const SESSION_KEY = "operon-reservas:intro-despegue-v4";
const AUDIO_URL = "/brand/reservas-intro/despegue.mp3";
// En la respuesta HTML, ocultar la cobertura antes de pintar si ya se vio.
// En navegaciones del router, useLayoutEffect resuelve esta decisión antes del paint.
const BEFORE_PAINT_SCRIPT = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(SESSION_KEY)})||location.hash){document.currentScript.previousElementSibling.hidden=true;}}catch(e){}})();`;

export default function IntroReservas() {
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);
  const startedAtRef = useRef(0);
  const skipRef = useRef(null);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      // Storage bloqueado: la animación sigue siendo descartable.
    }
    audioRef.current?.pause();
    setVisible(false);
  }, []);

  useLayoutEffect(() => {
    if (
      !matchMedia("(min-width: 1024px)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      location.hash
    ) {
      setVisible(false);
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setVisible(false);
        return;
      }
    } catch {
      // No hacer depender el acceso a la landing de sessionStorage.
    }

    let cancelled = false;
    let fontTimeout;
    const fonts = Promise.all([
      document.fonts.load('600 142px "Operon Intro Display"'),
      document.fonts.load('500 30px "Operon Intro Mono"'),
    ]).catch(() => {});
    Promise.race([
      fonts,
      new Promise((resolve) => { fontTimeout = setTimeout(resolve, 250); }),
    ]).then(() => {
      if (
        !cancelled &&
        matchMedia("(min-width: 1024px)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) setPlaying(true);
      else if (!cancelled) setVisible(false);
    });

    return () => {
      cancelled = true;
      clearTimeout(fontTimeout);
    };
  }, []);

  useEffect(() => {
    if (!visible || !playing) return;

    const content = document.getElementById("reservas-contenido");
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousInert = content?.inert;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    startedAtRef.current = performance.now();

    const audio = new Audio(AUDIO_URL);
    audio.volume = 0.55;
    audio.onplay = () => setSoundEnabled(true);
    audio.onpause = () => setSoundEnabled(false);
    audioRef.current = audio;
    // En una visita directa el navegador puede bloquear el audio; el control
    // permite activarlo con un gesto sin interrumpir la animación.
    audio.play().catch(() => {});

    const safetyTimeout = setTimeout(finish, 3400);
    const onKeyDown = (event) => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") {
        const buttons = document.querySelectorAll('[data-reservas-intro] button');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const desktop = matchMedia("(min-width: 1024px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = () => {
      if (!desktop.matches || reduced.matches) finish();
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onPreferenceChange);
    reduced.addEventListener("change", onPreferenceChange);

    return () => {
      clearTimeout(safetyTimeout);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onPreferenceChange);
      reduced.removeEventListener("change", onPreferenceChange);
      audio.onplay = null;
      audio.onpause = null;
      audio.pause();
      audioRef.current = null;
      document.body.style.overflow = previousOverflow;
      if (content) content.inert = previousInert;
      if (previousFocus?.isConnected && previousFocus !== document.body) {
        previousFocus.focus({ preventScroll: true });
      } else if (content?.isConnected) {
        content.focus({ preventScroll: true });
      }
    };
  }, [visible, playing, finish]);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    audio.currentTime = Math.min((performance.now() - startedAtRef.current) / 1000, 2.9);
    audio.play().catch(() => {});
  }

  if (!visible) return null;

  return (
    <>
    <div
      className={`${styles.intro} ${playing ? "" : styles.waiting}`}
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenido a Operon Reservas"
      data-reservas-intro
      data-state={playing ? "playing" : "waiting"}
      suppressHydrationWarning
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <div className={styles.artwork} aria-hidden="true">
        <svg viewBox="0 0 1920 1080" className={styles.canvas}>
          <g transform="translate(960 470)">
            <g className={styles.shift}>
              <g className={styles.flight}>
                <g fill="none" stroke="#FBF9F4" strokeWidth="1.4">
                  <circle r="80" className={styles.echoOne} />
                  <circle r="80" className={styles.echoTwo} />
                </g>
                <circle r="63" fill="none" stroke="#FBF9F4" strokeWidth="16.2" />
                <path d="M-18 63 L18 63 L0 87 Z" fill="#FBF9F4" />
                <g className={styles.cord}>
                  <path d="M0 87 C-12 111 21 120 6 162" fill="none" stroke="#FBF9F4" strokeWidth="10.044" strokeLinecap="round" />
                </g>
                <circle r="15.39" fill="#F2C94C" className={styles.yolk} />
              </g>
            </g>
          </g>
        </svg>
        <span className={styles.word}><span className={styles.letters}>peron</span></span>
        <span className={styles.descriptor}>RESERVAS</span>
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? "Silenciar sonido de inicio" : "Activar sonido de inicio"} className={styles.sound}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
            {soundEnabled ? <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" strokeLinecap="round" /> : <path d="m16 9 5 6m0-6-5 6" strokeLinecap="round" />}
          </svg>
        </button>
        <button ref={skipRef} type="button" onClick={finish} className={styles.skip}>Omitir <span aria-hidden="true">→</span></button>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT_SCRIPT }} />
    <noscript><style>{"[data-reservas-intro]{display:none!important}"}</style></noscript>
    </>
  );
}
