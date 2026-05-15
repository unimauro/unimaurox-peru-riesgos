/* SECCIÓN 9 — SINIESTROS VIALES */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.viales = () => {
  const c = RR.colors();

  const list = document.getElementById('viasList');
  if (list && !list.children.length) {
    list.innerHTML = RR.data.viasPeligrosas.map(v => `
      <li>
        <strong>${v.ruta}</strong> · <span class="muted">${v.muertes2023} muertes (2023)</span><br>
        <span class="small muted">${v.nota}</span>
      </li>`).join('');
  }

  RR.makeChart('chartViales', {
    type: 'line',
    data: {
      labels: RR.data.viales.labels,
      datasets: [
        { label: 'Muertes', data: RR.data.viales.muertes, borderColor: c.rojo, backgroundColor: c.rojo + '22', tension: 0.3, fill: true },
        { label: 'Heridos (×10)', data: RR.data.viales.heridos.map(h => h/10), borderColor: c.ocre, backgroundColor: c.ocre + '22', tension: 0.3, hidden: true }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};
