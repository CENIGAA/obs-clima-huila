import fs from 'node:fs'
import path from 'node:path'

export const root = process.cwd()

export function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath)
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function validateEstaciones(estaciones) {
  assert(Array.isArray(estaciones), 'estaciones.json debe ser un arreglo')
  assert(estaciones.length > 0, 'estaciones.json no puede estar vacío')

  const codes = new Set()
  const municipios = new Set()
  let estacionesConPrecipitacion = 0

  for (const estacion of estaciones) {
    assert(typeof estacion.codigo === 'string' && estacion.codigo.length > 0, 'Cada estación debe tener código')
    assert(!codes.has(estacion.codigo), `Código duplicado de estación: ${estacion.codigo}`)
    codes.add(estacion.codigo)

    assert(typeof estacion.nombre === 'string' && estacion.nombre.length > 0, `La estación ${estacion.codigo} debe tener nombre`)
    assert(typeof estacion.municipio === 'string' && estacion.municipio.length > 0, `La estación ${estacion.codigo} debe tener municipio`)
    assert(isFiniteNumber(estacion.latitud), `Latitud inválida para la estación ${estacion.codigo}`)
    assert(isFiniteNumber(estacion.longitud), `Longitud inválida para la estación ${estacion.codigo}`)
    assert(Array.isArray(estacion.sensores), `Sensores inválidos para la estación ${estacion.codigo}`)

    municipios.add(estacion.municipio)

    if (estacion.sensores.some((sensor) => String(sensor).startsWith('PT'))) {
      estacionesConPrecipitacion += 1
    }

    const stationFile = path.join(root, 'public', 'data', `estacion_${estacion.codigo}.json`)
    assert(fs.existsSync(stationFile), `Falta el archivo de detalle para la estación ${estacion.codigo}`)
  }

  return {
    totalEstaciones: estaciones.length,
    totalMunicipios: municipios.size,
    estacionesConPrecipitacion,
  }
}

export function validateResumen(resumen, stats) {
  assert(resumen && typeof resumen === 'object' && !Array.isArray(resumen), 'resumen_departamento.json debe ser un objeto')
  assert(typeof resumen.periodo_linea_base === 'string' && resumen.periodo_linea_base.length > 0, 'resumen_departamento.json debe incluir periodo_linea_base')
  assert(resumen.total_estaciones_aptas === stats.totalEstaciones, `total_estaciones_aptas (${resumen.total_estaciones_aptas}) no coincide con estaciones.json (${stats.totalEstaciones})`)
  assert(resumen.estaciones_con_precipitacion === stats.estacionesConPrecipitacion, `estaciones_con_precipitacion (${resumen.estaciones_con_precipitacion}) no coincide con estaciones.json (${stats.estacionesConPrecipitacion})`)
}

export function validateEnso(enso) {
  assert(enso && typeof enso === 'object' && !Array.isArray(enso), 'enso-estado.json debe ser un objeto')
  assert(enso._meta && typeof enso._meta === 'object', 'enso-estado.json debe incluir _meta')
  assert(/^\d{4}-\d{2}-\d{2}$/.test(enso._meta.ultima_actualizacion), 'ultima_actualizacion debe usar formato YYYY-MM-DD')
  assert(/^\d{4}-\d{2}-\d{2}$/.test(enso._meta.proxima_actualizacion), 'proxima_actualizacion debe usar formato YYYY-MM-DD')
  assert(Array.isArray(enso.linea_tiempo) && enso.linea_tiempo.length > 0, 'enso-estado.json debe incluir linea_tiempo')
  assert(Array.isArray(enso.indicadores) && enso.indicadores.length > 0, 'enso-estado.json debe incluir indicadores')
  assert(Array.isArray(enso.geovisores) && enso.geovisores.length > 0, 'enso-estado.json debe incluir geovisores')
}

export function validateEnsoContenido(ensoContenido) {
  assert(ensoContenido && typeof ensoContenido === 'object' && !Array.isArray(ensoContenido), 'enso-contenido.json debe ser un objeto')
  assert(typeof ensoContenido.hero?.subtitle === 'string', 'enso-contenido.json debe incluir hero.subtitle')
  assert(Array.isArray(ensoContenido.relevancia?.paragraphs) && ensoContenido.relevancia.paragraphs.length >= 2, 'enso-contenido.json debe incluir relevancia.paragraphs')
  assert(typeof ensoContenido.escala_nacional?.heading === 'string', 'enso-contenido.json debe incluir escala_nacional.heading')
  assert(Array.isArray(ensoContenido.historico_huila?.paragraphs) && ensoContenido.historico_huila.paragraphs.length >= 2, 'enso-contenido.json debe incluir historico_huila.paragraphs')
  assert(Array.isArray(ensoContenido.seguimiento_local?.regions) && ensoContenido.seguimiento_local.regions.length >= 1, 'enso-contenido.json debe incluir seguimiento_local.regions')
  assert(Array.isArray(ensoContenido.creditos?.sources_items) && ensoContenido.creditos.sources_items.length >= 1, 'enso-contenido.json debe incluir creditos.sources_items')
}

export function validateCatalog() {
  const catalogPath = path.join(root, 'public', 'data', 'catalogo_estaciones_CENIGAA.csv')
  assert(fs.existsSync(catalogPath), 'Falta catalogo_estaciones_CENIGAA.csv')
}

export function runValidation() {
  const estaciones = readJson('public/data/estaciones.json')
  const resumen = readJson('public/data/resumen_departamento.json')
  const enso = readJson('public/data/enso-estado.json')
  const ensoContenido = readJson('public/data/enso-contenido.json')

  const stats = validateEstaciones(estaciones)
  validateResumen(resumen, stats)
  validateEnso(enso)
  validateEnsoContenido(ensoContenido)
  validateCatalog()

  return stats
}

try {
  const stats = runValidation()
  console.log('Datos validados correctamente')
  console.log(`- Estaciones: ${stats.totalEstaciones}`)
  console.log(`- Estaciones con precipitación: ${stats.estacionesConPrecipitacion}`)
  console.log(`- Municipios cubiertos por estaciones: ${stats.totalMunicipios}`)
} catch (error) {
  console.error(`Validación fallida: ${error.message}`)
  process.exitCode = 1
}
