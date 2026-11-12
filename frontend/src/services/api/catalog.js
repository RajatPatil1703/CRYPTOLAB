import client from './client.js'
import { getAlgorithms } from './algorithms.js'
import { buildUnits } from '../../utils/normalizeCatalog.js'

export const getCategories = () => client.get('/categories').then((r) => r.data)

/** Loads algorithms + categories and returns them grouped by unit. */
export async function fetchCatalog() {
  const [algorithms, categories] = await Promise.all([
    getAlgorithms(),
    getCategories().catch(() => null), // categories are optional for grouping
  ])
  return buildUnits(algorithms, categories)
}
