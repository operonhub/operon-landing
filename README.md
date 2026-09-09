# Operon — Landing

Landing page para **Operon**: automatizaciones, SaaS y software a medida.
Construida en Next.js 14 + Tailwind + Framer Motion, respetando el sistema visual
de la identidad Operon v1.0 (globo · papel · tinta · azul · sol).

## Stack

- Next.js 14 (App Router) · React 18
- Tailwind CSS 3
- Framer Motion
- Tipografías: Space Grotesk · Geist · JetBrains Mono

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

```
app/
  layout.jsx        # metadata + globals
  page.jsx          # composición de la home
  globals.css       # tokens + utilidades
components/
  BalloonMark.jsx   # logo (mark + wordmark)
  Nav.jsx
  Hero.jsx
  Services.jsx
  Projects.jsx
  Process.jsx
  Differential.jsx
  CtaFinal.jsx
  Footer.jsx
  reservas/         # landing del producto (subdominio, ver abajo)
brand/              # assets originales del sistema de identidad
public/reservas/    # capturas reales del panel y de la web del huésped
```

## Build

```bash
npm run build
npm start
```

## Subdominio de producto: `reservas.operonhub.com`

La landing de **Operon Reservas** vive en este mismo proyecto, en `/reservas`, y
se sirve además desde su propio subdominio. Un solo repositorio, un solo deploy
y el mismo sistema de identidad (globo, paleta, modal de contacto).

Cómo funciona:

- `app/reservas/page.jsx` compone la página; los componentes están en
  `components/reservas/` y los textos y números, todos juntos, en
  `components/reservas/datos.js`.
- `middleware.js` mira el header `host`: si empieza con `reservas.`, **reescribe**
  `/` a `/reservas`. Es reescritura y no redirección, así la URL corta se
  mantiene en la barra del navegador. El resto de las rutas pasan sin tocar, de
  modo que `reservas.operonhub.com/privacidad` sigue funcionando.
- La página se sirve en dos hosts, así que su `canonical` apunta al subdominio.

### Puesta en marcha del subdominio

1. Vercel → proyecto `operon-landing` → **Settings → Domains** → agregar
   `reservas.operonhub.com`.
2. Hostinger → DNS de `operonhub.com` → crear el registro `CNAME` que indique
   Vercel (`reservas` → `cname.vercel-dns.com`).
3. Esperar la propagación y el certificado. Hasta entonces la página se llega
   igual por `operonhub.com/reservas`.

Para probar la reescritura en local, sin DNS:

```bash
curl -s -H "Host: reservas.operonhub.com" http://localhost:3000/ | head -c 400
```

### Capturas

Las imágenes de `public/reservas/` son capturas reales del producto, tomadas del
recorrido comercial publicado (`operon-reservas.netlify.app`, que corre contra
fixtures en memoria). Para regenerarlas se siembra la cookie `operon_demo=1` con
Playwright y se recorre el panel; conviene rehacerlas cuando cambie el diseño de
la app.
