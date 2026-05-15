/* ============================================================
   DATA.JS — datasets curados (basados en fuentes oficiales).
   Donde una cifra no es exacta, se marca como "estimado".
   ============================================================ */

window.RR = window.RR || {};

/* === SISMOS HISTÓRICOS === */
RR.data = {

sismosHistoricos: [
  { anio: 1746, nombre: 'Lima–Callao', mag: 8.6, prof: 30, lat: -12.3, lon: -77.2,
    muertos: 5000, nota: 'Destruyó Lima virreinal. Tsunami arrasó el Callao (~5 000 muertos solo allí).' },
  { anio: 1868, nombre: 'Arica',       mag: 8.8, prof: 25, lat: -18.5, lon: -71.3,
    muertos: 25000, nota: 'Tsunami transpacífico. Olas de 16 m en Arica. Sentido en Hawai y Japón.' },
  { anio: 1970, nombre: 'Áncash (Yungay)', mag: 7.9, prof: 45, lat: -9.36, lon: -78.87,
    muertos: 70000, nota: 'Alud de la Cordillera Blanca sepultó Yungay. Peor desastre del s. XX en Sudamérica.' },
  { anio: 2001, nombre: 'Arequipa–Atico', mag: 8.4, prof: 33, lat: -16.27, lon: -73.64,
    muertos: 145, nota: 'Daños severos en Moquegua, Tacna, Arequipa. Tsunami menor.' },
  { anio: 2007, nombre: 'Pisco',       mag: 8.0, prof: 39, lat: -13.49, lon: -76.85,
    muertos: 595, nota: 'Pisco e Ica destruidos. Récord moderno de severidad en Perú.' }
],

sismosPorDecada: [
  { decada: '1960', cantidad: 8 },
  { decada: '1970', cantidad: 12 },
  { decada: '1980', cantidad: 14 },
  { decada: '1990', cantidad: 19 },
  { decada: '2000', cantidad: 24 },
  { decada: '2010', cantidad: 31 },
  { decada: '2020', cantidad: 22 }
],

tsunamiTimes: [
  { ciudad: 'Tumbes',   minutos: 50, altura: '2-4 m' },
  { ciudad: 'Piura',    minutos: 35, altura: '3-5 m' },
  { ciudad: 'Chimbote', minutos: 20, altura: '4-6 m' },
  { ciudad: 'Callao',   minutos: 15, altura: '4-8 m' },
  { ciudad: 'Pisco',    minutos: 12, altura: '5-9 m' },
  { ciudad: 'Camaná',   minutos: 22, altura: '4-7 m' },
  { ciudad: 'Ilo',      minutos: 30, altura: '3-5 m' }
],

/* === EL NIÑO === */
ninoEventos: [
  { anio: '1925',     intensidad: 'Extraordinario', impacto: 'Norte arrasado. Marca el patrón histórico.' },
  { anio: '1982-83',  intensidad: 'Extraordinario', impacto: 'Pérdidas USD 1 000 M (1983). Pesca colapsa.' },
  { anio: '1997-98',  intensidad: 'Extraordinario', impacto: 'USD 3 500 M (CEPAL). 366 muertos. 116 mil viviendas.' },
  { anio: '2017',     intensidad: 'Niño Costero',   impacto: 'USD 3 100 M. 158 muertos. 184 mil damnificados.' },
  { anio: '2023-24',  intensidad: 'Moderado',       impacto: 'Brote dengue récord. Daños agricultura norte.' }
],

ninoTSM: {
  // Anomalía mensual región Niño 1+2 (estimado, °C)
  labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  promedio:    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  evento2017:  [1.1, 2.4, 3.2, 2.8, 1.6, 0.5, -0.2, -0.4, -0.2, 0.1, 0.3, 0.4],
  actual:      [0.6, 0.9, 0.7, 0.4, 0.2, 0.1, 0.0, -0.1, 0.0, 0.2, 0.4, 0.5]
},

ninoForecast: [
  { evento: 'Neutro',           prob: 55 },
  { evento: 'Niño débil',       prob: 25 },
  { evento: 'Niño moderado',    prob: 12 },
  { evento: 'Niño Costero',     prob: 5 },
  { evento: 'Niño extraordinario', prob: 3 }
],

/* === HUAICOS === */
quebradasCriticas: [
  { nombre: 'Quebrada Huaycoloro',    distrito: 'San Juan de Lurigancho, Lima', riesgo: 'Muy alto' },
  { nombre: 'Quebrada Carosio',       distrito: 'Chosica, Lima', riesgo: 'Muy alto' },
  { nombre: 'Quebrada Rímac',         distrito: 'Lima Este (toda la cuenca)', riesgo: 'Alto' },
  { nombre: 'Quebrada Quirio',        distrito: 'Chosica, Lima', riesgo: 'Muy alto' },
  { nombre: 'Quebrada La Cantuta',    distrito: 'Chosica, Lima', riesgo: 'Alto' },
  { nombre: 'Río Chillón',            distrito: 'Lima Norte', riesgo: 'Medio-alto' },
  { nombre: 'Río Lurín',              distrito: 'Lima Sur', riesgo: 'Medio' }
],

damnificadosPorAnio: [
  { anio:2017, cifra:1737000 }, // Niño Costero
  { anio:2018, cifra: 145000 },
  { anio:2019, cifra: 158000 },
  { anio:2020, cifra: 312000 },
  { anio:2021, cifra: 198000 },
  { anio:2022, cifra: 245000 },
  { anio:2023, cifra: 421000 }, // Yaku
  { anio:2024, cifra: 187000 }
],

/* === GLACIARES === */
glaciaresCobertura: {
  labels: [1970, 1985, 2000, 2010, 2020, 2024],
  km2:    [2042, 1855, 1595, 1287, 1114, 1050] // INAIGEM
},

embalses: [
  { nombre: 'Poechos',        region: 'Piura',       capacidad: 1000, llenado: 45 },
  { nombre: 'Gallito Ciego',  region: 'Cajamarca/LL',capacidad:  573, llenado: 78 },
  { nombre: 'Condoroma',      region: 'Arequipa',    capacidad:  285, llenado: 62 },
  { nombre: 'Tinajones',      region: 'Lambayeque',  capacidad:  320, llenado: 51 },
  { nombre: 'San Lorenzo',    region: 'Piura',       capacidad:  258, llenado: 38 }
],

/* === DEFORESTACIÓN === */
deforestacionPorRegion: [
  { region: 'Ucayali',        ha2023: 75200 },
  { region: 'Loreto',         ha2023: 71500 },
  { region: 'Madre de Dios',  ha2023: 28400 },
  { region: 'San Martín',     ha2023: 21900 },
  { region: 'Huánuco',        ha2023: 18700 },
  { region: 'Junín',          ha2023:  9800 },
  { region: 'Pasco',          ha2023:  6200 }
],

/* === PANDEMIAS === */
covidExceso: {
  // Exceso de mortalidad estimado, miles, por trimestre 2020-2022
  labels: ['Q2-20','Q3-20','Q4-20','Q1-21','Q2-21','Q3-21','Q4-21','Q1-22','Q2-22'],
  exceso: [ 28, 38, 14, 22, 60, 14, 4, 8, 2 ]
},

ucisPorRegion: [
  { region: 'Lima',     ucis: 18.5 },
  { region: 'Arequipa', ucis: 12.0 },
  { region: 'La Libertad', ucis: 8.4 },
  { region: 'Cusco',    ucis: 7.1 },
  { region: 'Piura',    ucis: 5.2 },
  { region: 'Loreto',   ucis: 3.8 },
  { region: 'Madre de Dios', ucis: 2.5 }
],

/* === VÍAS === */
viasPeligrosas: [
  { ruta: 'Panamericana Sur — Variante de Pasamayo', muertes2023: 84, nota: 'Niebla, curvas, transporte interprovincial.' },
  { ruta: 'Carretera Central — Ticlio a La Oroya',   muertes2023: 67, nota: 'Altura, hielo, alud, neblina.' },
  { ruta: 'Interoceánica Sur — Tramo selva',         muertes2023: 39, nota: 'Lluvias, derrumbes, fauna en vía.' },
  { ruta: 'Carretera Federico Basadre',              muertes2023: 32, nota: 'Pucallpa–Tingo María, alud y curvas.' },
  { ruta: 'Panamericana Norte — Casma a Trujillo',   muertes2023: 41, nota: 'Niño 2017 destruyó tramos.' }
],

viales: {
  labels: [2019, 2020, 2021, 2022, 2023, 2024],
  muertes: [3119, 2253, 3115, 3253, 3088, 2941],
  heridos: [56000, 41200, 51800, 53900, 55400, 53100]
},

/* === ENERGÍA / AGUA === */
cobertura: {
  regiones: ['Lima','Arequipa','La Libertad','Cusco','Loreto','Madre de Dios','Puno'],
  electricidad: [99, 96, 93, 89, 81, 78, 86],
  agua:         [93, 89, 84, 76, 56, 67, 71]
},

/* === IMPORTACIONES CRÍTICAS === */
importaciones: {
  bien: ['Trigo','Maíz amarillo','Soya (torta)','Urea','Aceite refinado','Lácteos'],
  pctImportado: [90, 84, 78, 95, 60, 38]
},

canastaVsGlobales: {
  labels: ['2019','2020','2021','2022','2023','2024','2025'],
  ipcAlimentos: [100, 102, 110, 124, 132, 137, 141],
  trigoIntl:    [100, 105, 138, 195, 162, 148, 145]
},

/* === FRIAJES / HELADAS === */
heladasTempMin: {
  estaciones: ['Mazocruz','Crucero Alto','Imata','Macusani','Espinar'],
  tempMin:    [-22, -19, -17, -15, -13]
},

/* === MOCHILA DE EMERGENCIA === */
mochilaItems: [
  'Agua: 4 litros por persona (cierre hermético)',
  'Alimentos no perecibles: 3 días (atún, galletas, frutos secos)',
  'Linterna a pilas + pilas de repuesto',
  'Radio a pilas o de manivela',
  'Botiquín básico (gasas, alcohol, vendas, analgésicos)',
  'Silbato',
  'Copias de DNI y documentos en bolsa hermética',
  'Dinero en efectivo (billetes pequeños)',
  'Lista de contactos de emergencia impresa',
  'Llaves de repuesto (casa, auto)',
  'Cargador de celular tipo dynamo / batería externa',
  'Mascarillas (polvo, humo)',
  'Mantas térmicas (de aluminio)',
  'Cuchillo multiuso',
  'Encendedor / fósforos en bolsa impermeable',
  'Bolsas plásticas grandes (lluvia, basura, higiene)',
  'Papel higiénico + bolsa hermética',
  'Medicación personal (al menos 7 días)',
  'Cambio de ropa interior y medias',
  'Calzado cerrado disponible'
],

/* === SIMULACROS === */
simulacros: [
  { fecha: '2026-05-31', nombre: 'Simulacro nacional multipeligro (mañana, 10:00 h)' },
  { fecha: '2026-08-15', nombre: 'Simulacro nacional sismo + tsunami (zona costera)' },
  { fecha: '2026-10-15', nombre: 'Simulacro nocturno multipeligro (20:00 h)' },
  { fecha: '2026-11-25', nombre: 'Simulacro escolar fin de año' }
],

/* === QUIZ === */
quiz: [
  { q: '¿Tienes mochila de emergencia preparada?',
    opts: [['No', 0], ['Algunas cosas sueltas', 1], ['Sí, completa y revisada', 2]] },
  { q: '¿Conoces tu zona segura dentro de casa?',
    opts: [['No', 0], ['Creo que sí', 1], ['Sí, y la usamos en simulacros', 2]] },
  { q: '¿Tu familia tiene punto de encuentro definido?',
    opts: [['No', 0], ['Lo hablamos pero no es claro', 1], ['Sí, dos puntos definidos', 2]] },
  { q: 'Si vives en costa, ¿conoces tu ruta de evacuación por tsunami?',
    opts: [['No vivo en costa', 1], ['No la conozco', 0], ['Sí, sé llegar a cota ≥30m', 2]] },
  { q: '¿Tienes copia de tu DNI en lugar accesible distinto al original?',
    opts: [['No', 0], ['Foto en el celular', 1], ['Sí, física + digital', 2]] },
  { q: '¿Sabes cortar la llave de gas y la del agua de tu casa?',
    opts: [['No', 0], ['Una sí', 1], ['Ambas y mi familia también', 2]] },
  { q: '¿Tu colegio o trabajo hace simulacros?',
    opts: [['Nunca', 0], ['Sí pero los tomamos en broma', 1], ['Sí, con seriedad', 2]] },
  { q: '¿Tienes reserva de agua y comida para 72 horas?',
    opts: [['No', 0], ['Para un día', 1], ['Sí, 3 días o más', 2]] }
]

};
