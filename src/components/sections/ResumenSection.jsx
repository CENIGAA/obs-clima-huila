import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { TrendingDown, TrendingUp, Minus, Activity } from 'lucide-react'

const tendencias = [
  { nombre: 'Decreciente',   valor: 25,  color: '#F4511E' },
  { nombre: 'Sin tendencia', valor: 112, color: '#94a3b8' },
  { nombre: 'Creciente',     valor: 12,  color: '#43B02A' },
]

const hallazgos = [
  {
    Icono: TrendingDown,
    color: '#F4511E',
    titulo: 'Tendencia decreciente al sur',
    texto:
      '25 estaciones registran reducción significativa de precipitación en el sur del departamento durante el periodo 1985-2015. La pendiente Theil-Sen confirma la magnitud del cambio.',
  },
  {
    Icono: TrendingUp,
    color: '#43B02A',
    titulo: 'Tendencia creciente al norte',
    texto:
      '12 estaciones en el norte del Huila muestran incremento estadísticamente significativo. El gradiente altitudinal y la posición relativa respecto a la cuenca del Magdalena explican el patrón diferencial.',
  },
  {
    Icono: Activity,
    color: '#4A60D8',
    titulo: 'Correlación con ENSO',
    texto:
      'La precipitación del Huila está inversamente correlacionada con los índices del Pacífico: Niño 3.4, MEI y OMI. El observatorio registra correlaciones con 17 índices globales NOAA.',
  },
  {
    Icono: Minus,
    color: '#162341',
    titulo: 'Patrón bimodal estable',
    texto:
      '112 de 149 estaciones no presentan tendencia significativa. El régimen bimodal del Huila (abril-mayo y octubre-noviembre) se mantiene como patrón dominante en el periodo analizado.',
  },
]

const metricas = [
  { valor: '149',  label: 'estaciones analizadas' },
  { valor: '37',   label: 'con tendencia significativa' },
  { valor: '87',   label: 'años de registro' },
]

function TooltipTendencia({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const { nombre, valor } = payload[0].payload
  return (
    <div className="rounded-md bg-[#162341] text-white px-3 py-1.5 text-[12px] shadow-lg">
      <span className="font-semibold">{nombre}:</span>{' '}
      <span className="font-mono">{valor}</span>{' '}
      <span className="text-neutral-300">estaciones</span>
    </div>
  )
}

export default function ResumenSection() {
  return (
    <section
      id="resumen"
      className="py-16 bg-slate-50"
      aria-labelledby="resumen-heading"
    >
      <div className="container-main">
        {/* Encabezado */}
        <div className="max-w-3xl mb-10">
          <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#4A60D8] mb-3">
            Hallazgos departamentales
          </span>
          <h2
            id="resumen-heading"
            className="text-3xl sm:text-4xl font-bold text-[#162341] tracking-tight mb-4"
          >
            Qué nos dicen 87 años de registros
          </h2>
          <p className="text-[15px] text-neutral-600 leading-relaxed">
            Análisis de 149 estaciones hidrometeorológicas del IDEAM procesadas
            por CENIGAA. Periodo: 1930-2017.
          </p>
        </div>

        {/* Métricas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {metricas.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl bg-white shadow-sm p-6 flex flex-col"
            >
              <span className="text-4xl font-extrabold text-[#162341] font-mono tracking-tight leading-none">
                {m.valor}
              </span>
              <span className="text-[13px] text-neutral-500 mt-2">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfico de tendencias */}
        <div className="rounded-2xl bg-white shadow-sm p-6 mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#162341]">
              Distribución de tendencias (Mann-Kendall, 1985-2015)
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              n = 149
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={tendencias}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <XAxis
                dataKey="nombre"
                tick={{ fontSize: 12, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(22,35,65,0.04)' }}
                content={<TooltipTendencia />}
              />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                {tendencias.map((entry) => (
                  <Cell key={entry.nombre} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hallazgos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {hallazgos.map((h) => {
            const Icono = h.Icono
            return (
              <article
                key={h.titulo}
                className="rounded-2xl bg-white shadow-sm p-6 flex gap-4"
              >
                <span
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${h.color}1A` }}
                  aria-hidden="true"
                >
                  <Icono size={20} style={{ color: h.color }} />
                </span>
                <div>
                  <h4 className="text-[15px] font-bold text-[#162341] mb-1.5">
                    {h.titulo}
                  </h4>
                  <p className="text-[13.5px] text-neutral-600 leading-relaxed">
                    {h.texto}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        {/* Nota metodológica */}
        <aside
          className="rounded-r-lg bg-white border-l-4 border-[#4A60D8] p-5 shadow-sm"
          aria-label="Nota metodológica"
        >
          <p className="text-[12.5px] text-neutral-600 leading-relaxed">
            <strong className="text-[#162341]">Metodología:</strong>{' '}
            Mann-Kendall para detección de tendencias + pendiente Theil-Sen para
            magnitud. Distribución mensual dominante: Gumbel con asimetría
            derecha. Distribución anual: Log-Gamma. Fuente: CCYVCE_DB.db, 149
            estaciones, 1930-2017. Referencia: Domínguez Calle et al. (2018),
            ISBN 978-620-2-16957-8.
          </p>
        </aside>
      </div>
    </section>
  )
}
