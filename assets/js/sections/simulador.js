/* ============================================================
   SECCIÓN 12 — SIMULADOR (gancho viral del dashboard)
   6 sub-simuladores, modelos educativos simplificados.
   ============================================================ */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.simulador = () => {
  // Tabs
  document.querySelectorAll('.sim-tab').forEach(t => {
    t.addEventListener('click', () => {
      const sim = t.dataset.sim;
      document.querySelectorAll('.sim-tab').forEach(x => x.classList.toggle('active', x === t));
      document.querySelectorAll('.sim-panel').forEach(p => p.classList.toggle('active', p.dataset.simPanel === sim));
      setTimeout(() => Object.values(RR.state.maps).forEach(m => { try { m.invalidateSize(); } catch(e){} }), 60);
    });
  });

  // Permitir hash con ?sim=X
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (params.get('sim')) {
    const btn = document.querySelector(`.sim-tab[data-sim="${params.get('sim')}"]`);
    btn?.click();
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
  // Lista de ciudades costeras y andinas como posibles epicentros
  const ciudades = [
    ...RR.regions.map(r => ({ name: r.ciudad + ' (' + r.name + ')', lat: r.lat, lon: r.lon })),
    { name: 'Fosa peruano-chilena · Pisco (mar)', lat: -13.49, lon: -76.85 },
    { name: 'Fosa peruano-chilena · Callao (mar)', lat: -12.30, lon: -77.40 },
    { name: 'Fosa peruano-chilena · Arica (mar)', lat: -18.50, lon: -71.30 }
  ];
  select.innerHTML = ciudades.map((c,i) => `<option value="${i}">${c.name}</option>`).join('');
  select.dataset.list = JSON.stringify(ciudades);
  select.value = ciudades.findIndex(c => c.name.includes('Lima')); // default Lima

  // Live update outputs
  const mag = document.getElementById('simSismoMag');
  const dep = document.getElementById('simSismoDep');
  mag.addEventListener('input', () => document.getElementById('simSismoMagOut').textContent = mag.value);
  dep.addEventListener('input', () => document.getElementById('simSismoDepOut').textContent = dep.value);

  document.getElementById('simSismoRun').addEventListener('click', runSismo);
  document.getElementById('simSismoCompare').addEventListener('click', () => {
    // Comparar con Pisco 2007: M8.0, prof 39, noche (era 18:40 — usaremos noche)
    select.value = ciudades.findIndex(c => c.name.includes('Pisco (mar)'));
    mag.value = 8.0; document.getElementById('simSismoMagOut').textContent = '8.0';
    dep.value = 39; document.getElementById('simSismoDepOut').textContent = '39';
    document.getElementById('simSismoHora').value = 'noche';
    runSismo({ historic: 'Pisco 2007 · 595 muertos · 80k viviendas destruidas' });
  });
  document.getElementById('simSismoShare').addEventListener('click', () => {
    const url = new URL(location.href);
    url.hash = `simulador?sim=sismo&m=${mag.value}&d=${dep.value}&c=${select.value}`;
    navigator.clipboard?.writeText(url.toString());
    alert('🔗 URL copiada al portapapeles.');
  });

  // Aplicar params si vienen en URL
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (params.get('m')) { mag.value = params.get('m'); document.getElementById('simSismoMagOut').textContent = mag.value; }
  if (params.get('d')) { dep.value = params.get('d'); document.getElementById('simSismoDepOut').textContent = dep.value; }
  if (params.get('c')) { select.value = params.get('c'); }

  runSismo();
}

function runSismo(extra) {
  const select = document.getElementById('simSismoCity');
  const ciudades = JSON.parse(select.dataset.list);
  const origen = ciudades[select.value];
  const m = parseFloat(document.getElementById('simSismoMag').value);
  const d = parseFloat(document.getElementById('simSismoDep').value);
  const hora = document.getElementById('simSismoHora').value;

  // Mapa con círculos Mercalli (radio aproximado por distancia donde intensidad cae a IX, VII, V)
  // Modelo simplificado: I = a*M - b*log10(R) - c*h
  // Resolvemos R donde I = umbral, conservador.
  const radiusFor = (intensity) => {
    // log10(R) = (1.5*M - intensity - 0.005*d) / 1.0   (educativo)
    const logR = (1.5 * m - intensity - 0.005 * d);
    return Math.max(0, Math.pow(10, logR)); // km
  };

  const mapEl = document.getElementById('mapSimSismo');
  if (RR.state.maps['mapSimSismo']) { RR.state.maps['mapSimSismo'].remove(); }
  const map = L.map('mapSimSismo', { scrollWheelZoom: false }).setView([origen.lat, origen.lon], 5);
  L.tileLayer(
    RR.state.theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', attribution: '© OSM © CartoDB' }
  ).addTo(map);
  RR.state.maps['mapSimSismo'] = map;

  // Anillos Mercalli
  const intensities = [
    { I: 9, color: '#8B0A1F', label: 'IX — Destrucción' },
    { I: 7, color: '#C8102E', label: 'VII — Daño severo' },
    { I: 5, color: '#D88C2A', label: 'V — Sentido fuerte' }
  ];
  intensities.forEach(({ I, color, label }) => {
    const radius = radiusFor(I) * 1000;
    if (radius < 1000) return;
    L.circle([origen.lat, origen.lon], {
      radius, color, fillColor: color, fillOpacity: 0.18, weight: 2
    }).bindPopup(`${label} · ~${Math.round(radius/1000)} km`).addTo(map);
  });
  L.marker([origen.lat, origen.lon]).addTo(map).bindPopup(`<b>Epicentro</b><br>M${m.toFixed(1)} · ${d} km`);

  // Población expuesta — estimado: suma de población dentro del radio VII
  const rDano = radiusFor(7); // km
  let pobExpuesta = 0;
  let ciudadesAfectadas = [];
  RR.regions.forEach(r => {
    const dist = haversine(origen.lat, origen.lon, r.lat, r.lon);
    if (dist <= rDano) {
      pobExpuesta += r.pob;
      ciudadesAfectadas.push({ nombre: r.ciudad, dist });
    }
  });

  // Edificación informal estimada (heurístico — Perú 70-80% construcción autoinformada)
  const pctInformal = 0.55;
  const viviendasVulnerables = Math.round(pobExpuesta * pctInformal / 4); // 4 hab/vivienda

  // Factor hora
  const factorHora = hora === 'noche' ? 1.4 : 1.0;
  const muertesEstimado = Math.max(0, Math.round(viviendasVulnerables * 0.008 * (m / 7.0) * factorHora));

  // Onda P (~6 km/s) y onda S (~3.5 km/s) a Lima si epicentro ≠ Lima
  const distLima = haversine(origen.lat, origen.lon, -12.05, -77.04);
  const tP = distLima / 6.0;   // segundos
  const tS = distLima / 3.5;

  const out = document.getElementById('simSismoOut');
  out.innerHTML = `
    <h4>Resultado de la simulación</h4>
    <div class="metric"><span class="metric-label">Radio de daño severo (Mercalli VII)</span><span class="metric-value">~${Math.round(rDano)} km</span></div>
    <div class="metric"><span class="metric-label">Población expuesta</span><span class="metric-value">${RR.fmt.short(pobExpuesta)}</span></div>
    <div class="metric"><span class="metric-label">Viviendas vulnerables (informales)</span><span class="metric-value">${RR.fmt.num(viviendasVulnerables)}</span></div>
    <div class="metric"><span class="metric-label">Víctimas mortales estimadas</span><span class="metric-value" style="color:var(--rojo-peru)">${RR.fmt.num(muertesEstimado)}</span></div>
    <div class="metric"><span class="metric-label">Onda P llega a Lima en</span><span class="metric-value">${tP.toFixed(1)} s</span></div>
    <div class="metric"><span class="metric-label">Onda S llega a Lima en</span><span class="metric-value">${tS.toFixed(1)} s</span></div>
    ${extra?.historic ? `<p style="margin-top:10px;color:var(--ocre)"><b>📚 Histórico:</b> ${extra.historic}</p>` : ''}
    <p class="muted small" style="margin-top:8px">⚠️ Estimaciones educativas. Modelo de atenuación simplificado.</p>
  `;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
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
  mag.addEventListener('input', () => document.getElementById('simTsunamiMagOut').textContent = mag.value);

  document.getElementById('simTsunamiRun').addEventListener('click', runTsunami);
  runTsunami();
}

function runTsunami() {
  const oSelect = document.getElementById('simTsunamiOrigin');
  const tSelect = document.getElementById('simTsunamiTarget');
  const origen = JSON.parse(oSelect.dataset.list)[oSelect.value];
  const target = JSON.parse(tSelect.dataset.list)[tSelect.value];
  const m = parseFloat(document.getElementById('simTsunamiMag').value);

  // Coordenadas reales del target (lookup por nombre)
  const cityCoords = {
    Tumbes: [-3.57,-80.45], Piura: [-5.19,-80.63], Chimbote: [-9.08,-78.58],
    Callao: [-12.06,-77.13], Pisco: [-13.71,-76.20], Camaná: [-16.62,-72.71], Ilo: [-17.64,-71.34]
  };
  const tc = cityCoords[target.ciudad] || [-12.05,-77.04];

  const dist = haversine(origen.lat, origen.lon, tc[0], tc[1]);
  // Velocidad onda √(g·h), h≈4000m (océano profundo) → ~720 km/h ≈ 200 m/s
  const minutos = Math.max(1, Math.round((dist / 720) * 60));
  // Altura simplificada: factor de magnitud × atenuación distancia
  const alturaBase = Math.max(0, (m - 7.0) * 3); // m
  const altura = (alturaBase * Math.exp(-dist / 800)).toFixed(1);

  if (RR.state.maps['mapSimTsunami']) RR.state.maps['mapSimTsunami'].remove();
  const map = L.map('mapSimTsunami', { scrollWheelZoom: false }).setView([(origen.lat+tc[0])/2, (origen.lon+tc[1])/2], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains:'abcd', attribution:'© OSM' }).addTo(map);
  RR.state.maps['mapSimTsunami'] = map;
  L.marker([origen.lat, origen.lon]).addTo(map).bindPopup('Epicentro');
  L.circleMarker([tc[0], tc[1]], { radius: 10, color: '#1E9AA4', fillColor: '#1E9AA4', fillOpacity: 0.6 }).addTo(map).bindPopup(`<b>${target.ciudad}</b>`);
  L.polyline([[origen.lat, origen.lon], [tc[0], tc[1]]], { color: '#1E9AA4', dashArray: '6 6' }).addTo(map);

  document.getElementById('simTsunamiOut').innerHTML = `
    <h4>Resultado de la simulación</h4>
    <div class="metric"><span class="metric-label">Distancia epicentro → ${target.ciudad}</span><span class="metric-value">${Math.round(dist)} km</span></div>
    <div class="metric"><span class="metric-label">Tiempo de llegada de la primera ola</span><span class="metric-value" style="color:var(--rojo-peru)">${minutos} min</span></div>
    <div class="metric"><span class="metric-label">Altura estimada de inundación</span><span class="metric-value">${altura} m</span></div>
    <div class="metric"><span class="metric-label">Cota segura recomendada</span><span class="metric-value">≥ 30 m sobre nivel del mar</span></div>
    <p style="margin-top:10px;color:var(--ocre)"><b>⚠️ Si sentiste un sismo fuerte en la costa, sube YA. No esperes la sirena.</b></p>
    <p class="muted small">Modelo: velocidad ola ≈ √(g·h), atenuación exponencial. Datos reales en cartas DHN.</p>
  `;
}

/* ================ 12.3 EL NIÑO ================ */
function initSimNino() {
  document.getElementById('simNinoRun')?.addEventListener('click', runNino);
  runNino();
}
function runNino() {
  const int = document.getElementById('simNinoInt').value;
  const factor = { debil: 1, moderado: 2.5, fuerte: 5, extraordinario: 10 }[int];
  const lluvia = (200 * factor).toFixed(0);
  const perdida = (factor * 320).toFixed(0); // USD M
  const damnificados = (factor * 28).toFixed(0); // miles

  const cultivos = { debil: 'arroz, banano', moderado: 'arroz, banano, mango', fuerte: 'arroz, banano, mango, caña, algodón', extraordinario: 'todo el agro norte (catastrófico)' }[int];

  document.getElementById('simNinoOut').innerHTML = `
    <h4>Impacto proyectado · Niño ${int}</h4>
    <div class="metric"><span class="metric-label">Lluvia acumulada (norte, prom.)</span><span class="metric-value">${lluvia} mm</span></div>
    <div class="metric"><span class="metric-label">Pérdidas económicas estimadas</span><span class="metric-value">USD ${perdida} M</span></div>
    <div class="metric"><span class="metric-label">Damnificados (miles)</span><span class="metric-value">${damnificados}k</span></div>
    <div class="metric"><span class="metric-label">Cultivos en riesgo</span><span class="metric-value">${cultivos}</span></div>
    <p class="muted small" style="margin-top:8px">
      📚 Comparables históricos: 1998 (~USD 3 500 M), 2017 (~USD 3 100 M). Modelo educativo.
    </p>
  `;
}

/* ================ 12.4 ALIMENTARIA ================ */
function initSimAlimentaria() {
  const dur = document.getElementById('simAlimDur');
  dur.addEventListener('input', () => document.getElementById('simAlimDurOut').textContent = dur.value);
  document.getElementById('simAlimRun').addEventListener('click', runAlim);
  runAlim();
}
function runAlim() {
  const shock = document.getElementById('simAlimShock').value;
  const dur = parseInt(document.getElementById('simAlimDur').value);
  const sev = { guerra: 1.0, canal: 0.7, embargo: 1.2, sequia: 1.5 }[shock];

  // Elasticidades aproximadas
  const aumPan      = (sev * 0.08 * dur).toFixed(1);
  const aumFideos   = (sev * 0.10 * dur).toFixed(1);
  const aumPollo    = (sev * 0.05 * dur).toFixed(1);
  const aumHuevo    = (sev * 0.06 * dur).toFixed(1);
  const aumArroz    = (sev * 0.04 * dur).toFixed(1);

  const region = shock === 'embargo' ? 'norte agrícola (Piura, Lambayeque, La Libertad)'
              : shock === 'sequia'  ? 'sierra y costa sur (Puno, Arequipa, Ica)'
              : 'todo el país, concentrado en quintiles 1 y 2';

  document.getElementById('simAlimOut').innerHTML = `
    <h4>Impacto sobre la canasta básica</h4>
    <div class="metric"><span class="metric-label">Pan</span><span class="metric-value">+${aumPan}%</span></div>
    <div class="metric"><span class="metric-label">Fideos</span><span class="metric-value">+${aumFideos}%</span></div>
    <div class="metric"><span class="metric-label">Pollo</span><span class="metric-value">+${aumPollo}%</span></div>
    <div class="metric"><span class="metric-label">Huevos</span><span class="metric-value">+${aumHuevo}%</span></div>
    <div class="metric"><span class="metric-label">Arroz</span><span class="metric-value">+${aumArroz}%</span></div>
    <div class="metric"><span class="metric-label">Regiones más vulnerables</span><span class="metric-value">${region}</span></div>
    <p class="muted small" style="margin-top:8px">Mitigación: stock estratégico, exoneración tributaria temporal, vales focalizados.</p>
  `;
}

/* ================ 12.5 PANDEMIA (SEIR) ================ */
function initSimPandemia() {
  ['R0','Let','UCI'].forEach(k => {
    const el = document.getElementById('simPan' + k);
    el.addEventListener('input', () => document.getElementById('simPan' + k + 'Out').textContent = el.value);
  });
  document.getElementById('simPanRun').addEventListener('click', runPandemia);
  runPandemia();
}
function runPandemia() {
  const R0  = parseFloat(document.getElementById('simPanR0').value);
  const cfr = parseFloat(document.getElementById('simPanLet').value) / 100;
  const uciFactor = parseFloat(document.getElementById('simPanUCI').value) / 100;

  // SEIR diario, N=20M Lima Metropolitana
  const N = 20_000_000;
  const sigma = 1 / 5;     // incubación 5 días
  const gamma = 1 / 7;     // duración infecciosa 7 días
  const beta = R0 * gamma;

  let S = N - 100, E = 100, I = 0, R = 0;
  let curve = [];
  let muertes = 0;
  const ucisDisp = Math.round(3000 * uciFactor); // ~3000 UCI baseline en LM
  let saturacionDia = -1;

  for (let day = 0; day < 180; day++) {
    const newE = beta * S * I / N;
    const newI = sigma * E;
    const newR = gamma * I;
    S -= newE; E += newE - newI; I += newI - newR; R += newR;
    if (S < 0) S = 0;
    curve.push(Math.round(I));
    // Aprox: 5% de I requiere UCI; saturación cuando esa demanda supera capacidad
    const demUCI = I * 0.05;
    if (saturacionDia < 0 && demUCI > ucisDisp) saturacionDia = day;
  }
  // Aprox letalidad sobre R acumulado
  muertes = Math.round(R * cfr);

  RR.makeChart('chartPandemia', {
    type: 'line',
    data: {
      labels: curve.map((_, i) => 'D' + i),
      datasets: [{
        label: 'Infecciosos activos',
        data: curve,
        borderColor: '#C8102E', backgroundColor: '#C8102E22',
        fill: true, tension: 0.2, pointRadius: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { maxTicksLimit: 12 } }, y: { ticks: { callback: v => RR.fmt.short(v) } } }
    }
  });

  document.getElementById('simPanOut').innerHTML = `
    <div class="metric"><span class="metric-label">Pico de infecciosos activos</span><span class="metric-value">${RR.fmt.short(Math.max(...curve))}</span></div>
    <div class="metric"><span class="metric-label">Día del pico</span><span class="metric-value">D${curve.indexOf(Math.max(...curve))}</span></div>
    <div class="metric"><span class="metric-label">Muertes acumuladas (180 días)</span><span class="metric-value" style="color:var(--rojo-peru)">${RR.fmt.short(muertes)}</span></div>
    <div class="metric"><span class="metric-label">UCI saturadas (día)</span><span class="metric-value">${saturacionDia >= 0 ? 'D' + saturacionDia : 'No satura'}</span></div>
    <p class="muted small" style="margin-top:8px">Modelo SEIR · población urbana ≈ 20M · 5% requiere UCI.</p>
  `;
}

/* ================ 12.6 APAGÓN ================ */
function initSimApagon() {
  const dur = document.getElementById('simApagonDur');
  dur.addEventListener('input', () => document.getElementById('simApagonDurOut').textContent = dur.value);
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
  // Hospitales con generador: ~60%
  const hospSinGen = Math.round((pob / 50000) * 0.4 * factorEpoca); // estimado

  document.getElementById('simApagonOut').innerHTML = `
    <h4>Impacto del corte (${dur} h en ${zona})</h4>
    <div class="metric"><span class="metric-label">Población impactada</span><span class="metric-value">${RR.fmt.short(pob)}</span></div>
    <div class="metric"><span class="metric-label">Hospitales sin generador estimados</span><span class="metric-value">${hospSinGen}</span></div>
    <div class="metric"><span class="metric-label">Bombeo de agua afectado</span><span class="metric-value">${dur >= 6 ? '⚠️ Sí' : 'Parcial'}</span></div>
    <div class="metric"><span class="metric-label">Semáforos / tránsito</span><span class="metric-value">${dur >= 1 ? 'Caos vial inmediato' : 'Mínimo'}</span></div>
    <div class="metric"><span class="metric-label">Refrigeración alimentos</span><span class="metric-value">${dur >= 12 ? '🔴 Pérdida masiva' : dur >= 4 ? '🟡 Riesgo' : '🟢 OK'}</span></div>
    <div class="metric"><span class="metric-label">Comunicaciones (celulares)</span><span class="metric-value">${dur >= 4 ? 'Antenas sin batería' : 'OK'}</span></div>
    <p class="muted small" style="margin-top:8px">⚠️ Recordar: <b>SEDAPAL depende de electricidad para bombear</b>. Apagón &gt; 6 h = corte de agua en zonas altas.</p>
  `;
}
