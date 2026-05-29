/* operon-app.jsx
 * — Industry tabs (cases)
 * — Savings calculator
 * — Tweaks panel: hero variation, accent color
 */

const OPERON_TWEAKS = /*EDITMODE-BEGIN*/{
  "hero": "A",
  "accent": "#1F40C2",
  "showCalc": true,
  "showCompare": true
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────
// INDUSTRY TABS
// ─────────────────────────────────────────────
const INDUSTRIES = [
  {
    id: 'comercio',
    label: 'Comercio',
    title: 'Comercio y distribución.',
    blurb: 'Locales, e-commerce, distribuidoras. Acá las tareas se repiten cien veces por semana — perfectas para un operón.',
    examples: 'Casos típicos: comercios minoristas, distribuidoras, importadoras, tiendas online.',
    items: [
      { lbl: 'Conciliar Mercado Pago con tu sistema interno', gain: '~8h / semana' },
      { lbl: 'Facturar AFIP automáticamente al recibir un pago', gain: '~6h / semana' },
      { lbl: 'Enviar remitos + comprobante por email al cliente', gain: '~4h / semana' },
      { lbl: 'Alertas de stock bajo (por SKU, por sucursal)', gain: 'errores -90%' },
      { lbl: 'Reporte semanal de ventas por canal para el dueño', gain: '~3h / semana' },
    ],
  },
  {
    id: 'servicios',
    label: 'Servicios profesionales',
    title: 'Estudios y consultoras.',
    blurb: 'Cuando vendés horas, cada minuto administrativo cuesta plata. Acá los operones devuelven tiempo facturable.',
    examples: 'Casos típicos: estudios contables, abogados, consultoras, agencias, arquitectos.',
    items: [
      { lbl: 'Recordatorios automáticos de vencimientos a clientes', gain: '~5h / semana' },
      { lbl: 'Armar carpeta de cliente nuevo en Drive + plantillas', gain: 'cero olvidos' },
      { lbl: 'Time tracking → factura mensual + email + cobro', gain: '~10h / mes' },
      { lbl: 'Sincronizar Calendly con tu CRM y agendar follow-up', gain: 'leads +35%' },
      { lbl: 'Reporte mensual de cartera por estado de cuenta', gain: '~6h / mes' },
    ],
  },
  {
    id: 'gastronomia',
    label: 'Gastronomía',
    title: 'Restoranes y delivery.',
    blurb: 'Operación de ritmo intenso. Pequeños procesos repetidos cien veces al día — el lugar donde un operón se paga en una semana.',
    examples: 'Casos típicos: restoranes, cafeterías, dark kitchens, catering, delivery propio.',
    items: [
      { lbl: 'Cierre de caja Z → email al contador, todos los días', gain: '~7h / semana' },
      { lbl: 'Pedidos delivery → ticket cocina + cliente notificado', gain: 'errores -80%' },
      { lbl: 'Conciliar Rappi/PedidosYa con caja real del local', gain: '~5h / semana' },
      { lbl: 'Stock crítico → orden de compra al proveedor', gain: 'rotura -60%' },
      { lbl: 'Encuesta NPS al cliente post-pedido + reseña', gain: 'reviews +3x' },
    ],
  },
  {
    id: 'salud',
    label: 'Salud y bienestar',
    title: 'Clínicas y profesionales de la salud.',
    blurb: 'Procesos sensibles, recurrentes, regulados. Acá la confiabilidad del operón vale más que la velocidad.',
    examples: 'Casos típicos: consultorios, clínicas, kinesiología, estética, veterinarias.',
    items: [
      { lbl: 'Recordatorio de turno 24hs antes (WhatsApp/SMS)', gain: 'no-show -50%' },
      { lbl: 'Facturar obra social + sistema de cuotas socio', gain: '~12h / mes' },
      { lbl: 'Histórico clínico nuevo → ficha + autorización digital', gain: 'turno -5min' },
      { lbl: 'Recetas digitales firmadas + envío al paciente', gain: 'cero errores' },
      { lbl: 'Reporte mensual de prestaciones para el director', gain: '~4h / mes' },
    ],
  },
  {
    id: 'logistica',
    label: 'Logística',
    title: 'Transporte y depósitos.',
    blurb: 'Coordinación pura. Cada hora de tracking manual es una hora menos de operación real. Aquí el operón es ahorro directo.',
    examples: 'Casos típicos: transportes, last mile, depósitos, fulfillment, comercio mayorista.',
    items: [
      { lbl: 'Hoja de ruta automática según pedidos del día', gain: '~6h / día' },
      { lbl: 'Notificar al cliente al despachar + al entregar', gain: 'llamadas -70%' },
      { lbl: 'Conciliar guías pendientes con cobranza', gain: '~8h / semana' },
      { lbl: 'Alerta de demoras o devoluciones al responsable', gain: 'reclamos -40%' },
      { lbl: 'Liquidación quincenal a choferes externos', gain: '~5h / quincena' },
    ],
  },
];

function IndustryTabs() {
  const [active, setActive] = React.useState(INDUSTRIES[0].id);
  const current = INDUSTRIES.find(x => x.id === active);

  return (
    <div>
      <div className="industry-tabs" role="tablist">
        {INDUSTRIES.map(ind => (
          <button
            key={ind.id}
            className={'industry-tab' + (ind.id === active ? ' active' : '')}
            onClick={() => setActive(ind.id)}
            role="tab"
            aria-selected={ind.id === active}
          >
            {ind.label}
          </button>
        ))}
      </div>

      <div className="industry-panel" key={current.id}>
        <div className="industry-meta">
          <h3>{current.title}</h3>
          <p>{current.blurb}</p>
          <div className="ex">{current.examples}</div>
        </div>

        <div className="industry-list">
          {current.items.map((it, i) => (
            <div className="industry-row" key={i}>
              <div className="ix">{String(i + 1).padStart(2, '0')}</div>
              <div className="lbl">{it.lbl}</div>
              <div className="gain">{it.gain}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CALCULADORA
// ─────────────────────────────────────────────
function fmtARS(n) {
  return '$' + Math.round(n).toLocaleString('es-AR', { maximumFractionDigits: 0 });
}
function fmtHours(n) {
  if (n < 60) return Math.round(n) + ' h';
  const days = n / 8;
  return Math.round(n) + ' h · ' + days.toFixed(1) + ' días';
}

function Calc() {
  const [hours, setHours] = React.useState(15);     // horas/semana
  const [people, setPeople] = React.useState(2);    // personas haciéndolo
  const [rate, setRate] = React.useState(8000);     // ARS/hora

  // Conservative: assume Operon eliminates ~80% of routine admin time
  const reduction = 0.8;
  const monthlyHoursRecovered = hours * people * 4.3 * reduction;
  const monthlySavings = monthlyHoursRecovered * rate;
  const yearlySavings = monthlySavings * 12;
  const fteEquivalent = monthlyHoursRecovered / 160; // 160h = 1 FTE/mes

  return (
    <div className="calc">
      <div className="calc-section">
        <div className="calc-row">
          <label>Horas por semana en tareas repetitivas</label>
          <span className="val">{hours} h</span>
        </div>
        <input type="range" min="2" max="40" step="1" value={hours} onChange={e => setHours(+e.target.value)} />
        <div className="calc-help">Facturación, conciliación, reportes, seguimientos, copy-paste entre sistemas</div>
      </div>

      <div className="calc-section">
        <div className="calc-row">
          <label>Personas haciendo estas tareas</label>
          <span className="val">{people} pers.</span>
        </div>
        <input type="range" min="1" max="10" step="1" value={people} onChange={e => setPeople(+e.target.value)} />
        <div className="calc-help">Vos, tu equipo, el contador, quien sea que hoy lo hace a mano</div>
      </div>

      <div className="calc-section">
        <div className="calc-row">
          <label>Costo estimado por hora</label>
          <span className="val">{fmtARS(rate)} / h</span>
        </div>
        <input type="range" min="2000" max="20000" step="500" value={rate} onChange={e => setRate(+e.target.value)} />
        <div className="calc-help">Si pagás un sueldo, dividilo por 160. Si es tu hora, ponele lo que vale.</div>
      </div>

      <div className="calc-result">
        <div>
          <div className="head-lbl">Ahorro mensual estimado</div>
          <div className="big">{fmtARS(monthlySavings)}</div>
          <div className="sub">{fmtHours(monthlyHoursRecovered)} recuperadas</div>
        </div>
        <div>
          <div className="head-lbl">En un año</div>
          <div className="big alt" style={{color:'#FBF9F4'}}>{fmtARS(yearlySavings)}</div>
          <div className="sub">≈ {fteEquivalent.toFixed(1)} persona{fteEquivalent >= 1.5 ? 's' : ''} de tiempo completo</div>
        </div>
      </div>

      <div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap',alignItems:'center'}}>
        <a href="#contacto" className="btn primary">Mostrame qué automatizar primero <span className="arrow">→</span></a>
        <span className="mono" style={{color:'var(--soft)'}}>Estimación · sin compromiso</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO VARIATION SWITCHER
// ─────────────────────────────────────────────
function applyHeroVariation(variant) {
  document.querySelectorAll('.hero-copy[data-hero]').forEach(el => {
    el.style.display = el.dataset.hero === variant ? '' : 'none';
  });
}

function applyAccent(color) {
  document.documentElement.style.setProperty('--blue', color);
  // also light variant
  // crude: keep blue-soft as a tint of the new color
  const r = parseInt(color.slice(1,3), 16);
  const g = parseInt(color.slice(3,5), 16);
  const b = parseInt(color.slice(5,7), 16);
  document.documentElement.style.setProperty(
    '--blue-soft',
    `rgba(${r}, ${g}, ${b}, .12)`
  );
}

// ─────────────────────────────────────────────
// TWEAKS PANEL
// ─────────────────────────────────────────────
function OperonTweaks() {
  const [t, setTweak] = useTweaks(OPERON_TWEAKS);

  React.useEffect(() => { applyHeroVariation(t.hero); }, [t.hero]);
  React.useEffect(() => { applyAccent(t.accent); }, [t.accent]);

  React.useEffect(() => {
    const c = document.getElementById('calculadora');
    if (c) c.style.display = t.showCalc ? '' : 'none';
  }, [t.showCalc]);
  React.useEffect(() => {
    const c = document.getElementById('comparativa');
    if (c) c.style.display = t.showCompare ? '' : 'none';
  }, [t.showCompare]);

  return (
    <TweaksPanel title="Tweaks · Operon">
      <TweakSection label="Hero" />
      <TweakRadio
        label="Variación"
        value={t.hero}
        options={[
          { value: 'A', label: 'A · Control' },
          { value: 'B', label: 'B · Operón' },
        ]}
        onChange={(v) => setTweak('hero', v)}
      />

      <TweakSection label="Marca" />
      <TweakColor
        label="Color acento"
        value={t.accent}
        options={['#1F40C2', '#142E96', '#0E5C5C', '#7A3CC4', '#B53A1F', '#14130F']}
        onChange={(v) => setTweak('accent', v)}
      />

      <TweakSection label="Secciones" />
      <TweakToggle
        label="Mostrar calculadora"
        value={t.showCalc}
        onChange={(v) => setTweak('showCalc', v)}
      />
      <TweakToggle
        label="Mostrar comparativa"
        value={t.showCompare}
        onChange={(v) => setTweak('showCompare', v)}
      />
    </TweaksPanel>
  );
}

// ─────────────────────────────────────────────
// MOUNTS
// ─────────────────────────────────────────────
const indMount = document.getElementById('industry-mount');
if (indMount) ReactDOM.createRoot(indMount).render(<IndustryTabs />);

const calcMount = document.getElementById('calc-mount');
if (calcMount) ReactDOM.createRoot(calcMount).render(<Calc />);

const tweaksMount = document.createElement('div');
tweaksMount.id = '__operon-tweaks-root';
document.body.appendChild(tweaksMount);
ReactDOM.createRoot(tweaksMount).render(<OperonTweaks />);
