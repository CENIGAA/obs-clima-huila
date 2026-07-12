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
import {
  Activity,
  Filter,
  MapPinned,
  Radar,
  RotateCcw,
  Waves,
} from 'lucide-react'
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
  { value: 'all', label: 'Todas' },
  { value: 'increasing', label: 'Creciente' },
  { value: 'decreasing', label: 'Decreciente' },
  { value: 'no trend', label: 'Sin tendencia' },
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

const GUIDE_STEPS = [
  {
    icon: Filter,
    title: 'Filtra el universo',
    text: 'Cruza municipio, tendencia y estado para reducir rápidamente el subconjunto relevante.',
  },
  {
    icon: MapPinned,
    title: 'Ubica el patrón espacial',
    text: 'Cada punto condensa el comportamiento principal de precipitación evaluado con Mann-Kendall.',
  },
  {
    icon: Radar,
    title: 'Abre el panel técnico',
    text: 'Cada estación expone series, estacionalidad, tendencias, distribuciones y relación con ENSO.',
  },
]

function tendenciaPrincipal(est) {
  const sensor = est?.sensores?.[0]
  const t = est?.resumen?.[sensor]?.tendencia
  return t ?? null
}

function styleForTendencia(t) {
  return TENDENCIA_STYLE[t] ?? TENDENCIA_FALLBACK
}

function tendenciaKey(t) {
  if (t === 'increasing' || t === 'decreasing') return t
  return 'no trend'
}

function porcentaje(parte, total) {
  if (!total) return '0%'
  return `${Math.round((parte / total) * 100)}%`
}

export default function MapaEstaciones() {
  const { data: estaciones, loading: loadingEst, error: errorEst } = useEstaciones()
  const { data: municipios } = useDataLoader('data/municipios_huila.geojson')
  const [seleccionada, setSeleccionada] = useState(null)

  const [fMunicipio, setFMunicipio] = useState('all')
  const [fTendencia, setFTendencia] = useState('all')
  const [fEstado, setFEstado] = useState('all')

  const municipiosOpciones = useMemo(() => {
    if (!Array.isArray(estaciones)) return []
    const set = new Set()
    for (const e of estaciones) if (e.municipio) set.add(e.municipio)
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [estaciones])

  const estacionesFiltradas = useMemo(() => {
    if (!Array.isArray(estaciones)) return []
    return estaciones.filter((e) => {
      if (fMunicipio !== 'all' && e.municipio !== fMunicipio) return false
      if (fEstado !== 'all' && e.estado !== fEstado) return false
      if (fTendencia !== 'all' && tendenciaKey(tendenciaPrincipal(e)) !== fTendencia) return false
      return true
    })
  }, [estaciones, fMunicipio, fTendencia, fEstado])

  const conteoPorTendencia = useMemo(() => {
    const c = { increasing: 0, decreasing: 0, 'no trend': 0 }
    for (const e of estacionesFiltradas) c[tendenciaKey(tendenciaPrincipal(e))] += 1
    return c
  }, [estacionesFiltradas])

  const totalEstaciones = Array.isArray(estaciones) ? estaciones.length : 0
  const totalVisibles = estacionesFiltradas.length

  const estacionesActivas = useMemo(() => {
    if (!Array.isArray(estaciones)) return 0
    return estaciones.filter((e) => e.estado === 'ACT').length
  }, [estaciones])

  const resumenSeleccion = useMemo(() => {
    if (!seleccionada) return null
    const tendencia = styleForTendencia(tendenciaPrincipal(seleccionada))
    return {
      tendencia,
      sensores: Array.isArray(seleccionada.sensores) ? seleccionada.sensores.length : 0,
      rango: seleccionada.inicio && seleccionada.fin
        ? `${seleccionada.inicio} - ${seleccionada.fin}`
        : 'Serie no reportada',
    }
  }, [seleccionada])

  const hayFiltrosActivos = fMunicipio !== 'all' || fTendencia !== 'all' || fEstado !== 'all'

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

  const clearFilters = () => {
    setFMunicipio('all')
    setFTendencia('all')
    setFEstado('all')
  }

  return (
    <section
      id="mapa"
      className="py-20 border-t border-neutral-100 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_22%,#ffffff_100%)]"
      aria-labelledby="mapa-heading"
    >
      <div className="container-main">
        <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.42fr)] xl:items-start">
          <article className="rounded-[28px] border border-[#C5CEEF] bg-[#162341] text-white p-6 sm:p-7 shadow-[0_18px_50px_-24px_rgba(22,35,65,0.75)]">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8B9FE8]">
              <Waves size={14} aria-hidden="true" />
              Monitoreo espacial
            </span>
            <h2
              id="mapa-heading"
              className="mt-4 text-3xl sm:text-[2.35rem] font-bold tracking-tight leading-tight"
            >
              Estaciones climáticas para lectura territorial rápida y análisis técnico.
            </h2>
            <p className="mt-4 max-w-xl text-[14px] sm:text-[15px] text-white/78 leading-relaxed">
              Esta vista concentra la red de observación del Huila y permite pasar de un
              patrón departamental a una estación puntual sin perder contexto metodológico.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetricCard
                icon={MapPinned}
                value={String(totalEstaciones || 150)}
                label="estaciones visibles en red"
              />
              <MetricCard
                icon={Activity}
                value={String(estacionesActivas)}
                label="estaciones activas"
              />
              <MetricCard
                icon={Radar}
                value={String(municipiosOpciones.length)}
                label="municipios cubiertos"
              />
            </div>

            <div className="mt-6 grid gap-3">
              {GUIDE_STEPS.map((step) => (
                <GuideCard key={step.title} {...step} />
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6 xl:p-7 shadow-[0_18px_50px_-30px_rgba(22,35,65,0.28)]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-2xl min-w-0">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A60D8]">
                    <Filter size={14} aria-hidden="true" />
                    Panel operativo
                  </span>
                  <h3 className="mt-3 text-[1.45rem] sm:text-[1.7rem] font-bold text-[#162341] tracking-tight text-balance">
                    Navega la red, valida cobertura y abre el detalle por estación.
                  </h3>
                  <p className="mt-3 text-[14px] text-neutral-600 leading-relaxed">
                    El color del punto resume la tendencia dominante. La selección de filtros se
                    refleja en el conteo visible para apoyar exploración técnica, revisión rápida
                    y lectura de cobertura territorial.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full sm:max-w-[390px] xl:min-w-[390px] xl:max-w-[390px]">
                  <RatioCard
                    value={String(totalVisibles)}
                    label="visibles"
                    accent="#4A60D8"
                  />
                  <RatioCard
                    value={porcentaje(totalVisibles, totalEstaciones)}
                    label="cobertura"
                    accent="#43B02A"
                  />
                  <RatioCard
                    value={String(conteoPorTendencia.decreasing + conteoPorTendencia.increasing)}
                    label="con señal"
                    accent="#F4511E"
                  />
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
                onReset={clearFilters}
                canReset={hayFiltrosActivos}
              />

              <div className="grid gap-4 items-start xl:grid-cols-[minmax(0,1fr)_300px]">
                <Leyenda conteo={conteoPorTendencia} />
                <SelectionCard
                  seleccionada={seleccionada}
                  resumenSeleccion={resumenSeleccion}
                />
              </div>

              <div
                className="
                  relative rounded-[26px] overflow-hidden
                  border border-neutral-200 bg-[#EEF1FB]
                  h-[420px] sm:h-[520px] xl:h-[620px]
                "
              >
                {errorEst && (
                  <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-red-50/95 px-6 text-center text-red-700 text-sm font-medium">
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
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
            </div>
          </article>
        </div>

        <PanelEstacion
          estacion={seleccionada}
          onClose={() => setSeleccionada(null)}
        />
      </div>
    </section>
  )
}

function MetricCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <Icon size={18} className="text-[#8B9FE8]" aria-hidden="true" />
      <div className="mt-3 text-3xl font-extrabold tracking-tight">{value}</div>
      <p className="mt-1 text-[12px] text-white/68 leading-snug">{label}</p>
    </div>
  )
}

function GuideCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-[#8B9FE8]">
          <Icon size={17} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-[13px] font-semibold text-white">{title}</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/68">{text}</p>
        </div>
      </div>
    </div>
  )
}

function RatioCard({ value, label, accent }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-[#F8FAFC] px-3 py-4 text-center min-w-0">
      <div className="text-[1.4rem] sm:text-[1.7rem] font-extrabold tracking-tight leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-2 text-[10px] sm:text-[10.5px] uppercase tracking-[0.14em] text-neutral-500 leading-snug">
        {label}
      </div>
    </div>
  )
}

function SelectionCard({ seleccionada, resumenSeleccion }) {
  if (!seleccionada || !resumenSeleccion) {
    return (
      <aside className="rounded-[24px] border border-dashed border-neutral-300 bg-neutral-50 p-5">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
          Estación seleccionada
        </p>
        <h4 className="mt-3 text-[18px] font-bold text-[#162341]">
          Haz click en un punto para inspeccionar una estación.
        </h4>
        <p className="mt-2 text-[13px] text-neutral-600 leading-relaxed">
          Verás una lectura previa aquí y el panel técnico completo se abrirá debajo
          del mapa con variables, series y métricas derivadas.
        </p>
      </aside>
    )
  }

  return (
    <aside className="rounded-[24px] border border-[#C5CEEF] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A60D8]">
        Estación seleccionada
      </p>
      <h4 className="mt-3 text-[22px] font-bold tracking-tight text-[#162341]">
        {seleccionada.nombre}
      </h4>
      <p className="mt-1 text-[13px] text-neutral-500">
        {seleccionada.municipio} · Código {seleccionada.codigo}
      </p>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">Tendencia principal</p>
        <p className="mt-2 text-[16px] font-semibold" style={{ color: resumenSeleccion.tendencia.color }}>
          {resumenSeleccion.tendencia.label}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SelectionMeta label="Sensores" value={String(resumenSeleccion.sensores)} />
        <SelectionMeta label="Estado" value={seleccionada.estado || 'No reportado'} />
        <SelectionMeta label="Altitud" value={seleccionada.altitud ? `${seleccionada.altitud} m` : 'N/D'} />
        <SelectionMeta label="Serie" value={resumenSeleccion.rango} />
      </div>

      <p className="mt-4 text-[12.5px] text-neutral-600 leading-relaxed">
        Abre el panel de detalle para consultar estacionalidad, tendencia anual,
        distribución de precipitaciones y señales ENSO por estación.
      </p>
    </aside>
  )
}

function SelectionMeta({ label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3">
      <p className="text-[10.5px] uppercase tracking-[0.12em] text-neutral-400">{label}</p>
      <p className="mt-1 text-[12.5px] font-semibold text-[#162341] leading-snug">{value}</p>
    </div>
  )
}

function Filtros({
  municipios,
  fMunicipio, fTendencia, fEstado,
  onMunicipio, onTendencia, onEstado,
  totalVisibles, totalEstaciones,
  onReset, canReset,
}) {
  return (
    <div className="mt-7 rounded-[24px] border border-neutral-200 bg-[#F8FAFC] p-4 sm:p-5">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end xl:gap-6">
          <FilterGroup label="Municipio" htmlFor="filtro-municipio">
            <select
              id="filtro-municipio"
              value={fMunicipio}
              onChange={(e) => onMunicipio(e.target.value)}
              className="
                w-full lg:w-[220px]
                h-10 rounded-full bg-white border border-neutral-200
                px-4 pr-8 text-[13px] text-[#162341]
                hover:border-[#4A60D8] focus:border-[#4A60D8]
                focus:outline-none focus:ring-2 focus:ring-[#4A60D8]/20
                transition-colors appearance-none cursor-pointer
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

          <FilterGroup label="Tendencia">
            <PillGroup
              options={TENDENCIA_FILTROS}
              value={fTendencia}
              onChange={onTendencia}
              ariaLabel="Filtrar por tendencia Mann-Kendall"
            />
          </FilterGroup>

          <FilterGroup label="Estado">
            <PillGroup
              options={ESTADO_FILTROS}
              value={fEstado}
              onChange={onEstado}
              ariaLabel="Filtrar por estado de la estación"
            />
          </FilterGroup>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-between 2xl:justify-end">
          <div className="rounded-full bg-white px-4 py-2 text-[12px] text-neutral-500 shadow-sm">
            <span className="font-bold text-[#162341]">{totalVisibles}</span>
            <span className="text-neutral-400"> / {totalEstaciones} estaciones visibles</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors
              ${canReset
                ? 'bg-[#162341] text-white hover:bg-[#0f1830]'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }
            `}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reiniciar filtros
          </button>
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
      className="inline-flex flex-wrap items-center gap-1 p-1 bg-white rounded-full border border-neutral-200"
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
              px-3 h-8 rounded-full text-[12px] font-semibold transition-colors
              ${active
                ? 'bg-[#162341] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#162341] hover:bg-neutral-100'
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

function Leyenda({ conteo }) {
  const items = [
    { key: 'increasing', label: 'Creciente', color: '#4A60D8', text: 'Mayor señal positiva' },
    { key: 'decreasing', label: 'Decreciente', color: '#F4511E', text: 'Descenso significativo' },
    { key: 'no trend', label: 'Sin tendencia', color: '#94A3B8', text: 'Comportamiento estable' },
  ]

  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
            Lectura del mapa
          </p>
          <h4 className="mt-1 text-[15px] font-bold text-[#162341]">
            Código cromático para interpretación rápida.
          </h4>
        </div>
        <p className="text-[12px] text-neutral-500">
          Punto seleccionado → panel técnico con series y análisis derivados.
        </p>
      </div>

      <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        {items.map((it) => (
          <div key={it.key} className="rounded-2xl border border-neutral-200 bg-[#F8FAFC] p-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                style={{ background: it.color }}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-[#162341] text-balance">{it.label}</span>
            </div>
            <p className="mt-2 text-[12px] text-neutral-500 leading-relaxed [overflow-wrap:normal]">
              {it.text}
            </p>
            {conteo && (
              <p className="mt-2 text-[11.5px] font-mono text-neutral-400 [overflow-wrap:anywhere]">
                {conteo[it.key] ?? 0} estaciones visibles
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
