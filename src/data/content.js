/**
 * content.js — Textos y datos del Observatorio Climático del Huila
 * Estructura bilingüe ES/EN preparada desde el inicio
 * (ver 03_CAPA_ESTATICA.md — sección 6: Multiidioma)
 *
 * Idioma activo: es-CO
 */

export const content = {
  es: {
    meta: {
      title: 'Observatorio Climático del Huila "Efraín Domínguez Calle" | CENIGAA',
      description:
        'Primera plataforma pública de datos climáticos del Departamento del Huila. 87 años de registros, 150 estaciones meteorológicas.',
    },
    observatory: {
      name:        'Observatorio Climático del Huila',
      dedicatedTo: 'Efraín Domínguez Calle',
      network:     'Red ROGAA-Huila',
      node:        'Nodo 1 de 5',
      slogan:      'Ideas para un desarrollo sustentable',
    },
    hero: {
      supratitle: 'Observatorio Climático del Huila',
      title1:     '87 años de registros',
      title2:     'climáticos del Huila',
      subtitle:
        'Primera plataforma pública de referencia climática departamental. 150 estaciones meteorológicas, análisis de tendencias y variabilidad hidroclimática para el Departamento del Huila.',
      dedication:
        'En memoria de Efraín Antonio Domínguez Calle (1960–2021)',
      cta_primary:   'Explorar mapa de estaciones',
      cta_secondary: 'Descargar datos',
    },
    stats: {
      stations:        { value: '150', label: 'estaciones aptas' },
      years:           { value: '87',  label: 'años de registros' },
      municipalities:  { value: '37',  label: 'municipios cubiertos' },
      components:      { value: '6',   label: 'componentes análisis' },
    },
    nav: [
      { href: '#mapa',       label: 'Mapa'       },
      { href: '#resumen',    label: 'Resumen'     },
      { href: '#politica',   label: 'Política'    },
      { href: '#biblioteca', label: 'Biblioteca'  },
      { href: '#equipo',     label: 'Equipo'      },
      { href: '#datos',      label: 'Datos'       },
    ],
    footer: {
      description:
        'Centro de Investigación en Ciencias y Recursos GeoAgroAmbientales. Ideas para un desarrollo sustentable.',
      developerNote: 'Desarrollado por Grupo Hidroinformática + GAA+IA Lab · CENIGAA',
      scientificDirection: 'Dirección científica: Jorge I. Chavarro D.',
    },
    dataSource: {
      database: 'CCYVCE_DB',
      period:   '1930 – 2017',
      project:  'SGR Conv. 124/2015',
      book:     'CC_VCE Huila · Domínguez Calle et al. (2018) · ISBN 978-620-2-16957-8',
    },
    policyBadges: [
      { label: 'Plan Huila 2050',     color: '#4A60D8' },
      { label: 'Plan CC Neiva',       color: '#43B02A' },
      { label: 'ODS 13',             color: '#F4511E' },
      { label: 'Horizonte Europa',    color: '#8B9FE8' },
    ],
  },

  // ── Inglés (preparado — contenido pendiente de traducción) ──────────────────
  en: {
    meta: {
      title: 'Climate Observatory of Huila "Efraín Domínguez Calle" | CENIGAA',
      description:
        'First public climate data platform for the Huila Department. 87 years of records, 150 meteorological stations.',
    },
    observatory: {
      name:        'Climate Observatory of Huila',
      dedicatedTo: 'Efraín Domínguez Calle',
      network:     'ROGAA-Huila Network',
      node:        'Node 1 of 5',
      slogan:      'Ideas for sustainable development',
    },
    hero: {
      supratitle: 'Climate Observatory of Huila',
      title1:     '87 years of climate',
      title2:     'data from Huila',
      subtitle:
        'First public reference climate platform for the Huila Department. 150 meteorological stations, trend analysis and hydroclimatic variability.',
      dedication:
        'In memory of Efraín Antonio Domínguez Calle (1960–2021)',
      cta_primary:   'Explore station map',
      cta_secondary: 'Download data',
    },
    stats: {
      stations:        { value: '150', label: 'suitable stations' },
      years:           { value: '87',  label: 'years of records' },
      municipalities:  { value: '37',  label: 'municipalities covered' },
      components:      { value: '6',   label: 'analysis components' },
    },
    nav: [
      { href: '#mapa',       label: 'Map'      },
      { href: '#resumen',    label: 'Summary'  },
      { href: '#politica',   label: 'Policy'   },
      { href: '#biblioteca', label: 'Library'  },
      { href: '#equipo',     label: 'Team'     },
      { href: '#datos',      label: 'Data'     },
    ],
    footer: {
      description:
        'Research Center in Sciences and GeoAgroEnvironmental Resources. Ideas for sustainable development.',
      developerNote: 'Developed by Hydroinformatics Group + GAA+IA Lab · CENIGAA',
      scientificDirection: 'Scientific direction: Jorge I. Chavarro D.',
    },
    dataSource: {
      database: 'CCYVCE_DB',
      period:   '1930 – 2017',
      project:  'SGR Conv. 124/2015',
      book:     'CC_VCE Huila · Domínguez Calle et al. (2018) · ISBN 978-620-2-16957-8',
    },
    policyBadges: [
      { label: 'Huila 2050 Plan',  color: '#4A60D8' },
      { label: 'Neiva CC Plan',    color: '#43B02A' },
      { label: 'SDG 13',          color: '#F4511E' },
      { label: 'Horizon Europe',  color: '#8B9FE8' },
    ],
  },
}

/** Idioma activo — cambiar a 'en' para habilitar inglés */
export const LANG = 'es'

/** Shortcut para el contenido activo */
export const t = content[LANG]
