/* SECCIÓN 8 — PANDEMIAS */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.pandemias = () => {
  const c = RR.colors();

  RR.makeChart('chartCovid', {
    type: 'bar',
    data: {
      labels: RR.data.covidExceso.labels,
      datasets: [{
        label: 'Exceso de mortalidad (miles)',
        data: RR.data.covidExceso.exceso,
        backgroundColor: ctx => ctx.parsed?.y > 30 ? c.rojo : c.ocre,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  const el = document.getElementById('capHospitalaria');
  if (el && !el.children.length) {
    const max = Math.max(...RR.data.ucisPorRegion.map(u => u.ucis));
    el.innerHTML = RR.data.ucisPorRegion.map(u => `
      <div style="margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
          <strong>${u.region}</strong><span>${u.ucis} UCI/100k</span>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${(u.ucis/max*100).toFixed(0)}%"></div></div>
      </div>`).join('');
  }
};
