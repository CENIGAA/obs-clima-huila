const ALIADOS = [
  {
    logo: '/assets/logos/Gobernacion_Huila.png',
    logoMaxWidth: 160,
    nombre: 'Gobernación del Huila',
    rol: 'Responsable institucional',
    descripcion:
      'Lidera el Plan de Cambio Climático Huila 2050 y preside el Comité Departamental de Cambio Climático al que responde el Observatorio.',
    destacado: true,
  },
  {
    logo: '/assets/logos/CAM.svg',
    logoMaxWidth: 180,
    nombre: 'CAM',
    rol: 'Sede institucional del Observatorio',
    descripcion:
      'Corporación Autónoma Regional del Alto Magdalena. Sede del Observatorio Climático según el Plan Huila 2050. Coordinadora de Cambio Climático del departamento.',
    destacado: true,
  },
  {
    logo: '/assets/logos/CENIGAA.svg',
    logoMaxWidth: 200,
    nombre: 'CENIGAA',
    rol: 'Gestor científico-tecnológico',
    descripcion:
      'Construye y opera la plataforma digital del Observatorio. Aporta la base de datos histórica 1930–2017 de 150 estaciones y la metodología del libro CC_VCE Huila.',
    destacado: false,
  },
  {
    logo: null,
    nombre: 'IDEAM',
    rol: 'Fuente de datos primaria',
    descripcion:
      'Instituto de Hidrología, Meteorología y Estudios Ambientales. Red de estaciones climatológicas del Huila, fuente primaria de los registros históricos del Observatorio.',
    destacado: false,
  },
]

function LogoTile({ logo, logoMaxWidth, nombre }) {
  if (!logo) {
    return (
      <div
        className="
          w-full min-h-[100px] rounded-xl bg-[#EEF1FB] border border-[#C5CEEF]
          flex items-center justify-center
        "
        style={{ paddingTop: 16, paddingBottom: 16 }}
        aria-hidden="true"
      >
        <span className="font-extrabold text-[#4A60D8] text-[28px] tracking-tight">
          {nombre}
        </span>
      </div>
    )
  }
  return (
    <div
      className="
        w-full min-h-[100px] rounded-xl bg-white border border-neutral-200
        flex items-center justify-center px-4
      "
      style={{ paddingTop: 16, paddingBottom: 16 }}
    >
      <img
        src={logo}
        alt={`Logo ${nombre}`}
        className="max-h-[80px] object-contain"
        style={{ maxWidth: logoMaxWidth, width: '100%' }}
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
            Responsabilidad institucional
          </p>
          <h2
            id="aliados-heading"
            className="text-[26px] sm:text-[30px] font-bold text-[#162341] tracking-tight"
          >
            Un mandato del Plan Huila 2050
          </h2>
          <div className="w-12 h-px bg-[#4A60D8] mx-auto mt-4 mb-5" aria-hidden="true" />
          <p className="text-[14.5px] text-neutral-600 leading-relaxed">
            El Observatorio Climático del Huila es el primero creado en Colombia
            con el fin de coordinar las acciones del{' '}
            <strong className="text-[#162341] font-semibold">Plan Huila 2050</strong>,
            generar la plataforma de información y monitoreo climático
            departamental, y servir de base para la coordinación de las diversas
            entidades relacionadas con el plan. Responde al{' '}
            <strong className="text-[#162341] font-semibold">
              Comité Departamental de Cambio Climático
            </strong>.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {ALIADOS.map((a) => (
            <li
              key={a.nombre}
              className={`
                relative rounded-2xl border p-5
                flex flex-col gap-4
                transition-shadow hover:shadow-md
                ${a.destacado
                  ? 'bg-[#EEF1FB] border-[#C5CEEF]'
                  : 'bg-white border-neutral-200'
                }
              `}
            >
              {a.destacado && (
                <span
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-[#4A60D8]"
                  aria-hidden="true"
                />
              )}
              <LogoTile
                logo={a.logo}
                logoMaxWidth={a.logoMaxWidth}
                nombre={a.nombre}
              />
              <div>
                <p className="text-[15px] font-bold text-[#162341] leading-tight">
                  {a.nombre}
                </p>
                <p
                  className={`mt-1 text-[11px] font-semibold tracking-[0.06em] uppercase ${
                    a.destacado ? 'text-[#4A60D8]' : 'text-neutral-400'
                  }`}
                >
                  {a.rol}
                </p>
                <p className="mt-2 text-[12.5px] text-neutral-600 leading-snug">
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
