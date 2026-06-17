import { Link } from 'react-router-dom'
import {
  Sun, TrendingDown, Waves, CloudRain, History, BarChart2,
  ArrowRight, BookOpen,
} from 'lucide-react'

const COMPONENTES = [
  {
    icon: Sun,
    titulo: 'Estacionalidad',
    explicacion:
      '¿Por qué llueve más en abril y en octubre? El Huila tiene un patrón bimodal único: dos épocas de lluvia al año determinadas por el paso de la Zona de Convergencia Intertropical.',
    dato: 'Pico máximo: octubre-noviembre en la zona centro. Mínimo: julio-agosto.',
  },
  {
    icon: TrendingDown,
    titulo: 'Tendencia',
    explicacion:
      '¿Está cambiando el clima? El test Mann-Kendall detecta si la lluvia o la temperatura llevan décadas aumentando o disminuyendo, con rigor estadístico.',
    dato: '25 estaciones muestran tendencia decreciente en precipitación. 12 creciente.',
  },
  {
    icon: Waves,
    titulo: 'Ciclos seculares',
    explicacion:
      'El clima tiene memoria de décadas. Las medias móviles de 10 años revelan ciclos largos que van más allá del año y que afectan la disponibilidad de agua a largo plazo.',
    dato: 'La zona media Páez-Quimbo muestra ciclos húmedos más prolongados que el resto del departamento.',
  },
  {
    icon: CloudRain,
    titulo: 'Fenómenos recurrentes - ENSO',
    explicacion:
      'El Niño seca el Huila. La Niña lo humedece. El análisis de correlación con 17 índices climáticos del Pacífico mide exactamente cuánto y con qué retraso.',
    dato: 'Correlación inversa con Niño3.4, MEI y OMI confirmada en la mayoría de estaciones.',
  },
  {
    icon: History,
    titulo: 'Inercia climática',
    explicacion:
      'El clima de hoy depende del clima de ayer. La autocorrelación mide esa dependencia temporal, clave para predecir períodos secos o lluviosos con semanas de anticipación.',
    dato: 'Dependencia temporal significativa en series de precipitación mensual en toda la cuenca alta del Magdalena.',
  },
  {
    icon: BarChart2,
    titulo: 'Distribuciones estadísticas',
    explicacion:
      '¿Cuál es la lluvia máxima esperada en 100 años? El ajuste a 14 distribuciones estadísticas (Gumbel, Log-Gamma, Normal) permite estimar eventos extremos con base científica.',
    dato: 'Precipitación mensual ajusta a Gumbel en la mayoría de estaciones. Anual a Log-Gamma.',
  },
]

function Card({ icon: Icon, titulo, explicacion, dato, index }) {
  return (
    <article
      className="
        relative rounded-2xl bg-white border border-neutral-200 p-6
        flex flex-col gap-3
        transition-shadow hover:shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <div className="
          shrink-0 inline-flex items-center justify-center
          w-11 h-11 rounded-xl bg-[#EEF1FB] text-[#4A60D8]
        ">
          <Icon size={20} aria-hidden="true" />
        </div>
        <p className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-neutral-400">
          Componente {String(index + 1).padStart(2, '0')}
        </p>
      </div>
      <h3 className="text-[18px] font-bold text-[#162341] leading-tight">
        {titulo}
      </h3>
      <p className="text-[13.5px] text-neutral-700 leading-relaxed">
        {explicacion}
      </p>
      <div className="mt-auto pt-3 border-t border-neutral-100">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#43B02A] mb-1">
          Dato Huila
        </p>
        <p className="text-[12.5px] text-[#162341] leading-snug font-medium">
          {dato}
        </p>
      </div>
    </article>
  )
}

export default function ComoFunciona() {
  return (
    <section
      id="metodologia"
      className="py-20 border-t border-neutral-100 bg-gradient-to-b from-neutral-50/60 to-white"
      aria-labelledby="metodologia-heading"
    >
      <div className="container-main">
        <div className="max-w-3xl mb-10">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#4A60D8] mb-2">
            Metodología
          </p>
          <h2
            id="metodologia-heading"
            className="text-[28px] sm:text-[32px] font-bold text-[#162341] tracking-tight"
          >
            Cómo funciona el Observatorio
          </h2>
          <p className="mt-2 text-[15px] text-neutral-500">
            La metodología del libro{' '}
            <em className="text-neutral-600">CC_VCE Huila</em> aplicada como
            herramienta pública viva.
          </p>
          <div className="w-12 h-px bg-[#4A60D8] mt-5 mb-5" aria-hidden="true" />
          <p className="text-[15px] text-neutral-700 leading-relaxed">
            Cada estación meteorológica del Huila es analizada con{' '}
            <strong className="text-[#162341] font-semibold">6 componentes
            científicos</strong>{' '}
            desarrollados por el{' '}
            <Link
              to="/efrain"
              className="text-[#4A60D8] hover:text-[#162341] font-medium underline underline-offset-2"
            >
              Dr. Efraín Domínguez Calle
            </Link>
            . Así es como convertimos{' '}
            <strong className="text-[#162341] font-semibold">87 años de registros</strong>{' '}
            en conocimiento útil para el territorio.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENTES.map((c, i) => (
            <Card key={c.titulo} {...c} index={i} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <Link
            to="/mapa"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-[#162341] hover:bg-[#4A60D8]
              text-white text-[13.5px] font-semibold
              transition-colors duration-200
            "
          >
            Ver metodología en el mapa
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <p className="inline-flex items-center gap-2 text-[12px] text-neutral-500 italic">
            <BookOpen size={13} className="text-[#4A60D8]" aria-hidden="true" />
            Metodología basada en:{' '}
            <Link
              to="/efrain"
              className="not-italic font-medium text-neutral-700 hover:text-[#4A60D8] underline underline-offset-2"
            >
              Domínguez Calle, E.A. (2018). CC_VCE Huila. ISBN 978-620-2-16957-8
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
