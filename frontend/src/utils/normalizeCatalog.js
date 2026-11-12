/**
 * PROVISIONAL ADAPTER
 * The only place that knows the shape of GET /algorithms and GET /categories.
 * Field names below are assumptions until the real contract is confirmed;
 * update the pick() lists here and nothing else in the UI needs to change.
 */
const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k]
  return fallback
}
const asList = (data, keys) => (Array.isArray(data) ? data : pick(data, keys, []))

export function normalizeAlgorithm(raw) {
  const cat = pick(raw, ['category', 'unit', 'chapter'])
  const catObj = typeof cat === 'object' && cat ? cat : null
  return {
    slug: pick(raw, ['slug', 'id']),
    name: pick(raw, ['name', 'title'], 'Untitled algorithm'),
    description: pick(raw, ['description', 'summary'], ''),
    kind: pick(raw, ['type', 'kind', 'family'], ''),
    unitKey: String(catObj ? pick(catObj, ['slug', 'id', 'name']) : pick(raw, ['category_id', 'category_slug', 'unit_id', 'unit', 'chapter', 'category'], 'other')),
    unitName: catObj ? pick(catObj, ['name', 'title']) : undefined,
    available: pick(raw, ['available', 'is_available', 'implemented', 'enabled'], true) !== false,
  }
}

export function buildUnits(algorithmsData, categoriesData) {
  const algorithms = asList(algorithmsData, ['algorithms', 'items', 'results', 'data']).map(normalizeAlgorithm).filter((a) => a.slug)
  const categories = categoriesData ? asList(categoriesData, ['categories', 'items', 'results', 'data']) : []

  const units = new Map()
  categories.forEach((c, i) => {
    const key = String(pick(c, ['slug', 'id', 'name']))
    units.set(key, { key, name: pick(c, ['name', 'title'], key), order: pick(c, ['order', 'unit_number', 'number'], i), algorithms: [] })
  })
  algorithms.forEach((a) => {
    if (!units.has(a.unitKey)) units.set(a.unitKey, { key: a.unitKey, name: a.unitName || a.unitKey, order: units.size, algorithms: [] })
    units.get(a.unitKey).algorithms.push(a)
  })
  return [...units.values()].sort((a, b) => a.order - b.order)
}

export function filterUnits(units, query) {
  const q = query.trim().toLowerCase()
  if (!q) return units
  return units
    .map((u) => ({ ...u, algorithms: u.algorithms.filter((a) => `${a.name} ${a.description} ${a.kind}`.toLowerCase().includes(q)) }))
    .filter((u) => u.algorithms.length)
}
