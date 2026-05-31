/* eslint-disable no-console */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, 'fonts');
const APP_DIR = join(__dirname, '..', 'app');       // og + twitter (magic files)
const PUB_DIR = join(__dirname, '..', 'public');    // favicons (explicit metadata.icons)

const C = {
  paper: '#FBF9F4', ink: '#14130F', blue: '#1F40C2', sol: '#F2C94C',
};
const FF = { display: 'Space Grotesk SemiBold', medium: 'Space Grotesk Medium', mono: 'JetBrains Mono Medium' };

function balloon({ x = 0, y = 0, s = 1, color = C.ink, accent = C.sol, stroke = 5.4 }) {
  return `
    <g transform="translate(${x}, ${y}) scale(${s})">
      <circle cx="28" cy="24" r="21" fill="none" stroke="${color}" stroke-width="${stroke}"/>
      <circle cx="28" cy="24" r="5.1" fill="${accent}"/>
      <path d="M22 45 L34 45 L28 53 Z" fill="${color}"/>
      <path d="M28 53 C 24 61, 35 64, 30 78" fill="none" stroke="${color}" stroke-width="${stroke * 0.62}" stroke-linecap="round"/>
    </g>`;
}

function dotGrid({ w, h, color, step = 38 }) {
  let s = '';
  for (let y = step; y < h; y += step)
    for (let x = step; x < w; x += step) s += `<circle cx="${x}" cy="${y}" r="1.2" fill="${color}"/>`;
  return s;
}

function renderPng(svg, w, h, file) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: w },
    background: 'transparent',
    font: { fontDirs: [FONTS_DIR], loadSystemFonts: false, defaultFontFamily: FF.display },
  });
  writeFileSync(file, r.render().asPng());
  console.log('✓', file.replace(join(__dirname, '..'), ''));
}

// ── OG / Twitter image (1200×630) ───────────────────────────────────────
{
  const W = 1200, H = 630;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${C.ink}"/>
    ${dotGrid({ w: W, h: H, step: 40, color: 'rgba(251,249,244,.06)' })}
    <defs>
      <radialGradient id="g1" cx="82%" cy="6%" r="62%">
        <stop offset="0%" stop-color="${C.blue}" stop-opacity=".30"/>
        <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g2" cx="2%" cy="100%" r="55%">
        <stop offset="0%" stop-color="${C.sol}" stop-opacity=".10"/>
        <stop offset="100%" stop-color="${C.sol}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
    <rect width="${W}" height="${H}" fill="url(#g2)"/>

    <text x="72" y="92" font-family="${FF.mono}" font-size="20" letter-spacing="4" fill="${C.paper}" opacity=".55">OPERON · BUE / AR</text>
    ${balloon({ x: W - 250, y: 70, s: 2.9, color: C.paper, accent: C.sol, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${C.paper}" letter-spacing="-3">
      <text font-size="86"><tspan x="72" y="330">Software que <tspan fill="${C.sol}" font-family="${FF.medium}" font-style="italic">flota</tspan>.</tspan></text>
      <text font-size="86" font-family="${FF.medium}" fill="${C.paper}" opacity=".62"><tspan x="72" y="430">Procesos que dejan de pesar.</tspan></text>
    </g>

    <text x="72" y="560" font-family="${FF.medium}" font-size="30" fill="${C.paper}" opacity=".78">Automatizaciones · SaaS · Software a medida</text>
    <text x="${W - 72}" y="560" text-anchor="end" font-family="${FF.mono}" font-size="20" letter-spacing="3" fill="${C.paper}" opacity=".45">operonhub.com</text>
  </svg>`;
  renderPng(svg, W, H, join(APP_DIR, 'opengraph-image.png'));
  renderPng(svg, W, H, join(APP_DIR, 'twitter-image.png'));
}

// ── Icon (512×512) ──────────────────────────────────────────────────────
{
  const W = 512, H = 512;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" rx="112" fill="${C.ink}"/>
    ${balloon({ x: W/2 - 145, y: H/2 - 205, s: 5.2, color: C.paper, accent: C.sol, stroke: 5.2 })}
  </svg>`;
  renderPng(svg, W, H, join(PUB_DIR, 'icon.png'));
}

// ── Apple icon (180×180, padded) ────────────────────────────────────────
{
  const W = 180, H = 180;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" rx="40" fill="${C.ink}"/>
    ${balloon({ x: W/2 - 51, y: H/2 - 72, s: 1.82, color: C.paper, accent: C.sol, stroke: 5.4 })}
  </svg>`;
  renderPng(svg, W, H, join(PUB_DIR, 'apple-icon.png'));
}

// ── favicon.ico (48×48 png renamed; browsers accept png in .ico slot) ────
{
  const W = 48, H = 48;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" rx="10" fill="${C.ink}"/>
    ${balloon({ x: W/2 - 13.5, y: H/2 - 19, s: 0.48, color: C.paper, accent: C.sol, stroke: 6 })}
  </svg>`;
  renderPng(svg, W, H, join(PUB_DIR, 'favicon.ico'));
}

console.log('\n✓ SEO assets generados en /app');
