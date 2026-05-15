/* ============================================================
   APP.JS — núcleo: routing, tema, filtro global de región,
   helpers de mapa y gráfico, estado compartido.
   ============================================================ */

window.RR = window.RR || {};

RR.state = {
  currentSection: 'portada',
  selectedRegion: null,
  theme: 'dark',
  maps: {},      // instancias Leaflet por id
  charts: {},    // instancias Chart.js por id
  initialized: {}
};

/* ------ Utilidades ------ */
RR.fmt = {
  num: (n, dec = 0) => Number(n).toLocaleString('es-PE', { maximumFractionDigits: dec }),
  pct: (n, dec = 1) => Number(n).toLocaleString('es-PE', { maximumFractionDigits: dec }) + '%',
  km: (n) => RR.fmt.num(n, 0) + ' km',
  min: (n) => RR.fmt.num(n, 0) + ' min',
  short: (n) => {
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n/1_000).toFixed(1) + 'k';
    return String(n);
  }
};

RR.colors = () => {
  const root = getComputedStyle(document.body);
  return {
    rojo: root.getPropertyValue('--rojo-peru').trim() || '#C8102E',
    ocre: root.getPropertyValue('--ocre').trim() || '#D88C2A',
    turquesa: root.getPropertyValue('--turquesa').trim() || '#1E9AA4',
    amazonas: root.getPropertyValue('--amazonas').trim() || '#2F8F4F',
    text: root.getPropertyValue('--text').trim() || '#E8EEF4',
    muted: root.getPropertyValue('--text-muted').trim() || '#93A1B0',
    border: root.getPropertyValue('--border').trim() || '#2A3441',
    bg: root.getPropertyValue('--bg-card').trim() || '#1E2632'
  };
};

/* ------ Tema claro/oscuro ------ */
RR.toggleTheme = () => {
  const cur = document.body.dataset.theme;
  const next = cur === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  RR.state.theme = next;
  localStorage.setItem('rr-theme', next);
  // re-renderear charts para que tomen el color nuevo
  Object.values(RR.state.charts).forEach(c => { try { c.update(); } catch(e){} });
};

/* ------ Routing por hash ------ */
RR.go = (sectionId, { replace = false } = {}) => {
  if (!sectionId) sectionId = 'portada';
  if (sectionId.startsWith('#')) sectionId = sectionId.slice(1);
  // Permite hashes con query: simulador?sim=tsunami
  const [section] = sectionId.split('?');

  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === section));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.section === section));

  RR.state.currentSection = section;
  if (!replace && location.hash !== '#' + sectionId) {
    history.pushState(null, '', '#' + sectionId);
  }
  // Trigger init solo la primera vez por sección
  const init = RR.sectionInit?.[section];
  if (init && !RR.state.initialized[section]) {
    try { init(); RR.state.initialized[section] = true; } catch(e) { console.error('Error init', section, e); }
  }
  // Mapas leaflet necesitan invalidate al mostrarse
  setTimeout(() => Object.values(RR.state.maps).forEach(m => { try { m.invalidateSize(); } catch(e){} }), 80);
  // Cerrar sidebar móvil
  document.getElementById('sidebar')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'instant' });
};

/* ------ Filtro global de región ------ */
RR.setRegion = (id) => {
  RR.state.selectedRegion = id || null;
  document.querySelectorAll('.region-chip').forEach(c => c.classList.toggle('active', c.dataset.region === id));
  // Sincronizar select del topbar
  const sel = document.getElementById('globalRegion');
  if (sel && sel.value !== (id || '')) sel.value = id || '';
  // Disparar evento para que las secciones se filtren
  document.dispatchEvent(new CustomEvent('rr:region', { detail: { id } }));
  // Renderizar perfil de región en portada
  if (id) RR.renderRegionProfile(id);
};

RR.renderRegionProfile = (id) => {
  const r = RR.regions.find(x => x.id === id);
  const card = document.getElementById('regionProfile');
  if (!r || !card) { card?.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  document.getElementById('regionProfileName').textContent = `${r.name} (${r.zona})`;
  const body = document.getElementById('regionProfileBody');
  const risks = Object.entries(r.risks)
    .sort(([,a],[,b]) => ({alta:3,media:2,baja:1}[b] - ({alta:3,media:2,baja:1}[a])))
    .map(([k, lvl]) => `
      <div class="profile-risk">
        <div class="profile-risk-name">${RR.riskLabels[k] || k}</div>
        <div class="profile-risk-level ${lvl}">Riesgo ${lvl}</div>
      </div>`).join('');
  body.innerHTML = `
    <p class="muted small">Ciudad principal: <strong>${r.ciudad}</strong> · Población ~${RR.fmt.short(r.pob)}</p>
    <div class="profile-risks">${risks}</div>
    <p class="small" style="margin-top:14px">
      Mira sus detalles en:
      ${Object.keys(r.risks).slice(0,4).map(k => {
        const map = {sismo:'sismos', tsunami:'sismos', huaicos:'huaicos', inundaciones:'huaicos',
          nino:'nino', friajes:'friajes', heladas:'friajes', sequia:'sequia', glaciares:'sequia',
          deforestacion:'amazonia', mineria:'amazonia', mercurio:'amazonia', salud:'pandemias',
          volcanes:'sismos', deslizamientos:'huaicos', incendios:'amazonia'};
        const sec = map[k]; if (!sec) return '';
        return `<a href="#${sec}">${RR.riskLabels[k]}</a>`;
      }).filter(Boolean).join(' · ')}
    </p>`;
};

/* ------ Helper para gráficos Chart.js con tema ------ */
RR.makeChart = (id, config) => {
  const el = document.getElementById(id);
  if (!el || typeof Chart === 'undefined') return null;
  const c = RR.colors();
  // Defaults
  Chart.defaults.color = c.muted;
  Chart.defaults.borderColor = c.border;
  Chart.defaults.font.family = "'Inter', sans-serif";
  if (RR.state.charts[id]) { RR.state.charts[id].destroy(); }
  RR.state.charts[id] = new Chart(el, config);
  return RR.state.charts[id];
};

/* ------ Helper para mapa Leaflet ------ */
RR.makeMap = (id, opts = {}) => {
  const el = document.getElementById(id);
  if (!el || typeof L === 'undefined') return null;
  if (RR.state.maps[id]) { RR.state.maps[id].remove(); }
  const map = L.map(id, { scrollWheelZoom: false, ...opts })
    .setView(opts.center || RR.config.mapCenter, opts.zoom || RR.config.mapZoom);
  const tilesDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const tilesLight = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const tiles = RR.state.theme === 'light' ? tilesLight : tilesDark;
  L.tileLayer(tiles, {
    attribution: '© OpenStreetMap · © CartoDB',
    subdomains: 'abcd',
    maxZoom: 18
  }).addTo(map);
  RR.state.maps[id] = map;
  return map;
};

/* ------ Inicio ------ */
RR.init = () => {
  // Tema persistido
  const saved = localStorage.getItem('rr-theme');
  if (saved) { document.body.dataset.theme = saved; RR.state.theme = saved; }

  // Toggle tema
  document.getElementById('themeToggle')?.addEventListener('click', RR.toggleTheme);

  // Toggle sidebar mobile
  document.getElementById('navToggle')?.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('open');
    const expanded = sb.classList.contains('open');
    document.getElementById('navToggle').setAttribute('aria-expanded', expanded);
  });

  // Nav clicks → routing
  document.querySelectorAll('.nav-item').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      RR.go(a.dataset.section);
    });
  });

  // Hash inicial
  window.addEventListener('hashchange', () => RR.go(location.hash || '#portada', { replace: true }));

  // Select global de región
  const sel = document.getElementById('globalRegion');
  sel.innerHTML = '<option value="">— Todo el Perú —</option>' +
    ['Costa','Sierra','Selva'].map(zona => {
      const opts = RR.regions.filter(r => r.zona === zona)
        .map(r => `<option value="${r.id}">${r.name}</option>`).join('');
      return `<optgroup label="${zona}">${opts}</optgroup>`;
    }).join('');
  sel.addEventListener('change', () => RR.setRegion(sel.value || null));

  // Mostrar última actualización
  document.getElementById('lastUpdate').textContent = RR.config.lastUpdate;

  // Boot: ir a la sección actual
  RR.go(location.hash || '#portada', { replace: true });
};
