/* SECCIÓN 3 — EL NIÑO / NIÑA COSTERA */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.nino = () => {
  // Timeline horizontal
  const tl = document.getElementById('ninoTimeline');
  if (tl && !tl.children.length) {
    tl.innerHTML = RR.data.ninoEventos.map(e => `
      <div class="event">
        <div class="event-year">${e.anio}</div>
        <div class="event-name">${e.intensidad}</div>
        <div class="event-body">${e.impacto}</div>
      </div>`).join('');
  }

  // Mapa
  const map = RR.makeMap('mapNino', { center: [-7, -79], zoom: 6 });
  if (map) {
    [{ n: 'Tumbes', lat: -3.57, lon: -80.45 },
     { n: 'Piura', lat: -5.19, lon: -80.63 },
     { n: 'Lambayeque', lat: -6.77, lon: -79.84 },
     { n: 'La Libertad', lat: -8.11, lon: -79.03 }
    ].forEach(r => {
      L.circle([r.lat, r.lon], {
        radius: 80000, color: '#D88C2A', fillColor: '#D88C2A', fillOpacity: 0.3, weight: 2
      }).bindPopup(`<b>${r.n}</b> — alto impacto El Niño`).addTo(map);
    });
  }

  // Chart TSM
  const c = RR.colors();
  RR.makeChart('chartTSM', {
    type: 'line',
    data: {
      labels: RR.data.ninoTSM.labels,
      datasets: [
        { label: 'Año actual',   data: RR.data.ninoTSM.actual,    borderColor: c.rojo, backgroundColor: 'transparent', tension: 0.3, borderWidth: 2 },
        { label: '2017 (Costero)', data: RR.data.ninoTSM.evento2017, borderColor: c.ocre, backgroundColor: 'transparent', tension: 0.3, borderDash: [5,5] },
        { label: 'Promedio',     data: RR.data.ninoTSM.promedio,  borderColor: c.muted, backgroundColor: 'transparent', tension: 0.3, borderDash: [2,4] }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { title: { display: true, text: 'Anomalía TSM (°C)' } } }
    }
  });

  // Forecast
  const fc = document.getElementById('ninoForecast');
  if (fc && !fc.children.length) {
    fc.innerHTML = RR.data.ninoForecast.map(f => `
      <div class="forecast-card">
        <div class="forecast-prob">${f.prob}%</div>
        <div class="forecast-label">${f.evento}</div>
      </div>`).join('');
  }
};
