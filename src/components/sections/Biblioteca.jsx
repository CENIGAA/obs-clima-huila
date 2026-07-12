import { useState } from 'react'
import { Bookmark, LibraryBig, Mail, Microscope } from 'lucide-react'
import SubpageHeroNav from '../layout/SubpageHeroNav'

const REFERENCIAS = [
  {
    año: 2018,
    autores: 'Domínguez Calle, E.A.',
    titulo: 'Cambio climático y variabilidad climática extrema en el Huila',
    fuente: 'Editorial Académica Española',
    detalle: 'ISBN 978-620-2-16957-8',
    badge: { texto: 'Libro base del Observatorio', tono: 'blue' },
    categoria: 'Fundacional',
    nota: 'Obra de referencia para el sustento metodológico y territorial del observatorio.',
    destacada: true,
  },
  {
    año: 2014,
    autores: 'Gobernación del Huila & CAM',
    titulo: 'Plan de Cambio Climático Huila 2050: Preparándose para el Cambio Climático',
    fuente: 'Neiva: Gobernación del Huila',
    badge: { texto: 'Marco institucional', tono: 'green' },
    categoria: 'Institucional',
    nota: 'Documento clave para entender la traducción territorial de la gestión climática.',
  },
  {
    año: 2015,
    autores: 'IDEAM',
    titulo: 'Atlas Climatológico de Colombia',
    fuente: 'Bogotá: IDEAM',
    categoria: 'Contexto científico',
    nota: 'Aporta línea base nacional para contrastar patrones regionales y escalas de análisis.',
  },
  {
    año: 2021,
    autores: 'IPCC',
    titulo: 'Sixth Assessment Report - Climate Change 2021: The Physical Science Basis',
    fuente: 'Cambridge University Press',
    categoria: 'Contexto científico',
    nota: 'Marco global actualizado para interpretar señales climáticas y escenarios de riesgo.',
  },
  {
    año: 2011,
    autores: 'Poveda, G. et al.',
    titulo:
      'La hidroclimatología de Colombia: una síntesis desde la escala inter-decadal hasta la escala diurna',
    fuente: 'Revista de la Academia Colombiana de Ciencias',
    categoria: 'Contexto científico',
    nota: 'Síntesis clave para conectar la variabilidad colombiana con escalas hidroclimáticas múltiples.',
  },
  {
    año: 2014,
    autores: 'CAM',
    titulo: 'Plan de Ordenación y Manejo de la Cuenca del Río Magdalena - Tramo Alto',
    fuente: 'Neiva: CAM',
    categoria: 'Institucional',
    nota: 'Aporta lectura de cuenca y ordenamiento hídrico con incidencia directa sobre el Huila.',
  },
]

const BADGE_TONO = {
  blue: 'bg-[#EEF1FB] text-[#4A60D8] border-[#C5CEEF]',
  green: 'bg-[#EBF7E7] text-[#43B02A] border-[#B8E4AB]',
}

const CATEGORY_STYLES = {
  Fundacional: {
    icon: LibraryBig,
    accent: '#4A60D8',
    bg: 'bg-[#EEF1FB]',
  },
  Institucional: {
    icon: Bookmark,
    accent: '#43B02A',
    bg: 'bg-[#EBF7E7]',
  },
  'Contexto científico': {
    icon: Microscope,
    accent: '#F4511E',
    bg: 'bg-[#FEF0EC]',
  },
}

function ReferenciaCard({ año, autores, titulo, fuente, detalle, badge, nota, categoria }) {
  const category = CATEGORY_STYLES[categoria] ?? CATEGORY_STYLES.Fundacional
  const Icon = category.icon

  return (
    <li
      className="
        relative rounded-[24px] bg-white border border-neutral-200 p-5
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold text-[#4A60D8] text-[18px] tabular-nums">
              {año}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.bg}`} style={{ color: category.accent }}>
              <Icon size={12} aria-hidden="true" />
              {categoria}
            </span>
          </div>
          <p className="mt-3 text-[12.5px] text-neutral-500 font-medium">
            {autores}
          </p>
        </div>
      </div>

      <h3 className="mt-2 text-[15px] font-bold text-[#162341] leading-snug">
        {titulo}
      </h3>
      <p className="text-[12.5px] text-neutral-500 mt-2 italic">
        {fuente}
        {detalle && (
          <span className="not-italic font-mono text-neutral-400"> · {detalle}</span>
        )}
      </p>
      <p className="mt-3 text-[12.5px] text-neutral-600 leading-relaxed">
        {nota}
      </p>

      {badge && (
        <span
          className={`
            mt-4 inline-flex items-center gap-1.5
            px-2.5 py-1 rounded-full
            text-[11px] font-semibold tracking-wide
            border ${BADGE_TONO[badge.tono] ?? BADGE_TONO.blue}
          `}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          {badge.texto}
        </span>
      )}
    </li>
  )
}

function CategoryPanel({ categoria, items }) {
  const style = CATEGORY_STYLES[categoria] ?? CATEGORY_STYLES.Fundacional
  const Icon = style.icon

  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${style.bg}`} style={{ color: style.accent }}>
            <Icon size={19} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[1.2rem] font-bold tracking-tight text-[#162341]">
              {categoria}
            </h3>
            <p className="mt-1 text-[12.5px] text-neutral-500">
              {items.length} {items.length === 1 ? 'referencia priorizada' : 'referencias priorizadas'}
            </p>
          </div>
        </div>
      </div>

      <ul className="grid gap-4 mt-5">
        {items.map((r, i) => (
          <ReferenciaCard key={`${r.año}-${i}`} {...r} />
        ))}
      </ul>
    </section>
  )
}

export default function Biblioteca() {
  const destacada = REFERENCIAS.find((ref) => ref.destacada)
  const categorias = ['Fundacional', 'Institucional', 'Contexto científico']
  const sections = [
    { id: 'destacada', label: 'Principal' },
    { id: 'Fundacional', label: 'Fundacional' },
    { id: 'Institucional', label: 'Institucional' },
    { id: 'Contexto científico', label: 'Científico' },
  ]
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
    <>
      <SubpageHeroNav
        eyebrow="Biblioteca curada"
        title="Referencias clave para entender el clima del Huila desde el territorio y la ciencia."
        description="Explora por vistas la referencia principal del observatorio y las categorías de documentos fundacionales, institucionales y científicos."
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        aside="La curaduría prioriza orientación y trazabilidad antes que exhaustividad, para que el usuario llegue rápido a la fuente más útil."
      />

      <section
        id={`panel-${activeSection}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeSection}`}
        className="py-20 border-t border-neutral-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
      >
        <div className="container-main">
          {activeSection === 'destacada' && destacada && (
            <article className="rounded-[30px] border border-[#C5CEEF] bg-[linear-gradient(135deg,#162341_0%,#20315a_100%)] p-6 sm:p-7 text-white shadow-[0_22px_60px_-34px_rgba(22,35,65,0.85)]">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8B9FE8]">
                Referencia principal
              </p>
              <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-end">
                <div>
                  <h3 className="text-[1.7rem] sm:text-[2.05rem] font-bold tracking-tight leading-tight text-balance">
                    {destacada.titulo}
                  </h3>
                  <p className="mt-3 text-[14px] text-white/70">
                    {destacada.autores} · {destacada.año}
                  </p>
                  <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/82">
                    {destacada.nota}
                  </p>
                  <p className="mt-4 text-[12px] text-white/62">
                    {destacada.fuente}
                    {destacada.detalle ? ` · ${destacada.detalle}` : ''}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                    Por qué abrir aquí
                  </p>
                  <div className="mt-3 space-y-3 text-[12.5px] text-white/78 leading-relaxed">
                    <p>Define la base científica y territorial del observatorio.</p>
                    <p>Conecta variabilidad climática extrema con el contexto del Huila.</p>
                    <p>Sirve como referencia transversal para lectura del resto del sitio.</p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {categorias.includes(activeSection) && (
            <CategoryPanel
              categoria={activeSection}
              items={REFERENCIAS.filter((ref) => ref.categoria === activeSection)}
            />
          )}

          <p className="mt-10 inline-flex flex-wrap items-center gap-2 text-[13px] text-neutral-600">
            <Mail size={14} className="text-[#4A60D8]" aria-hidden="true" />
            ¿Tienes una investigación sobre el clima del Huila? Escríbenos a{' '}
            <a
              href="mailto:info@cenigaa.org"
              className="font-medium text-[#4A60D8] hover:text-[#162341] underline underline-offset-2"
            >
              info@cenigaa.org
            </a>{' '}
            para evaluarla e incluirla en esta curaduría.
          </p>
        </div>
      </section>
    </>
  )
}
