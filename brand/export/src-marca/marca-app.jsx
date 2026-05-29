/* marca-app.jsx — Operon · sistema de marca
 * Símbolos dibujados con primitivas. Render a cualquier tamaño.
 */

/* ──────────────────────────────────────────────
   MARK REGISTRY — todos en viewBox 0 0 64 64
   color = tinta principal · bg = fondo (negativo) · accent = color marca
   ────────────────────────────────────────────── */
function MarkSVG({ c, size = 64, color = 'var(--ink)', bg = 'var(--bg)', accent = 'var(--blue)', outline = false, title }) {
  const sw = 3;
  let body = null;

  switch (c) {
    // C1 — Nodo suelto (recomendado): nodo flotando atado a un hilo
    case 'nodo':
      body = (
        <g>
          {outline
            ? <circle cx="32" cy="23" r="14" fill="none" stroke={color} strokeWidth={sw} />
            : <circle cx="32" cy="23" r="15" fill={color} />}
          {outline && <circle cx="32" cy="23" r="4" fill={accent} />}
          <path d="M27 36 L37 36 L32 42 Z" fill={color} />
          <path d="M32 42 C 30 48, 36 50, 33 60" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
      break;

    // C2 — Ascenso: el punto y la dirección (arriba)
    case 'ascenso':
      body = (
        <g>
          {outline
            ? <circle cx="32" cy="22" r="13" fill="none" stroke={color} strokeWidth={sw} />
            : <circle cx="32" cy="22" r="13" fill={color} />}
          {outline && <circle cx="32" cy="22" r="3.5" fill={accent} />}
          <path d="M19 52 L32 41 L45 52" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
      break;

    // C3 — Nudo: el globo en su geometría mínima
    case 'nudo':
      body = (
        <g>
          {outline
            ? <circle cx="32" cy="29" r="16" fill="none" stroke={color} strokeWidth={sw} />
            : <circle cx="32" cy="29" r="17" fill={color} />}
          {outline && <circle cx="32" cy="29" r="4.5" fill={accent} />}
          <path d="M27 45 L37 45 L32 52 Z" fill={color} />
        </g>
      );
      break;

    // C4 — Negativo: el globo aparece en el vacío de un tile
    case 'negativo':
      body = (
        <g>
          <rect x="4" y="4" width="56" height="56" rx="15" fill={color} />
          <circle cx="32" cy="26" r="12" fill={bg} />
          <path d="M28 37 L36 37 L32 42 Z" fill={bg} />
          <path d="M32 42 C 30 47, 35 49, 33 56" fill="none" stroke={bg} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
      break;

    // C5 — Membrana: superficie tensa, con luz (nodo cargado)
    case 'membrana':
      body = (
        <g>
          <circle cx="32" cy="25" r="15" fill={color} />
          <path d="M23 17 A 12 12 0 0 1 36 14.5" fill="none" stroke={bg} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M27 38 L37 38 L32 44 Z" fill={color} />
          <path d="M32 44 C 31 50, 35 51, 33 58" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
      break;

    // C6 — Par: dos nodos, uno ancla y otro flota
    case 'par':
      body = (
        <g>
          <path d="M38 32 L25 48" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          {outline
            ? <circle cx="40" cy="22" r="12" fill="none" stroke={color} strokeWidth={sw} />
            : <circle cx="40" cy="22" r="12" fill={color} />}
          {outline && <circle cx="40" cy="22" r="3.5" fill={accent} />}
          <circle cx="23" cy="50" r="5" fill={accent} />
        </g>
      );
      break;

    default:
      body = <circle cx="32" cy="32" r="14" fill={color} />;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title || c}>
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
}

const CONCEPTS = [
  { id: 'nodo',     n: 'Nodo suelto',  rec: true,  d: 'Un nodo de tu sistema que se desató y subió. El puente exacto entre el producto y el guiño.' },
  { id: 'ascenso',  n: 'Ascenso',      rec: false, d: 'Un punto y la única dirección que le importa: arriba. Lectura de impulso, no de objeto.' },
  { id: 'nudo',     n: 'Nudo',         rec: false, d: 'El globo reducido a su geometría mínima — cuerpo y nudo. Puro ícono, brutal a tamaño chico.' },
  { id: 'negativo', n: 'Negativo',     rec: false, d: 'El globo que aparece en el vacío de un tile. Funciona increíble como app icon.' },
  { id: 'membrana', n: 'Membrana',     rec: false, d: 'Superficie tensa, con un reflejo de luz. Un nodo cargado, a punto de soltarse.' },
  { id: 'par',      n: 'Par',          rec: false, d: 'Dos nodos: uno ancla, otro flota. Cadena de operón y elevación en una sola figura.' },
];

/* ──────────────────────────────────────────────
   WORDMARK + LOCKUPS
   ────────────────────────────────────────────── */
function WordmarkBalloonO({ fontSize = 38 }) {
  // "Operon" con la O inicial dibujada como globo
  const r = fontSize * 0.32;
  const box = fontSize * 1.0;
  return (
    <span className="wordmark" style={{ fontSize, alignItems: 'center' }}>
      <svg width={box} height={box * 1.15} viewBox="0 0 64 74" style={{ marginRight: fontSize * 0.04, transform: 'translateY(2%)' }} aria-hidden="true">
        <circle cx="32" cy="28" r="20" fill="none" stroke="var(--ink)" strokeWidth="6" />
        <path d="M25 47 L39 47 L32 56 Z" fill="var(--ink)" />
        <path d="M32 56 C 30 63, 36 65, 33 73" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <span style={{ letterSpacing: '-.03em' }}>peron</span>
    </span>
  );
}

function Lockups() {
  return (
    <div className="lockups">
      <div className="lockup">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <MarkSVG c="nodo" size={48} />
          <span className="wordmark" style={{ fontSize: 38 }}>Operon</span>
        </div>
        <div className="cap">Horizontal · web + mail</div>
      </div>

      <div className="lockup">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <MarkSVG c="nodo" size={56} />
          <span className="wordmark" style={{ fontSize: 30 }}>Operon</span>
        </div>
        <div className="cap">Apilado · perfiles + stickers</div>
      </div>

      <div className="lockup">
        <WordmarkBalloonO fontSize={40} />
        <div className="cap">Guiño · la "o" se suelta</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   APPLICATIONS
   ────────────────────────────────────────────── */
function Apps() {
  return (
    <div className="apps">
      <div className="app-card">
        <div className="app-stage">
          <div className="tile" style={{ background: 'var(--ink)' }}>
            <MarkSVG c="nodo" size={56} color="var(--sol)" />
          </div>
        </div>
        <div className="app-cap">App icon</div>
      </div>

      <div className="app-card">
        <div className="app-stage">
          <div className="tabmock">
            <div className="bar">
              <div className="dots"><i></i><i></i><i></i></div>
              <div className="tab">
                <MarkSVG c="nodo" size={16} />
                Operon
              </div>
            </div>
            <div style={{ height: 26, background: 'var(--bg)' }}></div>
          </div>
        </div>
        <div className="app-cap">Favicon · 16px</div>
      </div>

      <div className="app-card">
        <div className="app-stage blue">
          <MarkSVG c="nodo" size={72} color="var(--bg)" />
        </div>
        <div className="app-cap">Sobre color de marca</div>
      </div>

      <div className="app-card">
        <div className="app-stage">
          <MarkSVG c="nodo" size={72} color="var(--ink)" accent="var(--ink)" />
        </div>
        <div className="app-cap">Una sola tinta</div>
      </div>
    </div>
  );
}

function Sizes() {
  const sizes = [16, 24, 32, 48, 72];
  return (
    <div className="sizes">
      {sizes.map(s => (
        <div className="size-item" key={s}>
          <MarkSVG c="nodo" size={s} />
          <span className="px">{s}px</span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   THEME / TWEAKS
   ────────────────────────────────────────────── */
const MARCA_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#1F40C2",
  "markStyle": "filled"
}/*EDITMODE-END*/;

const THEMES = {
  light: { '--bg': '#FBF9F4', '--paper': '#F2EFE6', '--sand': '#E1DBCC', '--line': '#D9D2C0', '--ink': '#14130F', '--mute': '#6B655B', '--soft': '#A39C90' },
  dark:  { '--bg': '#100F0D', '--paper': '#1A1813', '--sand': '#2A2620', '--line': '#2A2620', '--ink': '#F2EFE6', '--mute': '#8B857A', '--soft': '#5A554C' },
};

function MarcaTweaks({ onMarkStyle }) {
  const [t, setTweak] = useTweaks(MARCA_TWEAKS);

  React.useEffect(() => {
    const vars = THEMES[t.theme] || THEMES.light;
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [t.theme]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--blue', t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    if (onMarkStyle) onMarkStyle(t.markStyle === 'outline');
  }, [t.markStyle]);

  return (
    <TweaksPanel title="Tweaks · Marca">
      <TweakSection label="Presentación" />
      <TweakRadio
        label="Tema"
        value={t.theme}
        options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakRadio
        label="Estilo del trazo"
        value={t.markStyle}
        options={[{ value: 'filled', label: 'Sólido' }, { value: 'outline', label: 'Contorno' }]}
        onChange={(v) => setTweak('markStyle', v)}
      />

      <TweakSection label="Color de marca" />
      <TweakColor
        label="Acento"
        value={t.accent}
        options={['#1F40C2', '#142E96', '#0E5C5C', '#C2552B', '#7A3CC4', '#14130F']}
        onChange={(v) => setTweak('accent', v)}
      />
    </TweaksPanel>
  );
}

/* ──────────────────────────────────────────────
   Shared outline state — los mounts son roots separados,
   así que un store mínimo los sincroniza.
   ────────────────────────────────────────────── */
const outlineListeners = new Set();
let OUTLINE = false;
function setOutlineGlobal(v) { OUTLINE = v; outlineListeners.forEach(fn => fn(v)); }
function useOutline() {
  const [o, setO] = React.useState(OUTLINE);
  React.useEffect(() => { outlineListeners.add(setO); return () => outlineListeners.delete(setO); }, []);
  return o;
}

/* Re-define concept-ish components to react to outline */
function ConceptsLive() {
  const outline = useOutline();
  return (
    <div className="concepts">
      {CONCEPTS.map((c, i) => (
        <div className="concept" key={c.id}>
          <div className="concept-stage">
            <span className="badge">{'C' + (i + 1)}</span>
            {c.rec && <span className="rec">Recomendado</span>}
            <MarkSVG c={c.id} size={c.id === 'negativo' ? 96 : 92} outline={outline && c.id !== 'negativo'} title={c.n} />
          </div>
          <div className="concept-meta">
            <h3>{c.n}</h3>
            <p>{c.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendedLive() {
  const outline = useOutline();
  return (
    <div className="rec-grid">
      <div className="rec-stage">
        <MarkSVG c="nodo" size={200} outline={outline} title="Nodo suelto" />
        <span className="tag">Positivo · fondo claro</span>
      </div>
      <div className="rec-stage dark">
        <MarkSVG c="nodo" size={200} color="var(--bg)" accent="var(--sol)" outline={outline} title="Nodo suelto reverso" />
        <span className="tag">Reverso · fondo oscuro</span>
      </div>
      <div className="rec-info" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--line)' }}>
        <div className="sub">C1 · Nodo suelto</div>
        <h3>Tres lecturas en una figura.</h3>
        <div className="read">
          <div className="read-row"><div className="k">Producto</div><div className="v">Es el <strong>nodo de un operón</strong> — el mismo primitivo de la landing y los diagramas. Marca y producto hablan el mismo idioma.</div></div>
          <div className="read-row"><div className="k">Idea</div><div className="v">El nodo <strong>se soltó del hilo y subió</strong>. Liviano, libre, sin peso. Eso hace Operon: te saca el peso de encima.</div></div>
          <div className="read-row"><div className="k">Guiño</div><div className="v">Es, sin decirlo, <strong>el Globo</strong>. Cuerpo redondo, nudo, piolín — pero leído como símbolo tech, no como objeto ni escudo.</div></div>
          <div className="read-row"><div className="k">Técnica</div><div className="v">Un círculo, un triángulo, una curva. <strong>Tres trazos.</strong> Nítido a 16px, imponente a tres metros, en una sola tinta.</div></div>
        </div>
      </div>
    </div>
  );
}

function DisguiseLive() {
  const outline = useOutline();
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 18, background: 'var(--paper)', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MarkSVG c="nodo" size={220} outline={outline} />
    </div>
  );
}

/* ──────────────────────────────────────────────
   MOUNTS
   ────────────────────────────────────────────── */
function mount(id, node) {
  const el = document.getElementById(id);
  if (el) ReactDOM.createRoot(el).render(node);
}

mount('concepts-mount', <ConceptsLive />);
mount('recommended-mount', <RecommendedLive />);
mount('lockups-mount', <Lockups />);
mount('apps-mount', <Apps />);
mount('sizes-mount', <Sizes />);
mount('disguise-mark-mount', <DisguiseLive />);

const tweaksRoot = document.createElement('div');
tweaksRoot.id = '__marca-tweaks-root';
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<MarcaTweaks onMarkStyle={setOutlineGlobal} />);
