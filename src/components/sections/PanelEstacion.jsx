import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from 'recharts'
import { useEstacion } from '../../hooks/useDataLoader'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

const TABS = [
  { id: 'estacionalidad', label: 'Estacionalidad' },
  { id: 'tendencia',      label: 'Tendencia' },
  { id: 'enso',           label: 'ENSO' },
  { id: 'distribucion',   label: 'Distribución' },
]

const TEND = {
  increasing:  { label: 'Creciente',     color: '#4A60D8' },
  decreasing:  { label: 'Decreciente',   color: '#F4511E' },
  'no trend':  { label: 'Sin tendencia', color: '#94A3B8' },
}
const TEND_FALLBACK = { label: 'Sin tendencia', color: '#94A3B8' }

function tendLabel(direccion) {
  return TEND[direccion] ?? TEND_FALLBACK
}

function median(values) {
  if (!values?.length) return null
  const s = [...values].sort((a, b) => a - b)
  const n = s.length
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}

function buildSeasonalityRows(estacionalidad, mesMax, mesMin) {
  if (!estacionalidad) return []
  return MESES.map((m) => ({
    mes: m,
    valor: estacionalidad[m] ?? 0,
    highlight: m === mesMax ? 'max' : m === mesMin ? 'min' : null,
  }))
}

function buildTrendRows(serieAnual, pendienteAnual) {
  if (!serieAnual?.años?.length) return []
  const valores = serieAnual.valores
  const años = serieAnual.años.map(Number)
  // Theil-Sen estimado: línea con pendiente provista pasando por la mediana
  const yMed = median(valores)
  const xMed = años[Math.floor(años.length / 2)]
  return años.map((año, i) => ({
    año,
    valor: valores[i],
    trend: yMed != null ? yMed + (pendienteAnual ?? 0) * (año - xMed) : null,
  }))
}

function buildHistogram(values, nBins = 15) {
  if (!values?.length) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const width = (max - min) / nBins
  if (width === 0) return [{ bin: `${min.toFixed(0)}`, count: values.length }]
  const bins = Array.from({ length: nBins }, () => 0)
  for (const v of values) {
    let idx = Math.floor((v - min) / width)
    if (idx >= nBins) idx = nBins - 1
    if (idx < 0) idx = 0
    bins[idx] += 1
  }
  return bins.map((count, i) => ({
    bin: `${Math.round(min + i * width)}`,
    rangoCompleto: `${Math.round(min + i * width)}–${Math.round(min + (i + 1) * width)}`,
    count,
  }))
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`
        relative px-4 py-2.5 text-[13px] font-medium transition-colors
        ${active
          ? 'text-[#162341]'
          : 'text-neutral-500 hover:text-[#162341]'
        }
      `}
    >
      {children}
      {active && (
        <span
          className="absolute left-3 right-3 -bottom-px h-0.5 bg-[#4A60D8] rounded-full"
          aria-hidden="true"
        />
      )}
    </button>
  )
}

function Skeleton({ height = 280 }) {
  return (
    <div
      className="rounded-xl bg-neutral-100 animate-pulse"
      style={{ height }}
      aria-hidden="true"
    />
  )
}

function StatCard({ label, value, mono = true, color }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3">
      <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-medium">
        {label}
      </p>
      <p
        className={`mt-1 text-[18px] font-bold text-[#162341] ${mono ? 'font-mono tabular-nums' : ''}`}
        style={color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  )
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

function TabEstacionalidad({ pt }) {
  const comp = pt?.componentes?.estacionalidad
  const mesMax = pt?.componentes?.mes_max
  const mesMin = pt?.componentes?.mes_min
  const rows = useMemo(
    () => buildSeasonalityRows(comp, mesMax, mesMin),
    [comp, mesMax, mesMin],
  )

  return (
    <div>
      <p className="text-[13px] text-neutral-600 mb-4 leading-relaxed">
        Precipitación media multianual por mes (mm/mes). El patrón bimodal del
        Huila típicamente muestra picos en Abr-May y Oct-Nov.
      </p>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              label={{ value: 'mm/mes', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
            />
            <RTooltip
              cursor={{ fill: 'rgba(74,96,216,0.05)' }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
              formatter={(v) => [`${v?.toFixed?.(1) ?? v} mm`, 'Precipitación']}
            />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {rows.map((r, i) => (
                <Cell
                  key={i}
                  fill={
                    r.highlight === 'max' ? '#4A60D8'
                    : r.highlight === 'min' ? '#94A3B8'
                    : '#C5CEEF'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[12px]">
        <span className="inline-flex items-center gap-2 text-neutral-500">
          <span className="w-3 h-3 rounded bg-[#4A60D8]" /> Máximo: <strong className="text-[#162341]">{mesMax ?? 'N/D'}</strong>
        </span>
        <span className="inline-flex items-center gap-2 text-neutral-500">
          <span className="w-3 h-3 rounded bg-[#94A3B8]" /> Mínimo: <strong className="text-[#162341]">{mesMin ?? 'N/D'}</strong>
        </span>
      </div>
    </div>
  )
}

function TabTendencia({ pt }) {
  const tend = pt?.componentes?.tendencia
  const serie = pt?.serie_anual
  const { label, color } = tendLabel(tend?.direccion)
  const rows = useMemo(
    () => buildTrendRows(serie, tend?.pendiente_anual),
    [serie, tend?.pendiente_anual],
  )

  const pValor = tend?.p_valor
  const pTexto =
    pValor == null ? 'N/D'
    : pValor < 0.001 ? '< 0.001'
    : pValor.toFixed(3)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold"
          style={{ background: `${color}1A`, color }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          {label}
          {tend?.significativa && <span className="font-normal opacity-80">· significativa</span>}
        </span>
        <span className="text-[12px] text-neutral-500 font-mono">
          p = {pTexto}
        </span>
        {tend?.pendiente_anual != null && (
          <span className="text-[12px] text-neutral-500 font-mono">
            pendiente = {tend.pendiente_anual.toFixed(2)} mm/año
          </span>
        )}
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="año" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              label={{ value: 'mm/mes', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
            />
            <RTooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
              formatter={(v, name) => [
                v != null ? `${Number(v).toFixed(1)} mm` : 'N/D',
                name === 'valor' ? 'Anual' : 'Theil-Sen',
              ]}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#4A60D8"
              strokeWidth={2}
              dot={{ r: 2, fill: '#4A60D8' }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="trend"
              stroke={color}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {tend?.cambio_total != null && (
        <p className="text-[12px] text-neutral-500 mt-3">
          Cambio total acumulado en el período:{' '}
          <strong className="text-[#162341] font-mono">
            {tend.cambio_total > 0 ? '+' : ''}{tend.cambio_total.toFixed(1)} mm
          </strong>
        </p>
      )}
    </div>
  )
}

function TabEnso({ pt }) {
  const enso = pt?.componentes?.enso
  if (!enso) {
    return <p className="text-[13px] text-neutral-500">Sin información de correlación ENSO para esta estación.</p>
  }
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_auto] items-start">
      <div className="space-y-4">
        <div>
          <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-medium mb-1">
            Correlación ENSO
          </p>
          <p className="text-[15px] font-semibold text-[#162341] leading-snug">
            {enso.nota}
          </p>
        </div>

        <div>
          <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-medium mb-1">
            Interpretación
          </p>
          <p className="text-[13.5px] text-neutral-700 leading-relaxed">
            {enso.interpretacion}
          </p>
        </div>

        {enso.fuente && (
          <p className="text-[11.5px] text-neutral-400 italic pt-2 border-t border-neutral-100">
            Fuente: {enso.fuente}
          </p>
        )}
      </div>

      <div className="rounded-xl bg-[#EEF1FB] border border-[#C5CEEF] p-5 max-w-[200px]">
        <p className="text-[10.5px] uppercase tracking-widest text-[#4A60D8] font-semibold mb-2">
          Índices Pacífico
        </p>
        <ul className="space-y-1.5 text-[12.5px] text-[#162341] font-mono">
          <li>Niño 3.4</li>
          <li>MEI</li>
          <li>OMI</li>
        </ul>
      </div>
    </div>
  )
}

function TabDistribucion({ pt }) {
  const dist = pt?.componentes?.distribucion
  const valores = pt?.serie_mensual?.valores
  const histRows = useMemo(() => buildHistogram(valores, 18), [valores])

  if (!dist) {
    return <p className="text-[13px] text-neutral-500">Sin información de distribución ajustada.</p>
  }

  const ks = dist.ks_p_valor
  const ksTexto = ks == null ? 'N/D' : ks < 0.001 ? '< 0.001' : ks.toFixed(3)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#EEF1FB] text-[#4A60D8]">
          <span className="w-2 h-2 rounded-full bg-[#4A60D8]" />
          Distribución {dist.nombre}
        </span>
        {dist.ajuste_aceptado ? (
          <span className="text-[11.5px] font-medium text-[#43B02A]">
            ✓ ajuste aceptado (KS p = {ksTexto})
          </span>
        ) : (
          <span className="text-[11.5px] font-medium text-[#F4511E]">
            ✗ ajuste no aceptado (KS p = {ksTexto})
          </span>
        )}
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histRows} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="bin"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              interval={1}
              label={{ value: 'mm/mes', position: 'insideBottom', offset: -2, style: { fontSize: 11, fill: '#6B7280' } }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              label={{ value: 'frecuencia', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
            />
            <RTooltip
              cursor={{ fill: 'rgba(74,96,216,0.05)' }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
              labelFormatter={(_l, payload) => `Rango: ${payload?.[0]?.payload?.rangoCompleto ?? ''} mm`}
              formatter={(v) => [v, 'observaciones']}
            />
            <Bar dataKey="count" fill="#4A60D8" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Media"      value={`${dist.media?.toFixed(1) ?? 'N/D'} mm`} />
        <StatCard label="Desv. std." value={`${dist.desv_std?.toFixed(1) ?? 'N/D'} mm`} />
        <StatCard label="Parám. 1"   value={dist.parametros?.[0]?.toFixed(2) ?? 'N/D'} />
        <StatCard label="Parám. 2"   value={dist.parametros?.[1]?.toFixed(2) ?? 'N/D'} />
      </div>
    </div>
  )
}

// ─── Panel principal ───────────────────────────────────────────────────────

export default function PanelEstacion({ estacion, onClose }) {
  const { data, loading, error } = useEstacion(estacion?.codigo ?? null)
  const [tab, setTab] = useState('estacionalidad')

  if (!estacion) return null

  const sensor = estacion?.sensores?.[0]
  const pt = data?.datos?.[sensor]
  const tend = pt?.componentes?.tendencia ?? estacion?.resumen?.[sensor]
  const direccion = tend?.direccion ?? tend?.tendencia
  const { label: tendLabelText, color: tendColor } = tendLabel(direccion)

  return (
    <section
      className="mt-8 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
      aria-label={`Detalle de estación ${estacion.nombre}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-neutral-100">
        <div className="min-w-0">
          <p className="text-[10.5px] font-mono tracking-widest text-neutral-400 uppercase">
            Estación · {estacion.codigo}
          </p>
          <h3 className="text-[20px] font-bold text-[#162341] mt-0.5 leading-tight truncate">
            {estacion.nombre}
          </h3>
          <p className="text-[13px] text-neutral-500 mt-0.5">
            {estacion.municipio}
            {estacion.corriente && <span className="text-neutral-300"> · {estacion.corriente}</span>}
            {estacion.altitud != null && (
              <span className="text-neutral-300"> · {estacion.altitud} msnm</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
            style={{ background: `${tendColor}1A`, color: tendColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tendColor }} />
            {tendLabelText}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 text-xl leading-none"
            aria-label="Cerrar panel de estación"
          >
            ×
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        className="flex flex-wrap items-center gap-1 px-4 border-b border-neutral-100 bg-neutral-50/50"
      >
        {TABS.map((t) => (
          <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </TabButton>
        ))}
      </div>

      {/* Body */}
      <div className="p-6">
        {error && (
          <p className="text-[13px] text-red-600">
            Error cargando datos de la estación: {error}
          </p>
        )}

        {loading && !error && (
          <div className="space-y-4">
            <Skeleton height={24} />
            <Skeleton height={280} />
          </div>
        )}

        {!loading && !error && pt && (
          <>
            {tab === 'estacionalidad' && <TabEstacionalidad pt={pt} />}
            {tab === 'tendencia'      && <TabTendencia pt={pt} />}
            {tab === 'enso'           && <TabEnso pt={pt} />}
            {tab === 'distribucion'   && <TabDistribucion pt={pt} />}
          </>
        )}

        {!loading && !error && !pt && (
          <p className="text-[13px] text-neutral-500">
            La estación no tiene datos del sensor {sensor ?? 'N/D'}.
          </p>
        )}
      </div>
    </section>
  )
}
