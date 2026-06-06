# Setup Operon Landing

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Variables de entorno

Copia `.env.example` a `.env.local` y completá:

```bash
cp .env.example .env.local
```

```
RESEND_API_KEY=re_...  # Tu API key de Resend (https://resend.com/api-keys)
```

**Sin la API key:** el formulario cae con elegancia a un mailto: fallback. **Con la key:** los emails se envían a `admin@operonhub.com` via Resend.

## Producción (Vercel)

El deploy automático ocurre cuando hacés `git push main`.

**Env vars requeridas en Vercel → Settings → Environment Variables:**
- `RESEND_API_KEY` (Sensitive) — la key que generaste en Resend

**Status actual:**
- ✅ Formulario de contacto en vivo
- ✅ Emails llegando a admin@operonhub.com
- ✅ Endpoint POST /api/contact validado (HTTP 200 con id del email)

### Verificación

Testea el endpoint:
```bash
curl -X POST https://operonhub.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "tipo": "Automatización",
    "mensaje": "Test message"
  }'
```

Esperado:
```json
{"ok":true,"id":"<resend-message-id>"}
```

## Después: verificar dominio en Resend (opcional pero recomendado)

Una vez que el sistema esté estable, verificá `operonhub.com` en [resend.com/domains](https://resend.com/domains) para que los emails salgan desde tu propio dominio en lugar del sandbox `onboarding@resend.dev`.

Cuando verifiques, actualizá en Vercel:
```
CONTACT_FROM="Operon <noreply@operonhub.com>"
```

Sin cambios en el código — el endpoint lo lee automáticamente.

## Stack

- **Next.js 14** — App Router, server components
- **Tailwind CSS** — styling
- **Framer Motion** — animaciones
- **Resend** — email delivery
- **Vercel** — hosting
