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
brand/              # assets originales del sistema de identidad
```

## Build

```bash
npm run build
npm start
```
