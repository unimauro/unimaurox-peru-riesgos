/* ============================================================
   CONFIG.JS — diseño país-agnóstico
   Cambiando COUNTRY a otro código (CL, EC, CO, BO) se podría
   alimentar el mismo dashboard con otros datos.
   ============================================================ */

window.RR = window.RR || {};

RR.config = {
  country: 'PE',
  countryName: 'Perú',
  capital: { name: 'Lima', lat: -12.046374, lon: -77.042793 },
  bbox: [[-18.5, -81.5], [0.0, -68.5]],  // SW, NE
  mapCenter: [-9.19, -75.0152],
  mapZoom: 5,
  emergencyNumbers: { policia: 105, samu: 106, indeci: 115, bomberos: 116 },
  lastUpdate: '2026-05-15'
};

/* 25 regiones del Perú, categorizadas por zona y con perfil de riesgo dominante.
   Para cada una, ciudad principal y coordenadas aproximadas.
   El perfil de riesgo se usa en la sección Portada. */
RR.regions = [
  // COSTA
  { id: 'LIM', name: 'Lima',          zona: 'Costa',  ciudad: 'Lima',           lat: -12.05, lon: -77.04, pob: 10628000,
    risks: { sismo:'alta', tsunami:'alta', huaicos:'alta', nino:'media', sequia:'media', friajes:'baja' } },
  { id: 'CAL', name: 'Callao',        zona: 'Costa',  ciudad: 'Callao',         lat: -12.06, lon: -77.13, pob: 1129000,
    risks: { sismo:'alta', tsunami:'alta', huaicos:'media', nino:'media', sequia:'baja', friajes:'baja' } },
  { id: 'ARE', name: 'Arequipa',      zona: 'Costa',  ciudad: 'Arequipa',       lat: -16.41, lon: -71.54, pob: 1497000,
    risks: { sismo:'alta', tsunami:'alta', volcanes:'alta', sequia:'media', friajes:'baja' } },
  { id: 'LAL', name: 'La Libertad',   zona: 'Costa',  ciudad: 'Trujillo',       lat: -8.11,  lon: -79.03, pob: 2055000,
    risks: { sismo:'media', tsunami:'media', nino:'alta', huaicos:'alta', sequia:'media' } },
  { id: 'LAM', name: 'Lambayeque',    zona: 'Costa',  ciudad: 'Chiclayo',       lat: -6.77,  lon: -79.84, pob: 1359000,
    risks: { sismo:'media', tsunami:'media', nino:'alta', huaicos:'alta' } },
  { id: 'PIU', name: 'Piura',         zona: 'Costa',  ciudad: 'Piura',          lat: -5.19,  lon: -80.63, pob: 2049000,
    risks: { sismo:'media', tsunami:'media', nino:'alta', huaicos:'alta' } },
  { id: 'TUM', name: 'Tumbes',        zona: 'Costa',  ciudad: 'Tumbes',         lat: -3.57,  lon: -80.45, pob: 252000,
    risks: { sismo:'media', tsunami:'media', nino:'alta', huaicos:'alta' } },
  { id: 'ICA', name: 'Ica',           zona: 'Costa',  ciudad: 'Ica',            lat: -14.07, lon: -75.73, pob: 1015000,
    risks: { sismo:'alta', tsunami:'alta', sequia:'alta', huaicos:'media' } },
  { id: 'TAC', name: 'Tacna',         zona: 'Costa',  ciudad: 'Tacna',          lat: -18.01, lon: -70.25, pob: 380000,
    risks: { sismo:'alta', tsunami:'media', sequia:'alta' } },
  { id: 'MOQ', name: 'Moquegua',      zona: 'Costa',  ciudad: 'Moquegua',       lat: -17.19, lon: -70.93, pob: 198000,
    risks: { sismo:'alta', tsunami:'media', sequia:'alta', volcanes:'media' } },
  { id: 'ANC', name: 'Áncash',        zona: 'Costa',  ciudad: 'Chimbote / Huaraz', lat: -9.08, lon: -78.58, pob: 1196000,
    risks: { sismo:'alta', tsunami:'alta', huaicos:'alta', glaciares:'alta' } },
  // SIERRA
  { id: 'CUS', name: 'Cusco',         zona: 'Sierra', ciudad: 'Cusco',          lat: -13.53, lon: -71.97, pob: 1357000,
    risks: { sismo:'media', huaicos:'alta', heladas:'alta', sequia:'media' } },
  { id: 'PUN', name: 'Puno',          zona: 'Sierra', ciudad: 'Puno',           lat: -15.84, lon: -70.02, pob: 1238000,
    risks: { heladas:'alta', sequia:'alta', sismo:'baja', friajes:'media' } },
  { id: 'JUN', name: 'Junín',         zona: 'Sierra', ciudad: 'Huancayo',       lat: -12.07, lon: -75.21, pob: 1361000,
    risks: { huaicos:'media', heladas:'media', sismo:'media' } },
  { id: 'AYA', name: 'Ayacucho',      zona: 'Sierra', ciudad: 'Ayacucho',       lat: -13.16, lon: -74.22, pob: 668000,
    risks: { sismo:'media', heladas:'alta', huaicos:'media', sequia:'media' } },
  { id: 'HUV', name: 'Huancavelica',  zona: 'Sierra', ciudad: 'Huancavelica',   lat: -12.79, lon: -74.97, pob: 365000,
    risks: { heladas:'alta', huaicos:'media' } },
  { id: 'APU', name: 'Apurímac',      zona: 'Sierra', ciudad: 'Abancay',        lat: -13.63, lon: -72.88, pob: 467000,
    risks: { heladas:'alta', sismo:'media', huaicos:'alta' } },
  { id: 'CAJ', name: 'Cajamarca',     zona: 'Sierra', ciudad: 'Cajamarca',      lat: -7.16,  lon: -78.50, pob: 1453000,
    risks: { huaicos:'alta', deslizamientos:'alta', sismo:'media', mineria:'alta' } },
  { id: 'PAS', name: 'Pasco',         zona: 'Sierra', ciudad: 'Cerro de Pasco', lat: -10.68, lon: -76.26, pob: 271000,
    risks: { heladas:'alta', mineria:'alta', huaicos:'media' } },
  { id: 'HUC', name: 'Huánuco',       zona: 'Sierra', ciudad: 'Huánuco',        lat: -9.93,  lon: -76.24, pob: 760000,
    risks: { huaicos:'alta', deforestacion:'media', sismo:'media' } },
  // SELVA
  { id: 'LOR', name: 'Loreto',        zona: 'Selva',  ciudad: 'Iquitos',        lat: -3.75,  lon: -73.25, pob: 1029000,
    risks: { inundaciones:'alta', deforestacion:'alta', friajes:'alta', salud:'alta' } },
  { id: 'UCY', name: 'Ucayali',       zona: 'Selva',  ciudad: 'Pucallpa',       lat: -8.38,  lon: -74.55, pob: 600000,
    risks: { inundaciones:'alta', deforestacion:'alta', friajes:'alta', incendios:'alta' } },
  { id: 'MDD', name: 'Madre de Dios', zona: 'Selva',  ciudad: 'Puerto Maldonado', lat: -12.59, lon: -69.18, pob: 173000,
    risks: { mineria:'alta', deforestacion:'alta', mercurio:'alta', friajes:'alta' } },
  { id: 'SMA', name: 'San Martín',    zona: 'Selva',  ciudad: 'Tarapoto',       lat: -6.49,  lon: -76.36, pob: 899000,
    risks: { deforestacion:'alta', inundaciones:'alta', sismo:'media' } },
  { id: 'AMA', name: 'Amazonas',      zona: 'Selva',  ciudad: 'Chachapoyas',    lat: -6.23,  lon: -77.87, pob: 426000,
    risks: { huaicos:'alta', deslizamientos:'alta', deforestacion:'media' } }
];

/* Etiquetas legibles para los riesgos */
RR.riskLabels = {
  sismo: 'Sismos',
  tsunami: 'Tsunamis',
  nino: 'El Niño',
  huaicos: 'Huaicos / inundaciones',
  friajes: 'Friajes',
  heladas: 'Heladas',
  sequia: 'Sequía',
  glaciares: 'Pérdida glaciar',
  volcanes: 'Volcanes',
  deforestacion: 'Deforestación',
  mineria: 'Minería (ilegal)',
  mercurio: 'Mercurio en agua',
  deslizamientos: 'Deslizamientos',
  inundaciones: 'Inundaciones',
  incendios: 'Incendios forestales',
  salud: 'Salud / epidemias'
};
