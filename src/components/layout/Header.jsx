import { useState, useEffect, useCallback } from 'react'
import { NavLink as RouterNavLink, Link } from 'react-router-dom'
import { Menu, X, Cloud, ChevronRight, ExternalLink } from 'lucide-react'

// ─── Item nav desktop — usa NavLink de react-router para estado activo ──────
function NavItem({ to, children, onClick }) {
  return (
    <RouterNavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) => `
        relative text-[13.5px] font-medium
        ${isActive ? 'text-[#4A60D8]' : 'text-neutral-600 hover:text-[#4A60D8]'}
        transition-colors duration-200
        after:absolute after:bottom-[-2px] after:left-0 after:h-[2px]
        after:bg-[#4A60D8] after:rounded-full after:transition-all after:duration-200
        ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
    >
      {children}
    </RouterNavLink>
  )
}

// ─── Item nav móvil ─────────────────────────────────────────────────────────
function MobileNavItem({ to, children, onClick }) {
  return (
    <RouterNavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center py-3 px-4 text-[15px] font-medium rounded-lg
        transition-colors duration-150
        ${isActive
          ? 'text-[#4A60D8] bg-[#EEF1FB]'
          : 'text-neutral-700 hover:text-[#4A60D8] hover:bg-[#EEF1FB]'
        }
      `}
    >
      {children}
    </RouterNavLink>
  )
}

// ─── Items del menú: una ruta por entrada ───────────────────────────────────
const NAV_LINKS = [
  { to: '/',           label: 'Inicio' },
  { to: '/mapa',       label: 'Mapa' },
  { to: '/enso',       label: 'El Niño 2026' },
  { to: '/sobre',      label: 'Sobre' },
  { to: '/resumen',    label: 'Resumen' },
  { to: '/politica',   label: 'Política pública' },
  { to: '/biblioteca', label: 'Biblioteca' },
  { to: '/equipo',     label: 'Equipo' },
  { to: '/datos',      label: 'Datos' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Estilo del header en scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al pasar a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      {/* Skip to content - accesibilidad */}
      <a href="#main-content" className="skip-to-content">
        Ir al contenido principal
      </a>

      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(22,35,65,0.08)] py-0'
            : 'bg-white/90 backdrop-blur-sm py-0'
          }
        `}
        style={{ height: 'var(--header-height)' }}
        role="banner"
      >
        <div className="container-main h-full flex items-center justify-between gap-4">

          {/* ── Identidad: Logo + breadcrumb + nombre nodo ──────── */}
          <div className="flex flex-col min-w-0">
            {/* Breadcrumb CENIGAA externo */}
            <div className="flex items-center gap-1 mb-0.5">
              <a
                href="https://www.cenigaa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[11px] font-extrabold tracking-[0.08em] uppercase
                  text-neutral-500 hover:text-[#4A60D8] transition-colors duration-200
                "
                aria-label="Ir al sitio principal de CENIGAA"
              >
                CENIGAA
              </a>
              <ChevronRight size={10} className="text-neutral-300 flex-shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-neutral-400 truncate hidden sm:block">
                Observatorio Climático
              </span>
            </div>

            {/* Nombre del nodo → Link a / */}
            <Link
              to="/"
              className="flex items-center gap-2 min-w-0 group"
              aria-label="Ir al inicio del Observatorio Climático del Huila"
            >
              <Cloud
                size={16}
                className="text-[#4A60D8] flex-shrink-0 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <span className="
                  text-[14px] sm:text-[15px] font-bold tracking-[-0.01em]
                  text-[#162341] group-hover:text-[#4A60D8] transition-colors
                  truncate block leading-tight
                ">
                  Observatorio Climático del Huila
                </span>
                <span className="text-[11px] text-neutral-400 font-normal hidden sm:block leading-none mt-0.5">
                  Efraín Domínguez Calle · CENIGAA
                </span>
              </div>
            </Link>
          </div>

          {/* ── Navegación desktop ─────────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-6"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map(link => (
              <NavItem key={link.to} to={link.to}>
                {link.label}
              </NavItem>
            ))}

            {/* CTA: ROGAA externo */}
            <a
              href="https://www.cenigaa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-1.5
                text-[12.5px] font-semibold
                bg-[#162341] hover:bg-[#4A60D8]
                text-white
                px-3.5 py-1.5 rounded-full
                transition-all duration-200
                hover:shadow-md hover:shadow-[#4A60D8]/20
              "
            >
              <span>ROGAA</span>
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          </nav>

          {/* ── Botón hamburger móvil ──────────────────────────── */}
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="
              lg:hidden flex items-center justify-center
              w-9 h-9 rounded-lg
              text-neutral-600 hover:text-[#4A60D8]
              hover:bg-[#EEF1FB]
              transition-colors duration-200
              flex-shrink-0
            "
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen
              ? <X size={20} aria-hidden="true" />
              : <Menu size={20} aria-hidden="true" />
            }
          </button>
        </div>

        {/* ── Indicador ROGAA - barra de progreso decorativa ──── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4A60D8] via-[#43B02A] to-[#F4511E]"
          aria-hidden="true"
          style={{ opacity: scrolled ? 1 : 0.4, transition: 'opacity 0.3s' }}
        />
      </header>

      {/* ── Menú móvil overlay ─────────────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
        </div>
      )}

      <nav
        id="mobile-nav"
        className={`
          fixed top-[var(--header-height)] left-0 right-0 z-40
          lg:hidden
          bg-white border-b border-neutral-200
          shadow-xl
          transition-all duration-300 ease-out
          ${menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
          }
        `}
        aria-label="Menú de navegación móvil"
        aria-hidden={!menuOpen}
      >
        <div className="container-main py-3">
          {NAV_LINKS.map(link => (
            <MobileNavItem key={link.to} to={link.to} onClick={closeMenu}>
              {link.label}
            </MobileNavItem>
          ))}

          {/* Separador */}
          <div className="section-divider my-3" />

          {/* CTA móvil */}
          <a
            href="https://www.cenigaa.org"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="
              flex items-center justify-center gap-2 w-full
              py-3 px-4 mt-1 rounded-lg
              bg-[#162341] text-white
              text-[14px] font-semibold
              hover:bg-[#4A60D8] transition-colors duration-200
            "
          >
            <span>ROGAA-Huila · CENIGAA</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>

          {/* Badges ROGAA */}
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            <span className="data-badge bg-[#EEF1FB] text-[#4A60D8]">
              Nodo 1 · ROGAA-Huila
            </span>
            <span className="data-badge bg-[#EBF7E7] text-[#43B02A]">
              Datos abiertos
            </span>
          </div>
        </div>
      </nav>

      {/* Espaciador para compensar el header fixed */}
      <div style={{ height: 'var(--header-height)' }} aria-hidden="true" />
    </>
  )
}
