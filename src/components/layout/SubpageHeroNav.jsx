export default function SubpageHeroNav({
  eyebrow,
  title,
  description,
  sections = [],
  activeSection,
  onSectionChange,
  aside,
}) {
  return (
    <section className="bg-[linear-gradient(180deg,#162341_0%,#1d2f56_100%)] text-white">
      <div className="container-main py-14 lg:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B9FE8]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl sm:text-4xl lg:text-[2.9rem] font-extrabold tracking-tight leading-[1.08] text-balance">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed">
              {description}
            </p>
          </div>

          {aside && (
            <aside className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm text-neutral-200 leading-relaxed xl:mt-1">
              {aside}
            </aside>
          )}
        </div>

        {sections.length > 0 && (
          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/6 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B9FE8]">
                  Menú de subsecciones
                </p>
                <p className="mt-2 text-[13.5px] text-neutral-300 leading-relaxed">
                  Muestra únicamente la parte que quieres consultar para evitar scroll largo.
                </p>
              </div>
              <p className="text-[12px] text-neutral-400">
                Viendo: <span className="font-semibold text-neutral-100">{sections.find((section) => section.id === activeSection)?.label}</span>
              </p>
            </div>

            <div
              className="mt-4 flex gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label={title}
            >
              {sections.map((section) => {
                const isActive = section.id === activeSection
                return (
                  <button
                    key={section.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${section.id}`}
                    id={`tab-${section.id}`}
                    onClick={() => onSectionChange(section.id)}
                    className={`
                      shrink-0 rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition-colors
                      ${isActive
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
        )}
      </div>
    </section>
  )
}
