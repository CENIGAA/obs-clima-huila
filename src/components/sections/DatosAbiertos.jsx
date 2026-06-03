import { Download, MapPin, Database, FileSpreadsheet } from 'lucide-react'

const CATALOGO_URL = '/data/catalogo_estaciones_CENIGAA.csv'

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
  return (
    <section
      id="datos"
      className="py-20 border-t border-neutral-100 bg-gradient-to-b from-white to-neutral-50/60"
      aria-labelledby="datos-heading"
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="
              inline-flex items-center justify-center
              w-10 h-10 rounded-xl bg-[#EEF1FB] text-[#4A60D8] shrink-0
            "
            aria-hidden="true"
          >
            <Database size={18} />
          </span>
          <div>
            <h2
              id="datos-heading"
              className="text-[26px] sm:text-[28px] font-bold text-[#162341] tracking-tight"
            >
              Datos abiertos
            </h2>
            <p className="text-[14px] text-neutral-500 mt-1 leading-snug">
              Todos los datos del Observatorio son de acceso libre y gratuito.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr] items-stretch">
          {/* Tarjeta principal - catálogo CSV */}
          <div className="rounded-2xl border-2 border-[#C5CEEF] bg-white p-6 sm:p-7 flex flex-col">
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
              <MetaItem icon={MapPin}  label="estaciones" value="150" />
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

          {/* Tarjeta secundaria - datos por estación */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 flex flex-col">
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
              <a
                href="#mapa"
                className="font-medium text-[#4A60D8] hover:text-[#162341] underline underline-offset-2"
              >
                mapa
              </a>
              {' '}→ pestaña <strong className="text-[#162341] font-semibold">Datos</strong>.
            </p>
            <p className="mt-4 text-[11.5px] text-neutral-400">
              Series mensuales y anuales · JSON por estación · análisis Mann-Kendall, ENSO y distribuciones
            </p>
          </div>
        </div>

        <p className="mt-8 text-[12px] text-neutral-500 leading-relaxed">
          <span className="font-mono text-neutral-400">Cita sugerida:</span>{' '}
          Domínguez Calle, E.A. et al. (2018).{' '}
          <em>Cambio climático y variabilidad climática extrema en el Huila</em>.
          Editorial Académica Española. ISBN 978-620-2-16957-8 · Base de datos
          procesada por CENIGAA, Observatorio Climático del Huila (1930–2017).
        </p>
      </div>
    </section>
  )
}
