import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, Database, MapPin, ArrowDown, BookOpen, Droplets, Thermometer } from 'lucide-react'

// ─── Tarjeta de estadística ───────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color = '#4A60D8', delay = 0 }) {
  return (
    <div
      className="fade-up flex flex-col items-center gap-1 p-4 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon size={18} style={{ color }} aria-hidden="true" />
      <span
        className="stat-number text-2xl font-extrabold text-white"
        style={{ letterSpacing: '-0.03em' }}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium text-neutral-400 text-center leading-tight uppercase tracking-wide">
        {label}
      </span>
    </div>
  )
}

// ─── Badge de alineación política ────────────────────────────────────────────
function PolicyBadge({ children, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border"
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {children}
    </span>
  )
}

// ─── Hero component ───────────────────────────────────────────────────────────
export default function Hero({ resumenData }) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#162341] min-h-[92vh] flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      {/* ── Fondo: grilla científica ────────────────────────── */}
      <div
        className="absolute inset-0 bg-grid-navy bg-grid opacity-100"
        aria-hidden="true"
      />

      {/* ── Gradientes de profundidad ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Gradiente radial - azul brand */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(74,96,216,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Gradiente radial - verde */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] translate-y-1/4 -translate-x-1/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(67,176,42,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Overlay inferior para transición suave */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(22,35,65,0.4))' }}
        />
      </div>

      {/* ── Contenido ──────────────────────────────────────── */}
      <div className="container-main relative z-10 py-16 lg:py-24">

        {/* Supra-título: red ROGAA */}
        <div
          className="fade-in flex items-center gap-2 mb-6"
          style={{ animationDelay: '0ms' }}
        >
          <span className="data-badge bg-[#4A60D8]/20 text-[#8B9FE8] border border-[#4A60D8]/30">
            Red ROGAA-Huila
          </span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span className="data-badge bg-white/8 text-neutral-400 border border-white/10">
            Nodo 1 de 5
          </span>
        </div>

        {/* Título principal */}
        <h1
          id="hero-heading"
          className="fade-up max-w-3xl"
          style={{ animationDelay: '80ms' }}
        >
          <span className="block text-[11px] sm:text-[12px] font-bold tracking-[0.15em] uppercase text-[#4A60D8] mb-2">
            Observatorio Climático del Huila
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-[-0.025em]">
            87 años de registros
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-[-0.025em]"
            style={{ color: '#43B02A' }}
          >
            climáticos del Huila
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          className="fade-up mt-5 text-[16px] sm:text-[17px] text-neutral-400 max-w-xl leading-relaxed"
          style={{ animationDelay: '160ms' }}
        >
          Primera plataforma pública de referencia climática departamental.
          150 estaciones meteorológicas, análisis de tendencias y variabilidad
          hidroclimática para el Departamento del Huila.
        </p>

        {/* Dedicatoria */}
        <div
          className="fade-up mt-6 flex items-center gap-3"
          style={{ animationDelay: '220ms' }}
        >
          <div className="w-8 h-px bg-[#4A60D8]" aria-hidden="true" />
          <p className="text-[13px] text-neutral-500 italic">
            En memoria de{' '}
            <Link
              to="/efrain"
              className="text-neutral-400 hover:text-[#4A60D8] transition-colors not-italic font-medium underline underline-offset-2"
            >
              Efraín Antonio Domínguez Calle (1969–2021)
            </Link>
          </p>
        </div>

        {/* Badges de política pública */}
        <div
          className="fade-up flex flex-wrap gap-2 mt-8"
          style={{ animationDelay: '280ms' }}
        >
          <PolicyBadge color="#4A60D8">Plan Huila 2050</PolicyBadge>
          <PolicyBadge color="#43B02A">Plan CC Neiva</PolicyBadge>
          <PolicyBadge color="#F4511E">ODS 13</PolicyBadge>
          <PolicyBadge color="#8B9FE8">Horizonte Europa</PolicyBadge>
        </div>

        {/* Estadísticas clave */}
        <div
          className="fade-up mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl"
          style={{ animationDelay: '360ms' }}
        >
          <StatCard
            icon={Database}
            value="150"
            label="estaciones aptas"
            color="#4A60D8"
            delay={400}
          />
          <StatCard
            icon={Cloud}
            value="87"
            label="años de registros"
            color="#43B02A"
            delay={460}
          />
          <StatCard
            icon={MapPin}
            value="37"
            label="municipios cubiertos"
            color="#F4511E"
            delay={520}
          />
          <StatCard
            icon={BookOpen}
            value="6"
            label="componentes análisis"
            color="#8B9FE8"
            delay={580}
          />
        </div>

        {/* CTA */}
        <div
          className="fade-up flex flex-col sm:flex-row gap-3 mt-10"
          style={{ animationDelay: '480ms' }}
        >
          <a
            href="#mapa"
            className="
              inline-flex items-center justify-center gap-2
              bg-[#4A60D8] hover:bg-[#3A50C8]
              text-white text-[14px] font-semibold
              px-6 py-3 rounded-full
              transition-all duration-200
              hover:shadow-lg hover:shadow-[#4A60D8]/30
              hover:-translate-y-0.5
            "
          >
            <MapPin size={15} aria-hidden="true" />
            Explorar mapa de estaciones
          </a>
          <a
            href="#datos"
            className="
              inline-flex items-center justify-center gap-2
              bg-white/8 hover:bg-white/12
              border border-white/15 hover:border-white/25
              text-neutral-300 text-[14px] font-medium
              px-6 py-3 rounded-full
              transition-all duration-200
            "
          >
            <Database size={15} aria-hidden="true" />
            Descargar datos
          </a>
        </div>

        {/* Indicador de periodo de datos */}
        {resumenData && (
          <div
            className="fade-in mt-8 text-[12px] text-neutral-600"
            style={{ animationDelay: '600ms' }}
          >
            <span className="font-mono">
              Período: 1930 – 2017
            </span>
            <span className="mx-2 text-neutral-700">·</span>
            <span>Fuente: CCYVCE_DB · SGR Conv. 124/2015</span>
          </div>
        )}
      </div>

      {/* ── Indicador scroll ───────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          Explorar
        </span>
        <ArrowDown
          size={16}
          className="text-neutral-500 animate-bounce"
          style={{ animationDuration: '2s' }}
        />
      </div>
    </section>
  )
}
