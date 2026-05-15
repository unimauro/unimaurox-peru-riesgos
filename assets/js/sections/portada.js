/* SECCIÓN 1 — PORTADA */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.portada = () => {
  const map = RR.makeMap('mapPortada', { zoom: 5 });
  if (!map) return;

  // Capas de riesgo
  const layers = {
    sismos: L.layerGroup(),
    tsunami: L.layerGroup(),
    nino: L.layerGroup(),
    huaicos: L.layerGroup(),
    friajes: L.layerGroup(),
    amazonia: L.layerGroup()
  };

  // Sismos: marcadores de epicentros históricos
  RR.data.sismosHistoricos.forEach(s => {
    const radius = Math.max(6, (s.mag - 5) * 6);
    L.circleMarker([s.lat, s.lon], {
      radius, color: '#C8102E', fillColor: '#C8102E', fillOpacity: 0.55, weight: 1
    }).bindPopup(`<b>${s.nombre} (${s.anio})</b><br>M${s.mag} · ${s.muertos.toLocaleString()} víctimas`).addTo(layers.sismos);
  });

  // Tsunami: corredor costero
  const costa = [[-3.5,-80.5],[-5.2,-81.1],[-8.1,-79.4],[-12.1,-77.0],[-14.0,-76.0],[-16.4,-73.6],[-17.6,-71.5]];
  L.polyline(costa, { color: '#1E9AA4', weight: 4, opacity: 0.7, dashArray: '6 6' }).bindPopup('Litoral con zonas de inundación por tsunami').addTo(layers.tsunami);

  // Niño: norte resaltado
  L.circle([-5.2, -80.6], { radius: 200000, color: '#D88C2A', fillColor: '#D88C2A', fillOpacity: 0.15, weight: 1 }).bindPopup('Norte peruano · zona de mayor impacto El Niño').addTo(layers.nino);

  // Huaicos: Lima Este, Cajamarca, Cusco
  [['Chosica/SJL', -11.94, -76.71], ['Cajamarca', -7.16, -78.50], ['Cusco', -13.53, -71.97], ['Áncash', -9.08, -78.0]].forEach(([n, lat, lon]) => {
    L.circleMarker([lat, lon], { radius: 9, color: '#8B4513', fillColor: '#D2691E', fillOpacity: 0.6 }).bindPopup(`<b>Huaicos críticos: ${n}</b>`).addTo(layers.huaicos);
  });

  // Friajes: altiplano + selva sur
  L.circle([-15.8, -70.0], { radius: 180000, color: '#5DADE2', fillColor: '#5DADE2', fillOpacity: 0.18, weight: 1 }).bindPopup('Altiplano puneño · heladas extremas').addTo(layers.friajes);
  L.circle([-12.6, -69.2], { radius: 220000, color: '#5DADE2', fillColor: '#5DADE2', fillOpacity: 0.18, weight: 1 }).bindPopup('Selva sur · friajes amazónicos').addTo(layers.friajes);

  // Deforestación: Ucayali, Loreto, MDD, SM
  [['Ucayali',-8.38,-74.55],['Loreto',-3.75,-73.25],['Madre de Dios',-12.59,-69.18],['San Martín',-6.49,-76.36]].forEach(([n,lat,lon]) => {
    L.circleMarker([lat,lon], { radius: 12, color: '#2F8F4F', fillColor: '#2F8F4F', fillOpacity: 0.55 }).bindPopup(`Deforestación crítica · ${n}`).addTo(layers.amazonia);
  });

  layers.sismos.addTo(map);

  // Conmutadores
  document.querySelectorAll('.map-layers input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const l = layers[cb.dataset.layer]; if (!l) return;
      cb.checked ? l.addTo(map) : map.removeLayer(l);
    });
  });

  // Region grid
  const grid = document.getElementById('regionGrid');
  if (grid && !grid.children.length) {
    grid.innerHTML = RR.regions.map(r => `
      <div class="region-chip" data-region="${r.id}">
        <span class="region-chip-name">${r.name}</span>
        <span class="region-chip-cat">${r.zona} · ${r.ciudad}</span>
      </div>`).join('');
    grid.addEventListener('click', e => {
      const chip = e.target.closest('.region-chip');
      if (!chip) return;
      const id = chip.dataset.region;
      RR.setRegion(RR.state.selectedRegion === id ? null : id);
    });
  }

  // KPIs vivos (estimados)
  document.getElementById('kpiSismosMes').textContent = '~280';
  document.getElementById('kpiAlertas').textContent = '12';
  document.getElementById('kpiDistritos').textContent = '46';
};
