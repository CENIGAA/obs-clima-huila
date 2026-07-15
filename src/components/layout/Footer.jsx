// ─── Entidades a cargo del observatorio (orden oficial) ──────────────────────
const ENTIDADES = [
  { src: '/assets/logos/Gobernacion_Huila.png', webp: '/assets/logos/Gobernacion_Huila.webp', alt: 'Gobernación del Huila' },
  { src: '/assets/logos/CAM.svg',               alt: 'CAM · Corporación Autónoma Regional del Alto Magdalena' },
  { src: '/assets/logos/CENIGAA.svg',           alt: 'CENIGAA' },
  { src: '/assets/logos/IDEAM.png',             alt: 'IDEAM' },
]

// ─── Footer mínimo ───────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white text-neutral-700 border-t border-neutral-200" role="contentinfo">
      {/* Banda de color ROGAA */}
      <div
        className="h-1 bg-gradient-to-r from-[#4A60D8] via-[#43B02A] to-[#F4511E]"
        aria-hidden="true"
      />

      <div className="container-main py-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        {/* Entidades a cargo · lateral izquierdo */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
          {ENTIDADES.map(logo => (
            <picture key={logo.alt}>
              {logo.webp && <source srcSet={logo.webp} type="image/webp" />}
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.alt}
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </picture>
          ))}
        </div>

        {/* Copyright · al frente */}
        <p className="text-[12px] text-neutral-500">
          © CENIGAA {year} · Observatorio Climático del Huila ·{' '}
          <a
            href="https://www.cenigaa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#4A60D8] transition-colors underline underline-offset-2"
          >
            www.cenigaa.org
          </a>
        </p>
      </div>
    </footer>
  )
}
