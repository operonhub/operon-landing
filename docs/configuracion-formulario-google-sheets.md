# Configuración del formulario `/contanos-tu-proceso` → Google Sheets

Esta guía conecta el formulario nativo de Operon con una **Google Sheet privada**.
El flujo es:

```
Navegador → POST /api/leads (servidor Operon)
          → Google Apps Script (Web App, con secreto compartido)
          → fila nueva en la Google Sheet + correo de aviso
```

La URL del Apps Script y el secreto **viven solo en el servidor** (variables de
entorno en Vercel). El navegador nunca los ve.

---

## 1. Crear la Google Sheet

1. Entrá a [sheets.new](https://sheets.new) con la cuenta de Google de Operon.
2. Nombrala, por ejemplo: **Operon · Leads /contanos-tu-proceso**.
3. Renombrá la primera pestaña a **`Leads`** (clic derecho en la pestaña de abajo → *Cambiar nombre*).

## 2. Colocar los encabezados

En la fila **1**, pegá estos 15 encabezados, uno por columna (de A a O):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Fecha | Nombre y apellido | Empresa | Proceso a simplificar | Funcionamiento actual y problema | Teléfono | Correo electrónico | Consentimiento | utm_source | utm_medium | utm_campaign | utm_content | fbclid | URL de origen | Estado |

> Si te olvidás de crear los encabezados, el script los genera solo la primera
> vez que recibe un envío. Pero conviene dejarlos listos para ordenar/filtrar.

## 3. Crear el Apps Script

1. En la Sheet: menú **Extensiones → Apps Script**.
2. Borrá el contenido de `Código.gs` y pegá **todo** el contenido de
   [`docs/google-apps-script.gs`](./google-apps-script.gs) de este repo.
3. Guardá con el ícono de disquete (o `Ctrl/Cmd + S`).

## 4. Configurar el secreto y el correo de notificación

En el editor de Apps Script:

1. Icono de engranaje **⚙ Configuración del proyecto** (barra izquierda).
2. Bajá hasta **Propiedades de la secuencia de comandos** → *Agregar propiedad*.
3. Cargá estas dos propiedades:

   | Propiedad | Valor |
   |---|---|
   | `SHARED_SECRET` | Un valor largo y aleatorio (ver abajo cómo generarlo) |
   | `NOTIFY_EMAIL` | El correo donde querés recibir el aviso, ej. `admin@operonhub.com` |

4. **Guardar propiedades de la secuencia de comandos.**

Para generar un secreto fuerte, en tu terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Guardá ese mismo valor: lo vas a usar también en Vercel (paso 7).

## 5. Definir la zona horaria (opcional pero recomendado)

En **⚙ Configuración del proyecto → Zona horaria**, elegí
`(GMT-03:00) Buenos Aires`. Así la columna **Fecha** queda en hora local.

## 6. Publicarlo como aplicación web

1. Botón **Implementar → Nueva implementación**.
2. En *Tipo* (ícono de engranaje) elegí **Aplicación web**.
3. Configurá:
   - **Descripción:** `Operon leads`
   - **Ejecutar como:** *Yo* (tu cuenta).
   - **Quién tiene acceso:** **Cualquier usuario** *(Anyone)*.
     > Es necesario para que el servidor de Operon pueda hacer el POST. La
     > seguridad la da el `SHARED_SECRET`, no el acceso: sin el secreto correcto,
     > el script responde `No autorizado` y no escribe nada.
4. **Implementar.** Google te va a pedir autorizar permisos (aceptar).
5. Copiá la **URL de la aplicación web**. Termina en **`/exec`**, por ejemplo:

   ```
   https://script.google.com/macros/s/AKfy...XYZ/exec
   ```

> Cada vez que edites el script, publicá los cambios con
> **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva**.
> La URL `/exec` se mantiene.

## 7. Configurar las variables de entorno en Vercel

En el proyecto de Vercel: **Settings → Environment Variables**. Agregá:

| Variable | Valor | Ámbito |
|---|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL` | La URL `/exec` del paso 6 | Production (y Preview si querés probar) |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | El mismo secreto del paso 4 | Production (marcar *Sensitive*) |

*(Opcional, Meta Pixel):*

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | El ID real de tu pixel de Meta (dejar vacío si no lo usás) |

Para desarrollo local, copiá los mismos valores a `.env.local` (ver `.env.example`).

Después de cambiar variables en Vercel, **redeploy** para que tomen efecto.

## 8. Probar un envío

**Opción A — desde el sitio:** abrí `/contanos-tu-proceso`, completá el formulario
(al menos teléfono o correo + el checkbox) y enviá. Deberías ver la pantalla
*"Gracias por contarnos tu caso"*.

**Opción B — con curl** (reemplazá la URL por la de tu deploy o `localhost:3000`):

```bash
curl -X POST https://operonhub.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Prueba Operon",
    "empresa": "Empresa Test",
    "proceso": "Actualización de precios",
    "situacion": "Hoy lo hacemos a mano en una planilla y tarda horas.",
    "telefono": "+54 9 11 5555 5555",
    "email": "prueba@example.com",
    "consentimiento": true
  }'
```

Respuesta esperada:

```json
{ "ok": true }
```

Verificá que:
- Apareció una **fila nueva** en la pestaña `Leads`, con la **Fecha** cargada y
  el **Estado** en `NUEVO`.
- Llegó el **correo de aviso** a `NOTIFY_EMAIL`.

## 9. Dónde se ven las respuestas

Todas las respuestas quedan como filas en la pestaña **`Leads`** de la Google
Sheet. Podés:

- Ordenar/filtrar por **Estado** (`NUEVO`, y los que vayas marcando como
  `CONTACTADO`, `DESCARTADO`, etc. a mano).
- Filtrar por campaña usando las columnas `utm_*` / `fbclid`.
- Además, por cada contacto te llega un **correo** a `NOTIFY_EMAIL`.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| El sitio muestra *"El envío no está configurado todavía"* | Faltan `GOOGLE_SHEETS_WEBHOOK_URL` / `_SECRET` en Vercel | Cargalas y redeploy |
| *"No pudimos guardar tu caso ahora mismo"* | La URL no es la `/exec`, el deploy quedó en *"Solo yo"*, o el secreto no coincide | Revisá acceso *Cualquier usuario* y que `SHARED_SECRET` sea idéntico en ambos lados |
| No llega el correo pero sí se guarda la fila | Falta `NOTIFY_EMAIL` o límite diario de MailApp | Cargá `NOTIFY_EMAIL`; el envío de mail es best-effort |
| El script responde `No autorizado` | Secreto distinto | Volvé a copiar el mismo valor en la Script Property y en Vercel |
