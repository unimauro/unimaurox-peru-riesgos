/* SECCIÓN 6 — SEQUÍAS Y GLACIARES */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.sequia = () => {
  const c = RR.colors();

  RR.makeChart('chartGlaciares', {
    type: 'line',
    data: {
      labels: RR.data.glaciaresCobertura.labels,
      datasets: [{
        label: 'Cobertura glaciar (km²)',
        data: RR.data.glaciaresCobertura.km2,
        borderColor: c.turquesa, backgroundColor: c.turquesa + '33',
        fill: true, tension: 0.3, borderWidth: 3, pointRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { tooltip: { callbacks: { label: ctx => RR.fmt.num(ctx.parsed.y) + ' km²' } } }
    }
  });

  const el = document.getElementById('embalsesList');
  if (el && !el.children.length) {
    el.innerHTML = RR.data.embalses.map(e => {
      const status = e.llenado < 40 ? '🔴 Crítico' : e.llenado < 70 ? '🟡 Medio' : '🟢 Bueno';
      return `<li>
        <strong>${e.nombre}</strong> (${e.region}) · ${e.capacidad} hm³ — ${status}
        <div class="progress" style="margin-top:6px;"><div class="progress-bar" style="width:${e.llenado}%"></div></div>
        <span class="muted small">Llenado: ${e.llenado}%</span>
      </li>`;
    }).join('');
  }

  const map = RR.makeMap('mapSequia', { zoom: 5 });
  if (map) {
    // Costa sur — alto estrés hídrico
    [['Ica',-14.07,-75.73,'alta'],['Tacna',-18.01,-70.25,'alta'],['Moquegua',-17.19,-70.93,'alta'],
     ['Lima',-12.05,-77.04,'media'],['Piura',-5.19,-80.63,'media']].forEach(([n,lat,lon,lvl]) => {
      const color = lvl === 'alta' ? '#C8102E' : '#D88C2A';
      L.circle([lat,lon], { radius: 90000, color, fillColor: color, fillOpacity: 0.3, weight: 1 })
        .bindPopup(`<b>${n}</b> — Estrés hídrico ${lvl}`).addTo(map);
    });
  }
};
