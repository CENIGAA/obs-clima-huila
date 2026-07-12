# Observatorio Climático del Huila · "Efraín Domínguez Calle"

**CENIGAA · Red ROGAA-Huila · Nodo 1 de 5**

> Primera plataforma pública de referencia climática departamental del Huila.

🌐 **Web:** [obs-clima-huila.cenigaa.org](https://obs-clima-huila.cenigaa.org)  
🏛 **Institución:** [CENIGAA](https://www.cenigaa.org) · Centro de Investigación en Ciencias y Recursos GeoAgroAmbientales  
🔬 **Grupo:** Hidroinformática CENIGAA  
⚗ **Infraestructura:** [GAA+IA Lab](https://gaaialab.cenigaa.org)  

---

## Descripción

87 años de datos climáticos del Departamento del Huila (1930–2017).  
150 estaciones meteorológicas aptas. 36 municipios cubiertos.  
Análisis de tendencias Mann-Kendall, variabilidad hidroclimática y 6 componentes metodológicos del libro **CC_VCE Huila** (Domínguez Calle et al., 2018).

**Red ROGAA-Huila:** Este observatorio es el Nodo 1 de la Red de Observatorios GeoAgroAmbientales del Huila.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Mapas | Leaflet.js + GeoJSON |
| Visualizaciones | Recharts + Chart.js |
| Hosting | Azure Static Web Apps (free tier) |
| CI/CD | GitHub Actions → Azure |
| Datos (Fase 1) | JSON estático · `/public/data/` |

---

## Estructura de datos

```
public/data/
├── estaciones.json           # 150 estaciones + tendencias MK
├── municipios_huila.geojson  # 36 municipios cubiertos por las estaciones
├── resumen_departamento.json # Hallazgos departamentales
└── estacion_{CODIGO}.json    # Datos por estación (×150)
```

---

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build    # Build de producción → /build
npm run preview  # Preview del build
```

## Mantenimiento editorial ENSO

La sección `/enso` ya no se actualiza editando React directamente.

- Guía operativa: [MANTENIMIENTO_ENSO.md](/Users/monox/webstack/obs-clima-huila/MANTENIMIENTO_ENSO.md)
- Estado operativo: `public/data/enso-estado.json`
- Narrativa institucional: `public/data/enso-contenido.json`

---

## Alineación política pública

- ✅ Plan Huila 2050: Preparándose para el Cambio Climático (CAM - Gobernación del Huila)
- ✅ Plan de Cambio Climático del Municipio de Neiva
- ✅ ODS 13: Acción por el clima
- ✅ Horizonte Europa · Clusters 5 y 6

---

## Dedicatoria

Este observatorio está dedicado a **Efraín Antonio Domínguez Calle (1960–2021)**, Asesor Científico NRMACENIGAA y uno de los mayores conocedores de la hidrología colombiana. Autor principal del libro base *CC_VCE Huila* (2018).

---

## Licencia

MIT License · Datos abiertos bajo política CENIGAA de ciencia abierta.

---

*CENIGAA · NIT 900345215-2 · Neiva, Huila, Colombia · info@cenigaa.org*
