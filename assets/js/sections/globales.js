/* SECCIÓN 11 — RIESGOS GLOBALES */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.globales = () => {
  const c = RR.colors();

  RR.makeChart('chartImportaciones', {
    type: 'bar',
    data: {
      labels: RR.data.importaciones.bien,
      datasets: [{
        label: '% importado',
        data: RR.data.importaciones.pctImportado,
        backgroundColor: ctx => ctx.parsed?.y > 80 ? c.rojo : ctx.parsed?.y > 50 ? c.ocre : c.amazonas,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }
    }
  });

  RR.makeChart('chartCanasta', {
    type: 'line',
    data: {
      labels: RR.data.canastaVsGlobales.labels,
      datasets: [
        { label: 'IPC alimentos PE (base 2019=100)', data: RR.data.canastaVsGlobales.ipcAlimentos, borderColor: c.rojo, tension: 0.3, borderWidth: 2 },
        { label: 'Trigo internacional (base 2019=100)', data: RR.data.canastaVsGlobales.trigoIntl, borderColor: c.ocre, tension: 0.3, borderWidth: 2, borderDash: [4,4] }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};
