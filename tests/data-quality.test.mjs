import test from 'node:test'
import assert from 'node:assert/strict'

import { readJson, runValidation } from '../scripts/validate-data.mjs'

test('la validacion integral de datos pasa', () => {
  const stats = runValidation()

  assert.equal(stats.totalEstaciones, 150)
  assert.equal(stats.estacionesConPrecipitacion, 149)
  assert.equal(stats.totalMunicipios, 36)
})

test('resumen_departamento mantiene coherencia con estaciones', () => {
  const resumen = readJson('public/data/resumen_departamento.json')

  assert.equal(resumen.total_estaciones_aptas, 150)
  assert.equal(resumen.estaciones_con_precipitacion, 149)
  assert.equal(resumen.periodo_linea_base, '1930 – 2017')
})

test('enso-estado mantiene fechas ISO y contenido minimo', () => {
  const enso = readJson('public/data/enso-estado.json')

  assert.match(enso._meta.ultima_actualizacion, /^\d{4}-\d{2}-\d{2}$/)
  assert.match(enso._meta.proxima_actualizacion, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(Array.isArray(enso.linea_tiempo) && enso.linea_tiempo.length >= 1)
  assert.ok(Array.isArray(enso.indicadores) && enso.indicadores.length >= 1)
})

test('enso-contenido expone narrativa estructurada y reusable', () => {
  const contenido = readJson('public/data/enso-contenido.json')

  assert.equal(typeof contenido.hero.subtitle, 'string')
  assert.ok(contenido.relevancia.paragraphs.some((text) => text.includes('{{eventPhaseWithYear}}')))
  assert.ok(contenido.historico_huila.paragraphs.some((text) => text.includes('{{historicalYears}}')))
  assert.ok(Array.isArray(contenido.creditos.observatory_items) && contenido.creditos.observatory_items.length >= 3)
})
