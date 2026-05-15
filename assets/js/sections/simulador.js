/* ============================================================
   SECCIÓN 12 — SIMULADOR (gancho viral del dashboard)
   6 sub-simuladores con visualizaciones ricas.
   ============================================================ */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

/* Helpers de UI compartidos por todos los simuladores */
const sev = (val, thresholds) => {
  // thresholds = [warn, crit]  → devuelve 'ok' / 'warn' / 'crit'
  if (val >= thresholds[1]) return 'crit';
  if (val >= thresholds[0]) return 'warn';
  return 'ok';
};
const hero = (icon, num, lbl, severity = '') =>
  `<div class="sim-hero ${severity}">
     <span class="sim-hero-icon">${icon}</span>
     <div class="sim-hero-num">${num}</div>
     <div class="sim-hero-lbl">${lbl}</div>
   </div>`;
const bar = (label, pct, val) =>
  `<div class="sim-bar">
     <span class="sim-bar-label">${label}</span>
     <div class="sim-bar-track"><div class="sim-bar-fill" style="width:${Math.min(100, pct)}%"></div></div>
     <span class="sim-bar-val">${val}</span>
   </div>`;

RR.sectionInit.simulador = () => {
  document.querySelectorAll('.sim-tab').forEach(t => {
    t.addEventListener('click', () => {
      const sim = t.dataset.sim;
      document.querySelectorAll('.sim-tab').forEach(x => x.classList.toggle('active', x === t));
      document.querySelectorAll('.sim-panel').forEach(p => p.classList.toggle('active', p.dataset.simPanel === sim));
      setTimeout(() => {
        Object.values(RR.state.maps).forEach(m => { try { m.invalidateSize(); } catch(e){} });
        Object.values(RR.state.charts).forEach(c => { try { c.resize(); } catch(e){} });
      }, 60);
    });
  });

  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (params.get('sim')) {
    document.querySelector(`.sim-tab[data-sim="${params.get('sim')}"]`)?.click();
  }

  initSimSismo();
  initSimTsunami();
  initSimNino();
  initSimAlimentaria();
  initSimPandemia();
  initSimApagon();
};

/* ================ 12.1 SÍSMICO ================ */
function initSimSismo() {
  const select = document.getElementById('simSismoCity');
  if (!select) return;
  const ciudades = [
    ...RR.regions.map(r => ({ name: r.ciudad + ' (' + r.name + ')', lat: r.lat, lon: r.lon })),
    { name: 'Fosa peruano-chilena · Pisco (mar)', lat: -13.49, lon: -76.85 },
    { name: 'Fosa peruano-chilena · Callao (mar)', lat: -12.30, lon: -77.40 },
    { name: 'Fosa peruano-chilena · Arica (mar)', lat: -18.50, lon: -71.30 }
  ];
  select.innerHTML = ciudades.map((c,i) => `<option value="${i}">${c.name}</option>`).join('');
  select.dataset.list = JSON.stringify(ciudades);
  select.value = ciudades.findIndex(c => c.name.includes('Lima'));

  const mag = document.getElementById('simSismoMag');
  const dep = document.getElementById('simSismoDep');
  mag.addEventListener('input', () => { document.getElementById('simSismoMagOut').textContent = mag.value; runSismo(); });
  dep.addEventListener('input', () => { document.getElementById('simSismoDepOut').textContent = dep.value; runSismo(); });
  document.getElementById('simSismoHora').addEventListener('change', runSismo);
  select.addEventListener('change', runSismo);

  document.getElementById('simSismoRun').addEventListener('click', runSismo);
  document.getElementById('simSismoCompare').addEventListener('click', () => {
    select.value = ciudades.findIndex(c => c.name.includes('Pisco (mar)'));
    mag.value = 8.0; document.getElementById('simSismoMagOut').textContent = '8.0';
    dep.value = 39; document.getElementById('simSismoDepOut').textContent = '39';
    document.getElementById('simSismoHora').value = 'noche';
    runSismo({ historic: 'Pisco 2007 · M8.0 · 595 muertos · ~80k viviendas destruidas · 24 horas para que llegara ayuda completa.' });
  });
  document.getElementById('simSismoShare').addEventListener('click', () => {
    const url = new URL(location.href);
    url.hash = `simulador?sim=sismo&m=${mag.value}&d=${dep.value}&c=${select.value}`;
    navigator.clipboard?.writeText(url.toString());
    const btn = document.getElementById('simSismoShare');
    const t = btn.textContent; btn.textContent = '✅ Copiada'; setTimeout(() => btn.textContent = t, 1500);
  });

  const p = new URLSearchParams(location.hash.split('?')[1] || '');
  if (p.get('m')) { mag.value = p.get('m'); document.getElementById('simSismoMagOut').textContent = mag.value; }
  if (p.get('d')) { dep.value = p.get('d'); document.getElementById('simSismoDepOut').textContent = dep.value; }
  if (p.get('c')) { select.value = p.get('c'); }

  runSismo();
}

function runSismo(extra) {
  const select = document.getElementById('simSismoCity');
  const ciudades = JSON.parse(select.dataset.list);
  const origen = ciudades[select.value];
  const m = parseFloat(document.getElementById('simSismoMag').value);
  const d = parseFloat(document.getElementById('simSismoDep').value);
  const hora = document.getElementById('simSismoHora').value;

  const radiusFor = (intensity) => {
    const logR = (1.5 * m - intensity - 0.005 * d);
    return Math.max(0, Math.pow(10, logR));
  };

  // Mapa con anillos Mercalli
  if (RR.state.maps['mapSimSismo']) { RR.state.maps['mapSimSismo'].remove(); }
  const map = L.map('mapSimSismo', { scrollWheelZoom: false }).setView([origen.lat, origen.lon], 5);
  L.tileLayer(
    RR.state.theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', attribution: '© OSM © CartoDB' }
  ).addTo(map);
  RR.state.maps['mapSimSismo'] = map;

  const intensities = [
    { I: 9, color: '#8B0A1F', label: 'IX — Destrucción' },
    { I: 7, color: '#C8102E', label: 'VII — Daño severo' },
    { I: 5, color: '#D88C2A', label: 'V — Sentido fuerte' }
  ];
  intensities.forEach(({ I, color, label }) => {
    const radius = radiusFor(I) * 1000;
    if (radius < 1000) return;
    L.circle([origen.lat, origen.lon], { radius, color, fillColor: color, fillOpacity: 0.18, weight: 2 })
      .bindPopup(`${label} · ~${Math.round(radius/1000)} km`).addTo(map);
  });
  L.marker([origen.lat, origen.lon]).addTo(map).bindPopup(`<b>Epicentro</b><br>M${m.toFixed(1)} · ${d} km`);

  // Análisis de impacto
  const rDano = radiusFor(7);
  const rDestr = radiusFor(9);
  let pobExpuesta = 0;
  let ciudadesAfectadas = [];
  RR.regions.forEach(r => {
    const dist = haversine(origen.lat, origen.lon, r.lat, r.lon);
    if (dist <= rDano) {
      pobExpuesta += r.pob;
      const intensidad = dist <= rDestr ? 'IX-X' : dist <= rDano * 0.6 ? 'VIII' : 'VII';
      ciudadesAfectadas.push({ nombre: r.ciudad, region: r.name, dist: Math.round(dist), intensidad, pob: r.pob });
    }
  });
  ciudadesAfectadas.sort((a,b) => a.dist - b.dist);

  const pctInformal = 0.55;
  const viviendasVuln = Math.round(pobExpuesta * pctInformal / 4);
  const factorHora = hora === 'noche' ? 1.4 : 1.0;
  const muertes = Math.max(0, Math.round(viviendasVuln * 0.008 * (m / 7.0) * factorHora));
  const heridos = Math.round(muertes * 8);
  const damnificados = Math.round(viviendasVuln * 2.2);

  const distLima = haversine(origen.lat, origen.lon, -12.05, -77.04);
  const tP = distLima / 6.0;
  const tS = distLima / 3.5;

  // Comparar con históricos
  const historico = RR.data.sismosHistoricos.reduce((best, h) =>
    Math.abs(h.mag - m) < Math.abs(best.mag - m) ? h : best
  );

  const sevMuertes = sev(muertes, [50, 500]);
  const sevPob = sev(pobExpuesta, [500_000, 3_000_000]);

  const out = document.getElementById('simSismoOut');
  out.innerHTML = `
    <h4>📊 Resultado de la simulación</h4>
    <div class="sim-heroes">
      ${hero('💀', RR.fmt.short(muertes), 'Víctimas estimadas', sevMuertes)}
      ${hero('🏥', RR.fmt.short(heridos), 'Heridos', sevMuertes === 'crit' ? 'crit' : 'warn')}
      ${hero('🏚️', RR.fmt.short(damnificados), 'Damnificados', 'warn')}
      ${hero('👥', RR.fmt.short(pobExpuesta), 'Población expuesta', sevPob)}
    </div>
    <div class="sim-detail">
      <div class="metric"><span class="metric-label">Radio destrucción (Mercalli IX)</span><span class="metric-value">~${Math.round(rDestr)} km</span></div>
      <div class="metric"><span class="metric-label">Radio daño severo (Mercalli VII)</span><span class="metric-value">~${Math.round(rDano)} km</span></div>
      <div class="metric"><span class="metric-label">Viviendas vulnerables (informales)</span><span class="metric-value">${RR.fmt.num(viviendasVuln)}</span></div>
      <div class="metric"><span class="metric-label">Onda P llega a Lima en</span><span class="metric-value">${tP.toFixed(1)} s</span></div>
      <div class="metric"><span class="metric-label">Onda S (destructiva) llega a Lima en</span><span class="metric-value">${tS.toFixed(1)} s</span></div>
    </div>
    ${ciudadesAfectadas.length ? `
      <h4>🏙️ Ciudades afectadas (top ${Math.min(6, ciudadesAfectadas.length)})</h4>
      <table class="sim-mini-table">
        <tbody>${ciudadesAfectadas.slice(0,6).map(c =>
          `<tr><td><b>${c.nombre}</b> · ${c.region}</td><td>${c.dist} km</td><td class="num">${c.intensidad}</td></tr>`
        ).join('')}</tbody>
      </table>` : ''}
    <h4>📚 Comparación histórica</h4>
    <div class="sim-detail">
      <span class="sim-tag">${historico.nombre} (${historico.anio})</span>
      <span class="sim-tag warn">M${historico.mag}</span>
      <span class="sim-tag crit">${historico.muertos.toLocaleString()} víctimas</span>
      <p class="sim-meta">${historico.nota}</p>
    </div>
    ${extra?.historic ? `<div class="sim-detail" style="background:rgba(216,140,42,.12);">📚 <b>Histórico real:</b> ${extra.historic}</div>` : ''}
    <p class="sim-meta">⚠️ Estimaciones educativas con atenuación GMPE simplificada. Factor noche ×${factorHora.toFixed(1)}.</p>
  `;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* ================ 12.2 TSUNAMI ================ */
function initSimTsunami() {
  const oSelect = document.getElementById('simTsunamiOrigin');
  const tSelect = document.getElementById('simTsunamiTarget');
  if (!oSelect) return;

  const origenes = [
    { name: 'Frente a Tumbes (norte)', lat: -3.6, lon: -81.5 },
    { name: 'Frente a Piura', lat: -5.2, lon: -82.0 },
    { name: 'Frente a Chimbote', lat: -9.1, lon: -79.4 },
    { name: 'Frente a Callao', lat: -12.3, lon: -77.8 },
    { name: 'Frente a Pisco', lat: -13.5, lon: -77.5 },
    { name: 'Frente a Arequipa', lat: -16.5, lon: -73.5 }
  ];
  const targets = RR.data.tsunamiTimes;
  oSelect.innerHTML = origenes.map((o,i) => `<option value="${i}">${o.name}</option>`).join('');
  tSelect.innerHTML = targets.map((t,i) => `<option value="${i}">${t.ciudad}</option>`).join('');
  oSelect.dataset.list = JSON.stringify(origenes);
  tSelect.dataset.list = JSON.stringify(targets);

  const mag = document.getElementById('simTsunamiMag');
  mag.addEventListener('input', () => { document.getElementById('simTsunamiMagOut').textContent = mag.value; runTsunami(); });
  oSelect.addEventListener('change', runTsunami);
  tSelect.addEventListener('change', runTsunami);

  document.getElementById('simTsunamiRun').addEventListener('click', runTsunami);
  runTsunami();
}

function runTsunami() {
  const oSelect = document.getElementById('simTsunamiOrigin');
  const tSelect = document.getElementById('simTsunamiTarget');
  const origen = JSON.parse(oSelect.dataset.list)[oSelect.value];
  const target = JSON.parse(tSelect.dataset.list)[tSelect.value];
  const m = parseFloat(document.getElementById('simTsunamiMag').value);

  const cityCoords = {
    Tumbes: [-3.57,-80.45], Piura: [-5.19,-80.63], Chimbote: [-9.08,-78.58],
    Callao: [-12.06,-77.13], Pisco: [-13.71,-76.20], Camaná: [-16.62,-72.71], Ilo: [-17.64,-71.34]
  };
  const tc = cityCoords[target.ciudad] || [-12.05,-77.04];

  const dist = haversine(origen.lat, origen.lon, tc[0], tc[1]);
  const minutos = Math.max(1, Math.round((dist / 720) * 60));
  const alturaBase = Math.max(0, (m - 7.0) * 3);
  const altura = (alturaBase * Math.exp(-dist / 800));

  if (RR.state.maps['mapSimTsunami']) RR.state.maps['mapSimTsunami'].remove();
  const map = L.map('mapSimTsunami', { scrollWheelZoom: false }).setView([(origen.lat+tc[0])/2, (origen.lon+tc[1])/2], 5);
  L.tileLayer(
    RR.state.theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains:'abcd', attribution:'© OSM' }
  ).addTo(map);
  RR.state.maps['mapSimTsunami'] = map;
  L.marker([origen.lat, origen.lon]).addTo(map).bindPopup(`Epicentro M${m}`);
  L.circleMarker([tc[0], tc[1]], { radius: 12, color: '#1E9AA4', fillColor: '#1E9AA4', fillOpacity: 0.6 }).addTo(map).bindPopup(`<b>${target.ciudad}</b>`);
  // Anillos de tiempo (cada 5 min)
  for (let t = 5; t <= minutos + 5; t += 5) {
    const r = (720 * 1000) * (t / 60); // metros
    L.circle([origen.lat, origen.lon], { radius: r, color: '#1E9AA4', weight: 1, fill: false, opacity: 0.4, dashArray: '4 4' }).addTo(map);
  }
  L.polyline([[origen.lat, origen.lon], [tc[0], tc[1]]], { color: '#1E9AA4', weight: 2, dashArray: '6 6' }).addTo(map);

  // Timeline de acciones según minutos disponibles
  const acciones = [
    { minOK: 0,  txt: 'Tienes el tiempo justo. Solo subir.', sev: 'crit' },
    { minOK: 5,  txt: 'Toma sólo lo esencial y sube a pie.', sev: 'crit' },
    { minOK: 15, txt: 'Reúne a la familia y suba en grupo. NO al auto.', sev: 'warn' },
    { minOK: 25, txt: 'Mochila + agua + medicación. Subir a cota ≥30 m.', sev: 'warn' },
    { minOK: 40, txt: 'Tiempo para evacuación organizada por rutas marcadas.', sev: 'ok' }
  ];
  const accion = acciones.reverse().find(a => minutos >= a.minOK) || acciones[0];

  const sevAltura = sev(altura, [3, 6]);
  const sevTiempo = minutos < 10 ? 'crit' : minutos < 25 ? 'warn' : 'ok';

  document.getElementById('simTsunamiOut').innerHTML = `
    <h4>🌊 Resultado de la simulación</h4>
    <div class="sim-heroes">
      ${hero('⏱️', `${minutos} min`, 'Tiempo de llegada', sevTiempo)}
      ${hero('📏', `${altura.toFixed(1)} m`, 'Altura inundación', sevAltura)}
      ${hero('📍', `${Math.round(dist)} km`, 'Distancia epicentro', '')}
      ${hero('🏃', accion.sev === 'crit' ? '¡SUBE YA!' : accion.sev === 'warn' ? 'Evacúa' : 'Aleja', 'Acción inmediata', accion.sev)}
    </div>
    <div class="sim-detail">
      <div class="metric"><span class="metric-label">Cota segura recomendada</span><span class="metric-value">≥ 30 m sobre nivel del mar</span></div>
      <div class="metric"><span class="metric-label">Ventana de evacuación</span><span class="metric-value">${minutos} minutos desde sismo</span></div>
      <div class="metric"><span class="metric-label">Acción priorizada</span><span class="metric-value">${accion.txt}</span></div>
    </div>
    <p class="sim-meta">📚 <b>Histórico:</b> El tsunami de 1746 destruyó el Callao. Solo unas decenas de personas sobrevivieron de ~5 000. Si sientes un sismo fuerte en la costa: <b>no esperes la sirena</b>.</p>
  `;
}

/* ================ 12.3 EL NIÑO ================ */
function initSimNino() {
  document.getElementById('simNinoInt').addEventListener('change', runNino);
  document.getElementById('simNinoMes').addEventListener('change', runNino);
  document.getElementById('simNinoRun')?.addEventListener('click', runNino);
  runNino();
}
function runNino() {
  const int = document.getElementById('simNinoInt').value;
  const factor = { debil: 1, moderado: 2.5, fuerte: 5, extraordinario: 10 }[int];
  const lluviaProm = 200 * factor;
  const perdida = factor * 320;
  const damnificadosMiles = factor * 28;
  const cultivos = { debil: 'arroz, banano', moderado: 'arroz, banano, mango', fuerte: 'arroz, banano, mango, caña, algodón', extraordinario: 'todo el agro norte (catastrófico)' }[int];

  // Distribución mensual aproximada (% del total) según mes de inicio
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const inicio = { 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11, 'Enero': 0 }[document.getElementById('simNinoMes').value];
  const perfilMensual = [0.05, 0.10, 0.22, 0.30, 0.20, 0.10, 0.03]; // 7 meses
  const lluviaPorMes = new Array(12).fill(0);
  perfilMensual.forEach((p, i) => { lluviaPorMes[(inicio + i) % 12] = Math.round(lluviaProm * p); });
  const pico = lluviaPorMes.indexOf(Math.max(...lluviaPorMes));

  const sevImpacto = factor >= 5 ? 'crit' : factor >= 2.5 ? 'warn' : 'ok';

  // Barras por región
  const regiones = [
    { n: 'Piura', impacto: factor * 35 },
    { n: 'Tumbes', impacto: factor * 28 },
    { n: 'Lambayeque', impacto: factor * 30 },
    { n: 'La Libertad', impacto: factor * 22 },
    { n: 'Cajamarca (sierra)', impacto: factor * 15 }
  ];
  const maxImp = Math.max(...regiones.map(r => r.impacto));

  document.getElementById('simNinoOut').innerHTML = `
    <h4>☀️ Impacto proyectado · Niño ${int}</h4>
    <div class="sim-heroes">
      ${hero('🌧️', RR.fmt.num(lluviaProm), 'mm lluvia (norte)', sevImpacto)}
      ${hero('💰', `${RR.fmt.short(perdida)}M`, 'USD pérdidas', sevImpacto)}
      ${hero('🏚️', `${damnificadosMiles}k`, 'Damnificados', sevImpacto)}
      ${hero('📆', meses[pico], 'Mes pico esperado', 'warn')}
    </div>
    <div class="sim-detail">
      <h4 style="margin-bottom:8px;font-size:.92rem;">📊 Impacto por región (relativo)</h4>
      <div class="sim-bars">
        ${regiones.map(r => bar(r.n, (r.impacto/maxImp)*100, `${r.impacto.toFixed(0)}`)).join('')}
      </div>
    </div>
    <div class="sim-detail">
      <div class="metric"><span class="metric-label">Cultivos en riesgo</span><span class="metric-value">${cultivos}</span></div>
      <div class="metric"><span class="metric-label">Quebradas que se reactivarían</span><span class="metric-value">${factor >= 5 ? '50+' : factor >= 2.5 ? '20-40' : '10-20'} en Lima Este</span></div>
      <div class="metric"><span class="metric-label">Comparable histórico</span><span class="metric-value">${factor>=10?'1998/2017':factor>=5?'1972/1983':'2008/2019'}</span></div>
    </div>
    <p class="sim-meta">📚 1998 (~USD 3 500 M) · 2017 (~USD 3 100 M). Modelo educativo simplificado.</p>
  `;
}

/* ================ 12.4 ALIMENTARIA ================ */
function initSimAlimentaria() {
  const dur = document.getElementById('simAlimDur');
  dur.addEventListener('input', () => { document.getElementById('simAlimDurOut').textContent = dur.value; runAlim(); });
  document.getElementById('simAlimShock').addEventListener('change', runAlim);
  document.getElementById('simAlimRun').addEventListener('click', runAlim);
  runAlim();
}
function runAlim() {
  const shock = document.getElementById('simAlimShock').value;
  const dur = parseInt(document.getElementById('simAlimDur').value);
  const sevidad = { guerra: 1.0, canal: 0.7, embargo: 1.2, sequia: 1.5 }[shock];

  const productos = [
    { n: 'Pan',     e: 0.08 },
    { n: 'Fideos',  e: 0.10 },
    { n: 'Pollo',   e: 0.05 },
    { n: 'Huevos',  e: 0.06 },
    { n: 'Arroz',   e: 0.04 },
    { n: 'Aceite',  e: 0.07 }
  ].map(p => ({ ...p, aum: sevidad * p.e * dur * 100 }));
  const maxAum = Math.max(...productos.map(p => p.aum));

  const region = shock === 'embargo' ? 'Norte agrícola (Piura, Lambayeque, La Libertad)'
              : shock === 'sequia'  ? 'Sierra y costa sur (Puno, Arequipa, Ica)'
              : 'Quintiles 1 y 2 a nivel nacional';

  const ipcGlobal = (productos.reduce((s,p) => s+p.aum, 0) / productos.length).toFixed(1);
  const sevIPC = sev(parseFloat(ipcGlobal), [10, 25]);

  const shockNombre = { guerra:'Guerra ampliada', canal:'Cierre canal marítimo', embargo:'Embargo fertilizantes', sequia:'Sequía global' }[shock];

  document.getElementById('simAlimOut').innerHTML = `
    <h4>🌾 ${shockNombre} · ${dur} meses</h4>
    <div class="sim-heroes">
      ${hero('📈', `+${ipcGlobal}%`, 'IPC alimentos prom.', sevIPC)}
      ${hero('⏳', `${dur} meses`, 'Duración shock', dur > 12 ? 'crit' : dur > 6 ? 'warn' : 'ok')}
      ${hero('🎯', sevidad.toFixed(1), 'Severidad shock', sevidad > 1 ? 'crit' : 'warn')}
    </div>
    <div class="sim-detail">
      <h4 style="margin-bottom:8px;font-size:.92rem;">🛒 Aumento por producto</h4>
      <div class="sim-bars">
        ${productos.map(p => bar(p.n, (p.aum/maxAum)*100, `+${p.aum.toFixed(1)}%`)).join('')}
      </div>
    </div>
    <div class="sim-detail">
      <div class="metric"><span class="metric-label">Regiones más vulnerables</span><span class="metric-value">${region}</span></div>
      <div class="metric"><span class="metric-label">Hogares en pobreza alimentaria</span><span class="metric-value">~${Math.round(sevidad * dur * 80)}k adicionales</span></div>
      <div class="metric"><span class="metric-label">Stock estratégico (días)</span><span class="metric-value">${shock === 'embargo' ? '~30 días urea' : '~45-60 días cereales'}</span></div>
    </div>
    <p class="sim-meta">📚 Crisis 2022 (post Ucrania): IPC alimentos +14% en 8 meses. Modelo basado en elasticidades históricas BCRP.</p>
  `;
}

/* ================ 12.5 PANDEMIA (SEIR) ================ */
function initSimPandemia() {
  ['R0','Let','UCI'].forEach(k => {
    const el = document.getElementById('simPan' + k);
    el.addEventListener('input', () => {
      document.getElementById('simPan' + k + 'Out').textContent = el.value;
      runPandemia();
    });
  });
  document.getElementById('simPanRun').addEventListener('click', runPandemia);
  runPandemia();
}
function runPandemia() {
  const R0  = parseFloat(document.getElementById('simPanR0').value);
  const cfr = parseFloat(document.getElementById('simPanLet').value) / 100;
  const uciFactor = parseFloat(document.getElementById('simPanUCI').value) / 100;

  const N = 20_000_000;
  const sigma = 1 / 5, gamma = 1 / 7;
  const beta = R0 * gamma;

  let S = N - 100, E = 100, I = 0, R = 0;
  let curve = [], demUCIarr = [];
  const ucisDisp = Math.round(3000 * uciFactor);
  let saturacionDia = -1;

  for (let day = 0; day < 180; day++) {
    const newE = beta * S * I / N;
    const newI = sigma * E;
    const newR = gamma * I;
    S -= newE; E += newE - newI; I += newI - newR; R += newR;
    if (S < 0) S = 0;
    curve.push(Math.round(I));
    const demUCI = Math.round(I * 0.05);
    demUCIarr.push(demUCI);
    if (saturacionDia < 0 && demUCI > ucisDisp) saturacionDia = day;
  }
  const muertes = Math.round(R * cfr);
  const pico = Math.max(...curve);
  const piDia = curve.indexOf(pico);

  RR.makeChart('chartPandemia', {
    type: 'line',
    data: {
      labels: curve.map((_, i) => 'D' + i),
      datasets: [
        { label: 'Infecciosos activos', data: curve, borderColor: '#C8102E', backgroundColor: '#C8102E22', fill: true, tension: 0.2, pointRadius: 0, borderWidth: 2 },
        { label: 'Demanda UCI (5%)', data: demUCIarr, borderColor: '#D88C2A', backgroundColor: 'transparent', tension: 0.2, pointRadius: 0, borderWidth: 2, yAxisID: 'y2' },
        { label: `Capacidad UCI (${ucisDisp})`, data: new Array(180).fill(ucisDisp), borderColor: '#2F8F4F', borderDash: [4,4], backgroundColor: 'transparent', pointRadius: 0, borderWidth: 1.5, yAxisID: 'y2' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { ticks: { maxTicksLimit: 12 } },
        y: { position: 'left', ticks: { callback: v => RR.fmt.short(v) }, title: { display: true, text: 'Infecciosos' } },
        y2: { position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => RR.fmt.short(v) }, title: { display: true, text: 'UCI' } }
      }
    }
  });

  const sevMuertes = sev(muertes, [10_000, 100_000]);

  document.getElementById('simPanOut').innerHTML = `
    <div class="sim-heroes">
      ${hero('☠️', RR.fmt.short(muertes), 'Muertes 180d', sevMuertes)}
      ${hero('📈', RR.fmt.short(pico), 'Pico activos', sevMuertes)}
      ${hero('📅', 'D' + piDia, 'Día del pico', 'warn')}
      ${hero('🏥', saturacionDia >= 0 ? 'D' + saturacionDia : 'No satura', 'UCI saturadas', saturacionDia >= 0 ? 'crit' : 'ok')}
    </div>
    <p class="sim-meta">📚 COVID-19 Perú: ~220 mil muertes oficiales · ~370 mil exceso mortalidad. Modelo SEIR con N=20M (Lima Met).</p>
  `;
}

/* ================ 12.6 APAGÓN ================ */
function initSimApagon() {
  const dur = document.getElementById('simApagonDur');
  dur.addEventListener('input', () => { document.getElementById('simApagonDurOut').textContent = dur.value; runApagon(); });
  document.getElementById('simApagonZona').addEventListener('change', runApagon);
  document.getElementById('simApagonEpoca').addEventListener('change', runApagon);
  document.getElementById('simApagonRun').addEventListener('click', runApagon);
  runApagon();
}
function runApagon() {
  const zona = document.getElementById('simApagonZona').value;
  const dur = parseInt(document.getElementById('simApagonDur').value);
  const epoca = document.getElementById('simApagonEpoca').value;

  const pob = { 'Lima Metropolitana': 10_628_000, 'Norte (Trujillo, Chiclayo, Piura)': 5_500_000,
    'Sur (Arequipa, Cusco, Puno)': 4_100_000, 'Selva (Iquitos, Pucallpa)': 1_800_000,
    'Nacional': 33_000_000 }[zona];
  const factorEpoca = epoca.includes('Invierno') ? 1.3 : 1.0;
  const hospSinGen = Math.round((pob / 50000) * 0.4 * factorEpoca);

  // Cascada temporal
  const cascada = [
    { t: 0,  txt: 'Semáforos apagados · caos vial inmediato', sev: 'warn' },
    { t: 1,  txt: 'Antenas celulares en batería · congestión llamadas', sev: 'warn' },
    { t: 2,  txt: 'Cajeros automáticos inservibles · panic withdrawal', sev: 'warn' },
    { t: 4,  txt: 'Antenas celulares caen · comunicaciones colapsan', sev: 'crit' },
    { t: 6,  txt: 'SEDAPAL deja de bombear · agua se pierde en pisos altos', sev: 'crit' },
    { t: 12, txt: 'Refrigeración de alimentos comprometida · pérdida masiva', sev: 'crit' },
    { t: 24, txt: 'Hospitales sin generador agotan combustible · UCI en riesgo', sev: 'crit' },
    { t: 48, txt: 'Bombas de combustible inoperativas · transporte colapsa', sev: 'crit' },
    { t: 72, txt: 'Crisis humanitaria · necesidad de ayuda externa', sev: 'crit' }
  ];

  const cascadaHTML = cascada.filter(c => c.t <= dur).map(c => `
    <div class="sim-cascade-row ${c.sev}">
      <span class="sim-cascade-time">${c.t === 0 ? 'INMED.' : '+' + c.t + 'h'}</span>
      <span>${c.txt}</span>
    </div>`).join('');

  const sevDur = sev(dur, [6, 24]);

  document.getElementById('simApagonOut').innerHTML = `
    <h4>⚡ Apagón de ${dur} h en ${zona}</h4>
    <div class="sim-heroes">
      ${hero('👥', RR.fmt.short(pob), 'Población impactada', sevDur)}
      ${hero('🏥', hospSinGen, 'Hospitales sin generador', sevDur)}
      ${hero('⏳', `${dur} h`, 'Duración', sevDur)}
      ${hero('🌡️', epoca.includes('Invierno') ? 'Friaje' : 'Calor', 'Factor estacional', 'warn')}
    </div>
    <h4>⏱️ Cascada de efectos</h4>
    <div class="sim-cascade">${cascadaHTML}</div>
    <p class="sim-meta">📚 Apagones históricos: terrorismo torres SEIN (años 80-90), corte Mantaro 2008. SEDAPAL Atarjea depende 100% de electricidad para bombear.</p>
  `;
}
