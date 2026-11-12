import client from './client.js'

export const getAlgorithms = () => client.get('/algorithms').then((r) => r.data)
export const getAlgorithm = (slug) => client.get(`/algorithms/${encodeURIComponent(slug)}`).then((r) => r.data)
export const executeAlgorithm = (slug, payload) =>
  client.post(`/algorithms/${encodeURIComponent(slug)}/execute`, payload).then((r) => r.data)
export const compareAlgorithms = (payload) => client.post('/compare', payload).then((r) => r.data)
