/* SECCIÓN 4 — HUAICOS E INUNDACIONES */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.huaicos = () => {
  const map = RR.makeMap('mapHuaicos', { center: [-10, -76], zoom: 6 });
  if (map) {
    // Hotspots de huaicos
    const spots = [
      { n: 'Chosica/SJL/Huachipa', lat: -11.94, lon: -76.71, w: 'Quebradas Carosio, Quirio, Huaycoloro' },
      { n: 'Cajamarca', lat: -7.16, lon: -78.50, w: 'Deslizamientos por geología inestable' },
      { n: 'Áncash (Yungay)', lat: -9.13, lon: -77.75, w: 'Aluviones de Cordillera Blanca' },
      { n: 'Cusco (VRAEM)', lat: -13.5, lon: -73.5, w: 'Lluvias intensas + deforestación' },
      { n: 'Pucallpa', lat: -8.38, lon: -74.55, w: 'Inundación amazónica (Ucayali)' },
      { n: 'Iquitos', lat: -3.75, lon: -73.25, w: 'Inundación amazónica (crecidas)' },
      { n: 'Tarapoto', lat: -6.49, lon: -76.36, w: 'Río Mayo (crecidas)' }
    ];
    spots.forEach(s => {
      L.circleMarker([s.lat, s.lon], {
        radius: 10, color: '#8B4513', fillColor: '#D2691E', fillOpacity: 0.6, weight: 2
      }).bindPopup(`<b>${s.n}</b><br>${s.w}`).addTo(map);
    });
  }

  // Lista de quebradas
  const ql = document.getElementById('quebradasList');
  if (ql && !ql.children.length) {
    ql.innerHTML = RR.data.quebradasCriticas.map(q => `
      <li><strong>${q.nombre}</strong> · ${q.distrito}<br><span class="muted small">Riesgo: ${q.riesgo}</span></li>
    `).join('');
  }

  // Chart damnificados
  const c = RR.colors();
  RR.makeChart('chartDamnificados', {
    type: 'bar',
    data: {
      labels: RR.data.damnificadosPorAnio.map(x => x.anio),
      datasets: [{
        label: 'Damnificados',
        data: RR.data.damnificadosPorAnio.map(x => x.cifra),
        backgroundColor: ctx => ctx.parsed?.y > 500000 ? c.rojo : c.ocre,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => RR.fmt.num(ctx.parsed.y) + ' damnificados' } }
      },
      scales: { y: { ticks: { callback: v => RR.fmt.short(v) } } }
    }
  });
};
