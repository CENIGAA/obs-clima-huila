import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  AlertTriangle, Clock, Construction, ExternalLink, MapPin,
  Waves, Activity, Target, RefreshCw, Globe2,
} from 'lucide-react'
import { useDataLoader, useResumenDepartamento } from '../../hooks/useDataLoader'

const ENSO_URL = '/data/enso-estado.json'

const COLOR_FASE = {
  'El Niño': { bg: '#F4511E', label: 'fase cálida' },
  'La Niña': { bg: '#4A60D8', label: 'fase fría' },
  Neutral: { bg: '#94A3B8', label: 'neutro' },
}

const COLOR_TIPO = {
  pasado: { punto: 'bg-neutral-400', line: 'border-neutral-300', card: 'bg-white border-neutral-200' },
  presente: { punto: 'bg-[#F4511E]', line: 'border-[#F4511E]', card: 'bg-white border-[#F4511E]/40 ring-1 ring-[#F4511E]/20' },
  hito: { punto: 'bg-[#43B02A]', line: 'border-[#43B02A]', card: 'bg-[#EBF7E7] border-[#43B02A]/30 border-l-4 border-l-[#43B02A]' },
}

const COLOR_AGENCIA = {
  'NOAA / PSL': { bg: '#003087', short: 'NOAA' },
  'Copernicus / ECMWF': { bg: '#003247', short: 'C3S' },
  'IRI / Columbia': { bg: '#1a5276', short: 'IRI' },
}

const HISTORICAL_DEFAULTS = {
  years: 87,
  totalStations: 150,
  precipitationStations: 149,
  period: '1930–2017',
  trendIncreasing: 12,
  trendDecreasing: 25,
  trendNoTrend: 112,
}

const NIVEL_IMPACTO_BADGE = {
  alto: 'bg-[#FEF0EC] text-[#F4511E] border-[#FAC4B4]',
  moderado: 'bg-orange-50 text-orange-700 border-orange-200',
  bajo: 'bg-[#EBF7E7] text-[#43B02A] border-[#B8E4AB]',
}

const REGION_NOMBRES = {
  Caribe: 'Región Caribe',
  Pacifica: 'Región Pacífica',
  Andina: 'Región Andina',
  Orinoquia: 'Región Orinoquía',
  Amazonia: 'Región Amazonía',
}

const NIVEL_LABEL = {
  alto: 'Alto',
  moderado: 'Moderado',
  bajo: 'Bajo',
}

const REGION_COLOR_CLASS = {
  blue: 'text-[#4A60D8]',
  green: 'text-[#43B02A]',
  orange: 'text-[#F4511E]',
}

function getYearFromIsoDate(value) {
  if (typeof value !== 'string') return null
  const match = value.match(/^(\d{4})-\d{2}-\d{2}$/)
  return match ? Number(match[1]) : null
}

function formatIsoDateEs(value) {
  if (typeof value !== 'string') return value ?? 'N/D'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatPeriodLabel(value) {
  if (typeof value !== 'string') return HISTORICAL_DEFAULTS.period
  return value.replace(/\s*–\s*/g, '–').replace(/\s*-\s*/g, '–')
}

function getHistoricalContext(resumen) {
  const period = formatPeriodLabel(resumen?.periodo_linea_base)
  const yearsMatch = period.match(/(\d{4})[–-](\d{4})/)
  const years =
    yearsMatch
      ? Math.max(Number(yearsMatch[2]) - Number(yearsMatch[1]), 0)
      : HISTORICAL_DEFAULTS.years
  const tendencia = resumen?.hallazgos_clave?.precipitacion?.tendencias_pt4 ?? {}

  return {
    years,
    period,
    totalStations: resumen?.total_estaciones_aptas ?? HISTORICAL_DEFAULTS.totalStations,
    precipitationStations:
      resumen?.estaciones_con_precipitacion ?? HISTORICAL_DEFAULTS.precipitationStations,
    trendIncreasing: tendencia.increasing ?? HISTORICAL_DEFAULTS.trendIncreasing,
    trendDecreasing: tendencia.decreasing ?? HISTORICAL_DEFAULTS.trendDecreasing,
    trendNoTrend: tendencia['no trend'] ?? HISTORICAL_DEFAULTS.trendNoTrend,
  }
}

function getEventContext(data) {
  const phase = data?.estado_actual?.fase ?? 'ENSO'
  const year =
    getYearFromIsoDate(data?._meta?.ultima_actualizacion) ??
    getYearFromIsoDate(data?.escala_nacional?._meta?.fecha_confirmacion_ideam)
  const phaseWithYear = phase === 'Neutral' || !year ? phase : `${phase} ${year}`

  return {
    phase,
    year,
    phaseWithYear,
    heading:
      phase === 'Neutral'
        ? `Seguimiento ENSO en el Huila${year ? ` · ${year}` : ''}`
        : `Seguimiento ${phaseWithYear} en el Huila`,
  }
}

function interpolateTemplate(value, vars) {
  if (typeof value === 'string') {
    return value.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
      const resolved = vars[key]
      return resolved == null ? '' : String(resolved)
    })
  }

  if (Array.isArray(value)) {
    return value.map((item) => interpolateTemplate(item, vars))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, interpolateTemplate(nestedValue, vars)]),
    )
  }

  return value
}

function useEnsoData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(ENSO_URL, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  return { data, loading, error }
}

function HeroEnso({ data, event, content }) {
  const fase = data?.estado_actual?.fase
  const tono = COLOR_FASE[fase] ?? { bg: '#94A3B8', label: 'estado' }
  const alerta = data?.estado_actual?.alerta
  const desc = data?.estado_actual?.descripcion_corta
  const ultima = data?._meta?.ultima_actualizacion
  const proxima = data?._meta?.proxima_actualizacion
  const fuente = data?._meta?.fuente_principal

  return (
    <section
      className="relative bg-[#162341] text-white py-16 lg:py-20 overflow-hidden"
      aria-labelledby="enso-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(244,81,30,0.18), transparent 60%)',
        }}
      />
      <div className="container-main relative">
        <div className="flex items-center gap-2 mb-4">
          <Waves size={14} className="text-[#8B9FE8]" aria-hidden="true" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B9FE8]">
            {content.eyebrow}
          </span>
        </div>

        <h1
          id="enso-heading"
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] max-w-3xl"
        >
          {event.heading}
        </h1>

        <p className="mt-4 text-[16px] sm:text-[17px] text-neutral-300 max-w-2xl leading-relaxed">
          {content.subtitle}
        </p>

        {data && (
          <div
            className="mt-8 inline-flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
            style={{ background: tono.bg }}
          >
            <AlertTriangle size={18} className="text-white shrink-0" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] sm:text-[14px] font-semibold">
              <span>{alerta}</span>
              <span className="opacity-70">·</span>
              <span className="font-medium">{desc}</span>
              <span className="opacity-70">·</span>
              <span className="font-normal opacity-90">
                Actualizado: <span className="font-mono">{ultima}</span>
              </span>
            </div>
          </div>
        )}

        {data && (
          <p className="mt-4 text-[12.5px] text-neutral-400">
            Fuente: <span className="text-neutral-300">{fuente}</span>
            <span className="mx-2 text-neutral-600">·</span>
            Próxima actualización: <span className="font-mono text-neutral-300">{proxima}</span>
          </p>
        )}
      </div>
    </section>
  )
}

function BloqueRelevancia({ content }) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-6">
          {content.heading}
        </h2>

        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-[15.5px] text-neutral-700 leading-relaxed ${index === 0 ? 'mb-5' : ''}`}
          >
            {paragraph}
          </p>
        ))}

        <blockquote className="mt-8 pl-5 py-2 border-l-4 border-[#4A60D8] text-[13.5px] text-neutral-600 italic leading-relaxed">
          {content.quote}
        </blockquote>
      </div>
    </section>
  )
}

function LineaTiempoItem({ item, esUltimo }) {
  const estilo = COLOR_TIPO[item.tipo] ?? COLOR_TIPO.pasado
  const esPresente = item.tipo === 'presente'

  return (
    <li className="relative pl-10 sm:pl-14 pb-8 last:pb-0">
      {!esUltimo && (
        <span
          className={`absolute left-3 sm:left-4 top-5 bottom-0 border-l-2 ${estilo.line}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`absolute left-1.5 sm:left-2.5 top-3 w-4 h-4 rounded-full ring-4 ring-[#F8F9FA] ${estilo.punto}`}
        aria-hidden="true"
      >
        {esPresente && (
          <span
            className="absolute inset-0 rounded-full bg-[#F4511E] animate-ping opacity-75"
            aria-hidden="true"
          />
        )}
      </span>

      <article className={`rounded-2xl border p-5 ${estilo.card}`}>
        <p className="text-[11.5px] font-mono uppercase tracking-[0.12em] text-neutral-500 mb-1">
          {item.fecha}
        </p>
        <h3 className="text-[16px] font-bold text-[#162341] leading-snug">
          {item.titulo}
        </h3>
        <p className="mt-2 text-[13.5px] text-neutral-700 leading-relaxed">
          {item.descripcion}
        </p>
        <p className="mt-3 text-[11.5px] text-neutral-500 italic">
          Fuente: {item.fuente}
        </p>
      </article>
    </li>
  )
}

function BloqueLineaTiempo({ items }) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-8">
          Cronología del evento
        </h2>

        <ol>
          {items.map((it, index) => (
            <LineaTiempoItem
              key={it.id}
              item={it}
              esUltimo={index === items.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

function IndicadorCard({ ind }) {
  const colorValor = ind.color === 'warning' ? 'text-[#F4511E]' : 'text-[#162341]'
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col gap-2 transition-shadow hover:shadow-md">
      <p className="text-[11.5px] uppercase tracking-[0.1em] text-neutral-500 font-medium">
        {ind.etiqueta}
      </p>
      <p className={`text-3xl font-extrabold tabular-nums ${colorValor}`}>
        {ind.valor}
      </p>
      <span className="inline-flex items-center self-start text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF0EC] text-[#F4511E] border border-[#FAC4B4]">
        {ind.estado}
      </span>
      <p className="mt-auto text-[11.5px] text-neutral-500 leading-snug pt-3 border-t border-neutral-100">
        {ind.nota}
      </p>
    </article>
  )
}

function BloqueIndicadores({ indicadores, meta, content }) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main">
        <div className="flex items-start gap-3 mb-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#FEF0EC] text-[#F4511E] shrink-0"
            aria-hidden="true"
          >
            <Activity size={18} />
          </span>
          <div>
            <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight">
              {content.heading}
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">
              Actualización: <span className="font-mono">{meta?.ultima_actualizacion}</span>
              <span className="mx-2 text-neutral-300">·</span>
              {meta?.ciclo}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {indicadores.map((ind) => (
            <IndicadorCard key={ind.id} ind={ind} />
          ))}
        </div>

        <p className="mt-8 text-[13px] text-neutral-600 leading-relaxed max-w-3xl">
          {content.roni_explainer}
        </p>
      </div>
    </section>
  )
}

function BotonGeo({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#4A60D8] text-[#4A60D8] text-[12.5px] font-semibold hover:bg-[#4A60D8] hover:text-white transition-colors"
    >
      {children}
      <ExternalLink size={11} aria-hidden="true" />
    </a>
  )
}

function GeovisorCard({ geo }) {
  const agencia = COLOR_AGENCIA[geo.agencia] ?? { bg: '#162341', short: geo.logo_texto }

  return (
    <article className="rounded-2xl bg-white p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-lg text-white font-extrabold text-[15px] tracking-tight shrink-0"
          style={{ background: agencia.bg }}
          aria-hidden="true"
        >
          {agencia.short}
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-neutral-500">
            {geo.agencia}
          </p>
          <h3 className="text-[14.5px] font-bold text-[#162341] leading-tight">
            {geo.nombre_completo}
          </h3>
        </div>
      </div>

      <p className="text-[13px] text-neutral-700 leading-relaxed">
        {geo.descripcion}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={12} className="text-[#4A60D8]" aria-hidden="true" />
          {geo.frecuencia}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
          {geo.tipo}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-neutral-100">
        {geo.id === 'geo-01' && (
          <>
            <BotonGeo href={geo.url}>Condiciones actuales</BotonGeo>
            <BotonGeo href={geo.url_probabilities}>Probabilidades RONI</BotonGeo>
          </>
        )}
        {geo.id === 'geo-02' && (
          <>
            <BotonGeo href={geo.url}>Pronóstico estacional</BotonGeo>
            <BotonGeo href={geo.url_charts}>Gráficos C3S</BotonGeo>
          </>
        )}
        {geo.id === 'geo-03' && (
          <BotonGeo href={geo.url}>Quick Look actual</BotonGeo>
        )}
      </div>
    </article>
  )
}

function BloqueGeovisores({ geovisores, content }) {
  return (
    <section className="py-16 lg:py-20 bg-[#162341] text-white">
      <div className="container-main">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          {content.heading}
        </h2>
        <p className="mt-2 text-[14.5px] text-neutral-300 max-w-2xl">
          {content.intro}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {geovisores.map((geo) => (
            <GeovisorCard key={geo.id} geo={geo} />
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-neutral-400 max-w-3xl leading-relaxed">
          {content.outro}
        </p>
      </div>
    </section>
  )
}

function MapaColombiaLeaflet({ event }) {
  const mapaRegionesRef = useRef(null)
  const mapaRegionesInstanceRef = useRef(null)
  const eventLabelRef = useRef(event.phaseWithYear)

  useEffect(() => {
    if (!mapaRegionesRef.current) return
    if (mapaRegionesInstanceRef.current) return

    const map = L.map(mapaRegionesRef.current, {
      center: [4.5, -74.0],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
      dragging: true,
    })

    mapaRegionesInstanceRef.current = map

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
          '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        opacity: 0.7,
      },
    ).addTo(map)

    fetch('/data/colombia-regiones-hidrologicas.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor: feature.properties.color,
            fillOpacity: 0.55,
            color: 'white',
            weight: 1.8,
            lineJoin: 'round',
          }),
          onEachFeature: (feature, layer) => {
            const nombre =
              REGION_NOMBRES[feature.properties.nombre] ??
              feature.properties.nombre
            const nivel = NIVEL_LABEL[feature.properties.nivel_impacto] ?? ''
            layer.bindTooltip(
              '<b>' + nombre + '</b><br>' +
              'Impacto esperado de ' + eventLabelRef.current + ': <b>' + nivel + '</b>',
              { sticky: true },
            )
            layer.on('mouseover', function () {
              this.setStyle({ fillOpacity: 0.75, weight: 2.5 })
            })
            layer.on('mouseout', function () {
              this.setStyle({ fillOpacity: 0.55, weight: 1.8 })
            })
          },
        }).addTo(map)

        L.circleMarker([2.5414, -75.6168], {
          radius: 16,
          fillColor: '#4A60D8',
          color: 'transparent',
          fillOpacity: 0.18,
        }).addTo(map)

        L.circleMarker([2.5414, -75.6168], {
          radius: 9,
          fillColor: '#4A60D8',
          color: 'white',
          weight: 2.5,
          fillOpacity: 1,
        })
          .bindTooltip(
            '<b>Huila</b><br>Cabecera cuenca alta del Magdalena<br><small>Observatorio CENIGAA</small>',
            { direction: 'right', offset: [10, 0] },
          )
          .addTo(map)
      })

    return () => {
      if (mapaRegionesInstanceRef.current) {
        mapaRegionesInstanceRef.current.remove()
        mapaRegionesInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapaRegionesRef}
      style={{ height: '380px', width: '100%' }}
      className="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
      aria-label={`Mapa de impactos de ${event.phaseWithYear} por región hidrológica de Colombia`}
    />
  )
}

function BloqueEscalaNacional({ nacional, event, content }) {
  if (!nacional) return null

  const alerta = nacional.alerta_ideam
  const regiones = nacional.impacto_por_region ?? []
  const huila = nacional.huila_en_contexto

  return (
    <section
      id="escala-nacional"
      className="py-16 lg:py-20 bg-white"
      aria-labelledby="escala-nacional-heading"
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-10 max-w-3xl">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#EBF7E7] text-[#43B02A] shrink-0"
            aria-hidden="true"
          >
            <Globe2 size={18} />
          </span>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#43B02A] mb-1">
              {content.eyebrow}
            </p>
            <h2
              id="escala-nacional-heading"
              className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight"
            >
              {content.heading}
            </h2>
            <p className="text-[14px] text-neutral-600 mt-2 leading-relaxed">
              {content.intro}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#162341] text-white p-6 mb-12 flex flex-col lg:flex-row lg:items-center gap-5 shadow-xl">
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-[#F4511E] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.12em]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" aria-hidden="true" />
              {content.alert_badge}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] sm:text-[14.5px] leading-relaxed">
              {alerta.texto}
            </p>
          </div>
          <div className="shrink-0 grid grid-cols-2 gap-5 lg:text-right">
            <div>
              <p className="text-[10.5px] text-neutral-400 uppercase tracking-[0.12em]">
                Persistencia
              </p>
              <p className="text-2xl font-extrabold text-[#43B02A] tabular-nums">
                {alerta.probabilidad_persistencia}%
              </p>
            </div>
            <div>
              <p className="text-[10.5px] text-neutral-400 uppercase tracking-[0.12em]">
                Muy fuerte
              </p>
              <p className="text-2xl font-extrabold text-[#F4511E] tabular-nums">
                {alerta.probabilidad_intensidad_muy_fuerte}%
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-6">
            {content.impacts_heading}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="w-full">
              <MapaColombiaLeaflet event={event} />
              <p className="text-xs text-gray-400 text-center mt-2">
                {content.map_caption}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-left">
                <thead>
                  <tr className="border-b-2 border-[#162341]">
                    <th className="pb-2 pr-3 text-[10.5px] font-bold text-[#162341] uppercase tracking-[0.1em]">
                      Región
                    </th>
                    <th className="pb-2 pr-3 text-[10.5px] font-bold text-[#162341] uppercase tracking-[0.1em]">
                      Impacto
                    </th>
                    <th className="pb-2 text-[10.5px] font-bold text-[#162341] uppercase tracking-[0.1em]">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {regiones.map((region) => (
                    <tr
                      key={region.region}
                      className={`border-b border-neutral-100 ${region.huila_incluido ? 'bg-[#EEF1FB]' : ''}`}
                    >
                      <td className="py-3 pr-3 font-semibold text-[#162341] whitespace-nowrap align-top">
                        {region.region}
                        {region.huila_incluido && (
                          <span className="ml-2 inline-block text-[10px] bg-[#4A60D8] text-white px-1.5 py-0.5 rounded font-semibold align-middle">
                            Huila
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <span
                          className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${NIVEL_IMPACTO_BADGE[region.nivel_impacto] ?? NIVEL_IMPACTO_BADGE.bajo}`}
                        >
                          {region.nivel_impacto.charAt(0).toUpperCase() + region.nivel_impacto.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-600 leading-snug align-top">
                        {region.descripcion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200 p-6 mb-12">
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-4">
            {content.cuenca_heading}
          </h3>
          <p className="text-[14px] text-neutral-700 leading-relaxed mb-4">
            {huila.posicion}. {huila.descripcion}
          </p>
          <p className="text-[14px] text-neutral-700 leading-relaxed mb-5">
            {huila.vulnerabilidad_diferenciada}
          </p>
          <div className="rounded-r-lg border-l-4 border-[#4A60D8] bg-[#EEF1FB] py-3 px-4">
            <p className="text-[12.5px] font-semibold text-[#162341] mb-1">
              {content.field_signal_label}
            </p>
            <p className="text-[13px] text-neutral-700 leading-snug">
              {huila.señal_actual}
            </p>
          </div>
          <p className="text-[11.5px] text-neutral-500 mt-4 leading-snug">
            {content.historical_bridge}
          </p>
        </div>

        <div>
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-5">
            {content.sectors_heading}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {huila.sectores_alerta.map((sector, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-[13.5px] text-neutral-700 leading-snug bg-white rounded-lg border border-neutral-200 px-4 py-3"
              >
                <span
                  className="mt-1 shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F4511E]"
                  aria-hidden="true"
                >
                  <span className="block w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span>{sector}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11.5px] text-neutral-500 mt-6 leading-relaxed">
            {content.sources}
          </p>
        </div>
      </div>
    </section>
  )
}

function BloqueHistoricoHuila({ content }) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main max-w-3xl">
        <div className="flex items-start gap-3 mb-6">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0"
            aria-hidden="true"
          >
            <Target size={18} />
          </span>
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight">
            {content.heading}
          </h2>
        </div>

        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-[15.5px] text-neutral-700 leading-relaxed ${index < content.paragraphs.length - 1 ? 'mb-5' : ''}`}
          >
            {paragraph}
          </p>
        ))}

        <blockquote className="mt-8 pl-5 py-3 border-l-4 border-[#4A60D8] text-[12.5px] text-neutral-600 italic leading-relaxed">
          {content.quote}
        </blockquote>
      </div>
    </section>
  )
}

function BloqueSeguimientoLocal({ content }) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-6">
          {content.heading}
        </h2>

        <div className="rounded-2xl border-2 border-dashed border-[#C5CEEF] bg-white p-8">
          <div className="flex items-start gap-4">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0"
              aria-hidden="true"
            >
              <Construction size={22} />
            </span>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#4A60D8] mb-2">
                {content.eyebrow}
              </p>
              <p className="text-[14.5px] text-neutral-700 leading-relaxed">
                {content.description}
              </p>

              <ul className="mt-5 space-y-2 text-[13px] text-neutral-700">
                {content.regions.map((region) => (
                  <li key={region.zone} className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className={`${REGION_COLOR_CLASS[region.color] ?? REGION_COLOR_CLASS.blue} shrink-0 mt-0.5`}
                      aria-hidden="true"
                    />
                    <span><strong className="text-[#162341]">{region.zone}:</strong> {region.municipios}</span>
                  </li>
                ))}
              </ul>

              <span className="inline-flex items-center mt-6 px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-[#EEF1FB] text-[#4A60D8] border border-[#C5CEEF]">
                {content.badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BloqueCreditos({ meta, content }) {
  return (
    <section className="py-16 lg:py-20 bg-[#162341] text-white">
      <div className="container-main">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              {content.sources_heading}
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              {content.sources_items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              {content.local_heading}
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              {content.local_items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              {content.observatory_heading}
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              {content.observatory_items.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-1 text-[#8B9FE8] hover:text-white transition-colors underline underline-offset-2"
                >
                  {content.observatory_link_label}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="inline-flex items-center gap-2 text-[12.5px] text-neutral-400">
            <RefreshCw size={12} className="text-[#8B9FE8]" aria-hidden="true" />
            {content.updated_label}
            <span className="font-mono text-neutral-200">{meta?.ultima_actualizacion}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

function EstadoCarga() {
  return (
    <section className="py-24 bg-white">
      <div className="container-main text-center">
        <div className="inline-flex items-center gap-3 text-neutral-500">
          <span
            className="inline-block w-5 h-5 rounded-full border-2 border-[#4A60D8] border-t-transparent animate-spin"
            aria-hidden="true"
          />
          <span className="text-[14px] font-medium">Cargando datos ENSO…</span>
        </div>
      </div>
    </section>
  )
}

function EstadoError({ mensaje }) {
  return (
    <section className="py-24 bg-white">
      <div className="container-main max-w-2xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-bold text-[15px] mb-2">No se pudieron cargar los datos ENSO</p>
          <p className="text-[13.5px] text-red-600">
            {mensaje}. Intenta recargar la página o vuelve más tarde. Los archivos
            de origen son <span className="font-mono">/data/enso-estado.json</span> y{' '}
            <span className="font-mono">/data/enso-contenido.json</span>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Enso() {
  const { data, loading, error } = useEnsoData()
  const { data: resumen } = useResumenDepartamento()
  const {
    data: editorialContent,
    loading: loadingContent,
    error: errorContent,
  } = useDataLoader('data/enso-contenido.json')

  const historical = getHistoricalContext(resumen)
  const event = getEventContext(data)
  const vars = {
    eventPhase: event.phase,
    eventPhaseLower: event.phase.toLowerCase(),
    eventPhaseWithYear: event.phaseWithYear,
    eventYear: event.year ?? 'actual',
    eventAnomalyWithUnit:
      data?.estado_actual?.nino34_anomalia && data?.estado_actual?.nino34_unidad
        ? `${data.estado_actual.nino34_anomalia}${data.estado_actual.nino34_unidad}`
        : 'N/D',
    eventIntensityLower: data?.estado_actual?.intensidad_proyectada?.toLowerCase?.() ?? 'no especificada',
    eventHorizon: data?.estado_actual?.horizonte_proyeccion ?? 'el horizonte vigente',
    historicalYears: historical.years,
    historicalPeriod: historical.period,
    historicalTotalStations: historical.totalStations,
    historicalPrecipitationStations: historical.precipitationStations,
    historicalTrendIncreasing: historical.trendIncreasing,
    historicalTrendDecreasing: historical.trendDecreasing,
    historicalTrendNoTrend: historical.trendNoTrend,
    ideamConfirmationDateLong: formatIsoDateEs(data?.escala_nacional?._meta?.fecha_confirmacion_ideam),
    nationalUpdateDateLong: formatIsoDateEs(data?.escala_nacional?._meta?.ultima_actualizacion),
  }

  const content = editorialContent ? interpolateTemplate(editorialContent, vars) : null
  const fallbackHero = content?.hero ?? {
    eyebrow: 'Seguimiento ENSO',
    subtitle: 'Contenido ENSO en carga o no disponible.',
  }

  if (loading || loadingContent) {
    return (
      <>
        <HeroEnso data={null} event={event} content={fallbackHero} />
        <EstadoCarga />
      </>
    )
  }

  if (error || errorContent || !data || !content) {
    return (
      <>
        <HeroEnso data={null} event={event} content={fallbackHero} />
        <EstadoError mensaje={error ?? errorContent ?? 'Datos no disponibles'} />
      </>
    )
  }

  return (
    <>
      <HeroEnso data={data} event={event} content={content.hero} />
      <BloqueRelevancia content={content.relevancia} />
      <BloqueLineaTiempo items={data.linea_tiempo} />
      <BloqueIndicadores indicadores={data.indicadores} meta={data._meta} content={content.indicadores} />
      <BloqueGeovisores geovisores={data.geovisores} content={content.geovisores} />
      <BloqueEscalaNacional nacional={data.escala_nacional} event={event} content={content.escala_nacional} />
      <BloqueHistoricoHuila content={content.historico_huila} />
      <BloqueSeguimientoLocal content={content.seguimiento_local} />
      <BloqueCreditos meta={data._meta} content={content.creditos} />
    </>
  )
}
