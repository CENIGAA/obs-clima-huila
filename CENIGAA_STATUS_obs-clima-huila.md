# CENIGAA_STATUS_obs-clima-huila.md
**Estado del nodo — obs-clima-huila.cenigaa.org**
**Observatorio Climático del Huila «Efraín Antonio Domínguez Calle»**
**Nodo 1 de la Red ROGAA-Huila**

| Versión | Fecha | Branch | Último commit | Estado |
|---|---|---|---|---|
| v1.0.1 | 2026-06-03 | `main` | `4b95d1c` — *feat: seccion politica publica cambio climatico #politica* | ✅ **Producción · MVP + sección política** |

> Documento de auditoría — refleja el estado real del repositorio `cenigaa-obs-clima-huila` el 2026-06-03 tras incorporar los assets P0 faltantes (favicon, og-image, apple-touch-icon) y la sección **#politica** con 12 instrumentos oficiales. No contiene aspiraciones: sólo lo que está mergeado a `main`.

---

## 1. Identidad del nodo

| Campo | Valor |
|---|---|
| Nombre público | Observatorio Climático del Huila «Efraín Antonio Domínguez Calle» |
| Subdominio | `obs-clima-huila.cenigaa.org` |
| Posición ecosistema | CAPA A · CENIGAA_CONTEXT.md §3 — **Nodo 1 ROGAA-Huila** |
| Repositorio | `cenigaa-obs-clima-huila` (GitHub · CENIGAA) |
| Tipo | Dinámico — SPA React + Vite + Leaflet + Recharts |
| Hosting | Azure Static Web Apps (Standard) |
| CI/CD | GitHub Actions → Azure SWA, deploy automático en push a `main` |
| Dedicado a | Dr. Efraín Antonio Domínguez Calle (1969–2021) |

---

## 2. Stack y estructura

### Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js (CI) | 20.x |
| Framework UI | React | ^18.2.0 |
| Bundler | Vite | ^5.2.0 |
| Routing | react-router-dom | ^7.15.1 |
| Estilos | Tailwind CSS + PostCSS + Autoprefixer | ^3.4.3 / ^8.4.38 / ^10.4.19 |
| Mapas | Leaflet + react-leaflet | ^1.9.4 / ^4.2.1 (v4 porque v5 exige React 19) |
| Gráficas | Recharts | ^3.8.1 |
| Iconografía | lucide-react | ^0.383.0 |
| Calidad | ESLint + plugins react / hooks / refresh | ^8.57.0 |

### Árbol de directorios (real, sin `node_modules` ni `build`)

```
cenigaa-obs-clima-huila/
├── CENIGAA_CONTEXT.md
├── CENIGAA_STATUS_obs-clima-huila.md      ← este archivo
├── LICENSE
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── azure-static-web-apps.yml              ← raíz (legacy)
├── .github/workflows/
│   └── azure-static-web-apps-jolly-forest-0b932a410.yml
├── public/
│   ├── staticwebapp.config.json
│   ├── favicon.svg                        ← añadido en v1.0.1 (commit 5c40948)
│   ├── apple-touch-icon.png               ← añadido en v1.0.1 (commit 5c40948)
│   ├── og-image.jpg                       ← añadido en v1.0.1 (commit 5c40948)
│   ├── assets/
│   │   ├── Nevado tatacoa.jpg
│   │   ├── efrain/                        (6 retratos: 1.jpg, 2.webp, 3.jpg, 4.jpg, .JPG, isologo.jpg)
│   │   └── logos/                         (CAM.svg, CENIGAA.svg, Gobernacion_Huila.png)
│   └── data/
│       ├── catalogo_estaciones_CENIGAA.csv          ← descargable público
│       ├── estaciones.json                          (150 estaciones)
│       ├── resumen_departamento.json
│       ├── municipios_huila.geojson                 (37 features tipo Point)
│       └── estacion_*.json                          (150 archivos por estación)
└── src/
    ├── main.jsx
    ├── App.jsx                            ← BrowserRouter + Routes (/, /efrain)
    ├── hooks/
    │   └── useDataLoader.js               (useEstaciones, useEstacion, useResumenDepartamento)
    ├── data/
    │   ├── content.js                     (estructura ES/EN preparada — no activa)
    │   └── politicaClimatica.js           ← v1.0.1 · 4 niveles, 12 instrumentos
    ├── styles/
    │   ├── tokens.css                     (tokens SIC)
    │   └── global.css                     (reset + @tailwind + utilidades)
    ├── components/layout/
    │   ├── Header.jsx
    │   └── Footer.jsx
    └── components/sections/
        ├── Hero.jsx
        ├── MapaEstaciones.jsx             (con Filtros y Leyenda inline)
        ├── PanelEstacion.jsx              (4 tabs: Estacionalidad / Tendencia / ENSO / Distribución)
        ├── SobreObservatorio.jsx
        ├── ComoFunciona.jsx
        ├── Biblioteca.jsx
        ├── Equipo.jsx
        ├── DatosAbiertos.jsx
        ├── Aliados.jsx
        ├── PoliticaSection.jsx            ← v1.0.1 · #politica (Global/Nacional/Dpto/Mpio)
        └── HomenajeEfrain.jsx             (ruta /efrain)
```

### Chunks de producción (output Vite)

| Chunk | Tamaño | Gzip | Contenido |
|---|---:|---:|---|
| `index-*.js` | 117 KB | 33.6 KB | App shell + router + secciones |
| `map-*.js` | 289 KB | 88.5 KB | leaflet + react-leaflet |
| `charts-*.js` | 374 KB | 110.3 KB | recharts (carga sólo al abrir el panel de estación) |
| `icons-*.js` | 20 KB | 5.8 KB | lucide-react |
| `vendor-*.js` | 0.06 KB | 0.07 KB | react / react-dom (hoisted por Rollup a otros chunks) |
| `index-*.css` | 52 KB | 14.1 KB | Tailwind compilado + Leaflet CSS + tokens |

---

## 3. Identidad visual

### Tokens SIC implementados ([src/styles/tokens.css](src/styles/tokens.css))

| Token | Valor | Pantone | Uso |
|---|---|---|---|
| `--color-brand-blue` | `#4A60D8` | 2726c | Agua/Ambiente · acento primario · CTAs |
| `--color-brand-green` | `#43B02A` | 361c | Agricultura · stats verde · indicadores positivos |
| `--color-brand-orange` | `#F4511E` | 171c | Energía · "Decreciente" en mapa · tendencia negativa |
| `--color-brand-navy` | `#162341` | 282c | Institucional · texto títulos · Hero/Dedicatoria |
| `--color-brand-*-light` / `*-mid` | derivados | — | Fondos suaves, hovers, borders destacados |

✅ **Conformidad SIC: total.** Los 4 colores oficiales viven en `tokens.css` con cita Pantone y se exponen en Tailwind como `[#xxxxxx]` arbitrary values en el código (consistente con el manual).

### Tipografía

| Familia | Origen | Uso |
|---|---|---|
| **Inter** (300–900) | Google Fonts | Body, títulos, UI |
| **JetBrains Mono** (400, 500) | Google Fonts | Datos numéricos, códigos de estación, citas técnicas |

✅ Conforme a `CENIGAA_CONTEXT.md §2`: Inter como fuente oficial web. JetBrains Mono complementa para tabulares; **no se usa Astera** (correctamente excluida).

### Logotipo

⚠ **Pendiente:** El logo CENIGAA en Header y Footer se renderiza como SVG **placeholder inline** (3 círculos GeoAgroAmbiental + wordmark Inter extrabold) — ver `CenigaaLogo` en [Header.jsx](src/components/layout/Header.jsx) y `CenigaaLogoFooter` en [Footer.jsx](src/components/layout/Footer.jsx). El archivo `public/assets/logos/CENIGAA.svg` SÍ existe pero sólo se usa en la sección Aliados, no en el chrome del sitio. Hay TODO explícito en el código para sustituir cuando se valide el SVG oficial.

---

## 4. Contenido y secciones

### Página principal `/`

| # | Sección | ID | Estado | Origen |
|---|---|---|---|---|
| 1 | **Hero** | `#hero` | ✅ Implementada | Sesión 1 |
| 2 | **Mapa de estaciones** (con filtros Municipio / Tendencia / Estado + leyenda en vivo + panel 4 tabs) | `#mapa` | ✅ Implementada | Sesiones 2–3, filtros añadidos post-Sesión 5 |
| 3 | **Sobre el Observatorio** (origen, ROGAA-Huila, ciencia abierta) | `#sobre` | ✅ Implementada | Sesión 5 cierre |
| 4 | Resumen Huila | `#resumen` | ❌ **Placeholder** "En construcción" | — |
| 5 | **Política pública sobre cambio climático** (12 instrumentos en 4 niveles: Global / Nacional / Departamental / Municipal, tarjetas con enlaces a fuentes oficiales) | `#politica` | ✅ Implementada | v1.0.1 · commit `4b95d1c` |
| 6 | **Cómo funciona el Observatorio** (6 cards componentes) | `#metodologia` | ✅ Implementada | Sesión 5 |
| 7 | **Biblioteca climática del Huila** (6 referencias) | `#biblioteca` | ✅ Implementada | Sesión 5 |
| 8 | **Equipo** (3 cards + memorial Efraín) | `#equipo` | ✅ Implementada | Sesión 5 cierre |
| 9 | **Datos abiertos** (CSV catálogo + cita APA) | `#datos` | ✅ Implementada | Sesión 5 |
| 10 | Dedicatoria sticky a Efraín Domínguez Calle (navy band) | `#dedicatoria` | ✅ Implementada | Sesión 1, retocada en 4 |
| 11 | **Respaldo institucional** (Gobernación, CAM, CENIGAA, IDEAM) | `#aliados` | ✅ Implementada | Sesión 4 |

### Ruta secundaria `/efrain`

| Sección | Estado |
|---|---|
| **Homenaje a Efraín Antonio Domínguez Calle** — banner Nevado-Tatacoa, retrato, biografía 3-bloques (NRMA / aporte científico / trayectoria), blockquote brand-blue, ficha del libro CC_VCE Huila con ISBN | ✅ Implementada (Sesión 4) |

### Hub de navegación

- **Header**: 7 anchors (`#mapa`, `#sobre`, `#resumen`, `#politica` → label "Política pública", `#biblioteca`, `#equipo`, `#datos`) + CTA externo "Red ROGAA → www.cenigaa.org". Resuelve correctamente desde `/efrain` (los anchors se prefijan con `/` vía `useLocation`).
- **Footer**: cuatro columnas — identidad + ecosistema CENIGAA + Recursos (incluye link `/efrain`) + redes ROGAA — más dedicatoria al pie con link cruzado a `/efrain`.

---

## 5. SEO

### Meta tags en `index.html`

| Campo | Valor / estado |
|---|---|
| `<title>` | "Observatorio Climático del Huila - Efraín Domínguez Calle \| CENIGAA" |
| `<meta name="description">` | ✅ Específica: 150 estaciones, 87 años (1930–2017), 6 componentes científicos, Plan Huila 2050, ROGAA-Huila |
| `<meta name="keywords">` | ✅ 15+ términos: observatorio climático Huila, Mann-Kendall, ENSO, Niño/Niña, Efraín Domínguez Calle, IDEAM, etc. |
| `<meta name="robots">` | `index, follow` |
| `<meta name="author">` | CENIGAA |
| `<link rel="canonical">` | `https://obs-clima-huila.cenigaa.org` |
| Open Graph | ✅ `og:type`, `url`, `title`, `description`, `image`, `image:alt`, `locale=es_CO`, `site_name=CENIGAA` |
| Twitter Card | ✅ `summary_large_image` + title/description/image |

### JSON-LD

- ✅ `ResearchOrganization` (CENIGAA) — name, alternateName, url, logo, address, contactPoint
- ✅ `WebSite` — name, description, publisher (`@id` cruzado a la organización), `inLanguage: es-CO`
- ✅ `Dataset` — **añadido en Sesión 5**: 150 estaciones, `temporalCoverage: 1930-01-01/2017-12-31`, `spatialCoverage` con bounding box del Huila, `sourceOrganization: IDEAM`, `variableMeasured` (precipitación, MK, ENSO, distribuciones), `license: CC-BY 4.0`, `citation` APA al libro CC_VCE Huila

### Activos SEO

| Archivo / recurso | Estado | Notas |
|---|---|---|
| `public/favicon.svg` | ✅ Presente (v1.0.1 · commit `5c40948`) | 7 líneas SVG inline; favicon en pestaña |
| `public/apple-touch-icon.png` | ✅ Presente (v1.0.1 · commit `5c40948`) | 5.1 KB · ícono para iOS home-screen |
| `public/og-image.jpg` | ✅ Presente (v1.0.1 · commit `5c40948`) | 82.9 KB · preview en redes sociales |
| `public/robots.txt` | ❌ No existe | Crawlers usan defaults |
| `public/sitemap.xml` | ❌ No existe | Indexación menos guiada (Google igual lo encuentra) |

> ✅ **P0 resuelto en v1.0.1**: los tres activos referenciados desde `index.html` ya existen, eliminando los 404s de favicon/og-image. Pendiente menor: `robots.txt` y `sitemap.xml` con rutas `/` y `/efrain`.

---

## 6. Rendimiento

### Estrategia de bundling (real)

`vite.config.js` define `manualChunks` separando `leaflet`, `react-leaflet`, `recharts` y `lucide-react` en chunks dedicados. **Resultado**: la home **no carga `charts-*.js` (374 KB)** hasta que el usuario hace click en una estación → primer paint mucho más ligero.

### Imágenes

| Métrica | Valor |
|---|---|
| Total imágenes en `public/assets/` | 10 archivos |
| WebP | **1** (`efrain/Efrain-Dominguez2.webp`) |
| JPG/JPEG/PNG/SVG | 9 |
| Con `loading="lazy"` | 2 (logos en Aliados) |
| Con `loading="eager"` | 1 (retrato Efraín en `/efrain` — apropiado, está en LCP) |

⚠ **Brecha frente a `CENIGAA_CONTEXT.md §6` ("imágenes en WebP con lazy loading obligatorio"):** sólo 1/10 imágenes está en WebP. Las críticas (`Nevado tatacoa.jpg`, retratos JPG de Efraín, logo PNG de Gobernación) deberían convertirse. La penalización es modesta porque la home no las carga; impactan principalmente `/efrain` y la sección Aliados.

### Lighthouse

🟡 **No medido aún**. No hay run reciente registrado en el repo (sin `lighthouserc`, sin badge en `README.md`, sin captura en `/docs`). Recomendado correr antes de cerrar v1.0.x:

```
npx lighthouse https://obs-clima-huila.cenigaa.org --view --preset=desktop
```

Objetivo `CENIGAA_CONTEXT.md §6`: ≥ 90 en Performance / Accessibility / Best Practices / SEO.

### Otras optimizaciones

- ✅ Carga lazy de datos por estación: `useEstacion(codigo)` con `AbortController` para cancelar fetches obsoletos
- ✅ Mapa: `scrollWheelZoom: false` — evita captura accidental del scroll de la página
- ✅ Tiles CartoDB Positron (CDN público, gratis, atribuido) — preconnect implícito por subdominio
- ✅ Google Fonts con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`
- ✅ CSP estricta en `staticwebapp.config.json` (script-src 'self' + img-src https permite tiles)

---

## 7. Coherencia ecosistémica

### Enlaces salientes a www.cenigaa.org

| Ubicación | Tratamiento | rel/target |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) — breadcrumb superior izquierdo | "← CENIGAA" implícito vía logo + chevron | ✅ `target=_blank` `rel=noopener noreferrer` |
| [Header.jsx](src/components/layout/Header.jsx) — CTA desktop "Red ROGAA" | Pill navy → www.cenigaa.org | ✅ |
| [Header.jsx](src/components/layout/Header.jsx) — CTA móvil | "Red ROGAA-Huila · CENIGAA" | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) — logo footer | Link al sitio principal | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) — columna Ecosistema | "www.cenigaa.org — Inicio" | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) — copyright | "www.cenigaa.org" inline | ✅ |

✅ Conforme a `CENIGAA_CONTEXT.md §6 (Coherencia ecosistémica)`.

### Enlaces a gaaialab.cenigaa.org

- ✅ [Footer.jsx](src/components/layout/Footer.jsx) — columna Ecosistema CENIGAA
- ✅ [Footer.jsx](src/components/layout/Footer.jsx) — sub-columna "Desarrollado por"
- ✅ [Equipo.jsx](src/components/sections/Equipo.jsx) — card destacada Jorge Chavarro
- ✅ [Equipo.jsx](src/components/sections/Equipo.jsx) — card GAA+IA Lab
- ✅ [SobreObservatorio.jsx](src/components/sections/SobreObservatorio.jsx) — bloque "La red ROGAA-Huila"

Todos con `target=_blank rel=noopener noreferrer`.

### Email institucional

- ✅ `mailto:info@cenigaa.org` en Footer (sección contacto)
- ✅ `mailto:info@cenigaa.org` en Biblioteca (call-to-collaborate)

### Hub central observatorios

🟡 No hay enlace a `observatorios.cenigaa.org` — el hub aún no existe (`CENIGAA_CONTEXT.md §3` lo marca "📋 Por crear"). El enlace a `obs-suelos-huila.cenigaa.org` fue **ocultado** del Footer en v1.0.1 (commit `5c40948`) para evitar 404s hasta que el subdominio se publique.

### Audit de enlaces externos

✅ **Todos los `target="_blank"` tienen `rel="noopener noreferrer"`**, incluyendo el atributo HTML del attribution de Leaflet (OpenStreetMap / CARTO) — corregido explícitamente en la pasada de calidad de Sesión 5.

---

## 8. Datos científicos

### Cobertura

| Métrica | Valor |
|---|---|
| Total de estaciones aptas | **150** |
| Estaciones con sensor de precipitación PT_4 | 149 |
| Período de la línea base | **1930 – 2017 · 87 años** |
| Estación más antigua | **APTO BENITO SALAS** (Neiva, código `21115020`) — inicio 1930 |
| Municipios cubiertos | **37** (todo el departamento del Huila) |
| Bounding box | `1.55, -76.65` ↔ `3.85, -74.50` |

### Fuente y trazabilidad

| Capa | Origen |
|---|---|
| Datos primarios | **IDEAM** — Red Nacional de Estaciones Climatológicas |
| Procesamiento | **CENIGAA** vía base `CCYVCE_DB.db` |
| Convenio que financió la sistematización | **SGR-FCTeI Convenio Especial de Cooperación 124 de 2015** |
| Metodología | **Domínguez Calle, E.A. (2018)** — *Cambio climático y variabilidad climática extrema en el Huila*. ISBN 978-620-2-16957-8 |

### Variables analizadas por estación

Cada archivo `estacion_{CODIGO}.json` contiene, para PT_4 (Precipitación total mensual, mm/mes):
- Serie mensual completa (`serie_mensual.fechas`, `valores`) y serie anual (`serie_anual`)
- **Estacionalidad** — medias multianuales por mes + `mes_max` / `mes_min` (patrón bimodal Huila: Abr-May y Oct-Nov)
- **Inercia** — `acf_lag1`, `acf_lag12`, serie ACF 1–12
- **Tendencia** — Mann-Kendall: `direccion`, `significativa`, `p_valor`, `pendiente_anual` (Theil-Sen), `cambio_total`
- **Ciclos seculares** — medias móviles 10 años
- **ENSO** — nota cualitativa, interpretación y fuente (correlación inversa con Niño 3.4, MEI, OMI)
- **Distribución** — ajuste (Gumbel mayoritariamente en mensual; Log-Gamma para anual), KS p-valor, parámetros, media, desv. std.

### Resumen departamental (`resumen_departamento.json`)

- Tendencias PT_4 globales: **25 decreciente · 12 creciente · 113 sin tendencia** (37 con tendencia estadísticamente significativa)
- Patrón espacial: tendencia decreciente significativa al sur del Huila, creciente al norte (1985–2015)
- Distribución mensual dominante: **Gumbel** con asimetría derecha; anual: **Log-Gamma**

### Capa cartográfica

⚠ **`municipios_huila.geojson` contiene 37 features tipo `Point` (centroides), no polígonos.** En `MapaEstaciones.jsx` se renderiza con un `pointToLayer` discreto + el `style` para polígonos preparado para que aplique automáticamente cuando se reemplace el archivo. Necesario para una visualización por municipio completa (choropleths futuros).

### Descargas públicas

- ✅ **CSV catálogo** — `/data/catalogo_estaciones_CENIGAA.csv` (151 líneas, ~12 KB; 9 campos: NOMBRE, CODIGO, MUNICIPIO, CORRIENTE, ALTITUD_msnm, INICIO, FIN, N_MESES, ESTADO). Botón en `#datos`.
- ✅ **JSON por estación** — accesible vía la URL del archivo (`/data/estacion_{CODIGO}.json`). No expuesto aún como botón explícito en el panel; el usuario lo recibe al click vía `useEstacion`.

---

## 9. Resumen ejecutivo

### Estado general

🟢 **MVP + marco normativo en producción.** 10 de las 11 secciones planeadas están implementadas con contenido final. La única restante es `#resumen` (Hallazgos departamentales) — placeholder explícito "En construcción".

### Hallazgos de la auditoría (positivos)

- ✅ Identidad visual al 100% conforme manual SIC (4 colores Pantone + Inter)
- ✅ Coherencia ecosistémica completa: header y footer enlazan a www.cenigaa.org y gaaialab.cenigaa.org con `rel` correcto
- ✅ JSON-LD multi-entidad (`ResearchOrganization` + `WebSite` + `Dataset`) bien estructurado, ideal para Google Dataset Search
- ✅ Routing SPA con fallback Azure correctamente configurado (`/efrain` resuelve en deep-link)
- ✅ Code splitting agresivo — el chunk de Recharts (374 KB) no carga en la home
- ✅ Pasada de calidad: alts descriptivos en todos los `<img>`, `rel=noopener` en todos los externos, attribution de Leaflet corregido
- ✅ Filtros del mapa con conteo de leyenda derivado de la misma lista filtrada (imposible que se desincronicen)
- ✅ **Sección política pública (v1.0.1)** — 12 instrumentos oficiales en 4 niveles con enlaces directos a UNFCCC, Función Pública, Minambiente, Gobernación del Huila y Alcaldía de Neiva; todos los anchors con `rel="noopener noreferrer"`

### Pendientes (priorizados)

| Prio | Item | Notas |
|---|---|---|
| 🟠 P1 | Implementar sección `#resumen` (Hallazgos departamentales: patrones norte/sur, ENSO) | Datos en `resumen_departamento.json` listos para visualizar; única sección aún en placeholder |
| 🟡 P2 | Reemplazar `municipios_huila.geojson` por polígonos reales | El style polygon ya está cableado |
| 🟡 P2 | Convertir imágenes JPG/PNG críticas a WebP | Brecha frente a §6 del CONTEXT |
| 🟡 P2 | Sustituir `CenigaaLogo` placeholder por SVG oficial registrado SIC | TODO explícito en Header y Footer |
| 🟢 P3 | Publicar `robots.txt` y `sitemap.xml` (`/`, `/efrain`) | Mejora indexación, no crítico |
| 🟢 P3 | Correr Lighthouse y registrar baseline (objetivo ≥ 90 las 4 categorías) | Sin medición previa |
| 🟢 P3 | Habilitar contenido EN cuando se traduzca (`src/data/content.js` ya tiene la estructura) | Sólo cambiar `LANG = 'en'` |

### Cerrado en v1.0.1 (desde v1.0.0)

- ✅ ~~P0 favicon · apple-touch-icon · og-image~~ — resueltos en commit `5c40948` (public/ y build/)
- ✅ ~~P1 sección `#politica`~~ — implementada en commit `4b95d1c` con 12 instrumentos y enlaces oficiales
- ✅ ~~Riesgo obs-suelos-huila enlazado~~ — ocultado en Footer en commit `5c40948`

### Riesgos operacionales

- ✅ ~~`obs-suelos-huila.cenigaa.org` enlazado en el Footer~~ — **resuelto en v1.0.1**: el `EcoLink` quedó comentado en `Footer.jsx` hasta que el subdominio se publique.
- 🟡 La estructura ES/EN en `src/data/content.js` **no está conectada** a los componentes — Hero, Header y Footer tienen los strings hardcoded. El comentario de `global.css` documenta cómo activar EN pero requiere refactor.
- 🟢 `staticwebapp.config.json` usa `navigationFallback: /index.html` — correcto para SPA según la advertencia explícita de `CENIGAA_CONTEXT.md §2` ("Solo usar en SPAs").

### Atribución científica

Cualquier uso académico o institucional debe citar:
> Domínguez Calle, E.A., Chavarro Díaz, J.A., Velasco Sánchez, A.N., Chavarro Díaz, J.I., De León Pérez, D.R., Garrido, A.E., Cañón Ramos, M.Á., & Parra Díaz, C.F. (2018). *Cambio Climático y Variabilidad Climática Extrema en el Huila: Herramientas para la Caracterización de la Amenaza Hidroclimática*. Editorial Académica Española. ISBN 978-620-2-16957-8.
> + **CENIGAA (2026)** — Observatorio Climático del Huila «Efraín Domínguez Calle», procesamiento y publicación de los datos 1930–2017. Última actualización del nodo: junio 2026.

---

## 10. Historial de versiones

| Versión | Fecha | Commit | Hito |
|---|---|---|---|
| **v1.0.1** | **2026-06-03** | `4b95d1c` | Cierre de P0 SEO (favicon + apple-touch-icon + og-image), ocultamiento del enlace prematuro a `obs-suelos-huila` e implementación de la sección **#politica** con 12 instrumentos oficiales en 4 niveles (Global / Nacional / Departamental / Municipal) y enlaces a fuentes del Estado colombiano y organismos internacionales. |
| **v1.0.0** | **2026-05-18** | `7eb02e0` | Creación del documento. Estado del nodo tras cierre del MVP (Sesiones 1–5 + correcciones de período de datos, filtros del mapa, catálogo descargable, sección Sobre, sección Equipo y pasada de calidad). |

### Antecedentes (commits de referencia del repo)

```
4b95d1c  feat: seccion politica publica cambio climatico #politica     ← v1.0.1
5c40948  fix: assets P0 favicon+og-image, ocultar enlace obs-suelos    ← v1.0.1
e64139d  docs: crear CENIGAA_STATUS_obs-clima-huila.md v1.0.0
7eb02e0  feat: MVP complete - about, team sections, quality pass       ← v1.0.0
ad63fd3  feat: open data section with downloadable station catalog
8b571e0  feat: add real-time filters to station map
b3a013d  fix: correct data period from 1923 to 1930, 87 years of records
0840f8f  feat: methodology + library + Dataset schema (Sesión 5)
2ca0985  feat: /efrain tribute page, Aliados section, router (Sesión 4)
fd5d8cf  feat: add full station panel with 4 tabs (Sesión 3)
3dd6b27  feat: add interactive Leaflet station map (Sesión 2)
ea54cef  fix: add postcss config so Tailwind directives compile
2d6a24a  fix: deploy build/ folder directly and bundle SWA config
```

---

*CENIGAA_STATUS_obs-clima-huila.md v1.0.1 — 2026-06-03*
*Auditor: agente Claude Code · Branch `main` · Repositorio `cenigaa-obs-clima-huila`*
*Próxima revisión sugerida: al cerrar la sección `#resumen`, al publicar `robots.txt` + `sitemap.xml`, o al sustituir el logo placeholder por el SVG oficial.*
