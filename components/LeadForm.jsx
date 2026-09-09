"use client";
import { useEffect, useState } from "react";

const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[+]?[\d\s().-]{6,}$/.test(v) && (v.match(/\d/g) || []).length >= 6;

const EMPTY = {
  nombre: "",
  empresa: "",
  proceso: "",
  situacion: "",
  telefono: "",
  email: "",
  consentimiento: false,
  website: "", // honeypot — debe quedar vacío
};

export default function LeadForm() {
  const [form, setForm] = useState(EMPTY);
  // Campos de campaña capturados desde la URL (nunca visibles como preguntas).
  const [campaign, setCampaign] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    fbclid: "",
    origen: "",
  });
  // status: "idle" | "sending" | "sent" | "error"
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // Captura de campaña al montar: UTMs + fbclid desde el query, y URL de origen.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = { origen: window.location.href.slice(0, 500) };
      for (const k of CAMPAIGN_KEYS) next[k] = (params.get(k) || "").slice(0, 400);
      setCampaign((c) => ({ ...c, ...next }));
    } catch {
      /* noop */
    }
  }, []);

  const set = (k) => (e) => {
    const value = k === "consentimiento" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    // Limpiamos el error del campo apenas el usuario lo corrige.
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  function validate() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre y apellido.";
    if (!form.empresa.trim()) e.empresa = "Ingresá el nombre de la empresa.";
    if (!form.proceso.trim()) e.proceso = "Contanos qué proceso te gustaría simplificar.";
    if (form.situacion.trim().length < 15) {
      e.situacion = "Contanos un poco más: cómo lo hacen hoy y qué problema tienen.";
    }
    if (form.telefono.trim() && !isPhone(form.telefono.trim())) {
      e.telefono = "Revisá el teléfono ingresado.";
    }
    if (form.email.trim() && !isEmail(form.email.trim())) {
      e.email = "Revisá el correo electrónico ingresado.";
    }
    if (!form.telefono.trim() && !form.email.trim()) {
      e.contacto = "Completá un teléfono o un correo para que podamos comunicarnos.";
    }
    if (!form.consentimiento) {
      e.consentimiento = "Necesitamos tu consentimiento para poder comunicarnos.";
    }
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (status === "sending") return; // evita envíos duplicados
    setFormError("");

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          empresa: form.empresa.trim(),
          proceso: form.proceso.trim(),
          situacion: form.situacion.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          consentimiento: form.consentimiento,
          website: form.website, // honeypot
          ...campaign,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        if (json?.fields) setErrors(json.fields);
        setFormError(
          json?.error ||
            "No pudimos guardar tu caso ahora mismo. Probá de nuevo en un momento."
        );
        setStatus("error");
        return; // conservamos todo lo que el usuario escribió
      }

      // Éxito confirmado por Google Sheets → recién ahora emitimos el evento Lead
      // de Meta Pixel (si está configurado). No se dispara al presionar el botón.
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead");
      }
      setStatus("sent");
    } catch (err) {
      console.error("[lead] submit failed");
      setFormError(
        "No pudimos guardar tu caso ahora mismo. Revisá tu conexión y probá de nuevo."
      );
      setStatus("error");
    }
  }

  // ── Pantalla de éxito ───────────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-line bg-paper p-8 lg:p-12 text-center shadow-[0_24px_80px_rgba(20,19,15,0.06)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-soft">
          <svg
            width="26"
            height="26"
            viewBox="0 0 22 22"
            fill="none"
            stroke="#1F40C2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 11l5 5L19 5" />
          </svg>
        </div>
        <h2 className="font-display text-[26px] lg:text-[30px] font-semibold tracking-tight">
          Gracias por contarnos tu caso
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[15.5px] leading-[1.6] text-mute">
          Vamos a revisar la información y nos comunicaremos para coordinar una
          conversación breve.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-display text-[14.5px] font-semibold text-paper transition-colors hover:bg-blue"
        >
          Volver a Operon
          <span aria-hidden>→</span>
        </a>
      </div>
    );
  }

  // ── Formulario ──────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-line bg-paper p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(20,19,15,0.06)]"
    >
      <div className="grid gap-5">
        <Field label="Nombre y apellido" htmlFor="nombre" required error={errors.nombre}>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            className="lead-input"
            value={form.nombre}
            onChange={set("nombre")}
            aria-invalid={!!errors.nombre}
          />
        </Field>

        <Field label="Nombre de la empresa" htmlFor="empresa" required error={errors.empresa}>
          <input
            id="empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            className="lead-input"
            value={form.empresa}
            onChange={set("empresa")}
            aria-invalid={!!errors.empresa}
          />
        </Field>

        <Field
          label="¿Qué proceso te gustaría simplificar?"
          htmlFor="proceso"
          required
          error={errors.proceso}
        >
          <input
            id="proceso"
            name="proceso"
            type="text"
            className="lead-input"
            placeholder="Por ejemplo: creación de presupuestos, actualización de precios o seguimiento de pedidos"
            value={form.proceso}
            onChange={set("proceso")}
            aria-invalid={!!errors.proceso}
          />
        </Field>

        <Field
          label="¿Cómo realizan actualmente este proceso y qué problema tienen?"
          htmlFor="situacion"
          required
          help="Contanos qué herramientas utilizan, qué pasos realizan y dónde pierden más tiempo."
          error={errors.situacion}
        >
          <textarea
            id="situacion"
            name="situacion"
            rows={5}
            className="lead-input resize-y"
            value={form.situacion}
            onChange={set("situacion")}
            aria-invalid={!!errors.situacion}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Teléfono o WhatsApp de contacto"
            htmlFor="telefono"
            error={errors.telefono}
          >
            <input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="lead-input"
              placeholder="+54 9 11 …"
              value={form.telefono}
              onChange={set("telefono")}
              aria-invalid={!!errors.telefono}
            />
          </Field>

          <Field label="Correo electrónico" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="lead-input"
              placeholder="nombre@empresa.com"
              value={form.email}
              onChange={set("email")}
              aria-invalid={!!errors.email}
            />
          </Field>
        </div>

        {errors.contacto && <FieldError>{errors.contacto}</FieldError>}
        <p className="-mt-2 font-mono-up text-soft">
          Podés dejar teléfono, correo o ambos.
        </p>

        {/* Consentimiento */}
        <label className="mt-1 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consentimiento"
            className="lead-checkbox"
            checked={form.consentimiento}
            onChange={set("consentimiento")}
            aria-invalid={!!errors.consentimiento}
          />
          <span className="text-[14px] leading-[1.5] text-ink">
            Acepto que Operon se comunique conmigo para conocer mi caso.
          </span>
        </label>
        {errors.consentimiento && <FieldError>{errors.consentimiento}</FieldError>}

        {/* Honeypot — oculto para humanos, atrapa bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
          <label>
            No completar
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </label>
        </div>

        {status === "error" && formError && (
          <div
            role="alert"
            className="rounded-xl border border-[#EBC5BF] bg-[#FBEDEA] px-4 py-3 text-[14px] leading-[1.5] text-[#8A2318]"
          >
            {formError}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="font-mono-up text-soft hidden sm:inline">
            Te respondemos a la brevedad
          </span>
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-[15px] font-semibold text-paper transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Enviando…" : "Enviar mi caso"}
            {status !== "sending" && (
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, required, help, error, children }) {
  return (
    <div className="block">
      <label htmlFor={htmlFor} className="mb-1.5 block font-mono-up text-mute">
        {label}
        {required && <span className="ml-1 text-blue">*</span>}
      </label>
      {help && <p className="mb-2 text-[13px] leading-[1.45] text-soft">{help}</p>}
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function FieldError({ children }) {
  return (
    <p className="mt-1.5 text-[13px] leading-[1.45] text-[#8A2318]" role="alert">
      {children}
    </p>
  );
}
