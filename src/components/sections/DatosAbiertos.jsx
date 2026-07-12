import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, MapPin, Database, FileSpreadsheet } from 'lucide-react'
import SubpageHeroNav from '../layout/SubpageHeroNav'

const CATALOGO_URL = '/data/catalogo_estaciones_CENIGAA.csv'
const DATA_SECTIONS = [
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'series', label: 'Por estación' },
  { id: 'cita', label: 'Cita y uso' },
]

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-neutral-500">
      <Icon size={13} className="text-[#4A60D8]" aria-hidden="true" />
      <span>
        <span className="text-neutral-700 font-semibold">{value}</span>
        <span className="text-neutral-400"> · {label}</span>
      </span>
    </div>
  )
}

export default function DatosAbiertos() {
  const [activeSection, setActiveSection] = useState(DATA_SECTIONS[0].id)

  return (
    <>
      <SubpageHeroNav
        eyebrow="Datos abiertos"
        title="Datos abiertos del observatorio: acceso libre a catálogos, series y referencias de uso."
        description="Navega por vistas separadas para descargar el catálogo, entender cómo obtener series por estación y consultar la referencia recomendada para citar estos datos."
        sections={DATA_SECTIONS}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        aside={(
          <>
            Todos los datos publicados por el Observatorio Climático del Huila son de acceso libre y gratuito.{' '}
            <Link to="/mapa" className="font-semibold underline underline-offset-2 hover:text-white">
              Ir al mapa
            </Link>
            .
          </>
        )}
      />

      <section
        id={`panel-${activeSection}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeSection}`}
        className="py-20 border-t border-neutral-100 bg-gradient-to-b from-white to-neutral-50/60"
      >
        <div className="container-main">
          {activeSection === 'catalogo' && (
            <div className="rounded-2xl border-2 border-[#C5CEEF] bg-white p-6 sm:p-7 flex flex-col max-w-3xl">
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#4A60D8] text-white shrink-0"
                  aria-hidden="true"
                >
                  <FileSpreadsheet size={20} />
                </span>
                <div>
                  <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-[#4A60D8] mb-0.5">
                    Catálogo descargable
                  </p>
                  <h3 className="text-[18px] font-bold text-[#162341] leading-tight">
                    Catálogo de estaciones meteorológicas del Huila
                  </h3>
                </div>
              </div>

              <p className="text-[13.5px] text-neutral-600 leading-relaxed">
                Listado completo de las 150 estaciones aptas del Observatorio con
                código, municipio, corriente, altitud, fechas de inicio y fin de
                registro, número de meses observados y estado operativo.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                <MetaItem icon={MapPin} label="estaciones" value="150" />
                <MetaItem icon={Database} label="campos por registro" value="9" />
                <MetaItem icon={FileSpreadsheet} label="formato" value="CSV · UTF-8" />
              </div>

              <a
                href={CATALOGO_URL}
                download="catalogo_estaciones_CENIGAA.csv"
                className="
                  mt-6 inline-flex items-center justify-center gap-2
                  px-5 py-3 rounded-full
                  bg-[#4A60D8] hover:bg-[#3A50C8]
                  text-white text-[14px] font-semibold
                  transition-all duration-200
                  hover:shadow-lg hover:shadow-[#4A60D8]/30
                  w-full sm:w-auto
                "
              >
                <Download size={16} aria-hidden="true" />
                Descargar catálogo de estaciones (CSV)
              </a>

              <p className="mt-3 text-[11.5px] text-neutral-400 font-mono">
                ~12 KB · 150 registros · sin restricciones de uso
              </p>
            </div>
          )}

          {activeSection === 'series' && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 flex flex-col max-w-2xl">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0 mb-4"
                aria-hidden="true"
              >
                <MapPin size={20} />
              </span>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.15em] text-neutral-400 mb-0.5">
                Datos por estación
              </p>
              <h3 className="text-[16px] font-bold text-[#162341] leading-tight mb-3">
                Series temporales y análisis por estación
              </h3>
              <p className="text-[13px] text-neutral-600 leading-relaxed flex-1">
                Para descargar datos por estación, haz click en cualquier punto del{' '}
                <Link
                  to="/mapa"
                  className="font-medium text-[#4A60D8] hover:text-[#162341] underline underline-offset-2"
                >
                  mapa
                </Link>
                {' '}→ pestaña <strong className="text-[#162341] font-semibold">Datos</strong>.
              </p>
              <p className="mt-4 text-[11.5px] text-neutral-400">
                Series mensuales y anuales · JSON por estación · análisis Mann-Kendall, ENSO y distribuciones
              </p>
            </div>
          )}

          {activeSection === 'cita' && (
            <p className="max-w-3xl text-[14px] text-neutral-600 leading-relaxed rounded-2xl border border-neutral-200 bg-white p-6">
              <span className="font-mono text-neutral-400">Cita sugerida:</span>{' '}
              Domínguez Calle, E.A. et al. (2018).{' '}
              <em>Cambio climático y variabilidad climática extrema en el Huila</em>.
              Editorial Académica Española. ISBN 978-620-2-16957-8 · Base de datos
              procesada por CENIGAA, Observatorio Climático del Huila (1930–2017).
            </p>
          )}
        </div>
      </section>
    </>
  )
}
