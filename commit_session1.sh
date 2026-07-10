#!/bin/bash
# =============================================================================
# SESIÓN 1 · obs-clima-huila.cenigaa.org
# Script de commit para GitHub
# Ejecutar desde la raíz del repositorio clonado
# =============================================================================

set -e  # Detener si hay error

echo "🌤  Observatorio Climático del Huila · Sesión 1 Claude Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que estamos en el repo correcto
if [ ! -f "staticwebapp.config.json" ]; then
  echo "❌ Error: Ejecuta este script desde la raíz del repositorio obs-clima-huila"
  exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar build
echo "🔨 Verificando build de producción..."
npm run build
echo "✅ Build exitoso"

# Limpiar directorio de build (no se sube a git)
rm -rf build/

# Git
echo ""
echo "📝 Preparando commit..."
git add .
git status

echo ""
echo "💬 Commit: feat: initialize React base structure for Observatorio Climático del Huila"
git commit -m "feat: initialize React base structure

Sesión 1 de 6 · Observatorio Climático del Huila (Efraín Domínguez Calle)
CENIGAA · Red ROGAA-Huila · Nodo 1 de 5

- React 18 + Vite + Tailwind CSS initialized
- Design tokens CENIGAA (colores SIC oficiales: #4A60D8, #43B02A, #F4511E, #162341)
- Inter font + JetBrains Mono (Google Fonts)
- staticwebapp.config.json with security headers (CSP, X-Frame-Options, etc.)
- Header: logo CENIGAA → www.cenigaa.org, breadcrumb, responsive nav + hamburger
- Footer: ecosistema CENIGAA, enlaces ROGAA, copyright dinámico, dedicatoria
- Hero section: título, estadísticas, policy badges, CTA
- Placeholder sections for sessions 2-6
- useDataLoader hooks for public/data/ JSON files
- Bilingual content structure ES/EN (content.js) prepared for future i18n
- GitHub Actions CI/CD workflow for Azure Static Web Apps
- SEO: meta tags, Open Graph, JSON-LD ResearchOrganization
- robots.txt + sitemap.xml
- Development data status banner (verifies public/data/ loading)

Build: ✅ 1504 modules · 133KB vendor · 27KB CSS (gzipped: 43 + 6 KB)

Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>"

echo ""
echo "🚀 Push a main..."
git push origin main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sesión 1 completada"
echo ""
echo "Próximos pasos:"
echo "  1. Verificar GitHub Actions en: https://github.com/CENIGAA/obs-clima-huila/actions"
echo "  2. Verificar despliegue en:     https://obs-clima-huila.cenigaa.org"
echo "  3. Ejecutar Lighthouse audit"
echo "  4. Iniciar Sesión 2: Mapa Leaflet de estaciones"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
