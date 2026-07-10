import { Users, ExternalLink, FlaskConical, Linkedin, Check } from 'lucide-react'

// ─── Roles posibles dentro del equipo (checklist por miembro) ────────────────
const ROLES = ['Researcher', 'Developer', 'Data Scientist', 'AI Engineer']

function RoleChecklist({ roles = [] }) {
  return (
    <ul className="flex flex-col gap-1.5 mt-1" aria-label="Roles del miembro">
      {ROLES.map(role => {
        const active = roles.includes(role)
        return (
          <li
            key={role}
            className={`flex items-center gap-2 text-[12.5px] ${active ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}
          >
            <span
              className={`
                inline-flex items-center justify-center w-4 h-4 rounded-[5px] shrink-0
                ${active ? 'bg-[#4A60D8] text-white' : 'border border-neutral-300 bg-white'}
              `}
              aria-hidden="true"
            >
              {active && <Check size={11} strokeWidth={3} />}
            </span>
            {role}
          </li>
        )
      })}
    </ul>
  )
}

function CardBase({ destacado = false, children }) {
  return (
    <article
      className={`
        relative rounded-2xl p-6 flex flex-col gap-3
        transition-shadow hover:shadow-md
        ${destacado
          ? 'bg-[#EEF1FB] border-2 border-[#C5CEEF]'
          : 'bg-white border border-neutral-200'
        }
      `}
    >
      {destacado && (
        <span
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px] bg-[#4A60D8]"
          aria-hidden="true"
        />
      )}
      {children}
    </article>
  )
}

// ─── Tarjeta horizontal (grupos de investigación / infraestructura) ──────────
// Logo (o ícono) grande al lateral izquierdo, con el texto al frente.
function GrupoCard({ logo, alt, icon: Icon, eyebrow = 'Grupo de investigación', nombre, descripcion, children }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 flex items-center gap-5 transition-shadow hover:shadow-md">
      <div className="shrink-0 w-28 sm:w-32 flex items-center justify-center">
        {logo ? (
          <img
            src={logo}
            alt={alt}
            className="w-full h-auto max-h-28 object-contain"
            loading="lazy"
          />
        ) : (
          <span
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#EEF1FB] text-[#4A60D8]"
            aria-hidden="true"
          >
            <Icon size={44} />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-neutral-400">
          {eyebrow}
        </p>
        <h3 className="text-[16px] font-bold text-[#162341] leading-tight">
          {nombre}
        </h3>
        <p className="text-[13px] text-neutral-700 leading-relaxed">
          {descripcion}
        </p>
        {children}
      </div>
    </article>
  )
}

function ExternalLinkChip({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-1.5 mt-2
        text-[12.5px] font-medium text-[#4A60D8] hover:text-[#162341]
        transition-colors
      "
    >
      {children}
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  )
}

// ─── Encabezado de subcategoría dentro del equipo ────────────────────────────
function SubCategoria({ titulo }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#4A60D8] whitespace-nowrap">
        {titulo}
      </h3>
      <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
    </div>
  )
}

export default function Equipo() {
  return (
    <section
      id="equipo"
      className="py-20 border-t border-neutral-100"
      aria-labelledby="equipo-heading"
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0"
            aria-hidden="true"
          >
            <Users size={18} />
          </span>
          <div>
            <h2
              id="equipo-heading"
              className="text-[26px] sm:text-[28px] font-bold text-[#162341] tracking-tight"
            >
              I+D+i
            </h2>
            <p className="text-[14px] text-neutral-500 mt-1 leading-snug">
              Investigación, desarrollo e innovación del Observatorio Climático del Huila.
            </p>
          </div>
        </div>

        {/* ── Talento Humano ─────────────────────────────────── */}
        <SubCategoria titulo="Talento Humano" />
        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          {/* Director científico - destacado */}
          <CardBase destacado>
            <img
              src="/assets/equipo/Jorge_Chavarro.jpg"
              alt="Jorge I. Chavarro D."
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-sm"
              loading="lazy"
            />
            <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-[#4A60D8]">
              Dirección científica
            </p>
            <h3 className="text-[18px] font-bold text-[#162341] leading-tight">
              Jorge I. Chavarro D.
            </h3>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed">
              Director científico · Grupo Hidroinformática CENIGAA.
            </p>
            <RoleChecklist roles={ROLES} />
            <a
              href="https://www.linkedin.com/in/jorge-chavarro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-auto pt-2 text-[12.5px] font-medium text-[#4A60D8] hover:text-[#162341] transition-colors"
            >
              <Linkedin size={13} aria-hidden="true" />
              LinkedIn
            </a>
          </CardBase>
        </div>

        {/* ── Grupos de Investigación ────────────────────────── */}
        <SubCategoria titulo="Grupos de Investigación" />
        <div className="grid gap-5 md:grid-cols-2 items-stretch">
          <GrupoCard
            icon={FlaskConical}
            nombre="Grupo Hidroinformática CENIGAA"
            descripcion="Análisis de series temporales, modelación hidrológica, ciencia de datos."
          />
          <GrupoCard
            logo="/assets/logos/DSGAA.png"
            alt="Grupo de Investigación en Dinámica de Sistemas GeoAgroAmbientales - DSGAA"
            nombre="Dinámica de Sistemas GeoAgroAmbientales - DSGAA"
            descripcion="Modelación de dinámica de sistemas aplicada a procesos geoagroambientales."
          />
        </div>

        {/* ── Infraestructura ────────────────────────────────── */}
        <SubCategoria titulo="Infraestructura" />
        <div className="grid gap-5 md:grid-cols-2 items-stretch">
          <GrupoCard
            logo="/assets/logos/Logo_GAA+IA.png"
            alt="GAA+IA Lab"
            eyebrow="Infraestructura"
            nombre="GAA+IA Lab"
            descripcion="Infraestructura computacional · Capa 2 ROGAA-Huila."
          >
            <ExternalLinkChip href="https://gaaialab.cenigaa.org">
              gaaialab.cenigaa.org
            </ExternalLinkChip>
          </GrupoCard>
        </div>
      </div>
    </section>
  )
}
