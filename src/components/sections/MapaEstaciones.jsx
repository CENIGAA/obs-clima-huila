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
import { useEstaciones, useDataLoader } from '../../hooks/useDataLoader'
import PanelEstacion from './PanelEstacion'

const HUILA_CENTER = [2.5, -75.5]
const HUILA_ZOOM = 8

const TENDENCIA_STYLE = {
  increasing: { color: '#4A60D8', label: 'Creciente' },
  decreasing: { color: '#F4511E', label: 'Decreciente' },
  'no trend': { color: '#94A3B8', label: 'Sin tendencia' },
}
const TENDENCIA_FALLBACK = { color: '#94A3B8', label: 'Sin tendencia' }

const TENDENCIA_FILTROS = [
  { value: 'all',        label: 'Todas' },
  { value: 'increasing', label: 'Creciente'   },
  { value: 'decreasing', label: 'Decreciente' },
  { value: 'no trend',   label: 'Sin tendencia' },
]

const ESTADO_FILTROS = [
  { value: 'all', label: 'Todas' },
  { value: 'ACT', label: 'Activa' },
]

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

function tendenciaKey(t) {
  // Normaliza para que increasing/decreasing/no trend caigan en las 3 categorías
  // de la leyenda; null o cualquier otro valor cuenta como "no trend".
  if (t === 'increasing' || t === 'decreasing') return t
  return 'no trend'
}

export default function MapaEstaciones() {
  const { data: estaciones, loading: loadingEst, error: errorEst } = useEstaciones()
  const { data: municipios } = useDataLoader('data/municipios_huila.geojson')
  const [seleccionada, setSeleccionada] = useState(null)

  // Filtros
  const [fMunicipio, setFMunicipio] = useState('all')
  const [fTendencia, setFTendencia] = useState('all')
  const [fEstado,    setFEstado]    = useState('all')

  // Lista de municipios únicos ordenados alfabéticamente
  const municipiosOpciones = useMemo(() => {
    if (!Array.isArray(estaciones)) return []
    const set = new Set()
    for (const e of estaciones) if (e.municipio) set.add(e.municipio)
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [estaciones])

  // Estaciones que pasan los 3 filtros
  const estacionesFiltradas = useMemo(() => {
    if (!Array.isArray(estaciones)) return []
    return estaciones.filter((e) => {
      if (fMunicipio !== 'all' && e.municipio !== fMunicipio) return false
      if (fEstado    !== 'all' && e.estado    !== fEstado)    return false
      if (fTendencia !== 'all') {
        if (tendenciaKey(tendenciaPrincipal(e)) !== fTendencia) return false
      }
      return true
    })
  }, [estaciones, fMunicipio, fTendencia, fEstado])

  // Conteo por tendencia sobre el subconjunto visible
  const conteoPorTendencia = useMemo(() => {
    const c = { increasing: 0, decreasing: 0, 'no trend': 0 }
    for (const e of estacionesFiltradas) {
      c[tendenciaKey(tendenciaPrincipal(e))] += 1
    }
    return c
  }, [estacionesFiltradas])

  const totalEstaciones = Array.isArray(estaciones) ? estaciones.length : 0
  const totalVisibles   = estacionesFiltradas.length

  const geojsonStyle = () => MUNICIPIO_POLYGON_STYLE

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

        <Filtros
          municipios={municipiosOpciones}
          fMunicipio={fMunicipio}
          fTendencia={fTendencia}
          fEstado={fEstado}
          onMunicipio={setFMunicipio}
          onTendencia={setFTendencia}
          onEstado={setFEstado}
          totalVisibles={totalVisibles}
          totalEstaciones={totalEstaciones}
        />

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

            {estacionesFiltradas.map((e) => {
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

          {!loadingEst && !errorEst && totalEstaciones > 0 && totalVisibles === 0 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 rounded-full bg-white/95 shadow text-[12px] text-neutral-600 font-medium">
              Sin estaciones que coincidan con los filtros
            </div>
          )}
        </div>

        <PanelEstacion
          estacion={seleccionada}
          onClose={() => setSeleccionada(null)}
        />
      </div>
    </section>
  )
}

// ─── Filtros ───────────────────────────────────────────────────────────────

function Filtros({
  municipios,
  fMunicipio, fTendencia, fEstado,
  onMunicipio, onTendencia, onEstado,
  totalVisibles, totalEstaciones,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
        {/* Municipio */}
        <FilterGroup label="Municipio" htmlFor="filtro-municipio">
          <select
            id="filtro-municipio"
            value={fMunicipio}
            onChange={(e) => onMunicipio(e.target.value)}
            className="
              w-full lg:w-[220px]
              h-9 rounded-full bg-neutral-50 border border-neutral-200
              px-4 pr-8 text-[13px] text-[#162341]
              hover:border-[#4A60D8] focus:border-[#4A60D8] focus:bg-white
              focus:outline-none focus:ring-2 focus:ring-[#4A60D8]/20
              transition-colors
              appearance-none cursor-pointer
            "
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23162341' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="all">Todos los municipios</option>
            {municipios.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Tendencia */}
        <FilterGroup label="Tendencia">
          <PillGroup
            options={TENDENCIA_FILTROS}
            value={fTendencia}
            onChange={onTendencia}
            ariaLabel="Filtrar por tendencia Mann-Kendall"
          />
        </FilterGroup>

        {/* Estado */}
        <FilterGroup label="Estado">
          <PillGroup
            options={ESTADO_FILTROS}
            value={fEstado}
            onChange={onEstado}
            ariaLabel="Filtrar por estado de la estación"
          />
        </FilterGroup>

        {/* Contador */}
        <div className="lg:ml-auto text-[12px] text-neutral-500 font-mono shrink-0">
          <span className="text-[#162341] font-bold">{totalVisibles}</span>
          <span className="text-neutral-400"> / {totalEstaciones} estaciones</span>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ label, htmlFor, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="block text-[10.5px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function PillGroup({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-full"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`
              px-3 h-7 rounded-full text-[12px] font-semibold
              transition-colors
              ${active
                ? 'bg-[#162341] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#162341] hover:bg-white'
              }
            `}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Leyenda ───────────────────────────────────────────────────────────────

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
