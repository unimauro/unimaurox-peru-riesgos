/* SECCIÓN 2 — SISMOS Y MAREMOTOS */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.sismos = () => {
  // Mapa de epicentros
  const map = RR.makeMap('mapSismos', { zoom: 5 });
  if (map) {
    RR.data.sismosHistoricos.forEach(s => {
      const r = Math.max(8, (s.mag - 5) * 8);
      L.circleMarker([s.lat, s.lon], {
        radius: r, color: '#C8102E', fillColor: '#C8102E', fillOpacity: 0.55, weight: 2
      }).bindPopup(`
        <b>${s.nombre} (${s.anio})</b><br>
        Magnitud: <b>${s.mag}</b> · Prof. ${s.prof} km<br>
        Víctimas: ${s.muertos.toLocaleString()}<br>
        <em>${s.nota}</em>
      `).addTo(map);
    });
  }

  // Timeline
  const tl = document.getElementById('sismosTimeline');
  if (tl && !tl.children.length) {
    tl.innerHTML = RR.data.sismosHistoricos
      .slice().sort((a,b) => a.anio - b.anio)
      .map(s => `
        <li>
          <span class="timeline-year">${s.anio}</span>
          <strong>${s.nombre}</strong> · M${s.mag}<br>
          <span class="muted small">${s.muertos.toLocaleString()} víctimas · ${s.nota}</span>
        </li>`).join('');
  }

  // Gráfico décadas
  const c = RR.colors();
  RR.makeChart('chartSismosDecadas', {
    type: 'bar',
    data: {
      labels: RR.data.sismosPorDecada.map(d => d.decada),
      datasets: [{
        label: 'Sismos M≥5.0 sentidos',
        data: RR.data.sismosPorDecada.map(d => d.cantidad),
        backgroundColor: c.rojo, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Tabla tsunami
  const t = document.getElementById('tablaTsunami');
  if (t) {
    t.innerHTML = `
      <thead><tr><th>Ciudad</th><th>Tiempo arribo</th><th>Altura estimada</th></tr></thead>
      <tbody>${RR.data.tsunamiTimes.map(x => `
        <tr><td><strong>${x.ciudad}</strong></td><td>${x.minutos} min</td><td>${x.altura}</td></tr>
      `).join('')}</tbody>`;
  }
};
