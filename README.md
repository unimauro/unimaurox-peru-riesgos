# 🇵🇪 Riesgos y Resiliencia del Perú

![Status](https://img.shields.io/badge/status-MVP-2ea44f)
![License](https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY%204.0-blue)
![Stack](https://img.shields.io/badge/stack-Vanilla%20HTML%2FJS-C8102E)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-181717)

Dashboard interactivo, **100 % estático** (sin backend, sin build step), que ayuda al ciudadano peruano a entender, explorar y prepararse ante los principales riesgos de catástrofe del país: sismos, tsunamis, El Niño, huaicos, friajes, sequías, deforestación amazónica, pandemias, crisis globales.

> 🌐 **Demo en vivo:** https://unimauro.github.io/unimaurox-peru-riesgos/

## ✨ Características

- **14 secciones** con storytelling, mapas, gráficos, datos y "qué hacer":
  1. **Portada** — mapa de Perú con capas, KPIs históricos, selector de las 25 regiones
  2. **Sismos & maremotos** — IGP/DHN, epicentros 1746–2007, llegada de tsunami
  3. **El Niño / Niña Costera** — timeline 1925–2024, TSM, predicción
  4. **Huaicos e inundaciones** — CENEPRED/INDECI, quebradas, damnificados
  5. **Friajes y heladas** — sierra sur vs selva, temperaturas mínimas
  6. **Sequías & glaciares** — INAIGEM, embalses, estrés hídrico
  7. **Deforestación amazónica** — MINAM Geobosques, minería ilegal
  8. **Pandemias** — exceso de mortalidad COVID, UCI por región
  9. **Siniestros viales** — Panamericana, Carretera Central, Interoceánica
  10. **Energía & agua** — cobertura, SEIN, SEDAPAL
  11. **Riesgos globales** — importaciones críticas, IPC vs eventos
  12. **🎮 Simulador** (gancho viral) — 6 sub-simuladores client-side:
      - Sísmico (anillos Mercalli, población expuesta, ondas P/S)
      - Tsunami (tiempo de arribo, altura, ruta)
      - El Niño (lluvias, pérdidas, cultivos en riesgo)
      - Crisis alimentaria (canasta básica vs shock externo)
      - Pandemia SEIR (180 días, UCI saturadas)
      - Apagón (servicios críticos en cadena)
  13. **Resiliencia social** — mochila checklist, plan familiar PDF (jsPDF), quiz preparación
  14. **Metodología y fuentes** — todas las fuentes oficiales con enlaces

- **Modo claro/oscuro** persistente · **Responsive móvil-first** · **Accesible** (AA, navegación por teclado)
- **Filtro global por región** que afecta perfil de riesgo
- **Compartir simulaciones por URL** (estado en el hash)
- **Sin backend, sin build, sin npm** — solo HTML/CSS/JS vanilla con librerías por CDN

## 🛠 Stack

| Capa | Herramienta |
|------|-------------|
| HTML/CSS/JS | Vanilla, sin framework |
| Mapas | [Leaflet 1.9](https://leafletjs.com/) (CDN) |
| Gráficos | [Chart.js 4.4](https://www.chartjs.org/) (CDN) |
| PDF | [jsPDF 2.5](https://github.com/parallax/jsPDF) (CDN) |
| Tipografía | Inter (Google Fonts) |
| Tiles | OpenStreetMap + CartoDB (light/dark) |

## 🚀 Correr localmente

No requiere instalación. Cualquier servidor HTTP estático:

```bash
git clone https://github.com/unimauro/unimaurox-peru-riesgos.git
cd unimaurox-peru-riesgos
python3 -m http.server 8080
# Abre http://localhost:8080
```

## 📦 Estructura

```
unimaurox-peru-riesgos/
├── index.html                       # Shell con las 14 secciones
├── assets/
│   ├── css/styles.css               # Paleta peruana, light/dark, responsive
│   ├── img/                         # OG image, íconos
│   └── js/
│       ├── config.js                # País-agnóstico: 25 regiones, riesgos
│       ├── data.js                  # Datasets curados
│       ├── app.js                   # Núcleo: routing, tema, helpers
│       └── sections/
│           ├── portada.js           # Sec 1 — mapa, KPIs, perfil regional
│           ├── sismos.js            # Sec 2 — epicentros + Mercalli
│           ├── nino.js              # Sec 3 — TSM, timeline
│           ├── huaicos.js           # Sec 4 — quebradas, damnificados
│           ├── friajes.js           # Sec 5 — heladas vs friajes
│           ├── sequia.js            # Sec 6 — glaciares, embalses
│           ├── amazonia.js          # Sec 7 — deforestación
│           ├── pandemias.js         # Sec 8 — COVID, UCI
│           ├── viales.js            # Sec 9 — carreteras
│           ├── energia.js           # Sec 10 — cobertura
│           ├── globales.js          # Sec 11 — geopolítica & mercados
│           ├── simulador.js         # Sec 12 — 6 sub-simuladores
│           ├── resiliencia.js       # Sec 13 — mochila, plan PDF, quiz
│           └── boot.js              # Arranque
├── robots.txt
├── sitemap.xml
├── 404.html
└── README.md
```

## 📊 Fuentes oficiales

| Tema | Fuente | Sitio |
|------|--------|-------|
| Sismos | **IGP** · USGS | https://www.igp.gob.pe/ |
| Tsunamis | **DHN — Marina de Guerra** | https://www.dhn.mil.pe/ |
| Clima · El Niño | **SENAMHI** · **ENFEN** · **IMARPE** | https://www.senamhi.gob.pe/ |
| Glaciares | **INAIGEM** | https://www.gob.pe/inaigem |
| Agua | **ANA** · **SEDAPAL** | https://www.ana.gob.pe/ |
| Emergencias | **INDECI SINPAD** · **CENEPRED** | https://sinpad.indeci.gob.pe/ |
| Salud | **MINSA** · SINADEF | https://www.gob.pe/minsa |
| Economía · comercio | **BCRP** · **INEI** · **MIDAGRI** · **SUNAT** | https://estadisticas.bcrp.gob.pe/ |
| Tránsito | **MTC** · **SUTRAN** · PNP | https://www.gob.pe/sutran |
| Energía | **OSINERGMIN** · **COES-SINAC** | https://www.osinergmin.gob.pe/ |
| Deforestación | **MINAM Geobosques** | https://geobosques.minam.gob.pe/ |

## ⚠️ Notas metodológicas

- Los **simuladores** son **modelos educativos simplificados**. No usar para toma de decisiones operativas. Cada uno indica su disclaimer en pantalla.
- Algunas cifras de daño y víctimas son **estimaciones** basadas en boletines oficiales — están etiquetadas como tales.
- El modelo sísmico usa una **atenuación tipo GMPE** simplificada (log-lineal). Para análisis serio, ver software como OpenQuake.
- El modelo de tsunami asume velocidad ≈ √(g·h) y atenuación exponencial. Para evacuación real, ver cartas DHN.
- El modelo de pandemia es **SEIR discreto** con paso diario, sin estructura por edad ni movilidad.

## 🌎 Extensibilidad a otros países

La arquitectura de datos es **país-agnóstica** desde el inicio:

```js
RR.config = { country: 'PE', countryName: 'Perú', ... };
RR.regions = [ ... ];   // estructura uniforme por país
```

Para añadir Chile, Ecuador, Colombia, Bolivia: solo crear nuevos archivos `config-XX.js` y `data-XX.js`, y el resto del código (router, mapas, gráficos, simuladores) reutiliza todo.

## 🤝 Contribuir

Issues y PRs en https://github.com/unimauro/unimaurox-peru-riesgos/issues

Áreas que se beneficiarían de contribuciones:
- Datasets reales (CSVs/JSONs) descargados de portales oficiales
- Validación de modelos con expertos (sismólogos, hidrólogos, epidemiólogos)
- Traducción a quechua y aymara para Sec 13 (resiliencia)
- Geojson de distritos para drill-down más fino

## 📄 Licencia

- **Código:** MIT
- **Datos:** CC BY 4.0 — atribuye al proyecto + a las fuentes originales

Construido con datos públicos del Estado peruano.

---

Hecho por **[Carlos Mauro Cárdenas](https://unimauro.github.io/)** — porque entender el riesgo es el primer paso para reducirlo. 🇵🇪
