import { Link } from 'react-router-dom'
import { Mail, MapPin, ExternalLink, Github, Cloud } from 'lucide-react'

// ─── Logo CENIGAA en el footer (oficial SIC, versión blanca para fondo navy) ──
function CenigaaLogoFooter() {
  return (
    <img
      src="/assets/logos/logo_cenigaa_T_Blanco.png"
      alt="CENIGAA"
      className="h-8 w-auto"
    />
  )
}

// ─── Link de ecosistema ───────────────────────────────────────────────────────
// `to`     → ruta interna (react-router Link, sin reload)
// `href`   → URL externa (anchor con target/rel cuando external=true)
function EcoLink({ to, href, children, external = false }) {
  const className = `
    flex items-center gap-1.5
    text-[13px] text-neutral-400
    hover:text-white transition-colors duration-200
    group
  `
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {children}
      {external && (
        <ExternalLink
          size={10}
          className="opacity-0 group-hover:opacity-70 transition-opacity"
          aria-hidden="true"
        />
      )}
    </a>
  )
}

// ─── Footer principal ─────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-[#162341] text-white"
      role="contentinfo"
    >
      {/* ── Banda de color ROGAA ──────────────────────────────── */}
      <div
        className="h-1 bg-gradient-to-r from-[#4A60D8] via-[#43B02A] to-[#F4511E]"
        aria-hidden="true"
      />

      {/* ── Cuerpo del footer ─────────────────────────────────── */}
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Columna 1 - Identidad institucional */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="https://www.cenigaa.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir al sitio principal de CENIGAA"
            >
              <CenigaaLogoFooter />
            </a>
            <p className="text-[13.5px] text-neutral-400 leading-relaxed max-w-sm">
              Centro de Investigación en Ciencias y Recursos GeoAgroAmbientales.
              <span className="italic text-neutral-500"> Ideas para un desarrollo sustentable.</span>
            </p>

            {/* Descripción del nodo */}
            <div className="flex items-start gap-2 pt-1">
              <Cloud size={14} className="text-[#4A60D8] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-[12.5px] text-neutral-500 leading-snug">
                Este observatorio es el{' '}
                <strong className="text-neutral-400 font-semibold">Nodo 1</strong>{' '}
                de la Red de Observatorios GeoAgroAmbientales del Huila -{' '}
                <span className="font-semibold text-[#4A60D8]">ROGAA-Huila</span>
              </p>
            </div>

            {/* Contacto */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="mailto:info@cenigaa.org"
                className="flex items-center gap-2 text-[13px] text-neutral-400 hover:text-white transition-colors"
              >
                <Mail size={13} aria-hidden="true" />
                info@cenigaa.org
              </a>
              <span className="flex items-center gap-2 text-[13px] text-neutral-500">
                <MapPin size={13} aria-hidden="true" />
                Neiva, Huila, Colombia
              </span>
            </div>
          </div>

          {/* Columna 2 - Ecosistema CENIGAA */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500">
              Ecosistema CENIGAA
            </h3>
            <nav aria-label="Ecosistema CENIGAA" className="flex flex-col gap-2.5">
              <EcoLink href="https://www.cenigaa.org" external>
                www.cenigaa.org - Inicio
              </EcoLink>
              <EcoLink href="https://gaaialab.cenigaa.org" external>
                GAA+IA Lab
              </EcoLink>
              <EcoLink to="/">
                Obs. Climático ← estás aquí
              </EcoLink>
              {/* Obs. Suelos del Huila - oculto hasta que el subdominio exista */}
            </nav>

            <div className="pt-2">
              <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 mb-2.5">
                Redes ROGAA-Huila
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['Clima', 'Suelos', 'Hídrico', 'Cobertura', 'Socio-espacial'].map((nodo, i) => (
                  <span
                    key={nodo}
                    className={`
                      text-[10.5px] font-semibold px-2 py-0.5 rounded-full
                      ${i === 0
                        ? 'bg-[#4A60D8] text-white'
                        : 'bg-white/8 text-neutral-500 border border-white/10'
                      }
                    `}
                  >
                    {i + 1}. {nodo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 3 - Recursos */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500">
              Recursos
            </h3>
            <nav aria-label="Recursos del observatorio" className="flex flex-col gap-2.5">
              <EcoLink to="/datos">
                Datos abiertos (CSV / JSON)
              </EcoLink>
              <EcoLink to="/biblioteca">
                Biblioteca climática
              </EcoLink>
              <EcoLink to="/mapa">
                Explorador de estaciones
              </EcoLink>
              <EcoLink
                href="https://github.com/CENIGAA/obs-clima-huila"
                external
              >
                <Github size={12} aria-hidden="true" />
                Repositorio GitHub
              </EcoLink>
              <Link
                to="/efrain"
                className="
                  flex items-center gap-1.5
                  text-[13px] text-neutral-400
                  hover:text-white transition-colors duration-200
                "
              >
                Homenaje a Efraín Domínguez Calle
              </Link>
            </nav>

            <div className="pt-2 space-y-2">
              <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 mb-2.5">
                Desarrollado por
              </h3>
              <p className="text-[12px] text-neutral-500 leading-snug">
                Grupo <span className="text-neutral-400 font-semibold">Hidroinformática</span>
                {' '}+{' '}
                <a
                  href="https://gaaialab.cenigaa.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A60D8] font-semibold hover:text-[#43B02A] transition-colors"
                >
                  GAA+IA Lab
                </a>
              </p>
              <p className="text-[12px] text-neutral-500 leading-snug">
                Dirección científica:{' '}
                <span className="text-neutral-400 font-medium">
                  Jorge I. Chavarro D.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Divisor ────────────────────────────────────────── */}
        <div className="section-divider mt-10 mb-6 opacity-20" />

        {/* ── Pie de footer ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[12px] text-neutral-600">
            © CENIGAA {year} - Todos los derechos reservados.{' '}
            <a
              href="https://www.cenigaa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-400 transition-colors underline underline-offset-2"
            >
              www.cenigaa.org
            </a>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="data-badge bg-white/6 text-neutral-500 border border-white/8">
              NIT 900345215-2
            </span>
            <span className="data-badge bg-[#4A60D8]/20 text-[#8B9FE8]">
              Datos abiertos
            </span>
            <span className="data-badge bg-[#43B02A]/15 text-[#7EC96E]">
              MIT License
            </span>
          </div>
        </div>

        {/* Dedicatoria */}
        <p className="mt-4 text-center text-[11.5px] text-neutral-600 italic">
          Dedicado a{' '}
          <Link
            to="/efrain"
            className="text-neutral-500 font-medium not-italic hover:text-white transition-colors underline underline-offset-2 decoration-[#4A60D8]/40"
          >
            Efraín Antonio Domínguez Calle (1969–2021)
          </Link>
          , Asesor Científico NRMACENIGAA, maestro de la hidrología colombiana.
        </p>
      </div>
    </footer>
  )
}
