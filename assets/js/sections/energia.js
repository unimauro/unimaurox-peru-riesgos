/* SECCIÓN 10 — ENERGÍA Y AGUA */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.energia = () => {
  const c = RR.colors();
  RR.makeChart('chartCobertura', {
    type: 'bar',
    data: {
      labels: RR.data.cobertura.regiones,
      datasets: [
        { label: 'Electricidad (%)', data: RR.data.cobertura.electricidad, backgroundColor: c.ocre, borderRadius: 4 },
        { label: 'Agua potable (%)', data: RR.data.cobertura.agua,         backgroundColor: c.turquesa, borderRadius: 4 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
  });
};
