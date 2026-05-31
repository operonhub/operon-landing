"use client";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BalloonMark from "./BalloonMark";

const TO_EMAIL = "hola@operon.ar";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    tipo: "Automatización",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);

  // Listen to data-open-contact clicks on the entire page
  useEffect(() => {
    const handler = (e) => {
      const trigger = e.target.closest("[data-open-contact]");
      if (trigger) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => setSent(false), 300);
  }, []);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = `[Operon] Nuevo contacto · ${form.tipo}`;
    const lines = [
      `Hola Operon,`,
      ``,
      `Nombre: ${form.nombre}`,
      `Empresa: ${form.empresa || "—"}`,
      `Email: ${form.email}`,
      `Tipo de proyecto: ${form.tipo}`,
      ``,
      `Mensaje:`,
      form.mensaje,
      ``,
      `— Enviado desde operon.ar`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    const href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
    // Open the user's email client
    window.location.href = href;
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="relative w-full max-w-[560px] bg-paper border border-line rounded-3xl shadow-[0_24px_80px_rgba(20,19,15,0.18)] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="relative px-7 lg:px-9 pt-7 pb-5 border-b border-line/70 overflow-hidden">
              <div
                className="absolute -top-20 -right-16 w-[280px] h-[280px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(31,64,194,.18), rgba(31,64,194,0) 70%)",
                }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="float">
                    <BalloonMark size={36} color="#14130F" accent="#F2C94C" stroke={5.6} />
                  </div>
                  <div>
                    <div className="font-mono-up text-blue">§ Contacto</div>
                    <h3 className="font-display font-semibold text-[22px] tracking-tight mt-1">
                      Hablemos.
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="text-mute hover:text-ink rounded-full w-8 h-8 inline-flex items-center justify-center hover:bg-cream"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
              <p className="relative mt-3 text-[14px] leading-[1.55] text-mute max-w-[44ch]">
                Contanos qué necesitás. Te respondemos en menos de 24 hs hábiles.
              </p>
            </div>

            {/* Body */}
            {!sent ? (
              <form onSubmit={submit} className="p-7 lg:p-9 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nombre" required>
                    <input
                      required
                      value={form.nombre}
                      onChange={onChange("nombre")}
                      className="input"
                      placeholder="Cómo te llamás"
                      autoFocus
                    />
                  </Field>
                  <Field label="Empresa">
                    <input
                      value={form.empresa}
                      onChange={onChange("empresa")}
                      className="input"
                      placeholder="Opcional"
                    />
                  </Field>
                </div>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    className="input"
                    placeholder="tu@empresa.com"
                  />
                </Field>
                <Field label="Tipo de proyecto" required>
                  <select
                    value={form.tipo}
                    onChange={onChange("tipo")}
                    className="input"
                  >
                    <option>Automatización</option>
                    <option>SaaS a medida</option>
                    <option>Software especializado</option>
                    <option>Desarrollo web</option>
                    <option>Todavía no lo tengo claro</option>
                  </select>
                </Field>
                <Field label="Contanos un poco" required>
                  <textarea
                    required
                    rows={4}
                    value={form.mensaje}
                    onChange={onChange("mensaje")}
                    className="input resize-none"
                    placeholder="Qué proceso querés resolver, qué herramientas usás, qué probaste hasta ahora…"
                  />
                </Field>

                <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
                  <span className="font-mono-up text-soft">
                    Abre tu cliente de email
                  </span>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 bg-ink text-paper font-display font-semibold text-[14px] px-5 py-3 rounded-xl hover:bg-blue"
                  >
                    Enviar mensaje
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>

                <p className="font-mono-up text-soft mt-1">
                  O escribinos directo a{" "}
                  <a href={`mailto:${TO_EMAIL}`} className="text-blue hover:underline">
                    {TO_EMAIL}
                  </a>
                </p>
              </form>
            ) : (
              <div className="p-9 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-soft flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#1F40C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l5 5L19 5" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-[22px] tracking-tight">
                  Listo.
                </h3>
                <p className="mt-2 text-[14px] text-mute max-w-[34ch] mx-auto leading-[1.55]">
                  Te abrimos el email con todo precargado. Apretá enviar y te respondemos a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 inline-flex items-center gap-2 border border-ink text-ink font-display font-semibold text-[14px] px-5 py-3 rounded-xl hover:bg-ink hover:text-paper"
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>

          <style jsx>{`
            :global(.input) {
              width: 100%;
              background: #fff;
              border: 1px solid var(--line);
              border-radius: 10px;
              padding: 11px 14px;
              font-family: inherit;
              font-size: 14.5px;
              color: var(--ink);
              outline: none;
              transition: border-color 0.15s, box-shadow 0.15s;
            }
            :global(.input::placeholder) {
              color: var(--soft);
            }
            :global(.input:focus) {
              border-color: var(--ink);
              box-shadow: 0 0 0 3px rgba(31, 64, 194, 0.12);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block font-mono-up text-mute mb-1.5">
        {label}
        {required && <span className="text-blue ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
