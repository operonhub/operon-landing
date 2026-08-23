// Endpoint de captación de leads para /contanos-tu-proceso.
//
// Recibe el formulario nativo de Operon, revalida y sanitiza todo del lado
// del servidor, y reenvía la fila a una Google Sheet privada a través de un
// Google Apps Script publicado como Web App. Ni la URL del Apps Script ni el
// secreto compartido llegan nunca al navegador: viven solo en variables de
// entorno del servidor.
//
// Node runtime (default) — nada de esto corre en el cliente.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

// ── Helpers ────────────────────────────────────────────────────────────────
const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// Teléfono permisivo: dígitos, +, espacios, guiones y paréntesis (código país).
const isPhone = (v) => /^[+]?[\d\s().-]{6,}$/.test(v) && (v.match(/\d/g) || []).length >= 6;

// Solo para logs: nunca registramos datos personales completos.
const mask = (v) => {
  const s = String(v ?? "");
  if (!s) return "—";
  return `${s.slice(0, 2)}***(${s.length})`;
};

// ── Rate limiting best-effort en memoria ─────────────────────────────────────
// En serverless el estado no se comparte entre instancias, así que esto es una
// barrera básica anti-flood, no una garantía. La protección real vive también
// en el honeypot y en la validación. Ventana: 5 envíos por IP cada 60s, y
// deduplicación de envíos idénticos dentro de 30s.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const DEDUPE_MS = 30_000;
const hits = new Map(); // ip -> number[] timestamps
const recent = new Map(); // fingerprint -> timestamp

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  // Limpieza oportunista para no crecer sin límite.
  if (hits.size > 5000) hits.clear();
  return arr.length > MAX_PER_WINDOW;
}

function isDuplicate(fingerprint) {
  const now = Date.now();
  const last = recent.get(fingerprint);
  recent.set(fingerprint, now);
  if (recent.size > 5000) recent.clear();
  return last && now - last < DEDUPE_MS;
}

export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Cuerpo inválido." }, { status: 400 });
  }

  // Honeypot: los humanos nunca completan este campo oculto.
  if (clean(data.website, 1)) {
    return Response.json({ ok: true }); // fingimos éxito y descartamos en silencio
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Demasiados envíos seguidos. Esperá un momento y probá de nuevo." },
      { status: 429 }
    );
  }

  // ── Sanitización ──────────────────────────────────────────────────────────
  const nombre = clean(data.nombre, 120);
  const empresa = clean(data.empresa, 160);
  const proceso = clean(data.proceso, 500);
  const situacion = clean(data.situacion, 4000);
  const telefono = clean(data.telefono, 60);
  const email = clean(data.email, 160);
  const consentimiento = data.consentimiento === true || data.consentimiento === "true";

  // Campos de campaña (ocultos, capturados desde la URL en el cliente).
  const utm_source = clean(data.utm_source, 200);
  const utm_medium = clean(data.utm_medium, 200);
  const utm_campaign = clean(data.utm_campaign, 200);
  const utm_content = clean(data.utm_content, 200);
  const fbclid = clean(data.fbclid, 400);
  const origen = clean(data.origen, 500);

  // ── Validación del lado del servidor (nunca confiamos en el cliente) ───────
  const errors = {};
  if (!nombre) errors.nombre = "Ingresá tu nombre y apellido.";
  if (!empresa) errors.empresa = "Ingresá el nombre de la empresa.";
  if (!proceso) errors.proceso = "Contanos qué proceso te gustaría simplificar.";
  if (!situacion || situacion.length < 15) {
    errors.situacion =
      "Contanos un poco más: cómo hacen hoy este proceso y qué problema tienen.";
  }
  if (telefono && !isPhone(telefono)) errors.telefono = "Revisá el teléfono ingresado.";
  if (email && !isEmail(email)) errors.email = "Revisá el correo electrónico ingresado.";
  if (!telefono && !email) {
    errors.contacto = "Completá un teléfono o un correo para que podamos comunicarnos.";
  }
  if (!consentimiento) {
    errors.consentimiento = "Necesitamos tu consentimiento para poder comunicarnos.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { ok: false, error: "Revisá los datos del formulario.", fields: errors },
      { status: 422 }
    );
  }

  // Deduplicación de envíos idénticos consecutivos.
  const fingerprint = `${ip}|${email}|${telefono}|${proceso}`;
  if (isDuplicate(fingerprint)) {
    // Idéntico a un envío reciente: respondemos ok para no frustrar al usuario
    // ni escribir una fila duplicada.
    return Response.json({ ok: true, dedupe: true });
  }

  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    console.error("[leads] Falta configurar GOOGLE_SHEETS_WEBHOOK_URL / _SECRET");
    return Response.json(
      { ok: false, error: "El envío no está configurado todavía. Escribinos a admin@operonhub.com." },
      { status: 503 }
    );
  }

  // ── Reenvío a Google Sheets (Apps Script) ──────────────────────────────────
  // El Apps Script agrega la Fecha automáticamente y fija el Estado en "NUEVO".
  const payload = {
    secret: WEBHOOK_SECRET,
    nombre,
    empresa,
    proceso,
    situacion,
    telefono,
    email,
    consentimiento: consentimiento ? "Sí" : "No",
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    fbclid,
    origen,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "follow",
    });

    const raw = await res.text();
    let out = {};
    try {
      out = JSON.parse(raw);
    } catch {
      // Apps Script devolvió algo que no es JSON (típico si el deploy no está
      // publicado correctamente o cayó en una pantalla de login).
      console.error("[leads] Respuesta no-JSON del webhook. HTTP", res.status);
      return Response.json(
        { ok: false, error: "No pudimos guardar tu caso ahora mismo. Probá de nuevo en un momento." },
        { status: 502 }
      );
    }

    if (!res.ok || !out.ok) {
      console.error("[leads] Webhook rechazó el envío. HTTP", res.status, "ok:", out.ok);
      return Response.json(
        { ok: false, error: "No pudimos guardar tu caso ahora mismo. Probá de nuevo en un momento." },
        { status: 502 }
      );
    }

    // Log sin datos personales completos.
    console.log(`[leads] OK · empresa=${mask(empresa)} · contacto=${mask(email || telefono)}`);
    return Response.json({ ok: true });
  } catch (err) {
    if (err?.name === "AbortError") {
      console.error("[leads] Timeout esperando al webhook de Google Sheets.");
    } else {
      console.error("[leads] Error inesperado al reenviar al webhook:", err?.message || err);
    }
    return Response.json(
      { ok: false, error: "No pudimos guardar tu caso ahora mismo. Probá de nuevo en un momento." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
