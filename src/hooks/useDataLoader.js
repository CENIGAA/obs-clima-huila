import { useState, useEffect, useRef } from 'react'

/**
 * Hook genérico para cargar archivos JSON desde /public/data/
 *
 * @param {string} path - Ruta relativa desde public/ (ej: 'data/estaciones.json')
 * @param {any} initialData - Valor inicial mientras carga
 * @returns {{ data, loading, error }}
 */
export function useDataLoader(path, initialData = null) {
  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!path) {
      setLoading(false)
      return
    }

    // Cancelar fetch anterior si el path cambia
    if (abortRef.current) {
      abortRef.current.abort()
    }

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetch(`/${path}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: no se pudo cargar ${path}`)
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return // cancelado intencionalmente
        console.error(`[useDataLoader] Error cargando ${path}:`, err)
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [path])

  return { data, loading, error }
}

/**
 * Hook específico para cargar el resumen departamental
 */
export function useResumenDepartamento() {
  return useDataLoader('data/resumen_departamento.json')
}

/**
 * Hook para cargar el listado de estaciones
 */
export function useEstaciones() {
  return useDataLoader('data/estaciones.json')
}

/**
 * Hook para cargar datos de una estación específica (bajo demanda)
 * @param {string|null} codigo - Código de la estación, o null para no cargar
 */
export function useEstacion(codigo) {
  const path = codigo ? `data/estacion_${codigo}.json` : null
  return useDataLoader(path)
}
