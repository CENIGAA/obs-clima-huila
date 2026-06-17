# CENIGAA_STATUS_obs-clima-huila.md
**Estado del nodo — obs-clima-huila.cenigaa.org**
**Observatorio Climático del Huila «Efraín Antonio Domínguez Calle»**
**Nodo 1 de la Red ROGAA-Huila**

| Versión | Fecha | Branch | Último commit | Estado |
|---|---|---|---|---|
| v1.2.0 | 2026-06-09 | `main` | `0b6ee0a` — *feat: fase1 cierre - lazy recharts, robots, sitemap, logos oficiales, webp* | ✅ **Producción · MVP completo + fase 1 de cierre técnico** |

> Documento de auditoría — refleja el estado real del repositorio `cenigaa-obs-clima-huila` el 2026-06-09 tras cerrar el bloque de pendientes técnicos de la fase 1: lazy-load de Recharts (chunk de 374 KB fuera del bundle inicial), `robots.txt` + `sitemap.xml`, sustitución del logo placeholder por los activos oficiales SIC y conversión a WebP de las imágenes críticas. No contiene aspiraciones: sólo lo que está mergeado a `main`.

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
| Gráficas | Recharts | ^3.8.1 (lazy desde v1.2.0) |
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
│   ├── favicon.svg                        ← v1.0.1 (commit 5c40948)
│   ├── apple-touch-icon.png               ← v1.0.1 (commit 5c40948)
│   ├── og-image.jpg                       ← v1.0.1 (commit 5c40948)
│   ├── robots.txt                         ← v1.2.0 (commit 0b6ee0a)
│   ├── sitemap.xml                        ← v1.2.0 (commit 0b6ee0a)
│   ├── assets/
│   │   ├── Nevado tatacoa.jpg             (original, 14 MB)
│   │   ├── Nevado tatacoa.webp            ← v1.2.0 · 2.1 MB (85% reducción)
│   │   ├── efrain/                        (6 retratos JPG + 5 WebP)
│   │   │   ├── Efrain-dominguez1.webp     ← v1.2.0 · 70 KB
│   │   │   ├── Efrain-Dominguez2.webp     (preexistente)
│   │   │   ├── Efraín.webp                ← v1.2.0 · 56 KB
│   │   │   └── Efrain4.webp               ← v1.2.0 · 118 KB
│   │   └── logos/
│   │       ├── CAM.svg
│   │       ├── CENIGAA.svg                (color, fondo claro)
│   │       ├── Gobernacion_Huila.png
│   │       └── logo_cenigaa_T_Blanco.png  ← commit 9eab46f · versión blanca para fondo navy
│   └── data/
│       ├── catalogo_estaciones_CENIGAA.csv          ← descargable público
│       ├── estaciones.json                          (150 estaciones)
│       ├── resumen_departamento.json
│       ├── municipios_huila.geojson                 (37 features tipo Point)
│       └── estacion_*.json                          (150 archivos por estación)
└── src/
    ├── main.jsx
    ├── App.jsx                            ← BrowserRouter + Routes (/, /efrain) · PlaceholderSection removida en v1.1.0
    ├── hooks/
    │   └── useDataLoader.js               (useEstaciones, useEstacion, useResumenDepartamento)
    ├── data/
    │   ├── content.js                     (estructura ES/EN preparada - no activa)
    │   └── politicaClimatica.js           ← v1.0.1 · 4 niveles, 12 instrumentos
    ├── styles/
    │   ├── tokens.css                     (tokens SIC)
    │   └── global.css                     (reset + @tailwind + utilidades)
    ├── components/layout/
    │   ├── Header.jsx                     ← v1.2.0: logo CENIGAA.svg oficial (h-8)
    │   └── Footer.jsx                     ← v1.2.0: logo logo_cenigaa_T_Blanco.png (h-8)
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
        ├── ResumenSection.jsx             ← v1.1.0 · #resumen · v1.2.0: lazy + Suspense
        ├── LazyBarChart.jsx               ← v1.2.0 · chunk dinámico de Recharts
        └── HomenajeEfrain.jsx             (ruta /efrain)
```

### Chunks de producción (output Vite tras v1.2.0)

| Chunk | Tamaño | Gzip | Contenido |
|---|---:|---:|---|
| `index-*.js` | 130 KB | 37.8 KB | App shell + router + secciones |
| `map-*.js` | 289 KB | 88.7 KB | leaflet + react-leaflet (lazy: carga al ver el mapa) |
| `charts-*.js` | 374 KB | 110.6 KB | recharts (**lazy desde v1.2.0** — disparado por `LazyBarChart` al montar `#resumen` o al abrir un panel de estación) |
| `LazyBarChart-*.js` | 1.08 KB | 0.62 KB | **nuevo en v1.2.0** · wrapper dinámico que importa Recharts asincrónicamente |
| `icons-*.js` | 21 KB | 6.0 KB | lucide-react |
| `vendor-*.js` | 0.06 KB | 0.07 KB | react / react-dom (hoisted por Rollup a otros chunks) |
| `index-*.css` | 55 KB | 14.5 KB | Tailwind compilado + Leaflet CSS + tokens |

✅ **Regresión de v1.1.0 mitigada en v1.2.0.** El bundle inicial vuelve a no contener Recharts. `LazyBarChart.jsx` se carga vía `React.lazy()` con `<Suspense fallback={<div className="h-56 bg-gray-100 rounded-lg animate-pulse" />}>` envolviendo la instancia; el chunk `charts-*.js` se descarga asincrónicamente cuando React monta el componente. Mismo efecto que tenía el code-splitting original previo a v1.1.0, pero ahora explícito vía `lazy/Suspense`.

---

## 3. Identidad visual

### Tokens SIC implementados ([src/styles/tokens.css](src/styles/tokens.css))

| Token | Valor | Pantone | Uso |
|---|---|---|---|
| `--color-brand-blue` | `#4A60D8` | 2726c | Agua/Ambiente · acento primario · CTAs |
| `--color-brand-green` | `#43B02A` | 361c | Agricultura · stats verde · indicadores positivos |
| `--color-brand-orange` | `#F4511E` | 171c | Energía · "Decreciente" en mapa · tendencia negativa |
| `--color-brand-navy` | `#162341` | 282c | Institucional · texto títulos · Hero/Dedicatoria |
| `--color-brand-*-light` / `*-mid` | derivados | - | Fondos suaves, hovers, borders destacados |

✅ **Conformidad SIC: total.** Los 4 colores oficiales viven en `tokens.css` con cita Pantone y se exponen en Tailwind como `[#xxxxxx]` arbitrary values en el código (consistente con el manual).

### Tipografía

| Familia | Origen | Uso |
|---|---|---|
| **Inter** (300–900) | Google Fonts | Body, títulos, UI |
| **JetBrains Mono** (400, 500) | Google Fonts | Datos numéricos, códigos de estación, citas técnicas |

✅ Conforme a `CENIGAA_CONTEXT.md §2`: Inter como fuente oficial web. JetBrains Mono complementa para tabulares; **no se usa Astera** (correctamente excluida).

### Logotipo

✅ **Resuelto en v1.2.0.** El logo CENIGAA en el chrome del sitio ahora usa los activos oficiales:

| Ubicación | Archivo | Razón |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) (fondo `bg-white/95`) | `/assets/logos/CENIGAA.svg` (h-8) | SVG color oficial para fondo claro |
| [Footer.jsx](src/components/layout/Footer.jsx) (fondo `bg-[#162341]` navy) | `/assets/logos/logo_cenigaa_T_Blanco.png` (h-8) | PNG en blanco para fondo oscuro |
| [Aliados.jsx](src/components/sections/Aliados.jsx) | `/assets/logos/CENIGAA.svg` | (sin cambio respecto a v1.0.x) |

El componente placeholder de 3 círculos `bg-[#43B02A]/[#4A60D8]/[#F4511E]` fue eliminado de Header y Footer.

---

## 4. Contenido y secciones

### Página principal `/`

| # | Sección | ID | Estado | Origen |
|---|---|---|---|---|
| 1 | **Hero** | `#hero` | ✅ Implementada | Sesión 1 |
| 2 | **Mapa de estaciones** (con filtros Municipio / Tendencia / Estado + leyenda en vivo + panel 4 tabs) | `#mapa` | ✅ Implementada | Sesiones 2–3, filtros añadidos post-Sesión 5 |
| 3 | **Sobre el Observatorio** (origen, ROGAA-Huila, ciencia abierta) | `#sobre` | ✅ Implementada | Sesión 5 cierre |
| 4 | **Qué nos dicen 87 años de registros** (3 métricas grandes 149/37/87, `BarChart` Mann-Kendall lazy con distribución de tendencias, 4 tarjetas de hallazgos: sur decreciente, norte creciente, ENSO, bimodal estable, + nota metodológica) | `#resumen` | ✅ Implementada | v1.1.0 · commit `77c135f` · lazy en v1.2.0 |
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
| **Homenaje a Efraín Antonio Domínguez Calle** - banner Nevado-Tatacoa (WebP desde v1.2.0), retrato (WebP desde v1.2.0), biografía 3-bloques (NRMA / aporte científico / trayectoria), blockquote brand-blue, ficha del libro CC_VCE Huila con ISBN | ✅ Implementada (Sesión 4) |

### Hub de navegación

- **Header**: 7 anchors (`#mapa`, `#sobre`, `#resumen`, `#politica` → label "Política pública", `#biblioteca`, `#equipo`, `#datos`) + CTA externo "Red ROGAA → www.cenigaa.org". Resuelve correctamente desde `/efrain` (los anchors se prefijan con `/` vía `useLocation`).
- **Footer**: cuatro columnas - identidad + ecosistema CENIGAA + Recursos (incluye link `/efrain`) + redes ROGAA - más dedicatoria al pie con link cruzado a `/efrain`.

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

- ✅ `ResearchOrganization` (CENIGAA) - name, alternateName, url, logo, address, contactPoint
- ✅ `WebSite` - name, description, publisher (`@id` cruzado a la organización), `inLanguage: es-CO`
- ✅ `Dataset` - **añadido en Sesión 5**: 150 estaciones, `temporalCoverage: 1930-01-01/2017-12-31`, `spatialCoverage` con bounding box del Huila, `sourceOrganization: IDEAM`, `variableMeasured` (precipitación, MK, ENSO, distribuciones), `license: CC-BY 4.0`, `citation` APA al libro CC_VCE Huila

### Activos SEO

| Archivo / recurso | Estado | Notas |
|---|---|---|
| `public/favicon.svg` | ✅ Presente (v1.0.1 · commit `5c40948`) | 7 líneas SVG inline; favicon en pestaña |
| `public/apple-touch-icon.png` | ✅ Presente (v1.0.1 · commit `5c40948`) | 5.1 KB · ícono para iOS home-screen |
| `public/og-image.jpg` | ✅ Presente (v1.0.1 · commit `5c40948`) | 82.9 KB · preview en redes sociales |
| `public/robots.txt` | ✅ **Presente desde v1.2.0** (commit `0b6ee0a`) | 80 B · `User-agent: *` · `Allow: /` · `Sitemap: https://obs-clima-huila.cenigaa.org/sitemap.xml` |
| `public/sitemap.xml` | ✅ **Presente desde v1.2.0** (commit `0b6ee0a`) | 380 B · 2 URLs: `/` (priority 1.0) y `/efrain` (priority 0.8) con `lastmod 2026-06-03` |

✅ **Bloque SEO cerrado en v1.2.0.** Los 5 activos referenciados o esperados por buscadores existen. Para registrar el sitemap explícitamente: enviarlo en [Google Search Console](https://search.google.com/search-console) y [Bing Webmaster Tools](https://www.bing.com/webmasters).

> ⚠ **Cache de previews sociales**: Twitter, LinkedIn, Facebook y WhatsApp cachean los previews con TTL largo. Si la URL ya fue compartida antes del fix de v1.0.1, puede requerir purge manual vía [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) o [Twitter Card Validator](https://cards-dev.twitter.com/validator) para que tomen la imagen nueva.

---

## 6. Rendimiento

### Estrategia de bundling (real, post v1.2.0)

`vite.config.js` define `manualChunks` separando `leaflet`, `react-leaflet`, `recharts` y `lucide-react` en chunks dedicados. Tras v1.2.0:

- **`charts-*.js` (374 KB) vuelve a ser asincrónico en home.** Se descarga sólo cuando React monta `LazyBarChart` (vía `React.lazy + Suspense`), no como parte del bundle inicial. Si el usuario nunca llega a `#resumen` ni abre el panel de una estación, no paga los 374 KB.
- **`map-*.js` (289 KB)** sigue lazy de facto (Leaflet sólo inicializa cuando el contenedor entra al DOM).
- **Bundle inicial efectivo en home**: `index` (130 KB) + `icons` (21 KB) + `css` (55 KB) ≈ 206 KB (~58 KB gzip), más `LazyBarChart` (1 KB) que se resuelve fuera del path crítico.

### Imágenes

| Métrica | v1.1.0 | v1.2.0 | Cambio |
|---|---:|---:|---|
| Total imágenes en `public/assets/` | 10 | 14 | +4 WebP (originales JPG conservados) |
| WebP | 1 | 5 | **+4** (Nevado tatacoa, Efrain-dominguez1, Efraín, Efrain4) |
| JPG/JPEG/PNG/SVG | 9 | 9 | (sin cambio — originales conservados como fallback) |
| Con `loading="lazy"` | 2 | 2 | (logos en Aliados) |
| Con `loading="eager"` | 1 | 1 | retrato Efraín en `/efrain` (está en LCP) |

**Conversiones aplicadas con `sharp-cli q=82`:**

| Archivo | Antes | Después | Reducción |
|---|---:|---:|---:|
| `Nevado tatacoa.jpg` → `.webp` | 14 MB | 2.1 MB | **85%** |
| `Efrain-dominguez1.jpg` → `.webp` | 128 KB | 70 KB | 45% |
| `Efraín.JPG` → `.webp` | 122 KB | 56 KB | 54% |
| `Efrain4.jpg` → `.webp` | 146 KB | 118 KB | 19% |

⚠ **Brecha pequeña restante**: `Gobernacion_Huila.png` (logo institucional) y `Efrain_isologo.jpg` siguen sin convertir. Bajo impacto; queda como P3.

### Lighthouse

🟡 **No medido aún**. No hay run reciente registrado en el repo. Buen momento para correrlo tras v1.2.0 (con lazy charts + WebP, debería mejorar respecto a un baseline hipotético de v1.1.0):

```
npx lighthouse https://obs-clima-huila.cenigaa.org --view --preset=desktop
```

Objetivo `CENIGAA_CONTEXT.md §6`: ≥ 90 en Performance / Accessibility / Best Practices / SEO.

### Otras optimizaciones

- ✅ Carga lazy de datos por estación: `useEstacion(codigo)` con `AbortController` para cancelar fetches obsoletos
- ✅ Mapa: `scrollWheelZoom: false` - evita captura accidental del scroll de la página
- ✅ Tiles CartoDB Positron (CDN público, gratis, atribuido) - preconnect implícito por subdominio
- ✅ Google Fonts con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`
- ✅ CSP estricta en `staticwebapp.config.json` (script-src 'self' + img-src https permite tiles)
- ✅ **v1.2.0**: `React.lazy + Suspense` para Recharts; chunk fuera del path crítico

---

## 7. Coherencia ecosistémica

### Enlaces salientes a www.cenigaa.org

| Ubicación | Tratamiento | rel/target |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) - breadcrumb superior izquierdo | "← CENIGAA" implícito vía logo + chevron | ✅ `target=_blank` `rel=noopener noreferrer` |
| [Header.jsx](src/components/layout/Header.jsx) - CTA desktop "Red ROGAA" | Pill navy → www.cenigaa.org | ✅ |
| [Header.jsx](src/components/layout/Header.jsx) - CTA móvil | "Red ROGAA-Huila · CENIGAA" | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) - logo footer | Link al sitio principal | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) - columna Ecosistema | "www.cenigaa.org - Inicio" | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) - copyright | "www.cenigaa.org" inline | ✅ |

✅ Conforme a `CENIGAA_CONTEXT.md §6 (Coherencia ecosistémica)`.

### Enlaces a gaaialab.cenigaa.org

- ✅ [Footer.jsx](src/components/layout/Footer.jsx) - columna Ecosistema CENIGAA
- ✅ [Footer.jsx](src/components/layout/Footer.jsx) - sub-columna "Desarrollado por"
- ✅ [Equipo.jsx](src/components/sections/Equipo.jsx) - card destacada Jorge Chavarro
- ✅ [Equipo.jsx](src/components/sections/Equipo.jsx) - card GAA+IA Lab
- ✅ [SobreObservatorio.jsx](src/components/sections/SobreObservatorio.jsx) - bloque "La red ROGAA-Huila"

Todos con `target=_blank rel=noopener noreferrer`.

### Email institucional

- ✅ `mailto:info@cenigaa.org` en Footer (sección contacto)
- ✅ `mailto:info@cenigaa.org` en Biblioteca (call-to-collaborate)

### Hub central observatorios

🟡 No hay enlace a `observatorios.cenigaa.org` - el hub aún no existe (`CENIGAA_CONTEXT.md §3` lo marca "📋 Por crear"). El enlace a `obs-suelos-huila.cenigaa.org` fue **ocultado** del Footer en v1.0.1 (commit `5c40948`) para evitar 404s hasta que el subdominio se publique.

### Audit de enlaces externos

✅ **Todos los `target="_blank"` tienen `rel="noopener noreferrer"`**, incluyendo el atributo HTML del attribution de Leaflet (OpenStreetMap / CARTO) - corregido explícitamente en la pasada de calidad de Sesión 5.

---

## 8. Datos científicos

### Cobertura

| Métrica | Valor |
|---|---|
| Total de estaciones aptas | **150** |
| Estaciones con sensor de precipitación PT_4 | 149 |
| Período de la línea base | **1930 – 2017 · 87 años** |
| Estación más antigua | **APTO BENITO SALAS** (Neiva, código `21115020`) - inicio 1930 |
| Municipios cubiertos | **37** (todo el departamento del Huila) |
| Bounding box | `1.55, -76.65` ↔ `3.85, -74.50` |

### Fuente y trazabilidad

| Capa | Origen |
|---|---|
| Datos primarios | **IDEAM** - Red Nacional de Estaciones Climatológicas |
| Procesamiento | **CENIGAA** vía base `CCYVCE_DB.db` |
| Convenio que financió la sistematización | **SGR-FCTeI Convenio Especial de Cooperación 124 de 2015** |
| Metodología | **Domínguez Calle, E.A. (2018)** - *Cambio climático y variabilidad climática extrema en el Huila*. ISBN 978-620-2-16957-8 |

### Variables analizadas por estación

Cada archivo `estacion_{CODIGO}.json` contiene, para PT_4 (Precipitación total mensual, mm/mes):
- Serie mensual completa (`serie_mensual.fechas`, `valores`) y serie anual (`serie_anual`)
- **Estacionalidad** - medias multianuales por mes + `mes_max` / `mes_min` (patrón bimodal Huila: Abr-May y Oct-Nov)
- **Inercia** - `acf_lag1`, `acf_lag12`, serie ACF 1–12
- **Tendencia** - Mann-Kendall: `direccion`, `significativa`, `p_valor`, `pendiente_anual` (Theil-Sen), `cambio_total`
- **Ciclos seculares** - medias móviles 10 años
- **ENSO** - nota cualitativa, interpretación y fuente (correlación inversa con Niño 3.4, MEI, OMI)
- **Distribución** - ajuste (Gumbel mayoritariamente en mensual; Log-Gamma para anual), KS p-valor, parámetros, media, desv. std.

### Resumen departamental (`resumen_departamento.json`)

- Tendencias PT_4 globales: **25 decreciente · 12 creciente · 113 sin tendencia** (37 con tendencia estadísticamente significativa)
- Patrón espacial: tendencia decreciente significativa al sur del Huila, creciente al norte (1985–2015)
- Distribución mensual dominante: **Gumbel** con asimetría derecha; anual: **Log-Gamma**

### Capa cartográfica

⚠ **`municipios_huila.geojson` contiene 37 features tipo `Point` (centroides), no polígonos.** En `MapaEstaciones.jsx` se renderiza con un `pointToLayer` discreto + el `style` para polígonos preparado para que aplique automáticamente cuando se reemplace el archivo. Necesario para una visualización por municipio completa (choropleths futuros).

### Descargas públicas

- ✅ **CSV catálogo** - `/data/catalogo_estaciones_CENIGAA.csv` (151 líneas, ~12 KB; 9 campos: NOMBRE, CODIGO, MUNICIPIO, CORRIENTE, ALTITUD_msnm, INICIO, FIN, N_MESES, ESTADO). Botón en `#datos`.
- ✅ **JSON por estación** - accesible vía la URL del archivo (`/data/estacion_{CODIGO}.json`). No expuesto aún como botón explícito en el panel; el usuario lo recibe al click vía `useEstacion`.

---

## 9. Resumen ejecutivo

### Estado general

🟢 **MVP completo + fase 1 de cierre técnico en producción.** Las 11 secciones planeadas están implementadas. Los pendientes que arrastraban las versiones anteriores (P0 SEO, P1 secciones placeholder, P1 logo placeholder, P1 regresión de Recharts, P2 imágenes WebP, P3 robots/sitemap) están **resueltos**. Quedan únicamente pendientes de baja prioridad: polígonos reales del Huila, baseline Lighthouse y activación EN.

### Hallazgos de la auditoría (positivos)

- ✅ Identidad visual al 100% conforme manual SIC (4 colores Pantone + Inter)
- ✅ **Logos oficiales SIC en el chrome del sitio (v1.2.0)** - `CENIGAA.svg` color en Header, `logo_cenigaa_T_Blanco.png` en Footer navy
- ✅ Coherencia ecosistémica completa: header y footer enlazan a www.cenigaa.org y gaaialab.cenigaa.org con `rel` correcto
- ✅ JSON-LD multi-entidad (`ResearchOrganization` + `WebSite` + `Dataset`) bien estructurado, ideal para Google Dataset Search
- ✅ **Activos SEO completos (v1.2.0)** - favicon, apple-touch, og-image, robots.txt y sitemap.xml todos presentes
- ✅ Routing SPA con fallback Azure correctamente configurado (`/efrain` resuelve en deep-link)
- ✅ **Code splitting completo (v1.2.0)** - el chunk de Recharts (374 KB) vuelve a estar fuera del bundle inicial gracias a `React.lazy + Suspense`
- ✅ Pasada de calidad: alts descriptivos en todos los `<img>`, `rel=noopener` en todos los externos, attribution de Leaflet corregido
- ✅ Filtros del mapa con conteo de leyenda derivado de la misma lista filtrada (imposible que se desincronicen)
- ✅ **Sección política pública (v1.0.1)** - 12 instrumentos oficiales en 4 niveles con enlaces directos a UNFCCC, Función Pública, Minambiente, Gobernación del Huila y Alcaldía de Neiva
- ✅ **Sección resumen hallazgos (v1.1.0)** - visualización Mann-Kendall (25 / 112 / 12) con `BarChart` Recharts + 4 hallazgos narrativos + bloque metodológico Theil-Sen / Gumbel / Log-Gamma + cita ISBN
- ✅ **Pasada tipográfica v1.1.0** - 56 em-dashes (U+2014) eliminados de 16 archivos según contexto
- ✅ **Imágenes críticas en WebP (v1.2.0)** - reducción agregada de ~12 MB en `/efrain` (banner Nevado-Tatacoa de 14 MB → 2.1 MB)

### Pendientes (priorizados)

| Prio | Item | Notas |
|---|---|---|
| 🟡 P2 | Reemplazar `municipios_huila.geojson` por polígonos reales | El style polygon ya está cableado; necesario para choropleths futuros |
| 🟡 P2 | Convertir a WebP `Gobernacion_Huila.png` y `Efrain_isologo.jpg` | Brecha menor; bajo impacto en LCP |
| 🟢 P3 | Correr Lighthouse y registrar baseline (objetivo ≥ 90 las 4 categorías) | Sin medición previa; v1.2.0 es el momento ideal para el primer baseline |
| 🟢 P3 | Habilitar contenido EN cuando se traduzca (`src/data/content.js` ya tiene la estructura) | Sólo cambiar `LANG = 'en'` |
| 🟢 P3 | Trackear `CENIGAA_CONTEXT.md` en git si aún no lo está | Archivo obligatorio según CONTEXT §2 |
| 🟢 P3 | Enviar `sitemap.xml` a Google Search Console y Bing Webmaster Tools | Acelera la primera indexación |
| 🟢 P3 | Resolver conflictos de merge en este STATUS doc consolidados a v1.2.0 | (cerrado en este commit) |

### Cerrado en v1.2.0 (desde v1.1.0)

- ✅ ~~P1 regresión `charts-*.js` (374 KB) en bundle inicial~~ - resuelta en commit `0b6ee0a` con `React.lazy + Suspense` y nuevo módulo `LazyBarChart.jsx`
- ✅ ~~P2 logo placeholder en Header y Footer~~ - sustituido por `CENIGAA.svg` (color) y `logo_cenigaa_T_Blanco.png` (blanco)
- ✅ ~~P2 imágenes críticas en JPG/PNG~~ - 4 conversiones WebP con `sharp-cli q=82`; banner Nevado-Tatacoa: 14 MB → 2.1 MB
- ✅ ~~P3 `public/robots.txt`~~ - creado con `Allow: /` + apuntando al sitemap
- ✅ ~~P3 `public/sitemap.xml`~~ - 2 URLs (`/` priority 1.0, `/efrain` priority 0.8)

### Cerrado en v1.1.0 (desde v1.0.1)

- ✅ ~~P1 sección `#resumen`~~ - implementada en commit `77c135f` con métricas, `BarChart` Mann-Kendall y 4 hallazgos
- ✅ ~~Em-dashes visibles en textos del sitio~~ - pasada tipográfica de 56 reemplazos en 16 archivos (sólo se mantuvieron los 10 placeholders técnicos de `PanelEstacion.jsx`)
- ✅ ~~Código muerto `PlaceholderSection` en App.jsx~~ - eliminado al cerrar las dos últimas secciones reales

### Cerrado en v1.0.1 (desde v1.0.0)

- ✅ ~~P0 favicon · apple-touch-icon · og-image~~ - resueltos en commit `5c40948` (public/ y build/)
- ✅ ~~P1 sección `#politica`~~ - implementada en commit `4b95d1c` con 12 instrumentos y enlaces oficiales
- ✅ ~~Riesgo obs-suelos-huila enlazado~~ - ocultado en Footer en commit `5c40948`

### Riesgos operacionales

- ✅ ~~`obs-suelos-huila.cenigaa.org` enlazado en el Footer~~ - **resuelto en v1.0.1**: el `EcoLink` quedó comentado en `Footer.jsx` hasta que el subdominio se publique.
- 🟡 La estructura ES/EN en `src/data/content.js` **no está conectada** a los componentes - Hero, Header y Footer tienen los strings hardcoded. El comentario de `global.css` documenta cómo activar EN pero requiere refactor.
- 🟢 `staticwebapp.config.json` usa `navigationFallback: /index.html` - correcto para SPA según la advertencia explícita de `CENIGAA_CONTEXT.md §2` ("Solo usar en SPAs").

### Atribución científica

Cualquier uso académico o institucional debe citar:
> Domínguez Calle, E.A., Chavarro Díaz, J.A., Velasco Sánchez, A.N., Chavarro Díaz, J.I., De León Pérez, D.R., Garrido, A.E., Cañón Ramos, M.Á., & Parra Díaz, C.F. (2018). *Cambio Climático y Variabilidad Climática Extrema en el Huila: Herramientas para la Caracterización de la Amenaza Hidroclimática*. Editorial Académica Española. ISBN 978-620-2-16957-8.
> + **CENIGAA (2026)** - Observatorio Climático del Huila «Efraín Domínguez Calle», procesamiento y publicación de los datos 1930–2017. Última actualización del nodo: junio 2026.

---

## 10. Historial de versiones

| Versión | Fecha | Commit | Hito |
|---|---|---|---|
| **v1.2.0** | **2026-06-09** | `0b6ee0a` | **Fase 1 de cierre técnico.** Lazy-load de Recharts vía `React.lazy + Suspense` (nuevo `LazyBarChart.jsx`, chunk `charts-*.js` vuelve a no estar en bundle inicial). Creación de `public/robots.txt` y `public/sitemap.xml` (con `/` y `/efrain`). Sustitución del logo placeholder por activos oficiales SIC (`CENIGAA.svg` en Header sobre fondo claro, `logo_cenigaa_T_Blanco.png` en Footer sobre fondo navy). Conversión a WebP de 4 imágenes críticas con `sharp-cli q=82`: Nevado-Tatacoa (14 MB → 2.1 MB, 85% reducción) y los 3 retratos de Efraín; referencias actualizadas en `HomenajeEfrain.jsx`. |
| **v1.1.0** | **2026-06-03** | `77c135f` | **MVP completo (11/11 secciones).** Cierre de la última sección pendiente `#resumen` (Hallazgos: 3 métricas grandes, `BarChart` Mann-Kendall, 4 tarjetas de hallazgos y nota metodológica con cita ISBN) + pasada tipográfica eliminando 56 em-dashes visibles + eliminación del componente muerto `PlaceholderSection`. Regresión controlada: `charts-*.js` deja de ser lazy en home (resuelta luego en v1.2.0). |
| **v1.0.1** | **2026-06-03** | `4b95d1c` | Cierre de P0 SEO (favicon + apple-touch-icon + og-image), ocultamiento del enlace prematuro a `obs-suelos-huila` e implementación de la sección **#politica** con 12 instrumentos oficiales en 4 niveles (Global / Nacional / Departamental / Municipal) y enlaces a fuentes del Estado colombiano y organismos internacionales. |
| **v1.0.0** | **2026-05-18** | `7eb02e0` | Creación del documento. Estado del nodo tras cierre del MVP (Sesiones 1–5 + correcciones de período de datos, filtros del mapa, catálogo descargable, sección Sobre, sección Equipo y pasada de calidad). |

### Antecedentes (commits de referencia del repo)

```
0b6ee0a  feat: fase1 cierre - lazy recharts, robots, sitemap, logos, webp ← v1.2.0
30a5c0b  ignore macOS DS_Store files
9eab46f  Esclogos cenigaa                                                 ← logos oficiales en assets/
e2b9aa2  actualizado el STATUS                                            (merge con marcadores sin resolver, consolidado aquí)
77c135f  feat: seccion resumen hallazgos + fix em-dash en textos          ← v1.1.0
cac0be6  docs: actualizar CENIGAA_STATUS a v1.0.1                         ← v1.1.0 (meta)
4b95d1c  feat: seccion politica publica cambio climatico #politica        ← v1.0.1
5c40948  fix: assets P0 favicon+og-image, ocultar enlace obs-suelos       ← v1.0.1
e64139d  docs: crear CENIGAA_STATUS_obs-clima-huila.md v1.0.0
7eb02e0  feat: MVP complete - about, team sections, quality pass          ← v1.0.0
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

*CENIGAA_STATUS_obs-clima-huila.md v1.2.0 - 2026-06-09*
*Auditor: agente Claude Code · Branch `main` · Repositorio `cenigaa-obs-clima-huila`*
*Próxima revisión sugerida: tras correr el primer baseline Lighthouse, al reemplazar `municipios_huila.geojson` por polígonos reales, o al activar el contenido EN.*
