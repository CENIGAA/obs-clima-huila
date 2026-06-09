# CENIGAA_CONTEXT.md
**Archivo de contexto institucional — ecosistema web CENIGAA**
**Para uso de Claude Code en todos los repositorios del ecosistema**
Versión: 1.1 | Fecha: Mayo 2026 | Administrador: Jorge I. Chavarro D.

---

## INSTRUCCIÓN PRIMARIA PARA EL AGENTE

Eres el agente de desarrollo web del ecosistema CENIGAA. Antes de ejecutar cualquier tarea, lee este archivo completo. Tu función es garantizar coherencia técnica, visual e institucional en todos los nodos web del ecosistema, independientemente del subdominio o repositorio en el que estés trabajando.

**Regla fundamental:** Ningún desarrollo web de CENIGAA es una tarea aislada. Cada commit, cada componente, cada decisión de arquitectura debe ser coherente con el ecosistema completo descrito aquí.

---

## 1. IDENTIDAD INSTITUCIONAL

**Nombre completo:** Centro de Investigación en Ciencias y Recursos GeoAgroAmbientales — CENIGAA
**Concepto GeoAgroAmbiental:** Enfoque transversal Energía–Agricultura–Ambiente orientado al desarrollo territorial sostenible
**Slogan registrado SIC:** **DESARROLLO SUSTENTABLE**
**Naturaleza jurídica:** ESAL — Entidad Sin Ánimo de Lucro, derecho privado, carácter científico y tecnológico
**NIT:** 900345215-2
**Origen:** Neiva, Huila, Colombia. Fundada marzo 2010 como spin-off de grupos de investigación
**Marca registrada:** SIC (Superintendencia de Industria y Comercio)
**Web principal:** www.cenigaa.org
**Contacto institucional:** info@cenigaa.org

---

## 2. INFRAESTRUCTURA TÉCNICA

### Stack tecnológico
- **Cloud:** Microsoft Azure (licencia nonprofit — $2.000 USD/año cómputo)
- **Hosting:** Azure Static Web Apps
- **Backend/dinámica:** Azure Functions (serverless)
- **Repositorios:** GitHub — un repositorio por proyecto, sin mezcla
- **Identidad visual:** Manual de marca SIC (Canva Pro, licencia nonprofit)
- **CI/CD:** GitHub Actions → Azure Static Web Apps

### Reglas de repositorio
- Cada subdominio tiene su propio repositorio GitHub independiente
- Nomenclatura: `cenigaa-[nombre-subdominio]`
- Branch principal: `main` → producción automática vía GitHub Actions
- Branch de desarrollo: `dev`

### Archivos obligatorios en cada repositorio
```
CENIGAA_CONTEXT.md              ← este archivo
CENIGAA_STATUS_[nodo].md        ← estado del nodo (ej: CENIGAA_STATUS_www.md)
staticwebapp.config.json        ← configuración Azure SWA
```

### Tokens de color oficiales (Manual de Marca SIC)
```css
--color-brand-blue:    #4A60D8;   /* Pantone 2726c — Agua/Ambiente */
--color-brand-green:   #43B02A;   /* Pantone 361c  — Agricultura   */
--color-brand-orange:  #F4511E;   /* Pantone 171c  — Energía       */
--color-brand-navy:    #162341;   /* Pantone 282c  — Institucional  */
```

### Tipografía oficial web
- **Inter** (Google Fonts) — fuente oficial para todas las aplicaciones digitales
- Familia Astera — exclusiva del wordmark del imagotipo, no disponible en web

### Lección aprendida — staticwebapp.config.json
```
⚠️ navigationFallback NO usar en sitios HTML estático con paths
relativos en subpáginas (/views/). Rompe carga de CSS/JS.
Solo usar en SPAs (React/Vue). Reintroducir solo tras pruebas en staging.
```

---

## 3. MAPA DE NODOS WEB DEL ECOSISTEMA

### CAPA A — Producción activa

| Subdominio | Repositorio | Tipo | Estado |
|---|---|---|---|
| www.cenigaa.org | cenigaa-www | Estático — HTML/CSS/JS vanilla | ✅ Activo |
| gaaialab.cenigaa.org | cenigaa-gaaialab | Dinámico — React + Vite | ✅ Activo |
| obs-clima-huila.cenigaa.org | cenigaa-obs-clima-huila | Dinámico — React + Vite + Leaflet | ✅ Activo — ROGAA Nodo 1 |

### CAPA B — Desarrollo prioritario

| Subdominio | Tipo | Prioridad | Estado |
|---|---|---|---|
| museosuelos.cenigaa.org | Dinámico — React + Leaflet + Azure Functions | 1 | 🔧 En desarrollo |
| observatorio.cenigaa.org | Hub ROGAA — agrupa 5 observatorios | 2 | 📋 Por iniciar |
| cacao.cenigaa.org | Dinámico — datos territoriales | 3 | 📋 Doc técnico disponible |

### CAPA C — Pendientes con identidad definida

| Subdominio | Tipo | Estado |
|---|---|---|
| doublee.cenigaa.org | Presencia EBT | Pendiente |
| hbs.cenigaa.org | Presencia EBT | Pendiente |
| intecc.cenigaa.org | Presencia unidad servicios | Pendiente |
| agb4.cenigaa.org | Plataforma agronegocio | Pendiente |
| academy.cenigaa.org | Landing formación | Pendiente |
| agrosem-huila.cenigaa.org | Proyecto 2025-2026 | Sin doc técnico |
| agrosem-putumayo.cenigaa.org | Proyecto 2025-2026 | Sin doc técnico |
| dengue.cenigaa.org | Servicio IA | Sin doc técnico |
| dona.cenigaa.org | Donaciones ESAL | ⏸ Revisión legal |

### CAPA D — Fase futura

| Subdominio | Tipo | Estado |
|---|---|---|
| sgc.cenigaa.org | SGC multi-agente, acceso miembros | 🔒 Diseño futuro |

---

## 4. ARQUITECTURA INSTITUCIONAL — LAS TRES CAPAS

### Capa 1: Grupos de Investigación
Producen conocimiento científico → publicaciones, proyectos CTI

| Grupo | Líder | Nota |
|---|---|---|
| DSGAA — Dinámica de Sistemas GeoAgroAmbientales | PhD Wilfredo Marimon Bolívar | Minciencias Categoría A |
| GHIDA — HidroIngeniería y Desarrollo Agropecuario | PhD Jaime Izquierdo Bautista | |
| ECOSURC — Ecosistemas Surcolombianos | PhD Alfredo Olaya Amaya | |
| GIPE — Productivity and Environment | PhD Freddy Humberto Escobar Macualo | |
| COFA — Comportamiento de Fases | MSc Jairo Antonio Sepúlveda Gaona | |
| Food Science & Agroenvironmental Quality | Amalia Molina Chaux | |
| GeoIA | Juan Camilo Salas Díaz | |
| Hidroinformática | Jorge I. Chavarro D. | |

### Capa 2: Unidades Especializadas de Servicios Tecnológicos
Traducen conocimiento en servicios contratables

- **INTECC** — Inteligencia Competitiva CENIGAA → sección en www.cenigaa.org
- **Academy for Scientists** — Apropiación social del conocimiento → sección en www.cenigaa.org
- **LABGAA Mobile** — Laboratorio móvil de reacción inmediata → sección en www.cenigaa.org
- **GAA+IA Lab** — Cómputo científico e IA → **gaaialab.cenigaa.org** (subdominio propio)
- **Innovación Exponencial** — Plataforma de emprendimiento → sección en www.cenigaa.org

### Capa 3: Marcas EBT (registro SIC)
Emprendimientos de base tecnológica derivados de investigación

- **DOUBLEE** — Energía–Ambiente
- **HBS HidroBioSistemas** — Agricultura–Ambiente
- **INTECC** — Inteligencia Competitiva
- **GEO Processing** — Data Science, ML, HPC
- **Agribusiness 4.0 (AGB4)** — Agronegocios sostenibles

---

## 5. RED ROGAA-HUILA

La Red de Observatorios GeoAgroAmbientales del Huila es la infraestructura
de datos territorial de CENIGAA. Cinco nodos temáticos + un hub central.

| Nodo | Subdominio | Estado |
|---|---|---|
| Hub central | observatorios.cenigaa.org | 📋 Por crear |
| Nodo 1 — Climático | obs-clima-huila.cenigaa.org | ✅ En producción |
| Nodo 2 — Suelos | obs-suelos-huila.cenigaa.org | 📋 Futuro |
| Nodo 3 — Hídrico | obs-hidrico-huila.cenigaa.org | 📋 Futuro |
| Nodo 4 — Cobertura | obs-cobertura-huila.cenigaa.org | 📋 Futuro |
| Nodo 5 — Socio-Espacial | obs-socio-huila.cenigaa.org | 📋 Futuro |

---

## 6. PRINCIPIOS DE DESARROLLO

### Identidad visual
- Aplicar siempre el manual de marca CENIGAA (tokens SIC en sección 2)
- Nunca improvisar paletas o tipografías fuera del manual
- El logo tiene registro SIC — usarlo exactamente como está definido
- Slogan en aplicaciones digitales: **DESARROLLO SUSTENTABLE** (versalitas)

### Comunicación científica
- Todo texto web equilibra rigor técnico con accesibilidad pública
- Audiencias simultáneas: evaluadores Minciencias/SGR, socios europeos, comunidades locales, financiadores
- Nunca reducir CENIGAA a solo una dimensión (no solo ambiental, no solo agrícola)

### Coherencia ecosistémica
- Cada nodo enlaza hacia www.cenigaa.org como nodo central
- www.cenigaa.org referencia todos los subdominios activos
- Footer de todos los nodos incluye: logo CENIGAA + enlace www.cenigaa.org + info@cenigaa.org
- Header de todos los nodos incluye: enlace "← CENIGAA" hacia www.cenigaa.org

### Rendimiento y accesibilidad
- Lighthouse ≥ 90 en Performance, Accessibility, Best Practices, SEO
- Imágenes en WebP con lazy loading obligatorio
- Estructura preparada para ES/EN desde el inicio
- SEO: meta tags, Open Graph, JSON-LD ResearchOrganization en todos los nodos

---

## 7. DIRECTIVA INSTITUCIONAL

| Rol | Nombre | Contacto |
|---|---|---|
| Director General | Jorge I. Chavarro D. | jorge.chavarro@cenigaa.org |
| Director Científico | Dr. Armando Torrente Trujillo | armando.torrente@cenigaa.org |
| Secretario General | Cristian Eduardo Cifuentes Céspedes | cristian.cifuentes@cenigaa.org |
| Directora CENIGAA EU | Amalia Molina Chaux | — |

---

## 8. FLUJO DE TRABAJO ESTÁNDAR

```
1. LEER este archivo completo
2. LEER CENIGAA_STATUS_[nodo].md para conocer el estado actual
3. SI hay documento técnico → ejecutar pipeline DOC2WEB
4. SI es web estática → aplicar convenciones de capa estática
5. SI es web dinámica → aplicar convenciones de capa dinámica
6. GENERAR lista de tareas con dependencias explícitas
7. EJECUTAR en branch dev
8. VERIFICAR coherencia ecosistémica antes de PR a main
9. ACTUALIZAR CENIGAA_STATUS_[nodo].md al cerrar sesión
```

---

*CENIGAA_CONTEXT.md v1.1 — Mayo 2026*
*Reemplaza la versión v1.0. Cambios: slogan corregido a "DESARROLLO SUSTENTABLE",
obs-clima-huila añadido a CAPA A, red ROGAA-Huila documentada,
líderes de grupos incorporados, lección staticwebapp.config.json registrada.*
