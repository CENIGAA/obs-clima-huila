import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

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

export default function LazyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
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
          {data.map((entry) => (
            <Cell key={entry.nombre} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
