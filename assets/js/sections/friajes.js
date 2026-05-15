/* SECCIÓN 5 — FRIAJES Y HELADAS */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.friajes = () => {
  const map = RR.makeMap('mapFriajes', { center: [-13, -73], zoom: 5 });
  if (map) {
    // Heladas en sierra sur
    [['Puno',-15.84,-70.02],['Cusco',-13.53,-71.97],['Apurímac',-13.63,-72.88],['Huancavelica',-12.79,-74.97]].forEach(([n,lat,lon]) => {
      L.circle([lat,lon], { radius: 120000, color: '#5DADE2', fillColor: '#5DADE2', fillOpacity: 0.25, weight: 1 })
        .bindPopup(`<b>${n}</b> — Heladas (mayo-agosto)`).addTo(map);
    });
    // Friajes en selva
    [['Madre de Dios',-12.59,-69.18],['Ucayali',-8.38,-74.55]].forEach(([n,lat,lon]) => {
      L.circle([lat,lon], { radius: 200000, color: '#2F8F4F', fillColor: '#2F8F4F', fillOpacity: 0.2, weight: 1 })
        .bindPopup(`<b>${n}</b> — Friajes (junio-agosto)`).addTo(map);
    });
  }

  const c = RR.colors();
  RR.makeChart('chartHeladas', {
    type: 'bar',
    data: {
      labels: RR.data.heladasTempMin.estaciones,
      datasets: [{
        label: 'Temp. mínima histórica (°C)',
        data: RR.data.heladasTempMin.tempMin,
        backgroundColor: c.turquesa, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } }
    }
  });
};
