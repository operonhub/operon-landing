/* eslint-disable no-console */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, 'fonts');
const OUT_DIR = join(homedir(), 'Desktop', 'operon-instagram');

mkdirSync(join(OUT_DIR, '01-perfil'), { recursive: true });
mkdirSync(join(OUT_DIR, '02-historias-destacadas'), { recursive: true });
mkdirSync(join(OUT_DIR, '03-publicaciones'), { recursive: true });

// ── Brand tokens ──────────────────────────────────────────────────────────
const C = {
  paper: '#FBF9F4',
  cream: '#F2EFE6',
  sand:  '#E1DBCC',
  line:  '#D9D2C0',
  ink:   '#14130F',
  mute:  '#6B655B',
  soft:  '#A39C90',
  blue:  '#1F40C2',
  sol:   '#F2C94C',
};

// fontsource TTFs encode weight in family name — these are the exact names resvg matches
const FF = {
  display: 'Space Grotesk SemiBold',     // 600 equivalent
  displayMedium: 'Space Grotesk Medium', // 500
  body: 'Space Grotesk',                 // 400 (Regular)
  mono: 'JetBrains Mono',                // 400
  monoMd: 'JetBrains Mono Medium',       // 500
};

// ── Balloon ───────────────────────────────────────────────────────────────
function balloon({ x = 0, y = 0, s = 1, color = C.ink, accent = C.sol, stroke = 5.4 }) {
  return `
    <g transform="translate(${x}, ${y}) scale(${s})">
      <circle cx="28" cy="24" r="21" fill="none" stroke="${color}" stroke-width="${stroke}"/>
      <circle cx="28" cy="24" r="5.1" fill="${accent}"/>
      <path d="M22 45 L34 45 L28 53 Z" fill="${color}"/>
      <path d="M28 53 C 24 61, 35 64, 30 78" fill="none" stroke="${color}" stroke-width="${stroke * 0.62}" stroke-linecap="round"/>
    </g>`;
}

// ── Dot grid ──────────────────────────────────────────────────────────────
function dotGrid({ w, h, color = 'rgba(20,19,15,.08)', step = 38 }) {
  let s = '';
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      s += `<circle cx="${x}" cy="${y}" r="1.2" fill="${color}"/>`;
    }
  }
  return s;
}

// ── Renderer ──────────────────────────────────────────────────────────────
function render(svg, filename) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    background: 'transparent',
    font: {
      fontDirs: [FONTS_DIR],
      loadSystemFonts: false,
      defaultFontFamily: FF.body,
    },
  });
  writeFileSync(filename, resvg.render().asPng());
  console.log('✓', filename.replace(OUT_DIR, ''));
}

// ═════════════════════════════════════════════════════════════════════════
// 01 · PROFILE PICTURE
// ═════════════════════════════════════════════════════════════════════════
{
  const W = 1080, H = 1080;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${C.paper}"/>
    ${dotGrid({ w: W, h: H, step: 56 })}
    <defs>
      <radialGradient id="halo" cx="50%" cy="46%" r="42%">
        <stop offset="0%"   stop-color="${C.blue}" stop-opacity=".10"/>
        <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#halo)"/>
    ${balloon({ x: W/2 - 320, y: H/2 - 460, s: 11.5, stroke: 5.0 })}
  </svg>`;
  render(svg, join(OUT_DIR, '01-perfil', 'profile-papel.png'));
}

{
  const W = 1080, H = 1080;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${C.ink}"/>
    ${dotGrid({ w: W, h: H, step: 56, color: 'rgba(251,249,244,.08)' })}
    <defs>
      <radialGradient id="halo2" cx="50%" cy="44%" r="46%">
        <stop offset="0%"   stop-color="${C.blue}" stop-opacity=".30"/>
        <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#halo2)"/>
    ${balloon({ x: W/2 - 320, y: H/2 - 460, s: 11.5, color: C.paper, accent: C.sol, stroke: 5.0 })}
  </svg>`;
  render(svg, join(OUT_DIR, '01-perfil', 'profile-tinta.png'));
}

// ═════════════════════════════════════════════════════════════════════════
// 02 · HIGHLIGHT COVERS
// ═════════════════════════════════════════════════════════════════════════
const highlights = [
  { name: 'quienes',  label: 'QUIÉNES',  icon: 'who'  },
  { name: 'servicios',label: 'SERVICIOS', icon: 'flow'},
  { name: 'proceso',  label: 'PROCESO',  icon: 'steps'},
  { name: 'casos',    label: 'CASOS',    icon: 'star' },
  { name: 'stack',    label: 'STACK',    icon: 'code' },
  { name: 'contacto', label: 'CONTACTO', icon: 'mail' },
];

function highlightIcon(name, cx, cy, color) {
  const s = 38;
  switch (name) {
    case 'who':
      return `
        <circle cx="${cx}" cy="${cy - 12}" r="${s * 0.5}" fill="none" stroke="${color}" stroke-width="6"/>
        <path d="M ${cx - s} ${cy + s} q ${s} -${s * 0.8} ${s * 2} 0" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
    case 'flow':
      return `
        <circle cx="${cx - s}" cy="${cy - s}" r="8" fill="${color}"/>
        <circle cx="${cx + s}" cy="${cy - s}" r="8" fill="${color}"/>
        <circle cx="${cx}"     cy="${cy}"     r="8" fill="${C.sol}"/>
        <circle cx="${cx - s}" cy="${cy + s}" r="8" fill="${color}"/>
        <circle cx="${cx + s}" cy="${cy + s}" r="8" fill="${color}"/>
        <path d="M ${cx - s} ${cy - s} L ${cx} ${cy} L ${cx + s} ${cy - s} M ${cx - s} ${cy + s} L ${cx} ${cy} L ${cx + s} ${cy + s}" stroke="${color}" stroke-width="3" fill="none"/>`;
    case 'steps':
      return `
        <rect x="${cx - s}"      y="${cy + s - 16}" width="22" height="16" fill="${color}"/>
        <rect x="${cx - s + 26}" y="${cy + s - 32}" width="22" height="32" fill="${color}"/>
        <rect x="${cx - s + 52}" y="${cy + s - 48}" width="22" height="48" fill="${color}"/>`;
    case 'star':
      return `<path d="M ${cx} ${cy - s} L ${cx + 10} ${cy - 8} L ${cx + s} ${cy - 6} L ${cx + 14} ${cy + 8} L ${cx + 18} ${cy + s} L ${cx} ${cy + 18} L ${cx - 18} ${cy + s} L ${cx - 14} ${cy + 8} L ${cx - s} ${cy - 6} L ${cx - 10} ${cy - 8} Z" fill="${C.sol}" stroke="${color}" stroke-width="4" stroke-linejoin="round"/>`;
    case 'code':
      return `
        <path d="M ${cx - s + 4} ${cy - 14} L ${cx - s + 4} ${cy + 14} L ${cx - 14} ${cy + s - 4}" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M ${cx + s - 4} ${cy - 14} L ${cx + s - 4} ${cy + 14} L ${cx + 14} ${cy + s - 4}" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M ${cx + 6} ${cy - s + 4} L ${cx - 6} ${cy + s - 4}" stroke="${C.sol}" stroke-width="6" stroke-linecap="round"/>`;
    case 'mail':
      return `
        <rect x="${cx - s}" y="${cy - s * 0.6}" width="${s * 2}" height="${s * 1.2}" rx="4" fill="none" stroke="${color}" stroke-width="6"/>
        <path d="M ${cx - s} ${cy - s * 0.6} L ${cx} ${cy + 6} L ${cx + s} ${cy - s * 0.6}" fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round"/>`;
  }
  return '';
}

for (const h of highlights) {
  const W = 1080, H = 1080;
  const cx = W / 2, cy = H / 2 - 30;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${C.paper}"/>
    <g transform="translate(${cx}, ${cy}) scale(2.2)">
      ${highlightIcon(h.icon, 0, 0, C.ink)}
    </g>
    <text x="${cx}" y="${cy + 270}"
      font-family="${FF.monoMd}" font-size="40" letter-spacing="6"
      text-anchor="middle" fill="${C.ink}">${h.label}</text>
    <circle cx="${cx}" cy="${cy + 330}" r="6" fill="${C.blue}"/>
  </svg>`;
  render(svg, join(OUT_DIR, '02-historias-destacadas', `${h.name}.png`));
}

// ═════════════════════════════════════════════════════════════════════════
// 03 · FEED POSTS (1080×1350)
// ═════════════════════════════════════════════════════════════════════════
const P_W = 1080, P_H = 1350;
const PAD = 80;

function frame({ bg = C.paper, content }) {
  return `
  <svg width="${P_W}" height="${P_H}" viewBox="0 0 ${P_W} ${P_H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${P_W}" height="${P_H}" fill="${bg}"/>
    ${dotGrid({ w: P_W, h: P_H, step: 44, color: bg === C.ink ? 'rgba(251,249,244,.06)' : 'rgba(20,19,15,.06)' })}
    ${content}
  </svg>`;
}

function eyebrow(text, color = C.blue, y = 120) {
  return `<text x="${PAD}" y="${y}" font-family="${FF.monoMd}" font-size="22" letter-spacing="4.4" fill="${color}">${text}</text>`;
}

function pageNum(n, color = C.mute) {
  return `
    <text x="${PAD}" y="${P_H - 70}" font-family="${FF.monoMd}" font-size="22" letter-spacing="4" fill="${color}">@OPERON.AR</text>
    <text x="${P_W - PAD}" y="${P_H - 70}" font-family="${FF.monoMd}" font-size="22" letter-spacing="4" fill="${color}" text-anchor="end">${String(n).padStart(2,'0')} / 06</text>
  `;
}

// ── POST 1 · COVER ───────────────────────────────────────────────────────
{
  const fg = C.paper;
  const content = `
    <defs>
      <radialGradient id="h1" cx="80%" cy="0%" r="60%">
        <stop offset="0%" stop-color="${C.blue}" stop-opacity=".26"/>
        <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="h1b" cx="0%" cy="100%" r="55%">
        <stop offset="0%" stop-color="${C.sol}" stop-opacity=".10"/>
        <stop offset="100%" stop-color="${C.sol}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${P_W}" height="${P_H}" fill="url(#h1)"/>
    <rect width="${P_W}" height="${P_H}" fill="url(#h1b)"/>

    <g font-family="${FF.monoMd}" font-size="22" letter-spacing="4.4" fill="${fg}" opacity=".55">
      <text x="${PAD}" y="110">OPERON · IDENTIDAD V1.0</text>
      <text x="${P_W - PAD}" y="110" text-anchor="end">BUE · AR</text>
    </g>

    ${balloon({ x: P_W - 320, y: 230, s: 5.0, color: fg, accent: C.sol, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${fg}" letter-spacing="-4">
      <text font-size="120">
        <tspan x="${PAD}" y="780">Software</tspan>
        <tspan x="${PAD}" y="900">que <tspan fill="${C.sol}" font-family="${FF.displayMedium}" font-style="italic">flota</tspan>.</tspan>
      </text>
      <text font-size="58" fill="${fg}" opacity=".75" font-family="${FF.displayMedium}">
        <tspan x="${PAD}" y="1020">Procesos que dejan</tspan>
        <tspan x="${PAD}" y="1080">de pesar.</tspan>
      </text>
    </g>

    ${pageNum(1, fg + 'opacity-50')}
    <g font-family="${FF.monoMd}" font-size="22" letter-spacing="4" fill="${fg}" opacity=".5">
      <text x="${PAD}" y="${P_H - 70}">@OPERON.AR</text>
      <text x="${P_W - PAD}" y="${P_H - 70}" text-anchor="end">01 / 06</text>
    </g>
  `;
  render(frame({ bg: C.ink, content }), join(OUT_DIR, '03-publicaciones', '01-presentacion.png'));
}

// ── POST 2 · Quiénes somos ──────────────────────────────────────────────
{
  const content = `
    ${eyebrow('§ QUIÉNES SOMOS')}
    ${balloon({ x: P_W - 220, y: 80, s: 2.8, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${C.ink}" letter-spacing="-3.6">
      <text font-size="104">
        <tspan x="${PAD}" y="340">Un equipo chico</tspan>
        <tspan x="${PAD}" y="450">que construye</tspan>
        <tspan x="${PAD}" y="560" font-family="${FF.displayMedium}" font-style="italic" fill="${C.mute}">software de</tspan>
        <tspan x="${PAD}" y="670" font-family="${FF.displayMedium}" font-style="italic" fill="${C.mute}">calidad real.</tspan>
      </text>
    </g>

    <line x1="${PAD}" y1="820" x2="${P_W - PAD}" y2="820" stroke="${C.line}" stroke-width="1"/>

    <g font-family="${FF.body}" font-size="32" fill="${C.ink}">
      <tspan></tspan>
      <text>
        <tspan x="${PAD}" y="900">Automatizaciones, SaaS y software a medida</tspan>
        <tspan x="${PAD}" y="945">para pymes que necesitan resolver hoy.</tspan>
        <tspan x="${PAD}" y="1010" fill="${C.mute}">Hechos en Argentina, mantenibles por vos.</tspan>
      </text>
    </g>

    ${pageNum(2)}
  `;
  render(frame({ content }), join(OUT_DIR, '03-publicaciones', '02-quienes-somos.png'));
}

// ── POST 3 · Qué hacemos ────────────────────────────────────────────────
{
  const services = [
    { n: '01', t: 'Automatizaciones',       d: 'Procesos que\nse ejecutan solos.' },
    { n: '02', t: 'SaaS a medida',          d: 'Productos digitales\npropios.' },
    { n: '03', t: 'Software\nespecializado', d: 'Lo que no\nexiste todavía.' },
    { n: '04', t: 'Desarrollo web',         d: 'Sitios rápidos\nque convierten.' },
  ];
  const gridX = PAD, gridY = 540, colW = 450, rowH = 350;
  const cells = services.map((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = gridX + col * (colW + 20);
    const y = gridY + row * rowH;
    const titleLines = s.t.split('\n');
    const descLines = s.d.split('\n');
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${colW}" height="${rowH - 30}" rx="20" fill="${C.cream}" stroke="${C.line}"/>
        <text x="32" y="56" font-family="${FF.monoMd}" font-size="22" letter-spacing="4" fill="${C.blue}">${s.n}</text>
        <text font-family="${FF.display}" font-size="42" letter-spacing="-1.4" fill="${C.ink}">
          ${titleLines.map((ln, j) => `<tspan x="32" y="${140 + j * 50}">${ln}</tspan>`).join('')}
        </text>
        <text font-family="${FF.body}" font-size="22" fill="${C.mute}">
          ${descLines.map((ln, j) => `<tspan x="32" y="${260 + j * 32}">${ln}</tspan>`).join('')}
        </text>
      </g>`;
  }).join('');

  const content = `
    ${eyebrow('§ SERVICIOS')}
    ${balloon({ x: P_W - 220, y: 80, s: 2.8, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${C.ink}" letter-spacing="-3.6">
      <text font-size="92"><tspan x="${PAD}" y="280">Cuatro disciplinas.</tspan></text>
      <text font-size="92" font-family="${FF.displayMedium}" font-style="italic" fill="${C.mute}">
        <tspan x="${PAD}" y="386">Una sola lógica.</tspan>
      </text>
    </g>

    ${cells}
    ${pageNum(3)}
  `;
  render(frame({ content }), join(OUT_DIR, '03-publicaciones', '03-que-hacemos.png'));
}

// ── POST 4 · Cómo trabajamos ────────────────────────────────────────────
{
  const steps = ['Diagnóstico','Diseño','Construcción','Implementación','Optimización'];
  const rows = steps.map((t, i) => `
    <g transform="translate(${PAD}, ${500 + i * 130})">
      <line x1="0" y1="0" x2="${P_W - PAD * 2}" y2="0" stroke="${C.line}" stroke-width="1"/>
      <text x="0" y="80" font-family="${FF.monoMd}" font-size="26" letter-spacing="4" fill="${C.mute}">0${i+1}</text>
      <text x="140" y="84" font-family="${FF.display}" font-size="56" letter-spacing="-1.8" fill="${C.ink}">${t}</text>
      <circle cx="${P_W - PAD * 2 - 30}" cy="64" r="10" fill="${i === 4 ? C.sol : C.blue}"/>
    </g>
  `).join('');

  const content = `
    ${eyebrow('§ PROCESO')}
    ${balloon({ x: P_W - 220, y: 80, s: 2.8, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${C.ink}" letter-spacing="-3.6">
      <text font-size="100"><tspan x="${PAD}" y="300">Cinco pasos.</tspan></text>
      <text font-size="100" font-family="${FF.displayMedium}" font-style="italic" fill="${C.mute}">
        <tspan x="${PAD}" y="416">Sin sorpresas.</tspan>
      </text>
    </g>

    ${rows}
    <line x1="${PAD}" y1="${500 + 5 * 130}" x2="${P_W - PAD}" y2="${500 + 5 * 130}" stroke="${C.line}" stroke-width="1"/>

    ${pageNum(4)}
  `;
  render(frame({ content }), join(OUT_DIR, '03-publicaciones', '04-como-trabajamos.png'));
}

// ── POST 5 · Por qué Operon ─────────────────────────────────────────────
{
  const items = [
    { t: 'Código que es tuyo',  d: 'Repo, infra y secretos pasan a tu organización el día uno.' },
    { t: 'Mantenible por vos',  d: 'Stack estándar. Cualquier dev decente puede continuar.' },
    { t: 'Velocidad real',      d: 'Equipo chico, decisiones rápidas. Primer demo en 7 días.' },
  ];

  function wrap(text, max) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
      else cur += ' ' + w;
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  const blocks = items.map((it, i) => {
    const dLines = wrap(it.d, 60);
    return `
      <g transform="translate(${PAD}, ${640 + i * 200})">
        <line x1="0" y1="0" x2="${P_W - PAD * 2}" y2="0" stroke="${C.line}" stroke-width="1"/>
        <text x="0" y="78" font-family="${FF.display}" font-size="50" letter-spacing="-1.6" fill="${C.ink}">${it.t}.</text>
        <text x="0" font-family="${FF.body}" font-size="24" fill="${C.mute}">
          ${dLines.map((ln,j)=>`<tspan x="0" y="${130 + j*32}">${ln}</tspan>`).join('')}
        </text>
      </g>`;
  }).join('');

  const content = `
    ${eyebrow('§ POR QUÉ OPERON')}
    ${balloon({ x: P_W - 220, y: 80, s: 2.8, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${C.ink}" letter-spacing="-3.6">
      <text font-size="96"><tspan x="${PAD}" y="320">No somos una</tspan></text>
      <text font-size="96"><tspan x="${PAD}" y="430">agencia.</tspan></text>
      <text font-size="42" font-family="${FF.displayMedium}" font-style="italic" fill="${C.mute}">
        <tspan x="${PAD}" y="520">Tampoco un freelancer.</tspan>
      </text>
    </g>

    ${blocks}
    <line x1="${PAD}" y1="${640 + 3 * 200}" x2="${P_W - PAD}" y2="${640 + 3 * 200}" stroke="${C.line}" stroke-width="1"/>

    ${pageNum(5)}
  `;
  render(frame({ content }), join(OUT_DIR, '03-publicaciones', '05-por-que-operon.png'));
}

// ── POST 6 · Hablemos ────────────────────────────────────────────────────
{
  const fg = C.paper;
  const content = `
    <defs>
      <radialGradient id="c1" cx="20%" cy="100%" r="70%">
        <stop offset="0%" stop-color="${C.blue}" stop-opacity=".30"/>
        <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="c2" cx="100%" cy="0%" r="55%">
        <stop offset="0%" stop-color="${C.sol}" stop-opacity=".14"/>
        <stop offset="100%" stop-color="${C.sol}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${P_W}" height="${P_H}" fill="url(#c1)"/>
    <rect width="${P_W}" height="${P_H}" fill="url(#c2)"/>

    <text x="${PAD}" y="120" font-family="${FF.monoMd}" font-size="22" letter-spacing="4.4" fill="${C.sol}">§ HABLEMOS</text>
    ${balloon({ x: P_W - 320, y: 200, s: 4.4, color: fg, accent: C.sol, stroke: 5.2 })}

    <g font-family="${FF.display}" fill="${fg}" letter-spacing="-3.8">
      <text font-size="120">
        <tspan x="${PAD}" y="720">Soltá lo</tspan>
        <tspan x="${PAD}" y="840">que pesa.</tspan>
      </text>
      <text font-size="68" font-family="${FF.displayMedium}" font-style="italic" fill="${C.sol}">
        <tspan x="${PAD}" y="950">Construyamos algo</tspan>
        <tspan x="${PAD}" y="1020">que flote.</tspan>
      </text>
    </g>

    <line x1="${PAD}" y1="1140" x2="${P_W - PAD}" y2="1140" stroke="${fg}" stroke-opacity=".18"/>
    <text x="${PAD}" y="1210" font-family="${FF.display}" font-size="32" fill="${fg}">hola@operon.ar  ·  operon.ar</text>

    <g font-family="${FF.monoMd}" font-size="22" letter-spacing="4" fill="${fg}" opacity=".5">
      <text x="${PAD}" y="${P_H - 70}">@OPERON.AR</text>
      <text x="${P_W - PAD}" y="${P_H - 70}" text-anchor="end">06 / 06</text>
    </g>
  `;
  render(frame({ bg: C.ink, content }), join(OUT_DIR, '03-publicaciones', '06-hablemos.png'));
}

// ── README ──────────────────────────────────────────────────────────────
writeFileSync(join(OUT_DIR, 'README.txt'), `
OPERON · Instagram Starter Pack v1.0

01-perfil/
  profile-papel.png   Variante clara (recomendada)
  profile-tinta.png   Variante oscura

02-historias-destacadas/  (1080×1080, listos para el crop circular)
  quienes / servicios / proceso / casos / stack / contacto

03-publicaciones/  (1080×1350 — 4:5)
  01-presentacion   Cover de bienvenida
  02-quienes-somos
  03-que-hacemos    Los 4 servicios
  04-como-trabajamos  Los 5 pasos
  05-por-que-operon   Diferenciales
  06-hablemos       CTA con contacto

Tipografías: Space Grotesk + JetBrains Mono.
Paleta: Papel #FBF9F4 · Tinta #14130F · Azul #1F40C2 · Sol #F2C94C.
`.trim());

console.log('\n✓ Pack completo en:', OUT_DIR);
