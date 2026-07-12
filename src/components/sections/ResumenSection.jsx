import { lazy, Suspense, useState } from 'react'
import { TrendingDown, TrendingUp, Minus, Activity } from 'lucide-react'
import SubpageHeroNav from '../layout/SubpageHeroNav'

const LazyBarChart = lazy(() => import('./LazyBarChart'))

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
      '112 de 149 estaciones con precipitación no presentan tendencia significativa. El régimen bimodal del Huila (abril-mayo y octubre-noviembre) se mantiene como patrón dominante en el periodo analizado.',
  },
]

const metricas = [
  { valor: '149',  label: 'estaciones analizadas' },
  { valor: '37',   label: 'con tendencia significativa' },
  { valor: '87',   label: 'años de registro' },
]

const RESUMEN_SECTIONS = [
  { id: 'metricas', label: 'Métricas' },
  { id: 'grafico', label: 'Gráfico' },
  { id: 'hallazgos', label: 'Hallazgos' },
  { id: 'metodologia', label: 'Metodología' },
]

export default function ResumenSection() {
  const [activeSection, setActiveSection] = useState(RESUMEN_SECTIONS[0].id)

  return (
    <>
      <SubpageHeroNav
        eyebrow="Hallazgos departamentales"
        title="Qué nos dicen 87 años de registros climáticos del Huila."
        description="Consulta por vistas las métricas principales, la distribución de tendencias, los hallazgos clave y la nota metodológica del análisis departamental."
        sections={RESUMEN_SECTIONS}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        aside="Base analítica: 149 estaciones con precipitación procesadas por CENIGAA para el periodo 1930–2017."
      />

      <section
        id={`panel-${activeSection}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeSection}`}
        className="py-16 bg-white"
      >
        <div className="container-main">
          {activeSection === 'metricas' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          )}

          {activeSection === 'grafico' && (
            <div className="rounded-2xl bg-white shadow-sm p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-[15px] font-bold text-[#162341]">
                  Distribución de tendencias (Mann-Kendall, 1985-2015)
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  n = 149
                </span>
              </div>

              <Suspense
                fallback={
                  <div className="h-56 bg-gray-100 rounded-lg animate-pulse" />
                }
              >
                <LazyBarChart data={tendencias} />
              </Suspense>
            </div>
          )}

          {activeSection === 'hallazgos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}

          {activeSection === 'metodologia' && (
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
          )}
        </div>
      </section>
    </>
  )
}
