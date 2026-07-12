import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero   from './components/sections/Hero'
import MapaEstaciones    from './components/sections/MapaEstaciones'
import SobreObservatorio from './components/sections/SobreObservatorio'
import ComoFunciona      from './components/sections/ComoFunciona'
import Biblioteca        from './components/sections/Biblioteca'
import Equipo            from './components/sections/Equipo'
import DatosAbiertos     from './components/sections/DatosAbiertos'
import Aliados           from './components/sections/Aliados'
import HomenajeEfrain    from './components/sections/HomenajeEfrain'
import Enso              from './components/sections/Enso'
import PoliticaSection   from './components/sections/PoliticaSection'
import ResumenSection    from './components/sections/ResumenSection'
import SubpageHeroNav from './components/layout/SubpageHeroNav'
import { useResumenDepartamento, useEstaciones } from './hooks/useDataLoader'

// ─── Banner de verificación de datos (desarrollo) ────────────────────────────
function DataStatusBanner({ resumen, estaciones, error }) {
  const isDev = import.meta.env.DEV
  if (!isDev && !error) return null

  const hasResumen    = !!resumen
  const hasEstaciones = !!estaciones
  const totalEst      = Array.isArray(estaciones) ? estaciones.length : 0

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-xs
        rounded-xl border text-[11.5px] font-mono
        shadow-xl backdrop-blur-sm p-3 space-y-1
        ${error
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-[#162341]/95 border-white/10 text-neutral-400'
        }
      `}
      role={error ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div className="font-bold text-[10px] tracking-widest uppercase mb-2 text-neutral-500">
        {isDev ? '⚙ Dev · Data Status' : '⚠ Data Error'}
      </div>
      {error && (
        <div className="text-red-600">Error: {error}</div>
      )}
      <div className={hasResumen ? 'text-[#43B02A]' : 'text-[#F4511E]'}>
        {hasResumen ? '✓' : '✗'} resumen_departamento.json
      </div>
      <div className={hasEstaciones ? 'text-[#43B02A]' : 'text-[#F4511E]'}>
        {hasEstaciones ? '✓' : '✗'} estaciones.json
        {hasEstaciones && ` (${totalEst} est.)`}
      </div>
      {!hasResumen && !hasEstaciones && !error && (
        <div className="text-neutral-500 text-[10px] mt-1">
          Cargando datos de /public/data/…
        </div>
      )}
    </div>
  )
}

// ─── Layout compartido ──────────────────────────────────────────────────────
// Cada ruta renderiza Header + main + Footer; el contenido va como children.
function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}

// ─── Dedicatoria reusable (banda navy memorial a Efraín) ────────────────────
function DedicatoriaBanda() {
  return (
    <section
      id="dedicatoria"
      className="py-16 bg-[#162341] text-center"
      aria-labelledby="dedicatoria-heading"
    >
      <div className="container-main max-w-2xl">
        <div className="w-12 h-px bg-[#4A60D8] mx-auto mb-6" aria-hidden="true" />
        <h2
          id="dedicatoria-heading"
          className="text-xl font-bold text-white mb-3 tracking-tight"
        >
          Dedicado a{' '}
          <Link
            to="/efrain"
            className="text-white hover:text-[#8B9FE8] transition-colors underline underline-offset-4 decoration-[#4A60D8]/60 decoration-2"
          >
            Efraín Antonio Domínguez Calle
          </Link>
        </h2>
        <p className="text-neutral-400 text-[14px] leading-relaxed">
          1969 – 2021 · Asesor Científico NRMACENIGAA<br />
          Uno de los mayores conocedores de la hidrología colombiana.<br />
          Autor principal del libro{' '}
          <em className="text-neutral-300">CC_VCE Huila</em>
          {' '}(2018), base científica de este observatorio.
        </p>
        <Link
          to="/efrain"
          className="inline-flex items-center gap-1.5 mt-5 text-[12.5px] font-medium text-[#8B9FE8] hover:text-white transition-colors"
        >
          Leer el homenaje completo →
        </Link>
        <div className="w-12 h-px bg-[#43B02A] mx-auto mt-6" aria-hidden="true" />
      </div>
    </section>
  )
}

// ─── Páginas ────────────────────────────────────────────────────────────────
function HomePage() {
  const { data: resumen } = useResumenDepartamento()
  return <Hero resumenData={resumen} />
}

function MapaPage()       { return <MapaEstaciones /> }

function SobrePage() {
  const sections = [
    { id: 'sobre-observatorio', label: 'Origen' },
    { id: 'metodologia', label: 'Metodología' },
    { id: 'aliados', label: 'Instituciones' },
    { id: 'dedicatoria', label: 'Dedicatoria' },
  ]
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const panels = {
    'sobre-observatorio': <SobreObservatorio />,
    metodologia: <ComoFunciona />,
    aliados: <Aliados />,
    dedicatoria: <DedicatoriaBanda />,
  }

  return (
    <>
      <SubpageHeroNav
        eyebrow="El Observatorio"
        title="Contexto institucional, metodología y respaldo del Observatorio Climático del Huila."
        description="Explora el origen del observatorio, la metodología aplicada, las entidades responsables y la dedicatoria científica que sostiene esta plataforma."
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        aside="Esta subpágina reúne el contexto estructural del observatorio. Cada vista resume una dimensión distinta del proyecto y su gobernanza."
      />
      <section id={`panel-${activeSection}`} role="tabpanel" aria-labelledby={`tab-${activeSection}`}>
        {panels[activeSection] ?? panels['sobre-observatorio']}
      </section>
    </>
  )
}

function BibliotecaPage() { return <Biblioteca /> }

function EquipoPage() { return <Equipo /> }

function DatosPage()  { return <DatosAbiertos /> }
function ResumenPage(){ return <ResumenSection /> }
function PoliticaPage(){ return <PoliticaSection /> }

// ─── App principal ──────────────────────────────────────────────────────────
export default function App() {
  const { data: resumen,    error: errorResumen    } = useResumenDepartamento()
  const { data: estaciones, error: errorEstaciones } = useEstaciones()

  useEffect(() => {
    if (import.meta.env.DEV) {
      if (resumen)    console.log('%c[OCH] resumen_departamento.json ✓',
                                  'color: #43B02A; font-weight: bold', resumen)
      if (estaciones) {
        const n = Array.isArray(estaciones) ? estaciones.length : 0
        console.log(`%c[OCH] estaciones.json ✓ - ${n} estaciones`,
                    'color: #4A60D8; font-weight: bold')
      }
      if (errorResumen || errorEstaciones)
        console.error('[OCH] Error cargando datos:', errorResumen || errorEstaciones)
    }
  }, [resumen, estaciones, errorResumen, errorEstaciones])

  const dataError = errorResumen || errorEstaciones || null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Layout><HomePage /></Layout>} />
        <Route path="/mapa"        element={<Layout><MapaPage /></Layout>} />
        <Route path="/sobre"       element={<Layout><SobrePage /></Layout>} />
        <Route path="/resumen"     element={<Layout><ResumenPage /></Layout>} />
        <Route path="/politica"    element={<Layout><PoliticaPage /></Layout>} />
        <Route path="/biblioteca"  element={<Layout><BibliotecaPage /></Layout>} />
        <Route path="/equipo"      element={<Layout><EquipoPage /></Layout>} />
        <Route path="/datos"       element={<Layout><DatosPage /></Layout>} />
        <Route path="/enso"        element={<Layout><Enso /></Layout>} />
        <Route path="/efrain"      element={<Layout><HomenajeEfrain /></Layout>} />
      </Routes>

      <DataStatusBanner
        resumen={resumen}
        estaciones={estaciones}
        error={dataError}
      />
    </BrowserRouter>
  )
}
