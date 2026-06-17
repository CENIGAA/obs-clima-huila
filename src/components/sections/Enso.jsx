import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Clock, Construction, ExternalLink, MapPin,
  Waves, Activity, Target, RefreshCw,
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
      <BloqueHistoricoHuila />
      <BloqueSeguimientoLocal />
      <BloqueCreditos meta={data._meta} />
    </>
  )
}
