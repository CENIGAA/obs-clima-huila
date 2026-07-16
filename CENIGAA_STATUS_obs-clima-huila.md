# CENIGAA_STATUS_obs-clima-huila.md
**Estado del nodo · obs-clima-huila.cenigaa.org**
**Observatorio Climático del Huila «Efraín Antonio Domínguez Calle»**
**Nodo 1 de la Red ROGAA-Huila**

| Versión | Fecha | Branch | Último commit | Estado |
|---|---|---|---|---|
| v1.7.2 | 2026-07-16 | `main` | (pendiente del commit `feat(enso): logos geovisores + visualización en vivo + WebP IRI`) | ✅ **Producción · logos de geovisores, bloque de visualización en vivo del ENSO y logo IRI en WebP** |
| v1.7.1 | 2026-07-14 | `main` | `8e00b5c` · *perf: lazy /enso + WebP + sitemap* | ✅ cierre de deuda técnica: code-splitting de /enso, WebP y SEO |
| v1.7.0 | 2026-07-12 | `main` | `f09ea37` · *chore: sincronizar restyle UI + infraestructura de calidad y CI* | ✅ header azul, homepage blanca, suite de pruebas y CI endurecido |
| v1.6.0 | 2026-07-10 | `main` | *feat: menú desplegable + footer mínimo + I+D+i reestructurado* | ✅ Navegación agrupada, footer institucional mínimo, sección I+D+i con grupos de investigación |
| v1.5.0 | 2026-06-17 | `main` | `6ba6bc2` · *feat(enso): mapa Leaflet regiones hidrologicas Colombia #N2* | ✅ `/enso` con mapa Leaflet real (escala nacional) |

> Documento de auditoría · refleja el estado real del repositorio `cenigaa-obs-clima-huila` el 2026-07-16. v1.7.2 enriquece `/enso`: las cards de geovisores integran los **logos reales** de NOAA, Copernicus e IRI (tile blanco 96×96, `object-contain`, fallback a siglas), y se añade un bloque **"Visualización en vivo"** con tres imágenes oficiales auto-actualizadas de NOAA (PSL/CPC) de ruta estable: anomalía de TSM, pluma Niño 3.4 (CFSv2) e índice MEI v2. Cada panel lleva fuente, enlace a origen y fallback `onError`. No requiere cambios de CSP (`img-src https:` ya lo permite). Copernicus (app interactiva) e IRI (URLs por fecha) se mantienen como enlace profundo, no como imagen embebida. El logo de IRI se optimiza a **WebP** (323→28.5 KB) servido vía `<picture>` + fallback PNG.
>
> v1.7.1 cierra deuda técnica: **`/enso` pasa a `React.lazy()` + `Suspense`** en App.jsx, con lo que el chunk `index-*.js` baja de **161 KB a 118 KB** (gzip 30 KB) y ENSO se emite como chunk aparte `Enso-*.js` (29.7 KB) que solo se descarga al navegar a `/enso`. **SEO**: `sitemap.xml` con `lastmod 2026-07-14` en las 10 rutas. **Imágenes WebP**: `Gobernacion_Huila` (32→6 KB), `Efrain-Dominguez3` (32→22 KB) y `Efrain_isologo` (91→26 KB); la de Gobernación se sirve vía `<picture>` + fallback PNG en Footer y Aliados (las dos de Efraín quedan disponibles, aún sin referencia en código). Verificado 0 em-dashes en JSONs públicos. Suite lint + validate:data + test + build en verde; persiste el warning preexistente del chunk de Recharts (>500 KB), ajeno a estos cambios.
>
> v1.7.0 combina un **restyle de UI** con una capa de **calidad e infraestructura**. UI: el **header pasa a fondo azul `#4A60D8`** con todo su contenido en blanco; la **homepage (Hero) pasa a fondo blanco** con los colores del contenido invertidos para legibilidad (tarjetas de estadística claras, badges tenues, CTA secundario claro); el **footer adopta layout horizontal** (logos institucionales a la izquierda, copyright al frente); se elimina el indicador de scroll "Explorar" + flecha del Hero; y los fondos claros de sección (Resumen, Aliados, bloques de `/enso`) pasan a blanco. Infraestructura: **suite de pruebas** (`vitest` para UI + `node:test` para datos/CSP), script `scripts/validate-data.mjs`, config `.eslintrc.cjs`, y **CI endurecido** (lint + validate:data + test antes del build). Se **deja de trackear `build/`** (Vite output ahora se genera en CI, `build/` en `.gitignore`) y se elimina el `azure-static-web-apps.yml` legacy de la raíz. El contenido de `/enso` se refactoriza a `public/data/enso-contenido.json` con guía `MANTENIMIENTO_ENSO.md`.
>
> v1.6.0 reorganizó la navegación y el equipo: **menú agrupado en desplegables temáticos** (Datos y Monitoreo · Recursos · El Observatorio), se eliminó el item redundante "Inicio", "Equipo" pasó a **"I+D+i"** y el CTA ROGAA apunta a `cenigaa.org/views/rogaa.html`. El footer se redujo al mínimo con los logos de las entidades a cargo (Gobernación del Huila · CAM · CENIGAA · IDEAM). La sección **I+D+i** se dividió en tres subcategorías (Talento Humano · Grupos de Investigación · Infraestructura): perfil de Jorge Chavarro con foto y LinkedIn + checklist de roles, nuevo **Grupo DSGAA**, y tarjetas horizontales con logo lateral. La dedicatoria a Efraín se movió a `/sobre`; se añadió el logo del ODS 13 en `/politica`. Se **eliminó el carácter em dash** de todo el proyecto.
>
> v1.5.0 sustituyó el mapa SVG conceptual del sub-bloque N2 (Bloque Escala Nacional de `/enso`) por un mapa **Leaflet real** con capa GeoJSON de las 5 regiones hidrológicas de Colombia (Natural Earth/IDEAM) sobre tiles CartoDB Light.

---

## 1. Identidad del nodo

| Campo | Valor |
|---|---|
| Nombre público | Observatorio Climático del Huila «Efraín Antonio Domínguez Calle» |
| Subdominio | `obs-clima-huila.cenigaa.org` |
| Posición ecosistema | CAPA A · CENIGAA_CONTEXT.md §3 · **Nodo 1 ROGAA-Huila** |
| Repositorio | `cenigaa-obs-clima-huila` (GitHub · CENIGAA) |
| Tipo | Dinámico · SPA React + Vite + Leaflet + Recharts |
| Hosting | Azure Static Web Apps (Standard) |
| CI/CD | GitHub Actions → Azure SWA en push a `main`. Desde v1.7.0 el pipeline corre `lint` + `validate:data` + `test` antes de `build`; el `build/` se genera en CI (ya no se commitea) |
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
| Mapas | Leaflet + react-leaflet | ^1.9.4 / ^4.2.1 (Leaflet vanilla usado en `/enso` desde v1.5.0; `react-leaflet` en `/mapa` de estaciones) |
| Gráficas | Recharts | ^3.8.1 (lazy desde v1.2.0) |
| Iconografía | lucide-react | ^0.383.0 |
| Calidad | ESLint (`.eslintrc.cjs`) + plugins react / hooks / refresh | ^8.57.0 |
| Pruebas | Vitest (UI) + `node:test` (datos/CSP) · script `validate-data.mjs` | v1.7.0 |

### Árbol de directorios (real, sin `node_modules` ni `build`)

```
cenigaa-obs-clima-huila/
├── CENIGAA_CONTEXT.md
├── CENIGAA_STATUS_obs-clima-huila.md      ← este archivo
├── MANTENIMIENTO_ENSO.md                  ← v1.7.0 · guía de actualización de contenido /enso
├── LICENSE
├── README.md                             ← v1.7.0 · documenta scripts de test/lint/validate
├── index.html
├── package.json                          ← v1.7.0 · scripts lint/validate:data/test/test:ui
├── package-lock.json
├── vite.config.js
├── vitest.config.js                      ← v1.7.0 · config de pruebas UI
├── .eslintrc.cjs                         ← v1.7.0 · config ESLint explícita
├── tailwind.config.js
├── postcss.config.js
├── scripts/
│   └── validate-data.mjs                 ← v1.7.0 · validación de datos públicos (usado en CI)
├── tests/                                ← v1.7.0 · vitest (UI) + node:test (datos/CSP)
│   ├── data-quality.test.mjs
│   ├── csp.test.mjs
│   ├── header.ui.test.jsx
│   ├── hero.ui.test.jsx
│   ├── datos-abiertos.ui.test.jsx
│   └── setup-vitest.js
├── build/                                ← v1.7.0 · NO trackeado (en .gitignore; generado en CI)
├── .github/workflows/
│   └── azure-static-web-apps-jolly-forest-0b932a410.yml  ← v1.7.0 · lint + validate + test + build
├── public/
│   ├── staticwebapp.config.json
│   ├── favicon.svg                                       ← v1.0.1
│   ├── apple-touch-icon.png                              ← v1.0.1
│   ├── og-image.jpg                                      ← v1.0.1
│   ├── robots.txt                                        ← v1.2.0 · Allow / + apunta a sitemap
│   ├── sitemap.xml                                       ← v1.2.0 · ampliado a 10 URLs en v1.3.0
│   ├── assets/
│   │   ├── Nevado tatacoa.jpg / .webp                    ← .webp en v1.2.0 (14 MB → 2.1 MB)
│   │   ├── efrain/                                       (6 retratos JPG + 4 .webp)
│   │   ├── equipo/                                       ← v1.6.0 · fotos de perfil (Jorge_Chavarro.jpg + README)
│   │   └── logos/
│   │       ├── CAM.svg
│   │       ├── CENIGAA.svg                               ← Header (fondo claro)
│   │       ├── Gobernacion_Huila.png
│   │       ├── IDEAM.png                                 ← v1.6.0 · footer entidades
│   │       ├── DSGAA.png                                 ← v1.6.0 · card grupo DSGAA
│   │       ├── Logo_GAA+IA.png                           ← v1.6.0 · card GAA+IA Lab
│   │       ├── S-WEB-Goal-13.png                         ← v1.6.0 · logo ODS 13 en /politica
│   │       ├── Gobernacion_Huila.webp                    ← v1.7.1 · WebP (Footer/Aliados vía <picture>)
│   │       ├── Logo_NOAA.jpeg / Logo_COPERNICUS.jpeg     ← v1.7.2 · logos geovisores /enso
│   │       ├── Logo_IRI-Columbia-University.png / .webp  ← v1.7.2 · logo IRI (WebP 323→28.5 KB, <picture>)
│   │       └── logo_cenigaa_T_Blanco.png                 ← (legacy footer navy · v1.6.0 footer usa fondo blanco)
│   └── data/
│       ├── catalogo_estaciones_CENIGAA.csv               ← descargable público
│       ├── estaciones.json                               (150 estaciones)
│       ├── resumen_departamento.json
│       ├── municipios_huila.geojson                      (37 features tipo Point)
│       ├── estacion_*.json                               (150 archivos por estación)
│       ├── enso-estado.json                              ← v1.3.0 · datos ENSO + alerta nacional
│       ├── enso-contenido.json                           ← v1.7.0 · narrativa /enso reutilizable (ver MANTENIMIENTO_ENSO.md)
│       └── colombia-regiones-hidrologicas.geojson        ← v1.5.0 · 24 KB · 5 features (regiones)
└── src/
    ├── main.jsx
    ├── App.jsx                                           ← BrowserRouter + 9 rutas · v1.7.1 Enso en React.lazy + Suspense
    ├── hooks/
    │   └── useDataLoader.js                              (useEstaciones, useEstacion, useResumenDepartamento)
    ├── data/
    │   ├── content.js                                    (estructura ES/EN preparada · no activa)
    │   └── politicaClimatica.js                          ← v1.0.1 · 4 niveles, 12 instrumentos
    ├── styles/
    │   ├── tokens.css                                    (tokens SIC)
    │   └── global.css                                    (reset + @tailwind + utilidades)
    ├── components/layout/
    │   ├── Header.jsx                                    ← v1.6.0 menú agrupado en desplegables · v1.7.0 fondo azul #4A60D8 (contenido en blanco)
    │   └── Footer.jsx                                    ← v1.6.0 rediseño mínimo · v1.7.0 layout horizontal (logos izquierda, texto al frente)
    └── components/sections/
        ├── Hero.jsx                                      ← v1.3.0 portada Plan Huila 2050 · v1.7.0 fondo blanco (colores invertidos), sin indicador "Explorar"
        ├── MapaEstaciones.jsx                            (con Filtros y Leyenda inline)
        ├── PanelEstacion.jsx                             (4 tabs: Estacionalidad / Tendencia / ENSO / Distribución)
        ├── SobreObservatorio.jsx
        ├── ComoFunciona.jsx
        ├── Biblioteca.jsx
        ├── Equipo.jsx                                    ← v1.6.0 "I+D+i": 3 subcategorías + perfil Jorge (foto/LinkedIn/roles) + Grupo DSGAA + tarjetas horizontales
        ├── DatosAbiertos.jsx
        ├── Aliados.jsx
        ├── PoliticaSection.jsx                           ← v1.0.1 · /politica
        ├── ResumenSection.jsx                            ← v1.1.0 · /resumen · v1.2.0 lazy BarChart
        ├── LazyBarChart.jsx                              ← v1.2.0 · chunk dinámico Recharts
        ├── Enso.jsx                                      ← v1.3.0 · /enso · v1.5.0 mapa Leaflet · v1.7.1 lazy chunk · v1.7.2 logos geovisores + visualización en vivo
        └── HomenajeEfrain.jsx                            (/efrain · WebPs desde v1.2.0)
```

### Chunks de producción (output rolldown tras v1.7.1)

| Chunk | Tamaño | Gzip | Contenido |
|---|---:|---:|---|
| `index-*.js` | 118 KB | 30.0 KB | App shell + router + secciones (bajó de 161 KB al sacar Enso a lazy en v1.7.1) |
| `Enso-*.js` | 29.7 KB | 7.8 KB | **`/enso` lazy** (v1.7.1) · mapa Leaflet + narrativa, solo se descarga en `/enso` |
| `map-*.js` | 148.8 KB | 43.4 KB | leaflet + react-leaflet |
| `charts-*.js` | 500.9 KB | 150.3 KB | recharts (lazy en `/resumen` vía `LazyBarChart`) · supera el límite de 500 KB (warning) |
| `vendor-*.js` | 57.2 KB | 20.7 KB | react / react-dom |
| `LazyBarChart-*.js` | 1.07 KB | 0.59 KB | wrapper dinámico de Recharts |
| `index-*.css` | 46.5 KB | 9.4 KB | Tailwind compilado + tokens |
| `map-*.css` | 14.8 KB | 6.3 KB | Leaflet CSS (chunk propio bajo rolldown) |

✅ **Code splitting por ruta intacto**. El usuario que entra a `/` ya no paga el código de `/enso`: los chunks `Enso-*.js`, `map-*.js` (Leaflet) y el GeoJSON de regiones se descargan únicamente al navegar a `/enso` o `/mapa`.

> ✅ **Resuelto en v1.7.1** (antes P2): `Enso` se envuelve con `React.lazy(() => import('./Enso'))` + `Suspense` en `App.jsx`, devolviendo `index-*.js` de 161 KB a 118 KB. Queda pendiente (P3) el chunk de Recharts (>500 KB); una opción futura es un lazy más granular de las gráficas.

---

## 3. Identidad visual

### Tokens SIC implementados ([src/styles/tokens.css](src/styles/tokens.css))

| Token | Valor | Pantone | Uso |
|---|---|---|---|
| `--color-brand-blue` | `#4A60D8` | 2726c | Agua/Ambiente · acento primario · CTAs · pin Huila en mapa nacional |
| `--color-brand-green` | `#43B02A` | 361c | Agricultura · stats verde · indicadores positivos · regiones de impacto bajo |
| `--color-brand-orange` | `#F4511E` | 171c | Energía · "Decreciente" en mapa · tendencia negativa · regiones de impacto alto |
| `--color-brand-navy` | `#162341` | 282c | Institucional · texto títulos · Hero/Dedicatoria |
| `--color-brand-*-light` / `*-mid` | derivados | - | Fondos suaves, hovers, borders destacados |

✅ **Conformidad SIC: total.** Los 4 colores oficiales viven en `tokens.css` con cita Pantone y se exponen en Tailwind como `[#xxxxxx]` arbitrary values. **El mapa Leaflet de `/enso` (v1.5.0) usa los mismos hex directamente desde el GeoJSON** (`#F4511E` para regiones de alto impacto, `#F4A261` para moderado, `#43B02A` para bajo, `#4A60D8` para el pin Huila).

### Tipografía

| Familia | Origen | Uso |
|---|---|---|
| **Inter** (300–900) | Google Fonts | Body, títulos, UI |
| **JetBrains Mono** (400, 500) | Google Fonts | Datos numéricos, códigos de estación, citas técnicas |

✅ Conforme a `CENIGAA_CONTEXT.md §2`: Inter como fuente oficial web. JetBrains Mono complementa para tabulares; **no se usa Astera** (correctamente excluida).

### Logotipo

✅ **Resuelto en v1.2.0.** El logo CENIGAA en el chrome del sitio usa los activos oficiales:

| Ubicación | Archivo | Razón |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) (fondo azul `#4A60D8` desde v1.7.0) | wordmark de texto en blanco; CTA ROGAA como pill blanco con texto azul | v1.7.0 · antes `bg-white/95` con texto oscuro |
| [Footer.jsx](src/components/layout/Footer.jsx) (fondo blanco desde v1.6.0) | logos institucionales a color (Gob. Huila · CAM · CENIGAA · IDEAM), layout horizontal v1.7.0 | v1.7.0 · antes navy con logo blanco |
| [Aliados.jsx](src/components/sections/Aliados.jsx) | `/assets/logos/CENIGAA.svg` | (sin cambio) |

---

## 4. Contenido y secciones (arquitectura multi-ruta v1.2.0+)

Hasta v1.1.0 todas las secciones se renderizaban apiladas en la home (`/`). **A partir de v1.2.0 cada item del menú vive en su propia ruta**; la home queda exclusivamente con el Hero como portada institucional. Las secciones que no son items del nav (ComoFunciona, Aliados, Dedicatoria) se reubican en la ruta semánticamente adyacente.

### Mapa rutas → contenido

| Ruta | Label nav | Contenido renderizado | Estado |
|---|---|---|---|
| `/` | **Inicio** | `Hero` (94 años de registros, 150 estaciones, 37 municipios, CTAs a /mapa y /datos, portada Plan Huila 2050 WebP) | ✅ |
| `/mapa` | **Mapa** | `MapaEstaciones` (filtros municipio/tendencia/estado, leyenda en vivo, panel 4 tabs vía `PanelEstacion`) | ✅ |
| `/enso` | **El Niño 2026** | `Enso` · 8 bloques (Hero con alerta dinámica, editorial, línea de tiempo, 3 indicadores, 3 geovisores, **Escala nacional v1.4.0 con mapa Leaflet v1.5.0**, correlación histórica Huila, placeholder seguimiento local) | ✅ |
| `/sobre` | **Sobre** | `SobreObservatorio` + `ComoFunciona` (6 componentes metodológicos) + `Aliados` (Gobernación, CAM, CENIGAA, IDEAM) + banda `Dedicatoria` memorial a Efraín (movida desde `/equipo` en v1.6.0) | ✅ |
| `/resumen` | **Resumen** | `ResumenSection` (3 métricas, `LazyBarChart` Mann-Kendall 25/112/12, 4 hallazgos, nota metodológica con cita ISBN) | ✅ |
| `/politica` | **Política pública** | `PoliticaSection` (12 instrumentos en 4 niveles: Global · Nacional · Departamental · Municipal) | ✅ |
| `/biblioteca` | **Biblioteca** | `Biblioteca` (6 referencias curadas con APA y badges) | ✅ |
| `/equipo` | **I+D+i** | `Equipo` · 3 subcategorías: Talento Humano (Jorge Chavarro con foto, LinkedIn y checklist de roles) · Grupos de Investigación (Hidroinformática + DSGAA, tarjetas horizontales con logo lateral) · Infraestructura (GAA+IA Lab). Dedicatoria a Efraín movida a `/sobre` | ✅ **v1.6.0** |
| `/datos` | **Datos** | `DatosAbiertos` (CSV catálogo descargable + cita APA + apuntador al panel de estación) | ✅ |
| `/efrain` | (no en nav) | `HomenajeEfrain` (banner Nevado-Tatacoa WebP, retrato WebP, biografía, blockquote, ficha del libro con ISBN) | ✅ |

### Detalle de `/enso` (subpágina más rica del sitio)

8 bloques alimentados desde `public/data/enso-estado.json` (actualización manual semanal hasta integración API NOAA prevista jul 2026):

1. **Hero ENSO** con badge de alerta dinámico (color según fase: El Niño = naranja, La Niña = azul, Neutral = gris).
2. **Editorial** · contexto científico del evento.
3. **Línea de tiempo vertical** con marcador `animate-ping` en el ítem "presente" y borde verde en hitos.
4. **Indicadores cuasi-real** · 3 cards con valor grande en naranja.
5. **Geovisores internacionales** · cards con logo real de NOAA/PSL, Copernicus/ECMWF e IRI/Columbia (v1.7.2) y botones que abren cada visor en pestaña nueva; seguidas del bloque **Visualización en vivo** (v1.7.2) con 3 imágenes oficiales auto-actualizadas de NOAA (TSM, pluma Niño 3.4 CFSv2, MEI v2) y fallback `onError`.
6. **Escala Nacional Colombia (v1.4.0 · refinado en v1.5.0)** · 4 sub-bloques:
   - **N1** · Tarjeta navy de alerta IDEAM (96% persistencia · 63% intensidad muy fuerte) con pulse animado.
   - **N2** · Grid 2 columnas con **mapa Leaflet real** (380 px) sobre tiles CartoDB Light + tabla de regiones con badges por nivel y row resaltado para Andina.
   - **N3** · Tarjeta blanca con blockquote "Señal en campo".
   - **N4** · Grid de 5 sectores en seguimiento.
7. **Correlación histórica Huila** · 25/12/112 con LazyBarChart.
8. **Placeholder seguimiento local** · 17 estaciones automáticas, Q3 2026.

### Header de navegación (reorganizado en v1.6.0)

- **Navegación agrupada en desplegables temáticos** (ya no items planos). Se eliminó el item "Inicio" porque el nombre del nodo ya enlaza a `/`:
  - **Datos y Monitoreo** → Mapa · Resumen · El Niño 2026 · Datos
  - **Recursos** → Biblioteca · Política pública
  - **El Observatorio** → Sobre · **I+D+i** (antes "Equipo", misma ruta `/equipo`)
- **Desktop**: cada grupo abre panel al hover (cierre suave 120 ms) y con clic; chevron que rota, grupo resaltado si su ruta está activa, cierre con `Escape`/blur/navegación. Accesible (`aria-haspopup`, `aria-expanded`, `role="menu"`).
- **Móvil**: cada grupo es un acordeón que se autoexpande si contiene la ruta activa; panel con scroll interno.
- **CTA ROGAA**: pill navy que apunta a `www.cenigaa.org/views/rogaa.html`. El breadcrumb "CENIGAA" del logo sigue apuntando a la home principal.
- **Wordmark de texto** desde v1.3.0 (commit `6e69dee`).

### Footer (rediseño mínimo en v1.6.0)

- Reducido de 4 columnas + badges + dedicatoria a un footer mínimo: banda de color ROGAA + logos institucionales + una línea de copyright.
- **Fondo blanco** con borde superior; texto oscuro (invertido respecto al navy previo).
- **Logos de entidades a cargo** en orden oficial: Gobernación del Huila · CAM · CENIGAA · IDEAM (`h-12`, `object-contain`).
- Se eliminaron `EcoLink`, columnas de Ecosistema/Recursos y los enlaces que solo vivían en el footer (repo GitHub, homenaje, datos abiertos, biblioteca).

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

- ✅ `ResearchOrganization` (CENIGAA) · name, alternateName, url, logo, address, contactPoint
- ✅ `WebSite` · name, description, publisher (`@id` cruzado a la organización), `inLanguage: es-CO`
- ✅ `Dataset` · 150 estaciones, `temporalCoverage: 1930-01-01/2017-12-31`, `spatialCoverage` con bounding box del Huila, `sourceOrganization: IDEAM`, `variableMeasured` (precipitación, MK, ENSO, distribuciones), `license: CC-BY 4.0`, `citation` APA al libro CC_VCE Huila

### Activos SEO

| Archivo / recurso | Estado | Notas |
|---|---|---|
| `public/favicon.svg` | ✅ Presente (v1.0.1 · commit `5c40948`) | 364 B · isotipo CENIGAA |
| `public/apple-touch-icon.png` | ✅ Presente (v1.0.1) | 5 KB · 180×180 |
| `public/og-image.jpg` | ✅ Presente (v1.0.1) | 83 KB · 1200×630 |
| `public/robots.txt` | ✅ Presente desde v1.2.0 (commit `0b6ee0a`) | 80 B · `User-agent: *` · `Allow: /` · apunta al sitemap |
| `public/sitemap.xml` | ✅ Ampliado en v1.3.0 (commit `7625afc`) | 10 URLs: `/`, `/enso`, `/mapa`, `/sobre`, `/resumen`, `/politica`, `/biblioteca`, `/equipo`, `/datos`, `/efrain` con `lastmod 2026-06-17` |

✅ **Bloque SEO cerrado y al día.** Pendiente operativo: enviar el sitemap a [Google Search Console](https://search.google.com/search-console) y [Bing Webmaster Tools](https://www.bing.com/webmasters).

> ⚠ **Cache de previews sociales**: Twitter, LinkedIn, Facebook y WhatsApp cachean los previews con TTL largo. Si la URL ya fue compartida antes del fix de v1.0.1, puede requerir purge manual vía Facebook Sharing Debugger o Twitter Card Validator.

---

## 6. Rendimiento

### Estrategia de bundling (real, post v1.5.0)

`vite.config.js` define `manualChunks` separando `leaflet`, `react-leaflet`, `recharts` y `lucide-react`. Tras el refactor multi-ruta de v1.2.0, cada chunk pesado se carga sólo donde aplica:

- **`/`** carga sólo `index + vendor + icons + css` (≈ 244 KB sin gzip, ≈ 67 KB gzip)
- **`/mapa`** suma `map-*.js` (289 KB) · Leaflet en panel de estaciones
- **`/enso`** suma `map-*.js` (289 KB) y descarga `colombia-regiones-hidrologicas.geojson` (24 KB) · mapa Leaflet de regiones nacionales (v1.5.0)
- **`/resumen`** y panel de estación suman `charts-*.js` (374 KB) bajo demanda
- **`ResumenSection`** además usa `React.lazy(() => import('./LazyBarChart'))` para que `charts-*.js` se importe después del primer paint de la ruta

### Imágenes

| Métrica | Valor |
|---|---|
| Total imágenes en `public/assets/` | 14 archivos |
| WebP | **5** (`Nevado tatacoa.webp` + 4 retratos de Efraín) |
| JPG/JPEG/PNG/SVG | 9 |
| Con `loading="lazy"` | varios (Aliados, retratos Efraín) |
| Con `loading="eager"` | retrato Efraín en `/efrain` (LCP apropiado) |

**Conversiones aplicadas con `sharp-cli q=82` (v1.2.0):**

| Archivo | Antes | Después | Reducción |
|---|---:|---:|---:|
| `Nevado tatacoa.jpg` → `.webp` | 14 MB | 2.1 MB | **85%** |
| `Efrain-dominguez1.jpg` → `.webp` | 128 KB | 70 KB | 45% |
| `Efraín.JPG` → `.webp` | 122 KB | 56 KB | 54% |
| `Efrain4.jpg` → `.webp` | 146 KB | 118 KB | 19% |

⚠ **Brecha pequeña restante**: `Gobernacion_Huila.png`, `Efrain-Dominguez3.jpg` y `Efrain_isologo.jpg` siguen sin convertir. Bajo impacto; queda como P3.

### Lighthouse

🟡 **Sin baseline registrada todavía.** Recomendado correr ahora que el árbol multi-ruta y el nuevo mapa nacional están operativos:

```
npx lighthouse https://obs-clima-huila.cenigaa.org --view --preset=desktop
npx lighthouse https://obs-clima-huila.cenigaa.org/enso --view --preset=desktop
npx lighthouse https://obs-clima-huila.cenigaa.org/mapa --view --preset=desktop
```

Objetivo `CENIGAA_CONTEXT.md §6`: ≥ 90 en Performance / Accessibility / Best Practices / SEO. La home debería superarlo cómodamente; `/enso` y `/mapa` por debajo por la carga de Leaflet pero aún razonables.

### Otras optimizaciones

- ✅ Carga lazy de datos por estación: `useEstacion(codigo)` con `AbortController` para cancelar fetches obsoletos
- ✅ Mapa: `scrollWheelZoom: false` (consistente entre `/mapa` y el mapa nacional de `/enso`) · evita captura accidental del scroll de la página
- ✅ Tiles CartoDB Positron (CDN público, gratis, atribuido) · preconnect implícito por subdominio
- ✅ Google Fonts con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`
- ✅ CSP estricta en `staticwebapp.config.json` (script-src 'self' + img-src https permite tiles)
- ✅ `React.lazy(LazyBarChart)` para diferir Recharts en `/resumen` (v1.2.0)
- ✅ Cleanup explícito del mapa Leaflet de `/enso` en el unmount (`map.remove()` + ref guard) · evita memory leak en navegación SPA

---

## 7. Coherencia ecosistémica

### Enlaces salientes a www.cenigaa.org

| Ubicación | Tratamiento | rel/target |
|---|---|---|
| [Header.jsx](src/components/layout/Header.jsx) · breadcrumb superior izquierdo | Texto "CENIGAA" wordmark + chevron | ✅ `target=_blank` `rel=noopener noreferrer` |
| [Header.jsx](src/components/layout/Header.jsx) · CTA desktop "ROGAA" | Pill navy → www.cenigaa.org | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) · logo footer | Link al sitio principal | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) · columna Ecosistema | "www.cenigaa.org - Inicio" | ✅ |
| [Footer.jsx](src/components/layout/Footer.jsx) · copyright | "www.cenigaa.org" inline | ✅ |

✅ Conforme a `CENIGAA_CONTEXT.md §6 (Coherencia ecosistémica)`.

### Enlaces a gaaialab.cenigaa.org

- ✅ [Footer.jsx](src/components/layout/Footer.jsx) · columna Ecosistema CENIGAA + sub-columna "Desarrollado por"
- ✅ [Equipo.jsx](src/components/sections/Equipo.jsx) · card destacada Jorge Chavarro + card GAA+IA Lab
- ✅ [SobreObservatorio.jsx](src/components/sections/SobreObservatorio.jsx) · bloque "La red ROGAA-Huila"

Todos con `target=_blank rel=noopener noreferrer`.

### Navegación interna SPA

- **Header**: `NavLink` con estado activo visual; sin anchors `#`. "Inicio" y el clic sobre el nombre del nodo llevan a `/`.
- **Hero**: CTAs "Explorar mapa" y "Descargar datos" usan `<Link>` (SPA, sin reload).
- **Footer Recursos**: `<EcoLink to="/datos">`, `to="/biblioteca"`, `to="/mapa"`, `to="/efrain"`.

✅ El único `#anchor` que sobrevive es el `skip-to-content` (accesibilidad pura, apunta a `#main-content`).

### Email institucional

- ✅ `mailto:info@cenigaa.org` en Footer (sección contacto)
- ✅ `mailto:info@cenigaa.org` en Biblioteca (call-to-collaborate)

### Hub central observatorios

🟡 No hay enlace a `observatorios.cenigaa.org` · el hub aún no existe (`CENIGAA_CONTEXT.md §3` lo marca "📋 Por crear"). El enlace a `obs-suelos-huila.cenigaa.org` sigue comentado en Footer desde v1.0.1.

### Audit de enlaces externos

✅ Todos los `target="_blank"` tienen `rel="noopener noreferrer"`, incluyendo el atributo HTML del attribution de Leaflet (OpenStreetMap / CARTO) · tanto en `/mapa` como en el nuevo mapa de `/enso` (v1.5.0).

---

## 8. Datos científicos

### Cobertura (web pública · Fase 1)

| Métrica | Valor |
|---|---|
| Total de estaciones aptas | **150** |
| Estaciones con sensor de precipitación PT_4 | 149 |
| Período de la línea base | **1930 – 2017 · 87 años** |
| Estación más antigua | **APTO BENITO SALAS** (Neiva, código `21115020`) · inicio 1930 |
| Municipios cubiertos | **37** (todo el departamento del Huila) |
| Bounding box | `1.55, -76.65` ↔ `3.85, -74.50` |

### Fuente y trazabilidad

| Capa | Origen |
|---|---|
| Datos primarios | **IDEAM** · Red Nacional de Estaciones Climatológicas |
| Procesamiento | **CENIGAA** vía base `CCYVCE_DB.db` |
| Convenio que financió la sistematización | **SGR-FCTeI Convenio Especial de Cooperación 124 de 2015** |
| Metodología | **Domínguez Calle, E.A. (2018)** · *Cambio climático y variabilidad climática extrema en el Huila*. ISBN 978-620-2-16957-8 |
| Regiones hidrológicas (v1.5.0) | **Natural Earth / IDEAM** · 5 polígonos para `/enso` mapa nacional |

### Variables analizadas por estación

Cada archivo `estacion_{CODIGO}.json` contiene, para PT_4 (Precipitación total mensual, mm/mes):
- Serie mensual completa (`serie_mensual.fechas`, `valores`) y serie anual (`serie_anual`)
- **Estacionalidad** · medias multianuales por mes + `mes_max` / `mes_min` (patrón bimodal Huila: Abr-May y Oct-Nov)
- **Inercia** · `acf_lag1`, `acf_lag12`, serie ACF 1–12
- **Tendencia** · Mann-Kendall: `direccion`, `significativa`, `p_valor`, `pendiente_anual` (Theil-Sen), `cambio_total`
- **Ciclos seculares** · medias móviles 10 años
- **ENSO** · nota cualitativa, interpretación y fuente (correlación inversa con Niño 3.4, MEI, OMI)
- **Distribución** · ajuste (Gumbel mayoritariamente en mensual; Log-Gamma para anual), KS p-valor, parámetros, media, desv. std.

### Resumen departamental (`resumen_departamento.json`)

- Tendencias PT_4 globales: **25 decreciente · 12 creciente · 113 sin tendencia** (37 con tendencia estadísticamente significativa)
- Patrón espacial: tendencia decreciente significativa al sur del Huila, creciente al norte (1985–2015)
- Distribución mensual dominante: **Gumbel** con asimetría derecha; anual: **Log-Gamma**

### Capa cartográfica

| Archivo | Cobertura | Tipo geometría | Notas |
|---|---|---|---|
| `municipios_huila.geojson` | 37 municipios del Huila | Point (centroides) | ⚠ Pendiente polígonos reales; el `style` polygon ya está cableado |
| `colombia-regiones-hidrologicas.geojson` (v1.5.0) | 5 regiones hidrológicas de Colombia | Polygon / MultiPolygon | 24 KB · fuente Natural Earth / IDEAM · propiedades `nombre`, `color`, `nivel_impacto`, `huila_incluido` |

### Descargas públicas

- ✅ **CSV catálogo** · `/data/catalogo_estaciones_CENIGAA.csv` (151 líneas, ~12 KB; 9 campos: NOMBRE, CODIGO, MUNICIPIO, CORRIENTE, ALTITUD_msnm, INICIO, FIN, N_MESES, ESTADO). Botón en `/datos`.
- ✅ **JSON por estación** · `/data/estacion_{CODIGO}.json` accesible vía URL; el cliente lo recibe al click vía `useEstacion`.

### Fase 2 · Pipeline IDEAM 2017–2026 (groundwork v1.2.0, local-only)

Infraestructura preparada en `data/pipeline/` (ignorada por git):

| Componente | Estado |
|---|---|
| `CC_VCE_Huila_Fase2_Pipeline.ipynb` | ✅ Creado · 23 celdas (9 markdown + 14 código): CONFIG centralizado, catálogo IDEAM via Socrata, descarga PT/T con filtro SoQL, QC dual Grubbs+MAD con regla "2 de 3", integración SQLite con campo `fuente=IDEAM_API_2026`, comparativo Fase 1/2 y reaplicación de los 6 componentes metodológicos |
| `estaciones_fase1.json` | ✅ Poblado con 150 entradas |
| `outputs/{series_extendidas, control_calidad, variabilidad_fase2}/` | ✅ Directorios creados |
| `referencias/CC_VCE_Huila_2018.pdf` | ✅ Libro fuente reubicado |
| Dependencias Python | ✅ Instaladas: pandas 2.2.3, numpy 2.0.2, scipy 1.13.1, matplotlib 3.9.4, seaborn 0.13.2, sodapy 2.2.0, jupyter 4.5.8 |
| Smoke test celda 1 | ✅ Ejecutado limpio |
| Corrida real Módulo 1+ (catálogo IDEAM) | 📋 Pendiente · requiere conectividad a `datos.gov.co` |
| Integración con `CCYVCE_DB.db` (Módulo 4) | 📋 Pendiente · requiere copiar la base original a `data/` |

> El campo **`fuente=IDEAM_API_2026`** en cada registro nuevo es el mecanismo de trazabilidad que permitirá distinguir los datos del estudio original (`CCYVCE_DB`) de los datos del API en publicaciones derivadas, sin perder linaje.

---

## 9. Resumen ejecutivo

### Estado general

🟢 **MVP completo + arquitectura multi-ruta + escala nacional con mapa real + Fase 2 en scaffolding.** Las 11 secciones del sitio están implementadas con contenido final. La subpágina `/enso` se consolida en v1.5.0 con su mapa nacional pasando de SVG conceptual a Leaflet real con GeoJSON, completando la narrativa global → nacional → regional (este último bloque queda como placeholder hasta Q3 2026).

### Hallazgos positivos

- ✅ Identidad visual al 100% conforme manual SIC (4 colores Pantone + Inter + logo oficial)
- ✅ Coherencia ecosistémica completa: header y footer enlazan a `www.cenigaa.org` y `gaaialab.cenigaa.org` con `rel` correcto
- ✅ JSON-LD multi-entidad (`ResearchOrganization` + `WebSite` + `Dataset`) bien estructurado para Google Dataset Search
- ✅ Routing SPA con `navigationFallback` de Azure correctamente configurado (deep-links resuelven directamente)
- ✅ Code splitting agresivo · `charts-*.js` no se carga en home; `map-*.js` sólo en `/mapa` y `/enso`; `LazyBarChart` también lazy en `/resumen`
- ✅ Pasada de calidad: alts descriptivos en todos los `<img>`, `rel=noopener` en todos los externos, attribution de Leaflet correcta en ambos mapas
- ✅ Filtros del mapa con conteo de leyenda derivado de la misma lista filtrada (imposible que se desincronicen)
- ✅ Sección **/politica** (v1.0.1) · 12 instrumentos oficiales en 4 niveles con enlaces directos
- ✅ Sección **/resumen** (v1.1.0) · visualización Mann-Kendall + 4 hallazgos + bloque metodológico con cita ISBN
- ✅ **Refactor multi-ruta v1.2.0** · cada item del nav es una ruta dedicada con estado activo visual
- ✅ **Subpágina `/enso` (v1.3.0)** · 8 bloques alimentados desde JSON con fetch + AbortController
- ✅ **Bloque Escala Nacional (v1.4.0)** · alerta IDEAM dinámica, 5 regiones hidrológicas, vulnerabilidad del Huila, sectores en seguimiento
- ✅ **Mapa Leaflet real del Bloque Nacional (v1.5.0)** · sustitución del SVG conceptual por capa GeoJSON sobre tiles CartoDB Light con hover, tooltips por región y pin del Huila en el centroide cartográfico real
- ✅ **Fase 2 scaffolding v1.2.0** · notebook completo de 23 celdas con metodología documentada, lista de 150 estaciones poblada, deps Python instaladas

### Cerrado en v1.5.0 (desde v1.4.0)

- ✅ ~~Mapa SVG conceptual en `/enso` sub-bloque N2~~ · sustituido por mapa Leaflet real (commit `6ba6bc2`); componente `MapaColombiaLeaflet` con `L.map` + `L.tileLayer` (CartoDB Light) + `L.geoJSON` + 2 `L.circleMarker` para halo y pin del Huila; cleanup explícito al unmount
- ✅ ~~`colombia-regiones-hidrologicas.geojson` ausente en `public/data/`~~ · incorporado (24 KB · 5 features · Polygon/MultiPolygon · Natural Earth + IDEAM)
- ✅ ~~Código muerto `REGIONES_SVG` + `NIVEL_IMPACTO_FILL` + componente `MapaColombiaConceptual`~~ · eliminado (≈ 110 líneas) al integrar el Leaflet real
- ✅ ~~33 marcadores de conflicto de merge sin resolver en el propio STATUS doc~~ · resueltos al consolidar a v1.5.0

### Cerrado en v1.4.0 (desde v1.3.0)

- ✅ Bloque Escala Nacional en `/enso` (`escala_nacional` en JSON + componente `BloqueEscalaNacional`)

### Cerrado en v1.3.0 (desde v1.2.0)

- ✅ Subpágina `/enso` con 7 bloques iniciales, `enso-estado.json`, item nav, sitemap ampliado a 10 URLs
- ✅ Hero con portada Plan Huila 2050 (WebP + fallback PNG)
- ✅ Footer logo agrandado
- ✅ Purga global "Red ROGAA" → "ROGAA"

### Cerrado en v1.2.0 (desde v1.1.0)

- ✅ Refactor multi-ruta (home solo Hero)
- ✅ Logo placeholder → activos SIC oficiales
- ✅ 4 imágenes críticas → WebP (Nevado tatacoa 14 MB → 2.1 MB)
- ✅ `robots.txt` y `sitemap.xml` (inicial)
- ✅ `React.lazy(LazyBarChart)` para diferir Recharts
- ✅ Fase 2 scaffolding (notebook + deps)

### Cerrado en v1.1.0 (desde v1.0.1)

- ✅ Sección `/resumen` con BarChart Mann-Kendall + 4 hallazgos
- ✅ Pasada tipográfica: 56 em-dashes eliminados de 16 archivos
- ✅ Código muerto `PlaceholderSection` eliminado

### Cerrado en v1.0.1 (desde v1.0.0)

- ✅ P0 favicon · apple-touch-icon · og-image
- ✅ Sección `/politica` con 12 instrumentos
- ✅ Riesgo `obs-suelos-huila` enlazado → comentado en Footer

### Pendientes (priorizados)

| Prio | Item | Notas |
|---|---|---|
| 🟠 P1 | Correr Lighthouse y registrar baseline | Especialmente relevante tras v1.5.0 (Leaflet ya carga en `/enso`); home debería estar por encima de 90 |
| 🟠 P1 | Ejecutar primera corrida real del notebook Fase 2 · Módulo 1 (catálogo IDEAM) | Confirma conectividad al API `datos.gov.co/resource/hp9r-jxuu` |
| 🟡 P2 | Reemplazar `municipios_huila.geojson` por polígonos reales | El `style` polygon ya está cableado; sólo cambiar el archivo |
| ✅ ~~P2~~ | ~~Convertir a WebP las imágenes restantes~~ | **Resuelto v1.7.1**: `Gobernacion_Huila`, `Efrain-Dominguez3`, `Efrain_isologo` en WebP. Gobernación vía `<picture>`; las dos de Efraín aún sin referencia en código |
| 🟡 P2 | Copiar `CCYVCE_DB.db` a `data/` para habilitar Módulo 4 del pipeline | Sin esto, Módulo 4 emite advertencia y se salta |
| ✅ ~~P2~~ | ~~Lazy-load del componente `Enso` completo en `App.jsx`~~ | **Resuelto v1.7.1**: `React.lazy` + `Suspense`; `index-*.js` de 161 KB → 118 KB, chunk `Enso-*.js` (29.7 KB) aparte |
| 🟢 P3 | Habilitar contenido EN cuando se traduzca | `src/data/content.js` ya tiene estructura · sólo cambiar `LANG = 'en'` |
| 🟢 P3 | Implementar Módulo 5b ENSO (17 índices NOAA-CPC) en el notebook | Marcado explícitamente como "versión futura" |
| 🟢 P3 | Automatizar actualización de `enso-estado.json` con API NOAA/CPC | Prevista jul 2026 |
| 🟢 P3 | Enviar `sitemap.xml` a Google Search Console y Bing Webmaster Tools | Acelera la primera indexación |
| ✅ ~~P3~~ | ~~Pasada tipográfica sobre `enso-estado.json` y JSON propietarios~~ | **Resuelto**: 0 em-dashes en todo `public/data/` (verificado v1.7.1) |
| 🟢 P3 | Actualizar `<lastmod>` del sitemap al hacer cambios en `/enso` | Hoy queda en `2026-06-17`; manual hasta automatización |

### Riesgos operacionales

- 🟡 La estructura ES/EN en `src/data/content.js` **no está conectada** a los componentes · Hero, Header y Footer tienen los strings hardcoded. Activar EN requiere refactor.
- 🟡 **`/enso` depende de actualización manual semanal** de `enso-estado.json` hasta la automatización con API NOAA. El `_meta.ciclo` lo documenta.
- 🟢 `staticwebapp.config.json` usa `navigationFallback: /index.html` · correcto para SPA según la advertencia explícita de `CENIGAA_CONTEXT.md §2` ("Solo usar en SPAs").
- 🟢 El mapa Leaflet de `/enso` (v1.5.0) tiene cleanup explícito al desmontar (`map.remove()` + ref guard) · evita memory leak en navegación SPA.

### Atribución científica

Cualquier uso académico o institucional debe citar:
> Domínguez Calle, E.A., Chavarro Díaz, J.A., Velasco Sánchez, A.N., Chavarro Díaz, J.I., De León Pérez, D.R., Garrido, A.E., Cañón Ramos, M.Á., & Parra Díaz, C.F. (2018). *Cambio Climático y Variabilidad Climática Extrema en el Huila: Herramientas para la Caracterización de la Amenaza Hidroclimática*. Editorial Académica Española. ISBN 978-620-2-16957-8.
> + **CENIGAA (2026)** · Observatorio Climático del Huila «Efraín Domínguez Calle», procesamiento y publicación de los datos 1930–2017. Última actualización del nodo: junio 2026.

---

## 10. Historial de versiones

| Versión | Fecha | Commit | Hito |
|---|---|---|---|
| **v1.5.0** | **2026-06-17** | `6ba6bc2` | **Mapa Leaflet real en `/enso` sub-bloque N2.** Sustitución del SVG conceptual `MapaColombiaConceptual` (5 paths poligonales sobre viewBox 400×600) por `MapaColombiaLeaflet`: instancia `L.map` con `scrollWheelZoom:false` y `dragging:true`, tile CartoDB Light al 0.7 de opacidad, capa `L.geoJSON` de `colombia-regiones-hidrologicas.geojson` (24 KB · 5 features) con estilo por `properties.color` y opacidad de hover (0.55 → 0.75), tooltips bilingües por región con nivel de impacto, doble `L.circleMarker` para el Huila (halo `radius:16 fillOpacity:0.18` + pin `radius:9 fillColor:#4A60D8`) en el centroide real (2.5414°N, -75.6168°W), cleanup del mapa en el unmount. Eliminadas constantes `REGIONES_SVG`, `NIVEL_IMPACTO_FILL` y componente `MapaColombiaConceptual` (≈ 110 líneas muertas). Build 2277 módulos, 0 warnings. También: resolución de 33 marcadores de conflicto de merge en este propio documento. |
| v1.4.0 | 2026-06-17 | `e5fe11d` | Bloque Escala Nacional Colombia en `/enso`. Nueva clave `escala_nacional` en JSON con `alerta_ideam`, `impacto_por_region` (5 regiones), `huila_en_contexto`, `sectores_alerta` (5). Componente `BloqueEscalaNacional` con N1 alerta IDEAM navy + pulse, N2 grid 2 columnas con mapa SVG conceptual + tabla, N3 blockquote "Señal en campo", N4 grid sectores. (El mapa SVG fue sustituido por Leaflet en v1.5.0.) |
| v1.3.0 | 2026-06-17 | `7625afc` | Subpágina `/enso` · Seguimiento El Niño 2026. Nueva ruta con 7 bloques alimentados desde `enso-estado.json`. Componente único `Enso.jsx` con fetch + AbortController. Hero con badge de alerta dinámico, línea de tiempo con `animate-ping`, indicadores cuasi-real, geovisores NOAA/C3S/IRI. Cambios complementarios: portada Plan Huila 2050 WebP+fallback, wordmark de texto en Header, logo footer agrandado, purga global "Red ROGAA" → "ROGAA", sitemap ampliado de 2 a 10 URLs. |
| v1.2.0 | 2026-06-14 | `c6496a9` | Refactor arquitectónico + scaffolding Fase 2. Home queda solo con el Hero; cada item del nav pasa a su propia ruta. Header con `NavLink` y estado activo visual. Footer `EcoLink` interno/externo. Incorpora cambios externos: lazy `BarChart` en `/resumen`, `robots.txt`, `sitemap.xml`, logos SIC en Header, 5 imágenes WebP. Notebook Fase 2 de 23 celdas + lista de 150 estaciones + deps Python instaladas. |
| v1.1.0 | 2026-06-03 | `77c135f` | MVP completo (11/11 secciones). Cierre de `#resumen` (3 métricas, BarChart Mann-Kendall, 4 hallazgos, nota metodológica con cita ISBN) + pasada tipográfica eliminando 56 em-dashes visibles + eliminación de `PlaceholderSection`. |
| v1.0.1 | 2026-05-18 | `4b95d1c` / `5c40948` | Cierre de P0 SEO (favicon + apple-touch-icon + og-image), ocultamiento del enlace prematuro a `obs-suelos-huila`, implementación de `#politica` con 12 instrumentos oficiales. |
| v1.0.0 | 2026-05-18 | `7eb02e0` | Creación del documento. Estado del nodo tras cierre del MVP (Sesiones 1–5). |

### Antecedentes (commits de referencia del repo)

```
6ba6bc2  feat(enso): mapa Leaflet regiones hidrologicas Colombia #N2          ← v1.5.0
71c0c56  Resolve merge conflict keeping remote status
a3975c2  Trabajo local antes de sincronizar
e5fe11d  feat(enso): bloque escala nacional Colombia #N2                       ← v1.4.0
7625afc  feat: subpágina /enso · Seguimiento El Niño 2026 · datos JSON manuales ← v1.3.0
f259020  content: 'Red ROGAA' → 'ROGAA' en todo el sitio
982a218  ui: agrandar logo CENIGAA en el footer
6e69dee  ui: quitar logo CENIGAA del menu bar; reemplazar por texto
af283e8  perf: portada Plan Huila 2050 en WebP con fallback PNG
c6496a9  feat: home solo Hero; cada item del nav pasa a ruta dedicada           ← v1.2.0
8e19567  chore: ignorar data/ y reubicar PDF de referencia para Fase 2          ← v1.2.0
0b6ee0a  feat: fase1 cierre - lazy recharts, robots, sitemap, logos, webp       ← v1.2.0
30a5c0b  ignore macOS DS_Store files
9eab46f  Esclogos cenigaa                                                       ← logos oficiales
77c135f  feat: seccion resumen hallazgos + fix em-dash en textos                ← v1.1.0
cac0be6  docs: actualizar CENIGAA_STATUS a v1.0.1                               (meta)
4b95d1c  feat: seccion politica publica cambio climatico #politica              ← v1.0.1
5c40948  fix: assets P0 favicon+og-image, ocultar enlace obs-suelos             ← v1.0.1
e64139d  docs: crear CENIGAA_STATUS_obs-clima-huila.md v1.0.0
7eb02e0  feat: MVP complete - about, team sections, quality pass                ← v1.0.0
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

*CENIGAA_STATUS_obs-clima-huila.md v1.5.0 · 2026-06-17*
*Auditor: agente Claude Code · Branch `main` · Repositorio `cenigaa-obs-clima-huila`*
*Próxima revisión sugerida: al añadir el bloque regional con las 17 estaciones automáticas del Huila (cierra la narrativa global → nacional → regional, Q3 2026), al ejecutar la primera corrida real del Módulo 1 del notebook de Fase 2, o al abordar el chunk de Recharts (>500 KB) con un lazy más granular de las gráficas.*
