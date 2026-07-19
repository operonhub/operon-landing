"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Adapatado de originkit/typewriter para Next.js.
// Escribe el texto char por char, luego el cursor sigue parpadeando.
export default function TypewriterWord({ text = "flota", startDelay = 800, typeSpeed = 72 }) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  // Espera a que las animaciones del hero terminen antes de escribir
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  // Escribe un caracter por tick
  useEffect(() => {
    if (!started || displayText.length >= text.length) return;
    const t = setTimeout(
      () => setDisplayText(text.slice(0, displayText.length + 1)),
      typeSpeed
    );
    return () => clearTimeout(t);
  }, [started, displayText, text, typeSpeed]);

  const cursorVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.45,
        repeatType: "reverse",
      },
    },
  };

  return (
    <>
      {displayText}
      <motion.span
        variants={cursorVariants}
        initial="initial"
        animate="animate"
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.06em",
          height: "0.82em",
          backgroundColor: "currentColor",
          verticalAlign: "middle",
          marginLeft: "0.08em",
          marginBottom: "0.08em",
          borderRadius: "1px",
        }}
      />
    </>
  );
}
