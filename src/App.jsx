import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero   from './components/sections/Hero'
import { useResumenDepartamento, useEstaciones } from './hooks/useDataLoader'

// ─── Banner de verificación de datos (desarrollo) ────────────────────────────
function DataStatusBanner({ resumen, estaciones, error }) {
  // Mostrar solo en desarrollo o si hay error
  const isDev = import.meta.env.DEV
  if (!isDev && !error) return null

  const hasResumen    = !!resumen
  const hasEstaciones = !!estaciones
  const totalEst      = estaciones?.estaciones?.length ?? 0

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

// ─── Sección placeholder (sesiones 2-6) ─────────────────────────────────────
function PlaceholderSection({ id, title, description, icon = '🗂' }) {
  return (
    <section
      id={id}
      className="py-20 border-t border-neutral-100"
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-main">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <div>
            <h2
              id={`${id}-heading`}
              className="text-2xl font-bold text-[#162341] tracking-tight"
            >
              {title}
            </h2>
            <p className="text-neutral-500 mt-1 text-[14px]">{description}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
          <p className="text-neutral-400 text-[13px] font-medium">
            En construcción — próximas sesiones Claude Code
          </p>
          <p className="text-neutral-300 text-[12px] mt-1 font-mono">
            {id} · obs-clima-huila.cenigaa.org
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const { data: resumen,    error: errorResumen    } = useResumenDepartamento()
  const { data: estaciones, error: errorEstaciones } = useEstaciones()

  // Log de verificación en consola (desarrollo)
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (resumen) {
        console.log(
          '%c[OCH] resumen_departamento.json ✓',
          'color: #43B02A; font-weight: bold',
          resumen
        )
      }
      if (estaciones) {
        const n = estaciones?.estaciones?.length ?? 0
        console.log(
          `%c[OCH] estaciones.json ✓ — ${n} estaciones`,
          'color: #4A60D8; font-weight: bold',
        )
      }
      if (errorResumen || errorEstaciones) {
        console.error('[OCH] Error cargando datos:', errorResumen || errorEstaciones)
        console.info(
          '[OCH] Asegúrate de que public/data/ contiene: ' +
          'estaciones.json, resumen_departamento.json, municipios_huila.geojson'
        )
      }
    }
  }, [resumen, estaciones, errorResumen, errorEstaciones])

  const dataError = errorResumen || errorEstaciones || null

  return (
    <>
      <Header />

      <main id="main-content">
        {/* Sesión 1: Hero */}
        <Hero resumenData={resumen} />

        {/* Secciones placeholder — se implementan en Sesiones 2-6 */}
        <PlaceholderSection
          id="mapa"
          title="Mapa de estaciones"
          description="150 estaciones coloreadas por tendencia Mann-Kendall · Click → panel de detalle"
          icon="🗺"
        />
        <PlaceholderSection
          id="resumen"
          title="Resumen Huila"
          description="Hallazgos departamentales: patrones espaciales norte/sur, correlación ENSO"
          icon="📊"
        />
        <PlaceholderSection
          id="politica"
          title="Marco de política pública"
          description="Plan Huila 2050 · Plan CC Neiva · PNACC · ODS 13 · Horizonte Europa"
          icon="🏛"
        />
        <PlaceholderSection
          id="biblioteca"
          title="Biblioteca climática"
          description="Repositorio de investigaciones sobre cambio climático en el Huila"
          icon="📚"
        />
        <PlaceholderSection
          id="equipo"
          title="Equipo"
          description="Jorge I. Chavarro D. · Grupo Hidroinformática · GAA+IA Lab · CENIGAA"
          icon="👥"
        />
        <PlaceholderSection
          id="datos"
          title="Datos abiertos"
          description="Descarga CSV/JSON por estación con cita APA del libro y la base de datos"
          icon="⬇"
        />

        {/* Sección dedicatoria — se desarrolla en Sesión 4 */}
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
              Dedicado a Efraín Antonio Domínguez Calle
            </h2>
            <p className="text-neutral-400 text-[14px] leading-relaxed">
              1960 – 2021 · Asesor Científico NRMACENIGAA<br />
              Uno de los mayores conocedores de la hidrología colombiana.<br />
              Autor principal del libro{' '}
              <em className="text-neutral-300">CC_VCE Huila</em>
              {' '}(2018), base científica de este observatorio.
            </p>
            <div className="w-12 h-px bg-[#43B02A] mx-auto mt-6" aria-hidden="true" />
          </div>
        </section>
      </main>

      <Footer />

      {/* Banner de estado de datos (solo en dev o si hay error) */}
      <DataStatusBanner
        resumen={resumen}
        estaciones={estaciones}
        error={dataError}
      />
    </>
  )
}
