import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Header from '../src/components/layout/Header.jsx'

test('Header expone navegacion ENSO sin anclar el año en el menu', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

  expect(screen.getAllByText(/datos y monitoreo/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/^ENSO$/i).length).toBeGreaterThan(0)
})

test('Header permite abrir el menu movil', () => {
  window.innerWidth = 390

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

  const menuButton = screen.getAllByRole('button', { name: /abrir menú/i })[0]
  fireEvent.click(menuButton)

  expect(screen.getAllByRole('menuitem', { name: /^ENSO$/i }).length).toBeGreaterThan(0)
})
