import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, GraduationCap, Mountain, Scale } from 'lucide-react'

const HERO_BG = "/assets/Nevado%20tatacoa.webp"
const FOTO_EFRAIN = "/assets/efrain/Efrain-dominguez1.webp"

function VolverButton() {
  return (
    <Link
      to="/"
      className="
        inline-flex items-center gap-2 px-4 py-2.5
        rounded-full bg-white/10 hover:bg-white/15 border border-white/20
        text-[13px] text-white/90 hover:text-white font-medium
        backdrop-blur-sm transition-colors
      "
    >
      <ArrowLeft size={15} aria-hidden="true" />
      Volver al Observatorio
    </Link>
  )
}

function SeccionTitulo({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-3 text-[22px] sm:text-[26px] font-bold text-[#162341] tracking-tight mt-14 mb-5">
      {Icon && (
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#EEF1FB] text-[#4A60D8]"
          aria-hidden="true"
        >
          <Icon size={18} />
        </span>
      )}
      {children}
    </h2>
  )
}

function Bullet({ titulo, children }) {
  return (
    <li className="relative pl-6">
      <span
        className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#4A60D8]"
        aria-hidden="true"
      />
      <p className="text-[14.5px] text-neutral-700 leading-relaxed">
        {titulo && <strong className="text-[#162341] font-semibold">{titulo}: </strong>}
        {children}
      </p>
    </li>
  )
}

export default function HomenajeEfrain() {
  const sections = [
    { id: 'legado', label: 'Legado' },
    { id: 'aporte', label: 'Aporte' },
    { id: 'trayectoria', label: 'Trayectoria' },
    { id: 'obra', label: 'Obra' },
  ]
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
    <article className="bg-white">
      {/* ── Banner hero ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="homenaje-heading"
      >
        <div
          className="absolute inset-0 bg-[#162341]"
          aria-hidden="true"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(22,35,65,0.78) 0%, rgba(22,35,65,0.88) 60%, rgba(22,35,65,0.95) 100%)',
          }}
        />

        <div className="container-main relative z-10 py-10 md:py-14">
          <div className="flex justify-start mb-8">
            <VolverButton />
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-center">
            {/* Foto */}
            <div className="lg:order-1 mx-auto lg:mx-0">
              <div className="relative w-[220px] sm:w-[260px] lg:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                <img
                  src={FOTO_EFRAIN}
                  alt="Dr. Efraín Antonio Domínguez Calle"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Texto */}
            <div className="lg:order-2 text-center lg:text-left">
              <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8B9FE8] mb-3">
                Homenaje · CENIGAA
              </p>
              <h1
                id="homenaje-heading"
                className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-white leading-tight tracking-tight"
              >
                Dr. Efraín Antonio Domínguez Calle
              </h1>
              <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-300 font-medium">
                1960 – 2021 · Hidrólogo · Científico · Maestro
              </p>
              <div className="flex justify-center lg:justify-start mt-5">
                <div className="h-1 w-16 bg-gradient-to-r from-[#4A60D8] via-[#43B02A] to-[#F4511E] rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/6 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B9FE8]">
                  Menú de subsecciones
                </p>
                <p className="mt-2 text-[13.5px] text-neutral-300 leading-relaxed">
                  Consulta el homenaje por bloques temáticos para evitar scroll largo.
                </p>
              </div>
              <p className="text-[12px] text-neutral-400">
                Viendo: <span className="font-semibold text-neutral-100">{sections.find((section) => section.id === activeSection)?.label}</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Homenaje Efraín">
              {sections.map((section) => {
                const active = section.id === activeSection
                return (
                  <button
                    key={section.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${section.id}`}
                    id={`tab-${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      shrink-0 rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition-colors
                      ${active
                        ? 'border-white bg-white text-[#162341]'
                        : 'border-white/15 bg-white/5 text-neutral-200 hover:bg-white/10'
                      }
                    `}
                  >
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cuerpo ──────────────────────────────────────────── */}
      <section className="container-main py-14 lg:py-20 max-w-3xl" id={`panel-${activeSection}`} role="tabpanel" aria-labelledby={`tab-${activeSection}`}>
        {activeSection === 'legado' && (
          <>
            <p className="text-[16px] sm:text-[17px] text-neutral-700 leading-relaxed">
              El Observatorio Climático del Departamento del Huila rinde un profundo y
              respetuoso homenaje al Dr. Efraín Antonio Domínguez Calle (1960–2021),
              cuya brillantez intelectual, rigurosidad académica y calidad humana
              transformaron la gestión del conocimiento ambiental en nuestro territorio.
              Como uno de los científicos e hidrólogos más destacados de Colombia,
              dedicó su vida a descifrar la complejidad de los sistemas hídricos y
              climáticos a través del modelamiento matemático, dejando una huella
              imborrable en el departamento del Huila.
            </p>

            <SeccionTitulo icon={Mountain}>
              Forjador del Nodo Regional de Modelación Ambiental
            </SeccionTitulo>
            <p className="text-[15px] text-neutral-700 leading-relaxed">
              Su visión estratégica y generosidad científica fueron pilares fundamentales
              para CENIGAA. Como Asesor Científico, lideró el diseño técnico y
              metodológico que dio vida al{' '}
              <strong className="text-[#162341]">Nodo Regional de Modelación Ambiental (NRMA)</strong>,
              consolidado como una infraestructura científica pionera capaz de simular
              dinámicas territoriales y proveer herramientas tecnológicas avanzadas
              para la toma de decisiones frente a la gestión del riesgo y el desarrollo
              sostenible en la región.
            </p>
          </>
        )}

        {activeSection === 'aporte' && (
          <>
            <SeccionTitulo icon={Scale}>
              Aporte científico clave para la resiliencia del Huila
            </SeccionTitulo>
            <p className="text-[15px] text-neutral-700 leading-relaxed">
              Su obra cumbre para el territorio:{' '}
              <em className="text-[#162341] font-medium">
                Cambio climático y variabilidad climática extrema en el Huila:
                Herramientas para la caracterización de la amenaza hidroclimática
              </em>
              , se convirtió en carta de navegación indispensable para la academia
              y las instituciones públicas.
            </p>
            <ul className="mt-5 space-y-3">
              <Bullet titulo="Interpretación hidroclimática avanzada">
                Modelos estocásticos y determinísticos aplicados a las dinámicas locales
                de la cuenca alta del Río Magdalena.
              </Bullet>
              <Bullet titulo="Caracterización de amenazas">
                Herramientas metodológicas para evaluar escenarios futuros frente a la
                variabilidad climática extrema.
              </Bullet>
              <Bullet titulo="Apropiación social del conocimiento">
                Base científica diseñada para que comunidades e instituciones construyan
                acciones de adaptación a mediano y largo plazo.
              </Bullet>
            </ul>
          </>
        )}

        {activeSection === 'trayectoria' && (
          <>
            <SeccionTitulo icon={GraduationCap}>
              Una trayectoria de excelencia global
            </SeccionTitulo>
            <ul className="space-y-3">
              <Bullet>
                <strong className="text-[#162341] font-semibold">PhD en Ciencias Técnicas</strong>{' '}
                (Hidrología, Recursos Hídricos e Hidroquímica) y{' '}
                <strong className="text-[#162341] font-semibold">Maestría en Ecología
                Hidrometeorológica</strong> - Universidad Estatal Hidrometeorológica de Rusia.
              </Bullet>
              <Bullet>
                Ingeniero Hidrólogo e Investigador.
              </Bullet>
              <Bullet>
                <strong className="text-[#162341] font-semibold">
                  Director del Departamento de Ecología y Territorio
                </strong>
                , Facultad de Estudios Ambientales y Rurales, Pontificia Universidad
                Javeriana - formó generaciones de profesionales y lideró redes
                científicas internacionales de cambio climático y biodiversidad.
              </Bullet>
            </ul>

            <blockquote
              className="
                mt-14 pl-6 py-2 border-l-4 border-[#4A60D8]
                text-[16px] sm:text-[17px] text-[#162341] leading-relaxed italic
              "
            >
              “Su memoria vive en cada dato analizado, en cada modelo ejecutado y en
              este Observatorio Climático, que hoy hereda su rigor metodológico para
              salvaguardar la riqueza ambiental del Huila. Gracias, Dr. Efraín
              Domínguez, por enseñarnos a modelar el futuro con la precisión de la
              ciencia y el corazón puesto en el territorio.”
            </blockquote>
          </>
        )}

        {activeSection === 'obra' && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
            <div className="flex gap-5">
              <div
                className="shrink-0 w-[88px] sm:w-[110px] aspect-[3/4] rounded-lg overflow-hidden bg-[#162341] shadow-md ring-1 ring-black/5"
                aria-hidden="true"
              style={{
                backgroundImage: `url('${HERO_BG}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-widest text-[#4A60D8] mb-1.5">
                <BookOpen size={11} aria-hidden="true" /> Obra cumbre
              </p>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#162341] leading-snug">
                Cambio climático y variabilidad climática extrema en el Huila
              </h3>
              <p className="text-[13px] text-neutral-600 mt-1">
                Efraín Antonio Domínguez Calle · 2018
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px] font-mono">
                <dt className="text-neutral-400">ISBN</dt>
                <dd className="text-[#162341]">978-620-2-16957-8</dd>
                <dt className="text-neutral-400">Editorial</dt>
                <dd className="text-[#162341]">Editorial Académica Española</dd>
              </dl>
            </div>
          </div>
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Link
            to="/"
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              rounded-full bg-[#162341] hover:bg-[#0f1830]
              text-white text-[13.5px] font-medium transition-colors
            "
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Volver al Observatorio
          </Link>
        </div>
      </section>
    </article>
  )
}
