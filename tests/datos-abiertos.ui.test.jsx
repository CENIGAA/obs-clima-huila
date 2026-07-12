import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import DatosAbiertos from '../src/components/sections/DatosAbiertos.jsx'

test('DatosAbiertos expone enlaces de descarga y navegacion esperados', () => {
  render(
    <MemoryRouter>
      <DatosAbiertos />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: /datos abiertos/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /descargar catálogo de estaciones/i })).toHaveAttribute(
    'href',
    '/data/catalogo_estaciones_CENIGAA.csv',
  )
  expect(screen.getByRole('link', { name: /mapa/i })).toHaveAttribute('href', '/mapa')
})
