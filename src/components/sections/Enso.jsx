import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Clock, Construction, ExternalLink, MapPin,
  Waves, Activity, Target, RefreshCw, Globe2,
} from 'lucide-react'

const ENSO_URL = '/data/enso-estado.json'

const COLOR_FASE = {
  'El Niño':  { bg: '#F4511E', label: 'fase cálida' },
  'La Niña':  { bg: '#4A60D8', label: 'fase fría'  },
  'Neutral':  { bg: '#94A3B8', label: 'neutro'     },
}

const COLOR_TIPO = {
  pasado:   { punto: 'bg-neutral-400',  line: 'border-neutral-300', card: 'bg-white border-neutral-200' },
  presente: { punto: 'bg-[#F4511E]',     line: 'border-[#F4511E]',   card: 'bg-white border-[#F4511E]/40 ring-1 ring-[#F4511E]/20' },
  hito:     { punto: 'bg-[#43B02A]',     line: 'border-[#43B02A]',   card: 'bg-[#EBF7E7] border-[#43B02A]/30 border-l-4 border-l-[#43B02A]' },
}

const COLOR_AGENCIA = {
  'NOAA / PSL':          { bg: '#003087', short: 'NOAA' },
  'Copernicus / ECMWF':  { bg: '#003247', short: 'C3S'  },
  'IRI / Columbia':      { bg: '#1a5276', short: 'IRI'  },
}

// ─── Estado dinámico desde el JSON ──────────────────────────────────────────
function useEnsoData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(ENSO_URL, { signal: ctrl.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => { setData(json); setLoading(false) })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  return { data, loading, error }
}

// ─── Bloque 0 · Hero ────────────────────────────────────────────────────────
function HeroEnso({ data }) {
  const fase = data?.estado_actual?.fase
  const tono = COLOR_FASE[fase] ?? { bg: '#94A3B8', label: 'estado' }
  const alerta = data?.estado_actual?.alerta
  const desc   = data?.estado_actual?.descripcion_corta
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
            Seguimiento ENSO · Fase 2
          </span>
        </div>

        <h1
          id="enso-heading"
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] max-w-3xl"
        >
          Seguimiento El Niño 2026 en el Huila
        </h1>

        <p className="mt-4 text-[16px] sm:text-[17px] text-neutral-300 max-w-2xl leading-relaxed">
          Monitoreo científico del fenómeno ENSO y sus efectos sobre el departamento.
        </p>

        {data && (
          <div
            className="
              mt-8 inline-flex flex-wrap items-center gap-3
              px-4 py-3 rounded-xl
              shadow-lg
            "
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

// ─── Bloque 1 · Editorial: por qué es relevante ────────────────────────────
function BloqueRelevancia() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-6">
          ¿Por qué este evento es relevante?
        </h2>

        <p className="text-[15.5px] text-neutral-700 leading-relaxed mb-5">
          El Niño 2026 marca el inicio de un nuevo ciclo ENSO tras la secuencia
          La Niña 2020-2023, el intenso El Niño 2023/2024 y una breve fase
          neutral. Lo que distingue este evento es la velocidad de la
          transición: en apenas tres meses, el Pacífico ecuatorial pasó de
          condiciones de La Niña débil a superar el umbral de El Niño con
          anomalías superiores a +0.9°C en la región Niño3.4.
        </p>

        <p className="text-[15.5px] text-neutral-700 leading-relaxed">
          Para el Huila, un departamento con 87 años de registros
          hidrometeorológicos sistematizados, El Niño representa un patrón
          documentado: reducción en los totales de precipitación, especialmente
          en el norte del departamento, y mayor riesgo de déficit hídrico en
          los municipios del Alto Magdalena. El Observatorio Climático del
          Huila hace seguimiento a este fenómeno con datos de estaciones en
          tierra, complementando la observación satelital con medición directa.
        </p>

        <blockquote className="mt-8 pl-5 py-2 border-l-4 border-[#4A60D8] text-[13.5px] text-neutral-600 italic leading-relaxed">
          Referencia metodológica: Domínguez Calle, E.A. et al. (2018). Cambio
          climático y variabilidad climática en el Huila. ISBN 978-620-2-16957-8.
          Convenio SGR 124/2015.
        </blockquote>
      </div>
    </section>
  )
}

// ─── Bloque 2 · Línea de tiempo ─────────────────────────────────────────────
function LineaTiempoItem({ item, esUltimo }) {
  const estilo = COLOR_TIPO[item.tipo] ?? COLOR_TIPO.pasado
  const esPresente = item.tipo === 'presente'

  return (
    <li className="relative pl-10 sm:pl-14 pb-8 last:pb-0">
      {/* Línea conectora */}
      {!esUltimo && (
        <span
          className={`absolute left-3 sm:left-4 top-5 bottom-0 border-l-2 ${estilo.line}`}
          aria-hidden="true"
        />
      )}
      {/* Punto */}
      <span
        className={`
          absolute left-1.5 sm:left-2.5 top-3 w-4 h-4 rounded-full ring-4 ring-[#F8F9FA]
          ${estilo.punto}
        `}
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
    <section className="py-16 lg:py-20 bg-[#F8F9FA]">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-8">
          Cronología del evento
        </h2>

        <ol>
          {items.map((it, i) => (
            <LineaTiempoItem
              key={it.id}
              item={it}
              esUltimo={i === items.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

// ─── Bloque 3 · Indicadores en tiempo cuasi-real ───────────────────────────
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

function BloqueIndicadores({ indicadores, meta }) {
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
              Estado actual del fenómeno
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">
              Actualización: <span className="font-mono">{meta?.ultima_actualizacion}</span>
              <span className="mx-2 text-neutral-300">·</span>
              {meta?.ciclo}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {indicadores.map(ind => (
            <IndicadorCard key={ind.id} ind={ind} />
          ))}
        </div>

        <p className="mt-8 text-[13px] text-neutral-600 leading-relaxed max-w-3xl">
          El índice <strong className="text-[#162341]">RONI</strong> (Relative
          Oceanic Niño Index) es el estándar oficial del NOAA/CPC desde febrero
          de 2026. A diferencia del ONI histórico, el RONI sustrae la tendencia
          de calentamiento global de fondo, permitiendo comparar la intensidad
          de eventos de diferentes décadas en igualdad de condiciones.
        </p>
      </div>
    </section>
  )
}

// ─── Bloque 4 · Geovisores ──────────────────────────────────────────────────
function BotonGeo({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        border border-[#4A60D8] text-[#4A60D8]
        text-[12.5px] font-semibold
        hover:bg-[#4A60D8] hover:text-white
        transition-colors
      "
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

function BloqueGeovisores({ geovisores }) {
  return (
    <section className="py-16 lg:py-20 bg-[#162341] text-white">
      <div className="container-main">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          Geovisores de monitoreo internacional
        </h2>
        <p className="mt-2 text-[14.5px] text-neutral-300 max-w-2xl">
          Plataformas oficiales de seguimiento del ENSO. Selecciona cualquiera
          para acceder al visor en su sitio de origen.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {geovisores.map(g => (
            <GeovisorCard key={g.id} geo={g} />
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-neutral-400 max-w-3xl leading-relaxed">
          CENIGAA complementa estos geovisores globales con datos de estaciones
          en tierra del Huila. La observación satelital y la medición directa
          son métodos complementarios, no equivalentes.
        </p>
      </div>
    </section>
  )
}

// ─── Bloque Nacional · Escala Colombia (entre Geovisores e Histórico) ──────
const NIVEL_IMPACTO_BADGE = {
  alto:     'bg-[#FEF0EC] text-[#F4511E] border-[#FAC4B4]',
  moderado: 'bg-orange-50  text-orange-700 border-orange-200',
  bajo:     'bg-[#EBF7E7]  text-[#43B02A] border-[#B8E4AB]',
}

const NIVEL_IMPACTO_FILL = {
  alto:     { color: '#F4511E', op: 0.85 },
  moderado: { color: '#F4A261', op: 0.85 },
  bajo:     { color: '#43B02A', op: 0.75 },
}

// Paths SVG conceptuales de las 5 regiones hidrológicas (viewBox 400×600).
// Aproximación didáctica, no cartográfica. Coordenadas según briefing.
const REGIONES_SVG = [
  {
    key: 'caribe',
    label: 'Caribe',
    d: 'M 60 20 L 340 20 L 340 80 L 280 100 L 200 90 L 140 110 L 60 80 Z',
    nivel: 'alto',
    text: { x: 200, y: 60, fill: 'white' },
  },
  {
    key: 'pacifica',
    label: 'Pacífica',
    d: 'M 30 90 L 100 90 L 80 200 L 60 300 L 30 350 L 20 250 L 20 150 Z',
    nivel: 'moderado',
    text: { x: 55, y: 220, fill: '#162341' },
  },
  {
    key: 'andina',
    label: 'Andina',
    d: 'M 100 90 L 280 100 L 300 200 L 260 320 L 200 380 L 160 340 L 120 260 L 80 200 Z',
    nivel: 'alto',
    text: { x: 190, y: 200, fill: 'white' },
  },
  {
    key: 'orinoquia',
    label: 'Orinoquía',
    d: 'M 280 100 L 380 80 L 390 300 L 300 320 L 260 320 L 300 200 Z',
    nivel: 'bajo',
    text: { x: 330, y: 210, fill: 'white' },
  },
  {
    key: 'amazonia',
    label: 'Amazonía',
    d: 'M 160 340 L 200 380 L 260 320 L 300 320 L 390 300 L 380 500 L 280 560 L 180 520 L 100 440 L 120 360 Z',
    nivel: 'bajo',
    text: { x: 260, y: 430, fill: 'white' },
  },
]

function MapaColombiaConceptual() {
  return (
    <svg
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label="Mapa conceptual de impactos El Niño 2026 por región hidrológica de Colombia. El Huila marcado en azul CENIGAA dentro de la región Andina."
    >
      {REGIONES_SVG.map((r) => {
        const fill = NIVEL_IMPACTO_FILL[r.nivel]
        const nivelTexto =
          r.nivel === 'alto' ? 'Impacto alto'
          : r.nivel === 'moderado' ? 'Impacto moderado'
          : 'Impacto bajo'
        return (
          <g key={r.key}>
            <path
              d={r.d}
              fill={fill.color}
              fillOpacity={fill.op}
              stroke="white"
              strokeWidth="1.5"
            >
              <title>
                Región {r.label}: {nivelTexto}
                {r.key === 'andina' ? '. Incluye el Huila.' : ''}
              </title>
            </path>
            <text
              x={r.text.x}
              y={r.text.y}
              textAnchor="middle"
              fill={r.text.fill}
              fontSize={r.label.length > 7 ? 10 : 11}
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {r.label}
            </text>
          </g>
        )
      })}

      {/* Pin del Huila en la región Andina (cabecera del Magdalena) */}
      <g>
        <circle cx="180" cy="285" r="12" fill="#4A60D8" fillOpacity="0.25" />
        <circle cx="180" cy="285" r="7" fill="#4A60D8" />
        <text
          x="180"
          y="308"
          textAnchor="middle"
          fill="#162341"
          fontSize="10"
          fontWeight="700"
        >
          Huila
        </text>
        <title>Departamento del Huila, cabecera del río Magdalena</title>
      </g>

      {/* Leyenda */}
      <g>
        <rect x="30" y="560" width="14" height="14" fill="#F4511E" rx="2" />
        <text x="50" y="572" fill="#162341" fontSize="9">Alto</text>
        <rect x="100" y="560" width="14" height="14" fill="#F4A261" rx="2" />
        <text x="120" y="572" fill="#162341" fontSize="9">Moderado</text>
        <rect x="195" y="560" width="14" height="14" fill="#43B02A" rx="2" />
        <text x="215" y="572" fill="#162341" fontSize="9">Bajo</text>
      </g>
    </svg>
  )
}

function BloqueEscalaNacional({ nacional }) {
  if (!nacional) return null

  const alerta = nacional.alerta_ideam
  const regiones = nacional.impacto_por_region ?? []
  const huila = nacional.huila_en_contexto

  return (
    <section
      id="escala-nacional"
      className="py-16 lg:py-20 bg-[#F8F9FA]"
      aria-labelledby="escala-nacional-heading"
    >
      <div className="container-main">
        {/* Encabezado de sección */}
        <div className="flex items-start gap-3 mb-10 max-w-3xl">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#EBF7E7] text-[#43B02A] shrink-0"
            aria-hidden="true"
          >
            <Globe2 size={18} />
          </span>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#43B02A] mb-1">
              Escala nacional
            </p>
            <h2
              id="escala-nacional-heading"
              className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight"
            >
              El Niño 2026 en Colombia
            </h2>
            <p className="text-[14px] text-neutral-600 mt-2 leading-relaxed">
              El forzamiento global del Pacífico ecuatorial llega con intensidad
              diferenciada según la región hidrológica. El Huila, en la cabecera
              del Magdalena, ocupa una de las posiciones de mayor exposición del país.
            </p>
          </div>
        </div>

        {/* N1 · Tarjeta de alerta IDEAM */}
        <div className="rounded-2xl bg-[#162341] text-white p-6 mb-12 flex flex-col lg:flex-row lg:items-center gap-5 shadow-xl">
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-[#F4511E] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.12em]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" aria-hidden="true" />
              Alerta activa IDEAM
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

        {/* N2 · Mapa + tabla de regiones */}
        <div className="mb-12">
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-6">
            Impactos esperados por región hidrológica
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="w-full">
              <MapaColombiaConceptual />
              <p className="text-[11.5px] text-neutral-500 text-center mt-3 leading-snug">
                Mapa conceptual. Regiones hidrológicas IDEAM Colombia.
                Huila marcado en azul CENIGAA (#4A60D8).
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
                  {regiones.map((r) => (
                    <tr
                      key={r.region}
                      className={`border-b border-neutral-100 ${r.huila_incluido ? 'bg-[#EEF1FB]' : ''}`}
                    >
                      <td className="py-3 pr-3 font-semibold text-[#162341] whitespace-nowrap align-top">
                        {r.region}
                        {r.huila_incluido && (
                          <span className="ml-2 inline-block text-[10px] bg-[#4A60D8] text-white px-1.5 py-0.5 rounded font-semibold align-middle">
                            Huila
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <span
                          className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${NIVEL_IMPACTO_BADGE[r.nivel_impacto] ?? NIVEL_IMPACTO_BADGE.bajo}`}
                        >
                          {r.nivel_impacto.charAt(0).toUpperCase() + r.nivel_impacto.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-600 leading-snug align-top">
                        {r.descripcion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* N3 · Cuenca alta del Magdalena */}
        <div className="rounded-2xl bg-white border border-neutral-200 p-6 mb-12">
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-4">
            La cuenca alta del Magdalena bajo El Niño
          </h3>
          <p className="text-[14px] text-neutral-700 leading-relaxed mb-4">
            {huila.posicion}. {huila.descripcion}
          </p>
          <p className="text-[14px] text-neutral-700 leading-relaxed mb-5">
            {huila.vulnerabilidad_diferenciada}
          </p>
          <div className="rounded-r-lg border-l-4 border-[#4A60D8] bg-[#EEF1FB] py-3 px-4">
            <p className="text-[12.5px] font-semibold text-[#162341] mb-1">
              Señal en campo. Semana del 16 de junio de 2026
            </p>
            <p className="text-[13px] text-neutral-700 leading-snug">
              {huila.señal_actual}
            </p>
          </div>
          <p className="text-[11.5px] text-neutral-500 mt-4 leading-snug">
            La correlación entre El Niño y la precipitación histórica del Huila
            se documenta en la sección siguiente con datos de la serie CC_VCE
            (1930-2017, 87 años de registros propios de CENIGAA).
          </p>
        </div>

        {/* N4 · Sectores en alerta */}
        <div>
          <h3 className="text-[17px] font-bold text-[#162341] leading-tight mb-5">
            Sectores en seguimiento. Huila
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {huila.sectores_alerta.map((sector, idx) => (
              <li
                key={idx}
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
            Fuente: IDEAM Colombia, comunicado oficial 11 de junio de 2026.
            Corporación Autónoma Regional del Alto Magdalena.
            Diario del Huila, informe sectorial junio 2026.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Bloque 5 · Correlación histórica Huila ─────────────────────────────────
function BloqueHistoricoHuila() {
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
            El Niño en el Huila: lo que dicen 87 años de datos
          </h2>
        </div>

        <p className="text-[15.5px] text-neutral-700 leading-relaxed mb-5">
          El análisis de 150 estaciones hidrometeorológicas del Huila con
          registros entre 1930 y 2017 (87 años) revela patrones documentados
          de respuesta a El Niño. De las estaciones con tendencia
          estadísticamente significativa (p &lt; 0.05),{' '}
          <strong className="text-[#162341]">25 muestran tendencia decreciente</strong>{' '}
          en precipitación y{' '}
          <strong className="text-[#162341]">12 tendencia creciente</strong>,
          con el grueso de las estaciones sin tendencia detectada (112 de 149).
          Este comportamiento heterogéneo refleja la complejidad del relieve
          huilense: la cordillera divide el departamento en subregiones con
          respuestas distintas al forzamiento ENSO.
        </p>

        <p className="text-[15.5px] text-neutral-700 leading-relaxed mb-5">
          Los eventos El Niño históricos registrados en la base CCYVCE_DB
          (1930-2017) muestran consistentemente una reducción en los totales
          anuales de precipitación, más pronunciada en el{' '}
          <strong className="text-[#162341]">norte del Huila</strong>{' '}
          (municipios del Alto Magdalena: Neiva, Palermo, Aipe, Villavieja)
          que en el{' '}
          <strong className="text-[#162341]">sur</strong>{' '}
          (Pitalito, San Agustín, Saladoblanco). Este gradiente norte-sur es
          uno de los hallazgos centrales del análisis de variabilidad climática
          del Convenio SGR 124/2015.
        </p>

        <p className="text-[15.5px] text-neutral-700 leading-relaxed">
          El monitoreo cuasi-real de las 17 estaciones automáticas actualmente
          operativas en el departamento permitirá contrastar en tiempo real el
          comportamiento de El Niño 2026 con los patrones históricos
          documentados. Este seguimiento, en construcción, representa la
          primera capa de validación cruzada in situ disponible para el Huila.
        </p>

        <blockquote className="mt-8 pl-5 py-3 border-l-4 border-[#4A60D8] text-[12.5px] text-neutral-600 italic leading-relaxed">
          Fuente primaria: Domínguez Calle, E.A., Cerón Bretón, W.L., Mejía
          Fernández, A.J., y Cabezas Calderón, J. (2018). Cambio climático y
          variabilidad climática en el departamento del Huila. Editorial
          Académica Española. ISBN: 978-620-2-16957-8. Convenio de
          Cooperación SGR No. 124 de 2015. Gobernación del Huila / CENIGAA.
        </blockquote>
      </div>
    </section>
  )
}

// ─── Bloque 6 · Seguimiento local (placeholder) ────────────────────────────
function BloqueSeguimientoLocal() {
  return (
    <section className="py-16 lg:py-20 bg-[#F8F9FA]">
      <div className="container-main max-w-3xl">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#162341] tracking-tight mb-6">
          Seguimiento con estaciones automáticas del Huila
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
                En construcción
              </p>
              <p className="text-[14.5px] text-neutral-700 leading-relaxed">
                17 estaciones automáticas del departamento del Huila tienen
                datos operativos desde 2023. El componente de visualización en
                tiempo cuasi-real está en desarrollo. Estará disponible en esta
                sección a partir del tercer trimestre de 2026.
              </p>

              <ul className="mt-5 space-y-2 text-[13px] text-neutral-700">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#4A60D8] shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong className="text-[#162341]">Norte:</strong> Neiva, Palermo, Aipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#43B02A] shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong className="text-[#162341]">Centro:</strong> La Plata, Algeciras, Campoalegre</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#F4511E] shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong className="text-[#162341]">Sur:</strong> Pitalito, San Agustín</span>
                </li>
              </ul>

              <span className="inline-flex items-center mt-6 px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-[#EEF1FB] text-[#4A60D8] border border-[#C5CEEF]">
                17 estaciones activas · Red IDEAM · Datos 2023-2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Bloque 7 · Créditos y metodología ──────────────────────────────────────
function BloqueCreditos({ meta }) {
  return (
    <section className="py-16 lg:py-20 bg-[#162341] text-white">
      <div className="container-main">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              Fuentes de datos ENSO
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              <li>NOAA/CPC. National Centers for Environmental Prediction</li>
              <li>IRI/Columbia. International Research Institute for Climate and Society</li>
              <li>Copernicus C3S. Copernicus Climate Change Service / ECMWF</li>
              <li>Índice de referencia: <strong className="text-white">RONI</strong> (Relative Oceanic Niño Index), vigente desde feb 2026</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              Referencia científica local
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              <li>Domínguez Calle, E.A. et al. (2018)</li>
              <li>ISBN: <span className="font-mono">978-620-2-16957-8</span></li>
              <li>150 estaciones · 87 años (1930-2017)</li>
              <li>Convenio SGR No. 124/2015</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B9FE8] mb-4">
              Observatorio
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
              <li>Observatorio Climático del Huila</li>
              <li><em className="text-neutral-200">«Efraín Antonio Domínguez Calle»</em></li>
              <li>CENIGAA. NIT 900345215-2</li>
              <li>Nodo 1 ROGAA-Huila</li>
              <li>Actualización ENSO: semanal (manual)</li>
              <li>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-1 text-[#8B9FE8] hover:text-white transition-colors underline underline-offset-2"
                >
                  Más sobre el Observatorio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="inline-flex items-center gap-2 text-[12.5px] text-neutral-400">
            <RefreshCw size={12} className="text-[#8B9FE8]" aria-hidden="true" />
            Última actualización de datos ENSO:
            <span className="font-mono text-neutral-200">{meta?.ultima_actualizacion}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Estados de carga / error ───────────────────────────────────────────────
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
            {mensaje}. Intenta recargar la página o vuelve más tarde. El archivo
            de origen es <span className="font-mono">/data/enso-estado.json</span>.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Página /enso ───────────────────────────────────────────────────────────
export default function Enso() {
  const { data, loading, error } = useEnsoData()

  if (loading) {
    return (
      <>
        <HeroEnso data={null} />
        <EstadoCarga />
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <HeroEnso data={null} />
        <EstadoError mensaje={error ?? 'Datos no disponibles'} />
      </>
    )
  }

  return (
    <>
      <HeroEnso data={data} />
      <BloqueRelevancia />
      <BloqueLineaTiempo items={data.linea_tiempo} />
      <BloqueIndicadores indicadores={data.indicadores} meta={data._meta} />
      <BloqueGeovisores geovisores={data.geovisores} />
      <BloqueEscalaNacional nacional={data.escala_nacional} />
      <BloqueHistoricoHuila />
      <BloqueSeguimientoLocal />
      <BloqueCreditos meta={data._meta} />
    </>
  )
}
