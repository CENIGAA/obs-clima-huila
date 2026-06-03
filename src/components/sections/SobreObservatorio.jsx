import { Link } from 'react-router-dom'
import { BookOpen, Network, Unlock } from 'lucide-react'

const BLOQUES = [
  {
    id: 'origen',
    icon: BookOpen,
    titulo: 'El origen',
  },
  {
    id: 'red',
    icon: Network,
    titulo: 'La red ROGAA-Huila',
  },
  {
    id: 'apertura',
    icon: Unlock,
    titulo: 'Ciencia abierta',
  },
]

function Bloque({ icon: Icon, titulo, children }) {
  return (
    <article className="rounded-2xl bg-white border border-neutral-200 p-6 flex flex-col gap-3 transition-shadow hover:shadow-md">
      <span
        className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#EEF1FB] text-[#4A60D8]"
        aria-hidden="true"
      >
        <Icon size={20} />
      </span>
      <h3 className="text-[17px] font-bold text-[#162341] leading-tight">
        {titulo}
      </h3>
      <p className="text-[13.5px] text-neutral-700 leading-relaxed">
        {children}
      </p>
    </article>
  )
}

export default function SobreObservatorio() {
  return (
    <section
      id="sobre"
      className="py-20 border-t border-neutral-100 bg-gradient-to-b from-white to-neutral-50/40"
      aria-labelledby="sobre-heading"
    >
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#4A60D8] mb-2">
            Sobre el Observatorio
          </p>
          <h2
            id="sobre-heading"
            className="text-[26px] sm:text-[30px] font-bold text-[#162341] tracking-tight"
          >
            Origen, red y política de datos
          </h2>
          <div className="w-12 h-px bg-[#4A60D8] mt-4" aria-hidden="true" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Bloque icon={BLOQUES[0].icon} titulo={BLOQUES[0].titulo}>
            Este Observatorio nace del{' '}
            <strong className="text-[#162341] font-semibold">
              Convenio Especial de Cooperación SGR-FCTeI 124 de 2015
            </strong>
            , que financió la investigación CC_VCE Huila. CENIGAA sistematizó{' '}
            <strong className="text-[#162341] font-semibold">87 años</strong> de
            registros climatológicos - desde la estación{' '}
            <strong className="text-[#162341] font-semibold">
              APTO BENITO SALAS en Neiva (1930)
            </strong>{' '}
            hasta 2017 - en la base de datos CCYVCE_DB, aplicando la metodología
            del{' '}
            <Link
              to="/efrain"
              className="text-[#4A60D8] hover:text-[#162341] font-medium underline underline-offset-2"
            >
              Dr. Efraín Domínguez Calle
            </Link>
            .
          </Bloque>

          <Bloque icon={BLOQUES[1].icon} titulo={BLOQUES[1].titulo}>
            Este Observatorio es el{' '}
            <strong className="text-[#162341] font-semibold">Nodo 1</strong> de
            la Red de Observatorios GeoAgroAmbientales del Huila{' '}
            <strong className="text-[#162341] font-semibold">(ROGAA-Huila)</strong>,
            una infraestructura de 5 observatorios temáticos que alimentará el{' '}
            <em className="text-[#162341] font-medium">gemelo digital</em> del
            territorio huilense. Los datos son procesados e integrados por el{' '}
            <a
              href="https://gaaialab.cenigaa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A60D8] hover:text-[#162341] font-medium underline underline-offset-2"
            >
              GAA+IA Lab
            </a>{' '}
            de CENIGAA.
          </Bloque>

          <Bloque icon={BLOQUES[2].icon} titulo={BLOQUES[2].titulo}>
            Todos los datos son de acceso libre bajo política de{' '}
            <strong className="text-[#162341] font-semibold">ciencia abierta</strong>{' '}
            de CENIGAA. La metodología completa está documentada en el libro{' '}
            <em className="text-[#162341] font-medium">CC_VCE Huila</em> (ISBN
            978-620-2-16957-8). Para citar los datos:{' '}
            <span className="font-mono text-[12.5px] text-neutral-600">
              Domínguez Calle et al. (2018) + CENIGAA (2026)
            </span>
            .
          </Bloque>
        </div>
      </div>
    </section>
  )
}
