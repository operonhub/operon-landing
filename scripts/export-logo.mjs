import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ── Operon balloon mark SVG ──────────────────────────────────────────────────
// Dark version (tinta sobre papel)
const svgDark = `
<svg width="560" height="780" viewBox="0 0 56 78"
  xmlns="http://www.w3.org/2000/svg">
  <!-- fondo transparente -->
  <circle cx="28" cy="24" r="21"
    fill="none" stroke="#14130F" stroke-width="5.4"/>
  <!-- punto de acento sol -->
  <circle cx="28" cy="24" r="5.1" fill="#F2C94C"/>
  <!-- nudo -->
  <path d="M22 45 L34 45 L28 53 Z" fill="#14130F"/>
  <!-- piolín -->
  <path d="M28 53 C 24 61, 35 64, 30 78"
    fill="none" stroke="#14130F" stroke-width="3.35" stroke-linecap="round"/>
</svg>`;

// Light version (negativo, para fondos oscuros)
const svgLight = `
<svg width="560" height="780" viewBox="0 0 56 78"
  xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="24" r="21"
    fill="none" stroke="#FBF9F4" stroke-width="5.4"/>
  <circle cx="28" cy="24" r="5.1" fill="#F2C94C"/>
  <path d="M22 45 L34 45 L28 53 Z" fill="#FBF9F4"/>
  <path d="M28 53 C 24 61, 35 64, 30 78"
    fill="none" stroke="#FBF9F4" stroke-width="3.35" stroke-linecap="round"/>
</svg>`;

// Wordmark version (inline: globo + "peron")
const svgWordmark = `
<svg width="1200" height="420" viewBox="0 0 120 42"
  xmlns="http://www.w3.org/2000/svg">
  <!-- balloon at x=0, scaled to cap height -->
  <g transform="translate(0, -3) scale(0.54)">
    <circle cx="28" cy="24" r="21"
      fill="none" stroke="#14130F" stroke-width="5.4"/>
    <circle cx="28" cy="24" r="5.1" fill="#F2C94C"/>
    <path d="M22 45 L34 45 L28 53 Z" fill="#14130F"/>
    <path d="M28 53 C 24 61, 35 64, 30 78"
      fill="none" stroke="#14130F" stroke-width="3.35" stroke-linecap="round"/>
  </g>
  <!-- "peron" text -->
  <text x="19" y="32"
    font-family="'Space Grotesk', 'Helvetica Neue', sans-serif"
    font-weight="600"
    font-size="28"
    letter-spacing="-1.1"
    fill="#14130F">peron</text>
</svg>`;

const desktop = join(homedir(), 'Desktop');

function exportPng(svgStr, filename, bg) {
  const resvg = new Resvg(svgStr, {
    background: bg ?? 'transparent',
    fitTo: { mode: 'original' },
    font: { loadSystemFonts: true },
  });
  const data = resvg.render();
  const buf = data.asPng();
  const dest = join(desktop, filename);
  writeFileSync(dest, buf);
  console.log('✓ ' + dest + '  (' + buf.length + ' bytes)');
}

exportPng(svgDark,     'operon-mark.png');
exportPng(svgLight,    'operon-mark-light.png');
exportPng(svgWordmark, 'operon-wordmark.png');
