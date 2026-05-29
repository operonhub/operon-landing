/* app.jsx — Marca · brand exploration
 * Light/dark, focus mode, smooth scroll, scroll-spy.
 * Tweaks panel = floating control surface (host protocol).
 */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "focus": "all",
  "showRail": true
}/*EDITMODE-END*/;

function MarcaApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme + focus to body via attributes (CSS does the rest)
  React.useEffect(() => {
    document.body.dataset.theme = t.theme;
    document.documentElement.dataset.theme = t.theme;
  }, [t.theme]);

  React.useEffect(() => {
    document.body.dataset.focus = t.focus;
  }, [t.focus]);

  React.useEffect(() => {
    const rail = document.querySelector('.rail');
    if (rail) rail.style.display = t.showRail ? '' : 'none';
  }, [t.showRail]);

  // Scroll-spy: highlight rail link of the section in view
  React.useEffect(() => {
    const links = Array.from(document.querySelectorAll('.rail a[data-id]'));
    const idToLink = new Map(links.map(a => [a.dataset.id, a]));
    const sections = links
      .map(a => document.getElementById(a.dataset.id))
      .filter(Boolean);
    if (!sections.length) return;

    const io = new IntersectionObserver((entries) => {
      // Pick the entry highest on screen that is intersecting
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const id = visible[0].target.id;
      links.forEach(a => a.classList.toggle('active', a.dataset.id === id));
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Smooth scroll for rail anchors
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <TweaksPanel title="Tweaks · Marca">
      <TweakSection label="Vista" />
      <TweakRadio
        label="Tema"
        value={t.theme}
        options={[
          { value: 'light', label: 'Claro' },
          { value: 'dark',  label: 'Oscuro' },
        ]}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakToggle
        label="Mostrar rail (índice lateral)"
        value={t.showRail}
        onChange={(v) => setTweak('showRail', v)}
      />

      <TweakSection label="Foco" />
      <TweakSelect
        label="Mostrar solo"
        value={t.focus}
        options={[
          { value: 'all', label: 'Todas las direcciones' },
          { value: '01',  label: '01 · Norden' },
          { value: '02',  label: '02 · Taller' },
          { value: '03',  label: '03 · Runtime' },
          { value: '04',  label: '04 · Posta' },
        ]}
        onChange={(v) => setTweak('focus', v)}
      />

      <TweakSection label="Saltar a" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <TweakButton label="01 · Norden"  secondary onClick={() => jumpTo('dir-01')} />
        <TweakButton label="02 · Taller"  secondary onClick={() => jumpTo('dir-02')} />
        <TweakButton label="03 · Runtime" secondary onClick={() => jumpTo('dir-03')} />
        <TweakButton label="04 · Posta"   secondary onClick={() => jumpTo('dir-04')} />
        <TweakButton label="Comparativa"  secondary onClick={() => jumpTo('compare')} />
        <TweakButton label="Portada"      secondary onClick={() => jumpTo('cover')} />
      </div>
    </TweaksPanel>
  );
}

// Mount
const mount = document.createElement('div');
mount.id = '__marca-tweaks-root';
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<MarcaApp />);
