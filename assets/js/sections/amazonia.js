/* SECCIÓN 7 — DEFORESTACIÓN AMAZÓNICA */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.amazonia = () => {
  const c = RR.colors();

  RR.makeChart('chartDeforestacion', {
    type: 'bar',
    data: {
      labels: RR.data.deforestacionPorRegion.map(d => d.region),
      datasets: [{
        label: 'Hectáreas perdidas (2023)',
        data: RR.data.deforestacionPorRegion.map(d => d.ha2023),
        backgroundColor: c.amazonas, borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => RR.fmt.num(ctx.parsed.x) + ' ha' } }
      },
      scales: { x: { ticks: { callback: v => RR.fmt.short(v) } } }
    }
  });

  const map = RR.makeMap('mapAmazonia', { center: [-8, -73], zoom: 5 });
  if (map) {
    RR.data.deforestacionPorRegion.forEach(d => {
      const r = RR.regions.find(x => x.name === d.region);
      if (!r) return;
      const radius = 25000 + Math.sqrt(d.ha2023) * 250;
      L.circle([r.lat, r.lon], {
        radius, color: '#2F8F4F', fillColor: '#2F8F4F', fillOpacity: 0.3, weight: 1
      }).bindPopup(`<b>${d.region}</b><br>${RR.fmt.num(d.ha2023)} ha perdidas (2023)`).addTo(map);
    });
  }
};
