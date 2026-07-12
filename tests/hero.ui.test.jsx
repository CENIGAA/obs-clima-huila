import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Hero from '../src/components/sections/Hero.jsx'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero resumenData={{ periodo_linea_base: '1930 – 2017' }} />
    </MemoryRouter>,
  )
}

test('Hero muestra metricas y CTAs principales', () => {
  renderHero()

  expect(screen.getByRole('heading', { name: /observatorio climático del huila/i })).toBeInTheDocument()
  expect(screen.getByText(/87 años de registros/i)).toBeInTheDocument()
  expect(screen.getByText(/36/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /explorar mapa de estaciones/i })).toHaveAttribute('href', '/mapa')
  expect(screen.getByRole('link', { name: /descargar datos/i })).toHaveAttribute('href', '/datos')
})
