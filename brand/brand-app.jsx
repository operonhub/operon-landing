/* brand-app.jsx — Operon · sistema de identidad
 * Todo se construye sobre dos primitivas:
 *   <Balloon/>      el mark aislado (globo: cuerpo + nudo + piolín)
 *   <Wordmark/>     el lockup inline donde el globo ES la "O" de Operon
 */

/* ──────────────────────────────────────────────
   BALLOON MARK — viewBox 0 0 56 78 (retrato)
   cuerpo arriba, nudo, piolín que cae y vuelve
   ────────────────────────────────────────────── */
function Balloon({
  size = 64,
  color = 'var(--ink)',
  accent = null,        // si se pasa, un punto de luz/acento dentro del cuerpo
  filled = false,       // cuerpo sólido vs contorno
  stroke = 6,
  title,
}) {
  const h = size * (78 / 56);
  return (
    <svg width={size} height={h} viewBox="0 0 56 78" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title || 'Operon'} style={{ display: 'block', overflow: 'visible' }}>
      {title && <title>{title}</title>}
      {/* cuerpo */}
      {filled
        ? <circle cx="28" cy="24" r="22" fill={color} />
        : <circle cx="28" cy="24" r="21" fill="none" stroke={color} strokeWidth={stroke} />}
      {/* punto de acento opcional (cuando es contorno) */}
      {accent && !filled && <circle cx="28" cy="24" r={stroke * 0.95} fill={accent} />}
      {/* highlight cuando es sólido */}
      {filled && accent && <path d="M16 16 A 16 16 0 0 1 30 9" fill="none" stroke={accent} strokeWidth={stroke * 0.7} strokeLinecap="round" />}
      {/* nudo */}
      <path d="M22 45 L34 45 L28 53 Z" fill={color} />
      {/* piolín — cae y vuelve, nunca recto */}
      <path d="M28 53 C 24 61, 35 64, 30 78" fill="none" stroke={color} strokeWidth={stroke * 0.62} strokeLinecap="round" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   WORDMARK — el globo es la "O", luego "peron"
   ────────────────────────────────────────────── */
function Wordmark({ fontSize = 48, color = 'var(--ink)', accent = null, filled = false, float = false }) {
  // balloon sized to align with cap height; floats slightly above baseline
  const bSize = fontSize * 1.18;
  return (
    <span className="wordmark" style={{ fontSize, color, alignItems: 'flex-end', lineHeight: 1 }}>
      <span className={float ? 'float' : ''} style={{ display: 'inline-flex', marginRight: fontSize * -0.02, marginBottom: fontSize * -0.16 }}>
        <Balloon size={bSize} color={color} accent={accent} filled={filled} stroke={5.4} title="Operon" />
      </span>
      <span style={{ letterSpacing: '-.04em', paddingBottom: fontSize * 0.0 }}>peron</span>
    </span>
  );
}

/* ──────────────────────────────────────────────
   HERO LOCKUP (grande, flotando)
   ────────────────────────────────────────────── */
function HeroLockup() {
  const [fs, setFs] = React.useState(120);
  React.useEffect(() => {
    const calc = () => setFs(Math.min(160, Math.max(64, window.innerWidth * 0.11)));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return <Wordmark fontSize={fs} float />;
}

/* ──────────────────────────────────────────────
   SURFACES
   ────────────────────────────────────────────── */
function Surfaces() {
  return (
    <div className="surfaces">
      <div className="surface light">
        <Balloon size={92} color="var(--ink)" />
        <span className="tag">Tinta / papel</span>
      </div>
      <div className="surface paper">
        <Balloon size={92} color="var(--ink)" accent="var(--blue)" />
        <span className="tag">Con acento azul</span>
      </div>
      <div className="surface ink">
        <Balloon size={92} color="var(--bg)" accent="var(--sol)" />
        <span className="tag">Reverso / sol</span>
      </div>
      <div className="surface blue">
        <Balloon size={92} color="#FFFFFF" />
        <span className="tag">Sobre azul</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   ANATOMY — globo con guías
   ────────────────────────────────────────────── */
function Anatomy() {
  const blue = '#1F40C2';
  return (
    <svg width="280" height="360" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
      {/* grid */}
      <defs>
        <pattern id="ag" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(20,19,15,.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="20" y="10" width="160" height="240" fill="url(#ag)" />

      {/* construction circle guide */}
      <circle cx="100" cy="92" r="62" fill="none" stroke={blue} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      {/* center cross */}
      <line x1="100" y1="20" x2="100" y2="250" stroke={blue} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* the mark, scaled up */}
      <g transform="translate(100,0)">
        <circle cx="0" cy="92" r="58" fill="none" stroke="#14130F" strokeWidth="14" />
        <path d="M-16 150 L16 150 L0 172 Z" fill="#14130F" />
        <path d="M0 172 C -12 194, 18 204, 4 242" fill="none" stroke="#14130F" strokeWidth="9" strokeLinecap="round" />
      </g>

      {/* labels */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill={blue} letterSpacing="1">
        <text x="168" y="60">01</text>
        <text x="120" y="166">02</text>
        <text x="120" y="232">03</text>
      </g>
      {/* radius marker */}
      <line x1="100" y1="92" x2="158" y2="92" stroke={blue} strokeWidth="1" />
      <text x="118" y="86" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={blue}>r</text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   LOCKUPS
   ────────────────────────────────────────────── */
function Lockups() {
  return (
    <div className="lockups">
      <div className="lockup span2">
        <div className="body"><Wordmark fontSize={64} /></div>
        <span className="cap">Principal · inline (la O = globo)</span>
      </div>

      <div className="lockup">
        <div className="body" style={{ flexDirection: 'column', gap: 16 }}>
          <Balloon size={56} color="var(--ink)" />
          <span className="wordmark" style={{ fontSize: 26 }}>Operon</span>
        </div>
        <span className="cap">Apilado · perfiles</span>
      </div>

      <div className="lockup">
        <div className="body"><Balloon size={84} color="var(--ink)" /></div>
        <span className="cap">Mark solo · favicon, sello</span>
      </div>

      <div className="lockup span2" style={{ background: 'var(--ink)' }}>
        <div className="body"><Wordmark fontSize={56} color="var(--bg)" accent="var(--sol)" /></div>
        <span className="cap" style={{ color: 'rgba(251,249,244,.45)' }}>Reverso · sobre tinta</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   CLEARSPACE
   ────────────────────────────────────────────── */
function Clearspace() {
  return (
    <svg width="220" height="300" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
      {/* protection box */}
      <rect x="30" y="20" width="100" height="180" fill="none" stroke="#1F40C2" strokeWidth="1" strokeDasharray="5 4" opacity="0.7" />
      {/* x markers */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#1F40C2">
        <text x="74" y="14">x</text>
        <text x="138" y="115">x</text>
      </g>
      <line x1="30" y1="8" x2="30" y2="20" stroke="#1F40C2" strokeWidth="1" />
      <line x1="80" y1="8" x2="80" y2="20" stroke="#1F40C2" strokeWidth="1" />
      {/* mark */}
      <g transform="translate(80,28) scale(1.55)">
        <circle cx="0" cy="24" r="21" fill="none" stroke="#14130F" strokeWidth="6" />
        <path d="M-6 45 L6 45 L0 53 Z" fill="#14130F" />
        <path d="M0 53 C -4 61, 7 64, 2 78" fill="none" stroke="#14130F" strokeWidth="3.7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   SIZES
   ────────────────────────────────────────────── */
function Sizes() {
  const sizes = [16, 24, 40, 64];
  return (
    <React.Fragment>
      {sizes.map(s => (
        <div className="size-item" key={s}>
          <Balloon size={s} color="var(--ink)" stroke={Math.max(2, s * 0.11)} />
          <span className="px">{s}px</span>
        </div>
      ))}
    </React.Fragment>
  );
}

/* ──────────────────────────────────────────────
   APPLICATIONS
   ────────────────────────────────────────────── */
function AppIcon() {
  return (
    <div className="tile" style={{ width: 110, height: 110, background: 'var(--ink)' }}>
      <Balloon size={58} color="var(--sol)" />
    </div>
  );
}
function AppFavicon() {
  return (
    <div className="tabmock">
      <div className="bar">
        <div className="dots"><i></i><i></i><i></i></div>
        <div className="tab"><Balloon size={15} color="var(--ink)" stroke={2.4} /> Operon</div>
      </div>
      <div style={{ height: 40, background: 'var(--bg)', border: '1px solid var(--line)', borderTop: 0, borderRadius: '0 0 10px 10px' }}></div>
    </div>
  );
}
function AppAvatar() {
  return (
    <div className="avatar" style={{ background: 'var(--blue)' }}>
      <Balloon size={62} color="#FFFFFF" />
    </div>
  );
}
function AppCard() {
  return (
    <div className="card-mock">
      <div className="top">
        <Balloon size={30} color="var(--sol)" />
        <span className="nm" style={{ color: 'var(--bg)' }}>Operon</span>
      </div>
      <div className="bot">
        Tomás Giménez · Co-fundador<br />
        hola@operon.com.ar · operon.com.ar<br />
        Lanús · Buenos Aires
      </div>
    </div>
  );
}
function AppSig() {
  return (
    <div className="sig">
      <Balloon size={40} color="var(--ink)" />
      <div className="div"></div>
      <div>
        <div className="who">Tomás Giménez</div>
        <div className="role-t">Operon · Automatización</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MOTION — release the O
   ────────────────────────────────────────────── */
function Motion() {
  const balloonRef = React.useRef(null);
  const [gone, setGone] = React.useState(false);

  const release = () => {
    const el = balloonRef.current;
    if (!el) return;
    el.classList.remove('balloon-release');
    // force reflow
    void el.offsetWidth;
    el.classList.add('balloon-release');
    setGone(true);
    setTimeout(() => {
      el.classList.remove('balloon-release');
      setGone(false);
    }, 3200);
  };

  React.useEffect(() => {
    const btn = document.getElementById('release-btn');
    if (btn) btn.addEventListener('click', release);
    return () => { if (btn) btn.removeEventListener('click', release); };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 0 }}>
      <span className="wordmark" style={{ fontSize: 72, alignItems: 'flex-end', lineHeight: 1 }}>
        <span ref={balloonRef} style={{ display: 'inline-flex', marginRight: -2, marginBottom: -11, opacity: gone ? 1 : 1 }}>
          <Balloon size={72 * 1.18} color="var(--ink)" stroke={5.4} title="Operon" />
        </span>
        <span style={{ letterSpacing: '-.04em' }}>peron</span>
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   RULES (do / dont)
   ────────────────────────────────────────────── */
function Rules() {
  return (
    <div className="rules">
      <div className="rule">
        <div className="rule-stage">
          <span className="flag no">✕</span>
          <div style={{ transform: 'scaleX(1.6)' }}><Balloon size={70} color="var(--ink)" /></div>
        </div>
        <div className="rule-cap">No lo estires ni deformes. El cuerpo es un círculo perfecto, siempre.</div>
      </div>
      <div className="rule">
        <div className="rule-stage" style={{ background: 'linear-gradient(135deg,#F2C94C,#C2552B,#1F40C2)' }}>
          <span className="flag no">✕</span>
          <Balloon size={70} color="#FFFFFF" />
        </div>
        <div className="rule-cap">No lo pongas sobre fondos ruidosos ni degradés. Necesita aire.</div>
      </div>
      <div className="rule">
        <div className="rule-stage">
          <span className="flag ok">✓</span>
          <Balloon size={70} color="var(--ink)" />
        </div>
        <div className="rule-cap">Sí: tinta plana, fondo tranquilo, proporciones intactas, aire alrededor.</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   THEME / TWEAKS
   ────────────────────────────────────────────── */
const BRAND_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#1F40C2",
  "markFill": "outline",
  "heroFloat": true
}/*EDITMODE-END*/;

const THEMES = {
  light: { '--bg': '#FBF9F4', '--paper': '#F2EFE6', '--sand': '#E1DBCC', '--line': '#D9D2C0', '--ink': '#14130F', '--mute': '#6B655B', '--soft': '#A39C90' },
  dark:  { '--bg': '#100F0D', '--paper': '#1A1813', '--sand': '#2A2620', '--line': '#2A2620', '--ink': '#F2EFE6', '--mute': '#8B857A', '--soft': '#5A554C' },
};

function BrandTweaks() {
  const [t, setTweak] = useTweaks(BRAND_TWEAKS);

  React.useEffect(() => {
    const vars = THEMES[t.theme] || THEMES.light;
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [t.theme]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--blue', t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    document.querySelectorAll('.float').forEach(el => {
      el.style.animationPlayState = t.heroFloat ? 'running' : 'paused';
    });
  }, [t.heroFloat]);

  return (
    <TweaksPanel title="Tweaks · Identidad">
      <TweakSection label="Presentación" />
      <TweakRadio
        label="Tema"
        value={t.theme}
        options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakToggle
        label="Globo flotando (hero)"
        value={t.heroFloat}
        onChange={(v) => setTweak('heroFloat', v)}
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
   MOUNTS
   ────────────────────────────────────────────── */
function mount(id, node) {
  const el = document.getElementById(id);
  if (el) ReactDOM.createRoot(el).render(node);
}

mount('hero-lockup-mount', <HeroLockup />);
mount('surfaces-mount', <Surfaces />);
mount('anatomy-mount', <Anatomy />);
mount('lockups-mount', <Lockups />);
mount('clearspace-mount', <Clearspace />);
mount('sizes-mount', <Sizes />);
mount('app-icon-mount', <AppIcon />);
mount('app-favicon-mount', <AppFavicon />);
mount('app-avatar-mount', <AppAvatar />);
mount('app-card-mount', <AppCard />);
mount('app-sig-mount', <AppSig />);
mount('motion-mount', <Motion />);
mount('rules-mount', <Rules />);
mount('foot-lockup-mount', <Wordmark fontSize={34} color="var(--bg)" accent="var(--sol)" />);

const tweaksRoot = document.createElement('div');
tweaksRoot.id = '__brand-tweaks-root';
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<BrandTweaks />);
