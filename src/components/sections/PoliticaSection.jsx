import { politicaClimatica } from '../../data/politicaClimatica'

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    link: 'text-blue-700 hover:text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    link: 'text-green-700 hover:text-green-900',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    link: 'text-orange-700 hover:text-orange-900',
  },
  navy: {
    bg: 'bg-[#EEF1FB]',
    border: 'border-[#C7D1F0]',
    badge: 'bg-[#162341] text-white',
    dot: 'bg-[#162341]',
    link: 'text-[#162341] hover:text-[#4A60D8]',
  },
}

function InstrumentoCard({ instrumento, color }) {
  const styles = colorMap[color] ?? colorMap.blue

  return (
    <article
      className={`rounded-2xl border ${styles.border} ${styles.bg} p-5 flex flex-col h-full transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${styles.badge}`}
        >
          {instrumento.sigla}
        </span>
        <span className="text-[12px] font-mono text-neutral-500 flex-shrink-0">
          {instrumento.ano}
        </span>
      </div>

      <h4 className="text-[14.5px] font-bold text-[#162341] leading-snug mb-1.5">
        {instrumento.nombre}
      </h4>
      <p className="text-[12px] text-neutral-500 mb-3 font-medium">
        {instrumento.entidad}
      </p>
      <p className="text-[13px] text-neutral-700 leading-relaxed mb-4 flex-grow">
        {instrumento.descripcion}
      </p>

      <a
        href={instrumento.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold ${styles.link} transition-colors mt-auto`}
      >
        Ver documento oficial
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </article>
  )
}

export default function PoliticaSection() {
  const totalInstrumentos = politicaClimatica.reduce(
    (acc, nivel) => acc + nivel.instrumentos.length,
    0,
  )

  return (
    <section
      id="politica"
      className="py-16 bg-white"
      aria-labelledby="politica-heading"
    >
      <div className="container-main">
        {/* Encabezado */}
        <div className="max-w-3xl mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#4A60D8] mb-3">
            Marco normativo
          </span>
          <h2
            id="politica-heading"
            className="text-3xl sm:text-4xl font-bold text-[#162341] tracking-tight mb-4"
          >
            Política pública sobre cambio climático
          </h2>
          <p className="text-[15px] text-neutral-600 leading-relaxed">
            Recorrido por los <strong>{totalInstrumentos} instrumentos</strong>{' '}
            que enmarcan la gestión climática aplicable al Huila, desde la
            arquitectura global del régimen climático hasta los actos
            administrativos municipales. Cada tarjeta enlaza a la fuente oficial.
          </p>
        </div>

        {/* Niveles */}
        <div className="space-y-12">
          {politicaClimatica.map(nivel => {
            const styles = colorMap[nivel.color] ?? colorMap.blue
            return (
              <div key={nivel.nivel}>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-3 h-3 rounded-full ${styles.dot}`}
                    aria-hidden="true"
                  />
                  <h3 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#162341]">
                    {nivel.nivel.toUpperCase()}
                  </h3>
                  <span className="text-[12px] font-mono text-neutral-400">
                    {nivel.instrumentos.length}{' '}
                    {nivel.instrumentos.length === 1 ? 'instrumento' : 'instrumentos'}
                  </span>
                  <span
                    className="flex-grow h-px bg-neutral-200 ml-2"
                    aria-hidden="true"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nivel.instrumentos.map(instrumento => (
                    <InstrumentoCard
                      key={instrumento.id}
                      instrumento={instrumento}
                      color={nivel.color}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Nota al pie */}
        <p className="mt-12 text-[12px] text-neutral-400 italic border-t border-neutral-100 pt-5 leading-relaxed">
          Todos los enlaces apuntan a fuentes oficiales del Estado colombiano y
          organismos internacionales. Última revisión: junio de 2026.
        </p>
      </div>
    </section>
  )
}
