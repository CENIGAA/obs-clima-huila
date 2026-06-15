# CENIGAA_STATUS_obs-clima-huila.md
**Estado del nodo — obs-clima-huila.cenigaa.org**
**Observatorio Climático del Huila «Efraín Antonio Domínguez Calle»**
**Nodo 1 de la Red ROGAA-Huila**

| Versión | Fecha | Branch | Último commit | Estado |
|---|---|---|---|---|
| v1.2.0 | 2026-06-14 | `main` | `c6496a9` — *feat: home solo Hero; cada item del nav pasa a ruta dedicada* | ✅ **Producción · Arquitectura multi-ruta + Fase 2 en scaffolding** |

> Documento de auditoría — refleja el estado real del repositorio `cenigaa-obs-clima-huila` el 2026-06-14. v1.2.0 cubre tres bloques de cambio sobre v1.1.0: (a) **refactor estructural** del sitio (la home queda exclusivamente con el Hero y cada item del nav pasa a su propia ruta), (b) **groundwork de Fase 2** del pipeline IDEAM 2017–2026 (notebook Jupyter, lista de 150 estaciones poblada, dependencias Python), y (c) **cierre de Fase 1** del commit externo `0b6ee0a` (lazy recharts, robots.txt, sitemap.xml, logos oficiales, WebP). Resuelve además 5 marcadores de conflicto de merge que el documento arrastraba desde el commit `e2b9aa2`.

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
| Pipeline de datos (Fase 2) | Notebook Jupyter en `data/pipeline/` — **local-only**, fuera del build |

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
| Procesamiento Fase 2 | Python 3.9 + pandas 2.2 + numpy 2.0 + scipy 1.13 + matplotlib 3.9 + seaborn 0.13 + sodapy 2.2 + jupyter 4.5 | local |

### Árbol de directorios (real, sin `node_modules` ni `build`)

```
cenigaa-obs-clima-huila/
├── CENIGAA_CONTEXT.md                       ← tracked desde commit externo previo
├── CENIGAA_STATUS_obs-clima-huila.md        ← este archivo
├── LICENSE
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── azure-static-web-apps.yml                ← raíz (legacy)
├── .github/workflows/
│   └── azure-static-web-apps-jolly-forest-0b932a410.yml
├── .gitignore                               ← extendido en v1.2.0: data/ *.pdf *.db *.sqlite outputs/
├── public/
│   ├── staticwebapp.config.json
│   ├── favicon.svg                          ← v1.0.1
│   ├── apple-touch-icon.png                 ← v1.0.1
│   ├── og-image.jpg                         ← v1.0.1
│   ├── robots.txt                           ← v1.2.0 · commit externo 0b6ee0a
│   ├── sitemap.xml                          ← v1.2.0 · commit externo 0b6ee0a
│   ├── assets/
│   │   ├── Nevado tatacoa.jpg + Nevado tatacoa.webp     ← WebP añadido
│   │   ├── efrain/                          (5 jpg + 4 webp + 1 isologo · 10 archivos)
│   │   └── logos/                           (CAM.svg, CENIGAA.svg, Gobernacion_Huila.png, logo_cenigaa_T_Blanco.png)
│   └── data/
│       ├── catalogo_estaciones_CENIGAA.csv          ← descargable público
│       ├── estaciones.json                          (150 estaciones)
│       ├── resumen_departamento.json
│       ├── municipios_huila.geojson                 (37 features tipo Point)
│       └── estacion_*.json                          (150 archivos por estación)
├── data/                                    ← directorio LOCAL · gitignored
│   ├── pipeline/
│   │   ├── CC_VCE_Huila_Fase2_Pipeline.ipynb       ← 23 celdas (9 md + 14 código)
│   │   ├── estaciones_fase1.json                    (150 entradas con código, nombre, municipio)
│   │   └── outputs/{series_extendidas, control_calidad, variabilidad_fase2}/
│   └── referencias/
│       └── CC_VCE_Huila_2018.pdf                    (libro fuente · 33.7 MB)
└── src/
    ├── main.jsx
    ├── App.jsx                              ← BrowserRouter con 9 rutas (Layout DRY)
    ├── hooks/
    │   └── useDataLoader.js                 (useEstaciones, useEstacion, useResumenDepartamento)
    ├── data/
    │   ├── content.js                       (estructura ES/EN preparada — no activa)
    │   └── politicaClimatica.js             ← v1.0.1 · 4 niveles, 12 instrumentos
    ├── styles/
    │   ├── tokens.css                       (tokens SIC)
    │   └── global.css                       (reset + @tailwind + utilidades)
    ├── components/layout/
    │   ├── Header.jsx                       ← v1.2.0 · NavLink + Inicio + nombre clickable + logo SVG oficial
    │   └── Footer.jsx                       ← v1.2.0 · EcoLink interno vs externo
    └── components/sections/
        ├── Hero.jsx                         ← v1.2.0 · CTAs con <Link>
        ├── MapaEstaciones.jsx               (con Filtros y Leyenda inline)
        ├── PanelEstacion.jsx                (4 tabs: Estacionalidad / Tendencia / ENSO / Distribución)
        ├── SobreObservatorio.jsx
        ├── ComoFunciona.jsx                 ← v1.2.0 · Link a /mapa
        ├── Biblioteca.jsx
        ├── Equipo.jsx
        ├── DatosAbiertos.jsx                ← v1.2.0 · Link a /mapa
        ├── Aliados.jsx
        ├── PoliticaSection.jsx              ← v1.0.1 · /politica
        ├── ResumenSection.jsx               ← v1.1.0 · /resumen (con LazyBarChart)
        ├── LazyBarChart.jsx                 ← v1.1.0 · code-split de Recharts
        └── HomenajeEfrain.jsx               (ruta /efrain)
```

### Chunks de producción (output Vite tras refactor v1.2.0)

| Chunk | Tamaño | Gzip | Contenido |
|---|---:|---:|---|
| `index-*.js` | 131 KB | 38.0 KB | App shell + router + secciones (sube ligeramente al recibir Inicio + Layout) |
| `LazyBarChart-*.js` | 1.1 KB | 0.6 KB | Wrapper alrededor de `BarChart` (carga sólo cuando se monta `ResumenSection`) |
| `map-*.js` | 289 KB | 88.5 KB | leaflet + react-leaflet (sólo `/mapa`) |
| `charts-*.js` | 374 KB | 110.3 KB | Recharts (sólo `/mapa` panel y `/resumen` cuando se abre cada ruta) |
| `icons-*.js` | 21 KB | 6.0 KB | lucide-react |
| `vendor-*.js` | 0.06 KB | 0.07 KB | react / react-dom (hoisted por Rollup a otros chunks) |
| `index-*.css` | 55.7 KB | 14.5 KB | Tailwind compilado + Leaflet CSS + tokens |

> ✅ **Regresión de `charts-*.js` (introducida en v1.1.0) mitigada en v1.2.0 sin cambiar el bundling.** Como ahora `/resumen` es su propia ruta, el chunk pesado de Recharts ya no se descarga en `/` — sólo cuando el usuario navega a `/resumen` o `/mapa`. La home queda en `index + icons + vendor ≈ 152 KB` (44 KB gzip).

---

## 3. Identidad visual

### Tokens SIC implementados ([src/styles/tokens.css](src/styles/tokens.css))

| Token | Valor | Pantone | Uso |
|---|---|---|---|
| `--color-brand-blue` | `#4A60D8` | 2726c | Agua/Ambiente · acento primario · CTAs · ruta activa en nav |
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

✅ **Cerrado en commit externo `0b6ee0a` (logos oficiales).** El logo del Header ahora usa `<img src="/assets/logos/CENIGAA.svg" />` real (oficial SIC, h-8) en vez del placeholder de 3 círculos. El Footer mantiene el wordmark con isotipo + texto CENIGAA en blanco para contraste sobre fondo navy. El archivo `public/assets/logos/logo_cenigaa_T_Blanco.png` está disponible como versión PNG transparente blanca para usos sobre fondos oscuros.

---

## 4. Contenido y secciones (arquitectura multi-ruta v1.2.0)

Hasta v1.1.0 todas las secciones se renderizaban apiladas en la home (`/`). **A partir de v1.2.0 cada item del menú vive en su propia ruta**; la home queda exclusivamente con el Hero como portada institucional. Las secciones que no son items del nav (ComoFunciona, Aliados, Dedicatoria) se reubican en la ruta semánticamente adyacente.

### Mapa rutas → contenido

| Ruta | Label nav | Contenido renderizado | Estado |
|---|---|---|---|
| `/` | **Inicio** | `Hero` (94 años de registros, 150 estaciones, 37 municipios, CTAs a /mapa y /datos) | ✅ |
| `/mapa` | **Mapa** | `MapaEstaciones` (filtros municipio/tendencia/estado, leyenda en vivo, panel 4 tabs vía `PanelEstacion`) | ✅ |
| `/sobre` | **Sobre** | `SobreObservatorio` (origen / red / ciencia abierta) + `ComoFunciona` (6 componentes metodológicos) + `Aliados` (Gobernación, CAM, CENIGAA, IDEAM) | ✅ |
| `/resumen` | **Resumen** | `ResumenSection` (3 métricas grandes, `LazyBarChart` Mann-Kendall 25/112/12, 4 tarjetas de hallazgos, nota metodológica con cita ISBN) | ✅ |
| `/politica` | **Política pública** | `PoliticaSection` (12 instrumentos en 4 niveles: Global · Nacional · Departamental · Municipal, enlaces oficiales) | ✅ |
| `/biblioteca` | **Biblioteca** | `Biblioteca` (6 referencias curadas con APA y badges) | ✅ |
| `/equipo` | **Equipo** | `Equipo` (Jorge Chavarro destacado + Grupo Hidroinformática + GAA+IA Lab) + banda `Dedicatoria` memorial a Efraín | ✅ |
| `/datos` | **Datos** | `DatosAbiertos` (CSV catálogo descargable + cita APA + apuntador al panel de estación) | ✅ |
| `/efrain` | (no en nav) | `HomenajeEfrain` (banner Nevado-Tatacoa, retrato, biografía, blockquote, ficha del libro con ISBN) | ✅ |

### Header de navegación

- **Desktop**: 8 items (`Inicio · Mapa · Sobre · Resumen · Política pública · Biblioteca · Equipo · Datos`) + CTA externo "Red ROGAA → www.cenigaa.org" como pill navy.
- **Item activo**: `NavLink` de react-router pinta el label en `#4A60D8` y la barra inferior queda al 100% (`after:w-full`) — feedback inmediato de en qué ruta estás.
- **Nombre del nodo "Observatorio Climático del Huila"** es ahora un `<Link to="/">` con micro-interacción del icono Cloud (scale-110 en hover) — segunda ruta para volver al inicio.
- **Móvil**: mismas 8 entradas en overlay, mismo estado activo con fondo `#EEF1FB`.

### Footer

- **EcoLink refactorizado**: acepta `to` (rutas internas via react-router `<Link>`, sin reload) o `href` (URLs externas con `target=_blank rel=noopener`).
- **Recursos** apunta a `/datos`, `/biblioteca`, `/mapa`, `/efrain` y el repo de GitHub (externo).
- **Ecosistema CENIGAA** apunta a `www.cenigaa.org`, `gaaialab.cenigaa.org`, y el "← estás aquí" usa `to="/"` (ya no la URL absoluta).
- El enlace prematuro a `obs-suelos-huila.cenigaa.org` sigue comentado desde v1.0.1.

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
- ✅ `Dataset` — 150 estaciones, `temporalCoverage: 1930-01-01/2017-12-31`, `spatialCoverage` con bounding box del Huila, `sourceOrganization: IDEAM`, `variableMeasured` (precipitación, MK, ENSO, distribuciones), `license: CC-BY 4.0`, `citation` APA al libro CC_VCE Huila

### Activos SEO

| Archivo / recurso | Estado | Detalle |
|---|---|---|
| `public/favicon.svg` | ✅ | 364 B · viewBox 32×32 · isotipo CENIGAA (3 círculos brand sobre navy) |
| `public/apple-touch-icon.png` | ✅ | 180×180 · 5 KB |
| `public/og-image.jpg` | ✅ | 1200×630 · 83 KB |
| `public/robots.txt` | ✅ **Añadido en v1.2.0** (commit externo `0b6ee0a`) | Allow `/` + apunta a `sitemap.xml` |
| `public/sitemap.xml` | ⚠ **Presente pero desactualizado** | 2 URLs (`/` y `/efrain`); tras refactor v1.2.0 deberían listarse las 8 rutas (`/mapa`, `/sobre`, `/resumen`, `/politica`, `/biblioteca`, `/equipo`, `/datos` + las dos actuales) |

> ⚠ **Acción P1 detectada en v1.2.0**: regenerar `sitemap.xml` con las 9 URLs del nuevo árbol de rutas. Sin esto, Google sólo crawlea `/` y `/efrain` desde el sitemap; igual descubrirá las demás por enlace interno pero perdemos `lastmod` y `priority` por ruta.

---

## 6. Rendimiento

### Estrategia de bundling

`vite.config.js` define `manualChunks` separando `leaflet`, `react-leaflet`, `recharts` y `lucide-react`. **Mejora en v1.2.0**: como cada sección pesada vive en su propia ruta, los chunks asociados ya no se cargan en home:

- `/` → carga sólo `index + vendor + icons` (≈ 152 KB sin gzip)
- `/mapa` → suma `map-*.js` (289 KB) cuando se navega
- `/resumen` y panel de estación → suman `charts-*.js` (374 KB) bajo demanda
- `ResumenSection` además usa `React.lazy(() => import('./LazyBarChart'))` (commit externo `0b6ee0a`) → `LazyBarChart-*.js` (1.1 KB) se importa después del primer paint

### Imágenes

| Métrica | Valor |
|---|---|
| Total imágenes en `public/assets/` | 13 archivos |
| WebP | **5** (`Nevado tatacoa.webp` + 4 retratos de Efraín) |
| JPG/JPEG/PNG/SVG | 8 |
| Con `loading="lazy"` | varios (Aliados, retratos Efraín) |
| Con `loading="eager"` | retrato Efraín en `/efrain` (LCP apropiado) |

✅ **Mejora sustancial sobre v1.1.0** (commit externo `0b6ee0a`): de 1/10 a 5/13 imágenes en WebP. Las críticas para LCP de `/efrain` y home (Nevado tatacoa) ya están en WebP. Pendiente menor: los logos de Gobernación (PNG), `Efrain-Dominguez3.jpg`, `Efrain_isologo.jpg` y `Efraín.JPG` (este último también convertido como `.webp` paralelo).

### Lighthouse

🟡 **Sin baseline registrada todavía.** Recomendado correr ahora que la arquitectura multi-ruta cambió el perfil de carga:

```
npx lighthouse https://obs-clima-huila.cenigaa.org --view --preset=desktop
npx lighthouse https://obs-clima-huila.cenigaa.org/mapa --view --preset=desktop
```

Objetivo `CENIGAA_CONTEXT.md §6`: ≥ 90 en Performance / Accessibility / Best Practices / SEO. La home v1.2.0 debería superarlo cómodamente (152 KB iniciales · sin charts/leaflet/recharts hasta navegar).

### Otras optimizaciones

- ✅ Carga lazy de datos por estación: `useEstacion(codigo)` con `AbortController` para cancelar fetches obsoletos
- ✅ Mapa: `scrollWheelZoom: false` — evita captura accidental del scroll de la página
- ✅ Tiles CartoDB Positron (CDN público, gratis, atribuido) — preconnect implícito por subdominio
- ✅ Google Fonts con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`
- ✅ CSP estricta en `staticwebapp.config.json` (script-src 'self' + img-src https permite tiles)
- ✅ `React.lazy(LazyBarChart)` para diferir Recharts en `/resumen`

---

## 7. Coherencia ecosistémica

### Enlaces salientes a www.cenigaa.org

| Ubicación | Tratamiento | rel/target |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) — breadcrumb superior izquierdo | Logo CENIGAA oficial (`/assets/logos/CENIGAA.svg`) | ✅ `target=_blank` `rel=noopener noreferrer` |
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

### Navegación interna SPA (v1.2.0)

- **Header**: `NavLink` con estado activo visual; sin más anchors `#`. El item "Inicio" y el clic sobre el nombre del nodo llevan a `/`.
- **Hero**: CTAs "Explorar mapa" y "Descargar datos" usan `<Link>` (SPA, sin reload).
- **Footer Recursos**: `<EcoLink to="/datos">`, `to="/biblioteca"`, `to="/mapa"`, `to="/efrain"`.
- **ComoFunciona y DatosAbiertos**: los anchors `#mapa` se reemplazaron por `<Link to="/mapa">`.

✅ El único `#anchor` que sobrevive es el `skip-to-content` (accesibilidad pura, apunta a `#main-content`).

### Email institucional

- ✅ `mailto:info@cenigaa.org` en Footer (sección contacto)
- ✅ `mailto:info@cenigaa.org` en Biblioteca (call-to-collaborate)

### Hub central observatorios

🟡 No hay enlace a `observatorios.cenigaa.org` — el hub aún no existe (`CENIGAA_CONTEXT.md §3` lo marca "📋 Por crear"). El enlace a `obs-suelos-huila.cenigaa.org` sigue comentado en Footer desde v1.0.1.

### Audit de enlaces externos

✅ Todos los `target="_blank"` tienen `rel="noopener noreferrer"`, incluyendo el atributo HTML del attribution de Leaflet (OpenStreetMap / CARTO).

---

## 8. Datos científicos

### Cobertura (web pública — Fase 1)

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

⚠ **`municipios_huila.geojson` contiene 37 features tipo `Point` (centroides), no polígonos.** En `MapaEstaciones.jsx` se renderiza con un `pointToLayer` discreto + el `style` para polígonos preparado para que aplique automáticamente cuando se reemplace el archivo. Necesario para visualización por municipio completa (choropleths futuros).

### Descargas públicas

- ✅ **CSV catálogo** — `/data/catalogo_estaciones_CENIGAA.csv` (151 líneas, ~12 KB; 9 campos: NOMBRE, CODIGO, MUNICIPIO, CORRIENTE, ALTITUD_msnm, INICIO, FIN, N_MESES, ESTADO). Botón en `/datos`.
- ✅ **JSON por estación** — accesible vía la URL del archivo (`/data/estacion_{CODIGO}.json`); el cliente lo recibe al click vía `useEstacion`.

### Fase 2 — Pipeline IDEAM 2017-2026 (groundwork v1.2.0, **local-only**)

Infraestructura preparada en `data/pipeline/` (ignorada por git):

| Componente | Estado |
|---|---|
| `CC_VCE_Huila_Fase2_Pipeline.ipynb` | ✅ Creado — 23 celdas (9 markdown + 14 código) cubriendo: CONFIG centralizado, catálogo IDEAM via Socrata, descarga PT/T con filtro SoQL en query, QC dual Grubbs+MAD con regla "2 de 3", integración SQLite con campo `fuente=IDEAM_API_2026`, comparativo Fase 1/2 y reaplicación de los 6 componentes metodológicos sobre series extendidas |
| `estaciones_fase1.json` | ✅ Poblado con **150 entradas** desde `public/data/estaciones.json` (código + nombre + municipio) |
| `outputs/{series_extendidas, control_calidad, variabilidad_fase2}/` | ✅ Directorios creados (vacíos hasta primera corrida) |
| `referencias/CC_VCE_Huila_2018.pdf` | ✅ Libro fuente reubicado desde la raíz del repo |
| Dependencias Python | ✅ Instaladas: pandas 2.2.3, numpy 2.0.2, scipy 1.13.1, matplotlib 3.9.4, seaborn 0.13.2, sodapy 2.2.0, jupyter 4.5.8 |
| Smoke test celda 1 | ✅ Ejecutado limpio — CONFIG cargado, imports OK, directorios creados |
| Corrida real Módulo 1+ (catálogo IDEAM) | 📋 Pendiente — requiere conectividad a `datos.gov.co` |
| Integración con `CCYVCE_DB.db` (Módulo 4) | 📋 Pendiente — requiere copiar la base original a `data/` |

> El campo **`fuente=IDEAM_API_2026`** en cada registro nuevo es el mecanismo de trazabilidad que permitirá distinguir los datos del estudio original (`CCYVCE_DB`) de los datos del API en publicaciones derivadas, sin perder linaje.

---

## 9. Resumen ejecutivo

### Estado general

🟢 **MVP completo en producción · arquitectura multi-ruta · Fase 2 en scaffolding.** Las 11 secciones planeadas están implementadas con contenido final (cero placeholders). La home queda exclusivamente con el Hero como portada institucional. La infraestructura de Fase 2 está montada localmente y lista para la primera corrida real cuando se disponga de conectividad al API IDEAM.

### Hallazgos positivos

- ✅ Identidad visual al 100% conforme manual SIC (4 colores Pantone + Inter + logo SVG oficial)
- ✅ Coherencia ecosistémica completa: header y footer enlazan a `www.cenigaa.org` y `gaaialab.cenigaa.org` con `rel` correcto
- ✅ JSON-LD multi-entidad (`ResearchOrganization` + `WebSite` + `Dataset`) bien estructurado para Google Dataset Search
- ✅ Routing SPA con `navigationFallback` de Azure correctamente configurado (deep-links resuelven directamente)
- ✅ Code splitting agresivo — `charts-*.js` no se carga en home; `map-*.js` solo en `/mapa`; `LazyBarChart` también lazy en `/resumen`
- ✅ Pasada de calidad: alts descriptivos en todos los `<img>`, `rel=noopener` en todos los externos, attribution de Leaflet corregido
- ✅ Filtros del mapa con conteo de leyenda derivado de la misma lista filtrada (imposible que se desincronicen)
- ✅ Sección **/politica** (v1.0.1) — 12 instrumentos oficiales en 4 niveles con enlaces a UNFCCC, Función Pública, Minambiente, Gobernación del Huila y Alcaldía de Neiva
- ✅ Sección **/resumen** (v1.1.0) — visualización Mann-Kendall (25 / 112 / 12) + 4 hallazgos + bloque metodológico con cita ISBN
- ✅ **Refactor multi-ruta v1.2.0** — cada item del nav es una ruta dedicada con estado activo visual; "Inicio" y nombre del nodo permiten volver a `/` desde cualquier punto
- ✅ **Fase 2 scaffolding v1.2.0** — notebook completo de 23 celdas con metodología documentada celda por celda, lista de 150 estaciones poblada, dependencias Python instaladas, smoke test pasado

### Cerrado en v1.2.0 (desde v1.1.0)

- ✅ ~~P0 — refactor estructural: Home solo Hero + rutas dedicadas por sección~~ — commit `c6496a9`
- ✅ ~~Logo CENIGAA placeholder en Header~~ — commit externo `0b6ee0a` (logos oficiales)
- ✅ ~~Imágenes críticas en JPG/PNG (P2)~~ — 5 WebP añadidos en commit externo `0b6ee0a` (cobertura sube de 10% a 38%)
- ✅ ~~`robots.txt` ausente (P3)~~ — añadido en commit externo `0b6ee0a`
- ✅ ~~`sitemap.xml` ausente (P3)~~ — añadido en commit externo `0b6ee0a` (necesita actualización tras refactor, ver P1 abajo)
- ✅ ~~Regresión de `charts-*.js` en home~~ — la arquitectura multi-ruta resolvió la regresión sin tocar bundling; `/resumen` ya no es parte de la home
- ✅ ~~5 conflictos de merge sin resolver en el propio STATUS doc~~ — desarrollados al rebuildear el documento en v1.2.0
- ✅ ~~Fase 2 sin infraestructura local~~ — directorio `data/`, notebook y deps Python operativos

### Cerrado en v1.1.0 (desde v1.0.1)

- ✅ ~~Sección `/resumen` (P1)~~ — commit `77c135f`
- ✅ ~~Em-dashes visibles en textos~~ — pasada tipográfica de 56 reemplazos en 16 archivos
- ✅ ~~Código muerto `PlaceholderSection`~~ — eliminado de App.jsx

### Cerrado en v1.0.1 (desde v1.0.0)

- ✅ ~~P0 favicon · apple-touch-icon · og-image~~ — commit `5c40948`
- ✅ ~~Sección `/politica` (P1)~~ — commit `4b95d1c`
- ✅ ~~Riesgo `obs-suelos-huila` enlazado~~ — comentado en Footer

### Pendientes (priorizados)

| Prio | Item | Notas |
|---|---|---|
| 🟠 P1 | **Regenerar `sitemap.xml` con las 9 rutas** | Hoy lista sólo `/` y `/efrain`; faltan `/mapa /sobre /resumen /politica /biblioteca /equipo /datos`. Actualizar también `<lastmod>` a `2026-06-14` |
| 🟠 P1 | Correr Lighthouse y registrar baseline | Especialmente relevante tras el refactor multi-ruta: home debería estar muy por encima de 90 (152 KB iniciales) |
| 🟠 P1 | Ejecutar primera corrida real del notebook Fase 2 — Módulo 1 (catálogo IDEAM) | Confirma conectividad al API `datos.gov.co/resource/hp9r-jxuu`. Output esperado: 150 estaciones clasificadas A_heredada vs B_nueva |
| 🟡 P2 | Reemplazar `municipios_huila.geojson` por polígonos reales | El `style` polygon ya está cableado; sólo cambiar el archivo |
| 🟡 P2 | Convertir a WebP las imágenes restantes en JPG/PNG | Pendientes: `Gobernacion_Huila.png`, `Efrain-Dominguez3.jpg`, `Efrain_isologo.jpg` y un par más |
| 🟡 P2 | Copiar `CCYVCE_DB.db` a `data/` para habilitar Módulo 4 del pipeline | Sin esto, Módulo 4 emite advertencia y se salta sin tocar nada |
| 🟢 P3 | Habilitar contenido EN cuando se traduzca | `src/data/content.js` ya tiene estructura — sólo cambiar `LANG = 'en'` |
| 🟢 P3 | Implementar Módulo 5b ENSO (17 índices NOAA-CPC) | Marcado explícitamente como "versión futura" en el notebook |
| 🟢 P3 | Actualizar URLs históricas con anchors `#xxx` | Tras refactor multi-ruta, `https://obs-clima-huila.cenigaa.org/#mapa` ya no navega a `/mapa`. Considerar `useEffect` en Home que detecte hash legacy y haga `navigate('/mapa')` |

### Riesgos operacionales

- 🟡 La estructura ES/EN en `src/data/content.js` **no está conectada** a los componentes — Hero, Header y Footer tienen los strings hardcoded. Activar EN requiere refactor.
- 🟡 **Sitemap desincronizado del árbol de rutas v1.2.0** — minoritario para SEO porque Google igualmente descubre las rutas por enlace interno, pero impide control de prioridades.
- 🟢 `staticwebapp.config.json` usa `navigationFallback: /index.html` — correcto para SPA según la advertencia explícita de `CENIGAA_CONTEXT.md §2` ("Solo usar en SPAs").

### Atribución científica

Cualquier uso académico o institucional debe citar:
> Domínguez Calle, E.A., Chavarro Díaz, J.A., Velasco Sánchez, A.N., Chavarro Díaz, J.I., De León Pérez, D.R., Garrido, A.E., Cañón Ramos, M.Á., & Parra Díaz, C.F. (2018). *Cambio Climático y Variabilidad Climática Extrema en el Huila: Herramientas para la Caracterización de la Amenaza Hidroclimática*. Editorial Académica Española. ISBN 978-620-2-16957-8.
> + **CENIGAA (2026)** — Observatorio Climático del Huila «Efraín Domínguez Calle», procesamiento y publicación de los datos 1930–2017. Última actualización del nodo: junio 2026.

---

## 10. Historial de versiones

| Versión | Fecha | Commit | Hito |
|---|---|---|---|
| **v1.2.0** | **2026-06-14** | `c6496a9` | **Refactor arquitectónico + scaffolding Fase 2.** (a) Home queda solo con el Hero; cada item del nav (`Mapa`, `Sobre`, `Resumen`, `Política pública`, `Biblioteca`, `Equipo`, `Datos`) pasa a su propia ruta. Nuevo item "Inicio" + nombre del nodo clickable. Header con `NavLink` de react-router y estado activo visual. Footer `EcoLink` interno vs externo. Hero CTAs con `<Link>`. (b) Groundwork de Fase 2: `.gitignore` extendido a `data/ *.pdf *.db *.sqlite outputs/`, PDF del libro reubicado a `data/referencias/`, notebook Jupyter de 23 celdas con pipeline IDEAM 2017–2026, lista de 150 estaciones poblada desde producción, dependencias Python instaladas, smoke test celda 1 ejecutado. (c) Incorpora cambios externos: lazy `BarChart` en `/resumen`, `robots.txt`, `sitemap.xml`, logos oficiales SIC en Header, 5 imágenes WebP. Resuelve 5 marcadores de conflicto de merge en este propio documento. |
| v1.1.0 | 2026-06-03 | `77c135f` | MVP completo (11/11 secciones). Cierre de la última sección pendiente `#resumen` (Hallazgos: 3 métricas grandes, `BarChart` Mann-Kendall, 4 tarjetas de hallazgos y nota metodológica con cita ISBN) + pasada tipográfica eliminando 56 em-dashes visibles + eliminación del componente muerto `PlaceholderSection`. |
| v1.0.1 | 2026-05-18 | `4b95d1c` / `5c40948` | Cierre de P0 SEO (favicon + apple-touch-icon + og-image), ocultamiento del enlace prematuro a `obs-suelos-huila` e implementación de la sección `#politica` con 12 instrumentos oficiales en 4 niveles (Global / Nacional / Departamental / Municipal). |
| v1.0.0 | 2026-05-18 | `7eb02e0` | Creación del documento. Estado del nodo tras cierre del MVP (Sesiones 1–5 + correcciones de período de datos, filtros del mapa, catálogo descargable, sección Sobre, sección Equipo y pasada de calidad). |

### Antecedentes (commits de referencia del repo)

```
c6496a9  feat: home solo Hero; cada item del nav pasa a ruta dedicada              ← v1.2.0
8e19567  chore: ignorar data/ y reubicar PDF de referencia para Fase 2             ← v1.2.0
6cc164c  Libro CCyVCE                                                              (externo)
0b6ee0a  feat: fase1 cierre - lazy recharts, robots, sitemap, logos oficiales, webp ← v1.2.0 (externo)
30a5c0b  ignore macOS DS_Store files                                                (externo)
9eab46f  Esclogos cenigaa                                                          (externo · logos)
e2b9aa2  actualizado el STATUS                                                     (introdujo los conflictos resueltos en v1.2.0)
77c135f  feat: seccion resumen hallazgos + fix em-dash en textos                   ← v1.1.0
cac0be6  docs: actualizar CENIGAA_STATUS a v1.0.1                                  (meta)
4b95d1c  feat: seccion politica publica cambio climatico #politica                 ← v1.0.1
5c40948  fix: assets P0 favicon+og-image, ocultar enlace obs-suelos                ← v1.0.1
e64139d  docs: crear CENIGAA_STATUS_obs-clima-huila.md v1.0.0
7eb02e0  feat: MVP complete - about, team sections, quality pass                   ← v1.0.0
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

*CENIGAA_STATUS_obs-clima-huila.md v1.2.0 — 2026-06-14*
*Auditor: agente Claude Code · Branch `main` · Repositorio `cenigaa-obs-clima-huila`*
*Próxima revisión sugerida: al regenerar `sitemap.xml` con las 9 rutas (P1), al correr la primera Lighthouse baseline tras el refactor multi-ruta (P1), o al ejecutar la primera corrida real del Módulo 1 del notebook de Fase 2 (P1).*
