import { Resend } from "resend";

// Node runtime (default) — the Resend SDK runs server-side only, so the
// API key never reaches the browser.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO || "admin@operonhub.com";
// Until operonhub.com is verified in Resend, the sandbox sender only
// delivers to the account owner. After verifying the domain, set
// CONTACT_FROM="Operon <noreply@operonhub.com>" in the environment.
const FROM = process.env.CONTACT_FROM || "Operon <onboarding@resend.dev>";

const TYPES = [
  "Automatización",
  "SaaS a medida",
  "Software especializado",
  "Desarrollo web",
  "Todavía no lo tengo claro",
];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Cuerpo inválido." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(data.website, 1)) {
    return Response.json({ ok: true }); // pretend success, drop silently
  }

  const nombre = clean(data.nombre, 120);
  const empresa = clean(data.empresa, 120);
  const email = clean(data.email, 160);
  const tipo = TYPES.includes(data.tipo) ? data.tipo : "Consulta";
  const mensaje = clean(data.mensaje, 4000);

  // Server-side validation — never trust the client.
  if (!nombre || !email || !mensaje) {
    return Response.json(
      { ok: false, error: "Faltan campos obligatorios." },
      { status: 422 }
    );
  }
  if (!isEmail(email)) {
    return Response.json({ ok: false, error: "Email inválido." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration — let the client fall back to mailto gracefully.
    return Response.json(
      { ok: false, error: "El envío no está configurado todavía." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const subject = `[Operon] Nueva consulta · ${tipo} — ${nombre}`;
  const text = [
    `Nombre:  ${nombre}`,
    `Empresa: ${empresa || "—"}`,
    `Email:   ${email}`,
    `Tipo:    ${tipo}`,
    ``,
    `Mensaje:`,
    mensaje,
    ``,
    `— Enviado desde operonhub.com`,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#14130F;max-width:560px">
      <p style="font:600 12px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#1F40C2;margin:0 0 16px">
        Nueva consulta · ${escapeHtml(tipo)}
      </p>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.6">
        <tr><td style="color:#6B655B;padding-right:16px">Nombre</td><td><strong>${escapeHtml(nombre)}</strong></td></tr>
        <tr><td style="color:#6B655B;padding-right:16px">Empresa</td><td>${escapeHtml(empresa || "—")}</td></tr>
        <tr><td style="color:#6B655B;padding-right:16px">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#1F40C2">${escapeHtml(email)}</a></td></tr>
        <tr><td style="color:#6B655B;padding-right:16px">Tipo</td><td>${escapeHtml(tipo)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #D9D2C0;margin:20px 0"/>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.65;margin:0">${escapeHtml(mensaje)}</p>
      <p style="font:500 11px/1 ui-monospace,monospace;letter-spacing:.06em;color:#A39C90;margin-top:24px">
        Enviado desde operonhub.com
      </p>
    </div>`;

  try {
    const { data: sent, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email, // hit "Reply" → answers the prospect directly
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return Response.json(
        { ok: false, error: "No se pudo enviar el mensaje." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, id: sent?.id ?? null });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return Response.json(
      { ok: false, error: "Error inesperado al enviar." },
      { status: 500 }
    );
  }
}
