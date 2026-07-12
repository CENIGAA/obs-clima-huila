# Mantenimiento ENSO

Esta guía describe cómo actualizar la sección ENSO del Observatorio sin tocar código React y manteniendo las validaciones de calidad.

## Fuente de verdad

La página `/enso` usa tres fuentes del repo:

- `public/data/enso-estado.json`
  Contiene el estado operativo del fenómeno, fechas, cronología, indicadores, geovisores y contexto nacional.

- `public/data/enso-contenido.json`
  Contiene la narrativa editorial e institucional que se renderiza en la UI.

- `public/data/resumen_departamento.json`
  Aporta el contexto histórico del Observatorio: período base, total de estaciones y distribución de tendencias.

## Qué archivo editar

Edita `public/data/enso-estado.json` cuando cambie:

- la fase ENSO actual
- la fecha de actualización
- la próxima actualización
- la cronología del evento
- los indicadores operativos
- el contexto nacional o sectorial

Edita `public/data/enso-contenido.json` cuando cambie:

- el enfoque narrativo institucional
- los títulos o subtítulos de la sección
- el texto editorial de relevancia
- el texto explicativo de metodología o créditos
- el texto del bloque histórico o de seguimiento local

No edites `src/components/sections/Enso.jsx` para cambios editoriales normales.

## Placeholders permitidos

`public/data/enso-contenido.json` usa placeholders `{{...}}` que se resuelven automáticamente.

Placeholders disponibles:

- `{{eventPhase}}`
- `{{eventPhaseLower}}`
- `{{eventPhaseWithYear}}`
- `{{eventYear}}`
- `{{eventAnomalyWithUnit}}`
- `{{eventIntensityLower}}`
- `{{eventHorizon}}`
- `{{historicalYears}}`
- `{{historicalPeriod}}`
- `{{historicalTotalStations}}`
- `{{historicalPrecipitationStations}}`
- `{{historicalTrendIncreasing}}`
- `{{historicalTrendDecreasing}}`
- `{{historicalTrendNoTrend}}`
- `{{ideamConfirmationDateLong}}`
- `{{nationalUpdateDateLong}}`

Recomendaciones:

- usa placeholders cuando el texto dependa del año, la fase o una cifra que pueda cambiar
- evita duplicar números fijos en el texto si ya existen en los datos
- si hace falta un placeholder nuevo, primero hay que agregarlo en `Enso.jsx`

## Reglas editoriales

Mantener estas reglas:

- tono institucional y científico
- priorizar fuentes oficiales o académicas
- no usar referencias periodísticas salvo aprobación explícita
- evitar promesas temporales muy específicas si no dependen de un dato verificable
- preferir texto reusable entre escenarios `El Niño`, `La Niña` o `Neutral`

## Flujo de actualización recomendado

1. Actualiza `public/data/enso-estado.json`.
2. Ajusta `public/data/enso-contenido.json` si cambia la narrativa.
3. Ejecuta:

```bash
npm run validate:data
npm test
npm run lint
npm run build
```

4. Revisa visualmente `/enso` en local.

## Validaciones automáticas

El repo falla en CI si:

- `enso-estado.json` no tiene estructura válida
- `enso-contenido.json` pierde bloques obligatorios
- se rompe la coherencia de los datos base
- lint, tests o build dejan de pasar

Archivos relacionados:

- `scripts/validate-data.mjs`
- `tests/data-quality.test.mjs`
- `src/components/sections/Enso.jsx`

## Cuándo sí tocar código

Solo modifica `src/components/sections/Enso.jsx` si necesitas:

- un placeholder nuevo
- una nueva sección visual
- una nueva fuente de datos
- cambiar la estructura del render

Si cambias la estructura del contenido, actualiza también:

- `public/data/enso-contenido.json`
- `scripts/validate-data.mjs`
- `tests/data-quality.test.mjs`
