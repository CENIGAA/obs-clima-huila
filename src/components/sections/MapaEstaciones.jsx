import { useState, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  ZoomControl,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEstaciones, useEstacion, useDataLoader } from '../../hooks/useDataLoader'

const HUILA_CENTER = [2.5, -75.5]
const HUILA_ZOOM = 8

const TENDENCIA_STYLE = {
  increasing: { color: '#4A60D8', label: 'Creciente' },
  decreasing: { color: '#F4511E', label: 'Decreciente' },
  'no trend': { color: '#94A3B8', label: 'Sin tendencia' },
}
const TENDENCIA_FALLBACK = { color: '#94A3B8', label: 'Sin tendencia' }

const MUNICIPIO_POLYGON_STYLE = {
  fillColor: '#EEF1FB',
  fillOpacity: 1,
  color: '#4A60D8',
  weight: 1,
  opacity: 0.3,
}

function tendenciaPrincipal(est) {
  const sensor = est?.sensores?.[0]
  const t = est?.resumen?.[sensor]?.tendencia
  return t ?? null
}

function styleForTendencia(t) {
  return TENDENCIA_STYLE[t] ?? TENDENCIA_FALLBACK
}

function formatPeriodo(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return null
  const yi = fechaInicio.slice(0, 4)
  const yf = fechaFin.slice(0, 4)
  return `${yi} – ${yf}`
}

function computeCompletitud(fechaInicio, fechaFin, nMeses) {
  if (!fechaInicio || !fechaFin || !nMeses) return null
  const [yi, mi] = fechaInicio.split('-').map(Number)
  const [yf, mf] = fechaFin.split('-').map(Number)
  const expected = (yf - yi) * 12 + (mf - mi) + 1
  if (expected <= 0) return null
  return Math.round((nMeses / expected) * 1000) / 10
}

function SidePanel({ estacion, onClose }) {
  const { data: detalle, loading } = useEstacion(estacion?.codigo ?? null)

  if (!estacion) return null

  const tend = tendenciaPrincipal(estacion)
  const { color, label } = styleForTendencia(tend)
  const sensor = estacion?.sensores?.[0]
  const pt = detalle?.datos?.[sensor]
  const periodo = pt ? formatPeriodo(pt.fecha_inicio, pt.fecha_fin) : null
  const completitud = pt
    ? computeCompletitud(pt.fecha_inicio, pt.fecha_fin, pt.n_meses)
    : null

  return (
    <aside
      className="
        absolute top-3 right-3 z-[1000] w-[300px] max-w-[calc(100%-1.5rem)]
        rounded-2xl bg-white/95 backdrop-blur-md shadow-xl
        border border-neutral-200 p-5
        animate-fade-in
      "
      aria-label={`Detalle de estación ${estacion.nombre}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            Estación · {estacion.codigo}
          </p>
          <h3 className="text-[15px] font-bold text-[#162341] mt-0.5 leading-tight">
            {estacion.nombre}
          </h3>
          <p className="text-[12px] text-neutral-500 mt-0.5">
            {estacion.municipio}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="
            shrink-0 -mt-1 -mr-1 w-7 h-7 rounded-full
            text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
            text-lg leading-none
          "
          aria-label="Cerrar panel"
        >
          ×
        </button>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-[12.5px]">
        <dt className="text-neutral-500">Período</dt>
        <dd className="text-[#162341] font-medium font-mono">
          {loading ? '…' : periodo ?? '—'}
        </dd>

        <dt className="text-neutral-500">Completitud</dt>
        <dd className="text-[#162341] font-medium font-mono">
          {loading ? '…' : completitud != null ? `${completitud}%` : '—'}
        </dd>

        <dt className="text-neutral-500">Tendencia MK</dt>
        <dd className="font-medium flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: color }}
            aria-hidden="true"
          />
          <span style={{ color }}>{label}</span>
        </dd>
      </dl>
    </aside>
  )
}

export default function MapaEstaciones() {
  const { data: estaciones, loading: loadingEst, error: errorEst } = useEstaciones()
  const { data: municipios } = useDataLoader('data/municipios_huila.geojson')
  const [seleccionada, setSeleccionada] = useState(null)

  const conteoPorTendencia = useMemo(() => {
    if (!Array.isArray(estaciones)) return null
    const c = { increasing: 0, decreasing: 0, 'no trend': 0, otros: 0 }
    for (const e of estaciones) {
      const t = tendenciaPrincipal(e)
      if (t in c) c[t] += 1
      else c.otros += 1
    }
    return c
  }, [estaciones])

  const geojsonStyle = () => MUNICIPIO_POLYGON_STYLE

  // El geojson actual contiene centroides municipales (Point); cuando se
  // reemplace por polígonos, `style` arriba aplica automáticamente y este
  // fallback queda inactivo.
  const geojsonPointToLayer = (_feature, latlng) =>
    L.circleMarker(latlng, {
      radius: 2,
      color: '#4A60D8',
      weight: 1,
      opacity: 0.25,
      fillColor: '#4A60D8',
      fillOpacity: 0.15,
      interactive: false,
    })

  return (
    <section
      id="mapa"
      className="py-20 border-t border-neutral-100"
      aria-labelledby="mapa-heading"
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl" aria-hidden="true">🗺</span>
          <div>
            <h2
              id="mapa-heading"
              className="text-2xl font-bold text-[#162341] tracking-tight"
            >
              Mapa de estaciones
            </h2>
            <p className="text-neutral-500 mt-1 text-[14px]">
              150 estaciones coloreadas por tendencia Mann-Kendall · Click → panel de detalle
            </p>
          </div>
        </div>

        <Leyenda conteo={conteoPorTendencia} />

        <div
          className="
            relative mt-6 rounded-2xl overflow-hidden
            border border-neutral-200 bg-[#EEF1FB]
            h-[560px]
          "
        >
          {errorEst && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-red-50/95 text-red-700 text-sm font-medium">
              Error cargando estaciones: {errorEst}
            </div>
          )}

          <MapContainer
            center={HUILA_CENTER}
            zoom={HUILA_ZOOM}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ height: '100%', width: '100%', background: '#EEF1FB' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="topleft" />

            {municipios && (
              <GeoJSON
                data={municipios}
                style={geojsonStyle}
                pointToLayer={geojsonPointToLayer}
              />
            )}

            {Array.isArray(estaciones) &&
              estaciones.map((e) => {
                const tend = tendenciaPrincipal(e)
                const { color, label } = styleForTendencia(tend)
                return (
                  <CircleMarker
                    key={e.codigo}
                    center={[e.latitud, e.longitud]}
                    radius={6}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 1.5,
                      fillColor: color,
                      fillOpacity: 0.9,
                    }}
                    eventHandlers={{
                      click: () => setSeleccionada(e),
                    }}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -6]}
                      opacity={1}
                      className="och-tooltip"
                    >
                      <div className="text-[11px] leading-tight">
                        <div className="font-bold text-[#162341]">{e.nombre}</div>
                        <div className="text-neutral-500">{e.municipio}</div>
                        <div className="mt-0.5" style={{ color }}>
                          {label}
                        </div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                )
              })}
          </MapContainer>

          {loadingEst && !errorEst && (
            <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-full bg-white/95 shadow text-[11px] text-neutral-500 font-mono">
              Cargando estaciones…
            </div>
          )}

          <SidePanel
            estacion={seleccionada}
            onClose={() => setSeleccionada(null)}
          />
        </div>
      </div>
    </section>
  )
}

function Leyenda({ conteo }) {
  const items = [
    { key: 'increasing', label: 'Creciente',     color: '#4A60D8' },
    { key: 'decreasing', label: 'Decreciente',   color: '#F4511E' },
    { key: 'no trend',   label: 'Sin tendencia', color: '#94A3B8' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[12px]">
      {items.map((it) => (
        <div key={it.key} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
            style={{ background: it.color }}
            aria-hidden="true"
          />
          <span className="text-neutral-600">{it.label}</span>
          {conteo && (
            <span className="font-mono text-neutral-400 text-[11px]">
              · {conteo[it.key] ?? 0}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
