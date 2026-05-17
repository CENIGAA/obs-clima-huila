import { BookOpen, Mail } from 'lucide-react'

const REFERENCIAS = [
  {
    año: 2018,
    autores: 'Domínguez Calle, E.A.',
    titulo: 'Cambio climático y variabilidad climática extrema en el Huila',
    fuente: 'Editorial Académica Española',
    detalle: 'ISBN 978-620-2-16957-8',
    badge: { texto: 'Libro base del Observatorio', tono: 'blue' },
  },
  {
    año: 2014,
    autores: 'Gobernación del Huila & CAM',
    titulo: 'Plan de Cambio Climático Huila 2050: Preparándose para el Cambio Climático',
    fuente: 'Neiva: Gobernación del Huila',
    badge: { texto: 'Marco institucional', tono: 'green' },
  },
  {
    año: 2015,
    autores: 'IDEAM',
    titulo: 'Atlas Climatológico de Colombia',
    fuente: 'Bogotá: IDEAM',
  },
  {
    año: 2021,
    autores: 'IPCC',
    titulo: 'Sixth Assessment Report — Climate Change 2021: The Physical Science Basis',
    fuente: 'Cambridge University Press',
  },
  {
    año: 2011,
    autores: 'Poveda, G. et al.',
    titulo:
      'La hidroclimatología de Colombia: una síntesis desde la escala inter-decadal hasta la escala diurna',
    fuente: 'Revista de la Academia Colombiana de Ciencias',
  },
  {
    año: 2014,
    autores: 'CAM',
    titulo: 'Plan de Ordenación y Manejo de la Cuenca del Río Magdalena — Tramo Alto',
    fuente: 'Neiva: CAM',
  },
]

const BADGE_TONO = {
  blue:  'bg-[#EEF1FB] text-[#4A60D8] border-[#C5CEEF]',
  green: 'bg-[#EBF7E7] text-[#43B02A] border-[#B8E4AB]',
}

function ReferenciaCard({ año, autores, titulo, fuente, detalle, badge }) {
  return (
    <li
      className="
        relative grid grid-cols-[64px_1fr] gap-5
        rounded-2xl bg-white border border-neutral-200 p-5
        transition-shadow hover:shadow-md
      "
    >
      <div
        className="
          inline-flex items-start justify-center
          font-mono font-bold text-[#4A60D8] text-[20px] tabular-nums
          pt-0.5
        "
        aria-hidden="true"
      >
        {año}
      </div>
      <div className="min-w-0">
        <p className="text-[12.5px] text-neutral-500 mb-1 font-medium">
          {autores}
        </p>
        <h3 className="text-[15px] font-bold text-[#162341] leading-snug">
          {titulo}
        </h3>
        <p className="text-[12.5px] text-neutral-500 mt-1 italic">
          {fuente}
          {detalle && (
            <span className="not-italic font-mono text-neutral-400"> · {detalle}</span>
          )}
        </p>
        {badge && (
          <span
            className={`
              mt-3 inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-full
              text-[11px] font-semibold tracking-wide
              border ${BADGE_TONO[badge.tono] ?? BADGE_TONO.blue}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            {badge.texto}
          </span>
        )}
      </div>
    </li>
  )
}

export default function Biblioteca() {
  return (
    <section
      id="biblioteca"
      className="py-20 border-t border-neutral-100"
      aria-labelledby="biblioteca-heading"
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="
              inline-flex items-center justify-center
              w-10 h-10 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0
            "
            aria-hidden="true"
          >
            <BookOpen size={18} />
          </span>
          <div>
            <h2
              id="biblioteca-heading"
              className="text-[26px] sm:text-[28px] font-bold text-[#162341] tracking-tight"
            >
              Biblioteca climática del Huila
            </h2>
            <p className="text-[14px] text-neutral-500 mt-1 leading-snug">
              Investigaciones de referencia sobre cambio climático y variabilidad
              hidroclimática en el departamento.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 mt-8">
          {REFERENCIAS.map((r, i) => (
            <ReferenciaCard key={`${r.año}-${i}`} {...r} />
          ))}
        </ul>

        <p className="mt-10 inline-flex flex-wrap items-center gap-2 text-[13px] text-neutral-600">
          <Mail size={14} className="text-[#4A60D8]" aria-hidden="true" />
          ¿Tienes una investigación sobre el clima del Huila? Escríbenos a{' '}
          <a
            href="mailto:info@cenigaa.org"
            className="font-medium text-[#4A60D8] hover:text-[#162341] underline underline-offset-2"
          >
            info@cenigaa.org
          </a>{' '}
          para incluirla.
        </p>
      </div>
    </section>
  )
}
