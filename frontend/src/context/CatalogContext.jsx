import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCatalog } from '../services/api/catalog.js'
import { filterUnits } from '../utils/normalizeCatalog.js'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', units: [], error: null })
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const units = await fetchCatalog()
      setState({ status: 'ready', units, error: null })
    } catch (error) {
      setState({ status: 'error', units: [], error })
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visibleUnits = useMemo(() => filterUnits(state.units, query), [state.units, query])
  const value = { ...state, visibleUnits, query, setQuery, reload: load }
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)
