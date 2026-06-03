import { Link } from 'react-router-dom'
import { Users, ExternalLink, FlaskConical, Cpu } from 'lucide-react'

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

function CardIcon({ icon: Icon, destacado }) {
  return (
    <span
      className={`
        inline-flex items-center justify-center w-11 h-11 rounded-xl
        ${destacado ? 'bg-[#4A60D8] text-white' : 'bg-[#EEF1FB] text-[#4A60D8]'}
      `}
      aria-hidden="true"
    >
      <Icon size={20} />
    </span>
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
              Equipo
            </h2>
            <p className="text-[14px] text-neutral-500 mt-1 leading-snug">
              Investigación, infraestructura y operación del Observatorio Climático del Huila.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3 items-stretch">
          {/* Director científico - destacado */}
          <CardBase destacado>
            <CardIcon icon={Users} destacado />
            <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-[#4A60D8]">
              Dirección científica
            </p>
            <h3 className="text-[18px] font-bold text-[#162341] leading-tight">
              Jorge I. Chavarro D.
            </h3>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed">
              Director científico · Grupo Hidroinformática CENIGAA.
            </p>
            <ExternalLinkChip href="https://gaaialab.cenigaa.org">
              gaaialab.cenigaa.org
            </ExternalLinkChip>
          </CardBase>

          {/* Grupo Hidroinformática */}
          <CardBase>
            <CardIcon icon={FlaskConical} />
            <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              Grupo de investigación
            </p>
            <h3 className="text-[17px] font-bold text-[#162341] leading-tight">
              Grupo Hidroinformática CENIGAA
            </h3>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed">
              Análisis de series temporales, modelación hidrológica, ciencia de datos.
            </p>
          </CardBase>

          {/* GAA+IA Lab */}
          <CardBase>
            <CardIcon icon={Cpu} />
            <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              Infraestructura
            </p>
            <h3 className="text-[17px] font-bold text-[#162341] leading-tight">
              GAA+IA Lab
            </h3>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed">
              Infraestructura computacional · Capa 2 ROGAA-Huila.
            </p>
            <ExternalLinkChip href="https://gaaialab.cenigaa.org">
              gaaialab.cenigaa.org
            </ExternalLinkChip>
          </CardBase>
        </div>

        <p className="mt-10 text-[12.5px] text-neutral-500 italic text-center">
          En memoria del{' '}
          <Link
            to="/efrain"
            className="not-italic font-medium text-neutral-700 hover:text-[#4A60D8] underline underline-offset-2"
          >
            Dr. Efraín Antonio Domínguez Calle (1969–2021)
          </Link>
          , autor de la metodología base de este observatorio.
        </p>
      </div>
    </section>
  )
}
