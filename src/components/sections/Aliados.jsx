const ALIADOS = [
  {
    logo: '/assets/logos/Gobernacion_Huila.png',
    nombre: 'Gobernación del Huila',
    descripcion: 'Plan Huila 2050',
  },
  {
    logo: '/assets/logos/CAM.svg',
    nombre: 'CAM',
    descripcion: 'Autoridad Ambiental Regional del Alto Magdalena',
  },
  {
    logo: null,
    nombre: 'IDEAM',
    descripcion:
      'Instituto de Hidrología, Meteorología y Estudios Ambientales · Fuente primaria de registros climatológicos 1923–2017',
  },
  {
    logo: '/assets/logos/CENIGAA.svg',
    nombre: 'CENIGAA',
    descripcion: 'Red ROGAA-Huila',
  },
]

function LogoTile({ logo, nombre }) {
  if (!logo) {
    return (
      <div
        className="
          w-full h-20 rounded-xl bg-[#EEF1FB] border border-[#C5CEEF]
          flex items-center justify-center
        "
        aria-hidden="true"
      >
        <span className="font-extrabold text-[#4A60D8] text-[18px] tracking-tight">
          {nombre}
        </span>
      </div>
    )
  }
  return (
    <div
      className="
        w-full h-20 rounded-xl bg-white border border-neutral-200
        flex items-center justify-center p-3
      "
    >
      <img
        src={logo}
        alt={`Logo ${nombre}`}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}

export default function Aliados() {
  return (
    <section
      id="aliados"
      className="py-20 border-t border-neutral-100 bg-neutral-50/40"
      aria-labelledby="aliados-heading"
    >
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#4A60D8] mb-2">
            Respaldo institucional
          </p>
          <h2
            id="aliados-heading"
            className="text-[26px] sm:text-[30px] font-bold text-[#162341] tracking-tight"
          >
            Aliados institucionales
          </h2>
          <div className="w-12 h-px bg-[#4A60D8] mx-auto mt-4" aria-hidden="true" />
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ALIADOS.map((a) => (
            <li
              key={a.nombre}
              className="
                rounded-2xl bg-white border border-neutral-200 p-5
                flex flex-col gap-3
                transition-shadow hover:shadow-md
              "
            >
              <LogoTile logo={a.logo} nombre={a.nombre} />
              <div>
                <p className="text-[14px] font-bold text-[#162341] leading-tight">
                  {a.nombre}
                </p>
                <p className="text-[12.5px] text-neutral-500 mt-1 leading-snug">
                  {a.descripcion}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
