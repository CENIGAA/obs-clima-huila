import { ArrowUpRight, CheckCircle2, Globe2, Landmark, Map, Scale } from 'lucide-react'
import { politicaClimatica } from '../../data/politicaClimatica'

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    link: 'text-blue-700 hover:text-blue-900',
    panel: 'from-blue-50 to-white',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    link: 'text-green-700 hover:text-green-900',
    panel: 'from-green-50 to-white',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    link: 'text-orange-700 hover:text-orange-900',
    panel: 'from-orange-50 to-white',
  },
  navy: {
    bg: 'bg-[#EEF1FB]',
    border: 'border-[#C7D1F0]',
    badge: 'bg-[#162341] text-white',
    dot: 'bg-[#162341]',
    link: 'text-[#162341] hover:text-[#4A60D8]',
    panel: 'from-[#EEF1FB] to-white',
  },
}

const LEVEL_ICONS = {
  Global: Globe2,
  Nacional: Landmark,
  Departamental: Map,
  Municipal: Scale,
}

const LEVEL_DESCRIPTIONS = {
  Global: 'Fija el marco de referencia internacional y las metas comunes del régimen climático.',
  Nacional: 'Traduce compromisos globales a obligaciones, políticas y hojas de ruta para Colombia.',
  Departamental: 'Aterriza la planificación climática al territorio huilense y sus prioridades de adaptación.',
  Municipal: 'Activa gobernanza local, seguimiento y articulación con decisiones urbanas y sectoriales.',
}

function InstrumentoCard({ instrumento, color, nivel }) {
  const styles = colorMap[color] ?? colorMap.blue

  return (
    <article
      className={`
        rounded-[24px] border ${styles.border}
        bg-gradient-to-b ${styles.panel}
        p-5 flex flex-col h-full transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
      `}
    >
      {instrumento.logo && (
        <img
          src={instrumento.logo}
          alt={instrumento.nombre}
          className="w-12 h-12 rounded-lg object-contain mb-4"
          loading="lazy"
        />
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${styles.badge}`}
        >
          {instrumento.sigla}
        </span>
        <span className="text-[11px] font-mono text-neutral-500">{instrumento.ano}</span>
        {instrumento.vigente && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 border border-neutral-200">
            <CheckCircle2 size={12} aria-hidden="true" />
            Vigente
          </span>
        )}
      </div>

      <h4 className="text-[15px] font-bold text-[#162341] leading-snug mb-1.5">
        {instrumento.nombre}
      </h4>
      <p className="text-[12px] text-neutral-500 mb-3 font-medium">
        {instrumento.entidad}
      </p>
      <p className="text-[13px] text-neutral-700 leading-relaxed mb-4 flex-grow">
        {instrumento.descripcion}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-neutral-200/80">
        <span className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          {nivel}
        </span>
        <a
          href={instrumento.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold ${styles.link} transition-colors`}
        >
          Ver fuente oficial
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

function OverviewCard({ value, label, help, accent }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm h-full">
      <p className="text-[1.9rem] sm:text-3xl font-extrabold tracking-tight leading-none" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-[#162341]">{label}</p>
      <p className="mt-2 text-[12px] text-neutral-500 leading-relaxed">{help}</p>
    </div>
  )
}

function LevelNavigator({ nivel, color, total }) {
  const styles = colorMap[color] ?? colorMap.blue
  const Icon = LEVEL_ICONS[nivel] ?? Scale

  return (
    <div className={`rounded-[24px] border ${styles.border} ${styles.bg} p-4 h-full`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#162341] shadow-sm">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#162341]">{nivel}</h3>
          <p className="mt-1 text-[12.5px] text-neutral-600 leading-relaxed">
            {LEVEL_DESCRIPTIONS[nivel]}
          </p>
        </div>
      </div>
      <p className="mt-4 text-[11px] font-mono text-neutral-500">
        {total} {total === 1 ? 'instrumento' : 'instrumentos'}
      </p>
    </div>
  )
}

export default function PoliticaSection() {
  const totalInstrumentos = politicaClimatica.reduce(
    (acc, nivel) => acc + nivel.instrumentos.length,
    0,
  )
  const totalVigentes = politicaClimatica.reduce(
    (acc, nivel) => acc + nivel.instrumentos.filter((i) => i.vigente).length,
    0,
  )
  const primerAno = Math.min(...politicaClimatica.flatMap((nivel) => nivel.instrumentos.map((i) => i.ano)))
  const ultimoAno = Math.max(...politicaClimatica.flatMap((nivel) => nivel.instrumentos.map((i) => i.ano)))

  return (
    <section
      id="politica"
      className="py-20 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
      aria-labelledby="politica-heading"
    >
      <div className="container-main">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] xl:items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A60D8]">
              <Scale size={14} aria-hidden="true" />
              Gobernanza climática
            </span>
            <h2
              id="politica-heading"
              className="mt-4 text-3xl sm:text-4xl font-bold text-[#162341] tracking-tight text-balance max-w-4xl"
            >
              Arquitectura normativa que enmarca la acción climática del Huila.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] text-neutral-600 leading-relaxed">
              Esta sección organiza las fuentes oficiales desde el régimen climático
              internacional hasta la escala municipal. El objetivo no es solo listar
              documentos, sino mostrar cómo se conectan las decisiones que afectan la
              planeación climática territorial.
            </p>
          </div>

          <aside className="rounded-[28px] border border-[#C5CEEF] bg-[#162341] p-6 text-white shadow-[0_20px_50px_-30px_rgba(22,35,65,0.8)] xl:sticky xl:top-24">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8B9FE8]">
              Cómo leer esta ruta
            </p>
            <h3 className="mt-3 text-[1.45rem] font-bold leading-tight">
              De arriba hacia abajo: compromisos, obligación, territorio y ejecución local.
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/75">
              Cada bloque agrupa normas e instrumentos por nivel institucional. Todas las
              tarjetas enlazan a la fuente oficial para facilitar trazabilidad,
              verificación jurídica y actualización editorial segura.
            </p>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-stretch">
          <OverviewCard
            value={String(politicaClimatica.length)}
            label="niveles institucionales"
            help="Escala completa desde lo global hasta lo municipal."
            accent="#4A60D8"
          />
          <OverviewCard
            value={String(totalInstrumentos)}
            label="instrumentos trazados"
            help="Fuentes oficiales enlazadas para consulta y control de calidad."
            accent="#43B02A"
          />
          <OverviewCard
            value={String(totalVigentes)}
            label="instrumentos vigentes"
            help="Marco activo para referencia operativa y seguimiento."
            accent="#F4511E"
          />
          <OverviewCard
            value={`${primerAno}-${ultimoAno}`}
            label="rango temporal"
            help="Cobertura histórica del andamiaje regulatorio aquí documentado."
            accent="#162341"
          />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4 items-stretch">
          {politicaClimatica.map((nivel) => (
            <LevelNavigator
              key={nivel.nivel}
              nivel={nivel.nivel}
              color={nivel.color}
              total={nivel.instrumentos.length}
            />
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {politicaClimatica.map((nivel) => {
            const styles = colorMap[nivel.color] ?? colorMap.blue
            const Icon = LEVEL_ICONS[nivel.nivel] ?? Scale

            return (
              <section key={nivel.nivel} aria-labelledby={`nivel-${nivel.nivel}`} className="rounded-[30px] border border-neutral-200 bg-white p-6 sm:p-7 shadow-sm overflow-hidden">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${styles.bg} ${styles.border} border`}>
                        <Icon size={19} className="text-[#162341]" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
                          Nivel institucional
                        </p>
                        <h3
                          id={`nivel-${nivel.nivel}`}
                          className="text-[1.5rem] sm:text-[1.7rem] font-bold tracking-tight text-[#162341]"
                        >
                          {nivel.nivel}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-4 text-[14px] text-neutral-600 leading-relaxed">
                      {LEVEL_DESCRIPTIONS[nivel.nivel]}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-neutral-200 bg-[#F8FAFC] px-4 py-4 xl:min-w-[220px]">
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
                      Lectura rápida
                    </p>
                    <p className="mt-2 text-[22px] font-extrabold text-[#162341] tracking-tight">
                      {nivel.instrumentos.length}
                    </p>
                    <p className="text-[12px] text-neutral-500">
                      {nivel.instrumentos.length === 1 ? 'instrumento priorizado' : 'instrumentos priorizados'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {nivel.instrumentos.map((instrumento) => (
                    <InstrumentoCard
                      key={instrumento.id}
                      instrumento={instrumento}
                      color={nivel.color}
                      nivel={nivel.nivel}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <p className="mt-12 text-[12px] text-neutral-400 italic border-t border-neutral-100 pt-5 leading-relaxed">
          Todos los enlaces apuntan a fuentes oficiales del Estado colombiano y
          organismos internacionales. Última revisión editorial registrada: junio de 2026.
        </p>
      </div>
    </section>
  )
}
