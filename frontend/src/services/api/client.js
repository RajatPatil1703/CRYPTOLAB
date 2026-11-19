import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/** Turns any axios failure into one predictable shape the UI can display. */
export function toApiError(err) {
  if (err?.code === 'ECONNABORTED') {
    return { kind: 'timeout', message: 'The server took too long to respond. Try again in a moment.' }
  }
  if (!err?.response) {
    return { kind: 'network', message: `Cannot reach the backend at ${API_BASE_URL}. Check that the API is running.` }
  }
  const { status, data } = err.response
  const detail = data?.detail
  let message = typeof detail === 'string' ? detail : data?.error?.message || detail?.message || data?.message
  let fields = []
  if (Array.isArray(detail)) {
    // FastAPI/Pydantic validation errors: [{ loc: [...], msg: '...' }]
    fields = detail.map((d) => ({ path: (d.loc || []).filter((p) => p !== 'body').join('.'), message: d.msg }))
    message = fields.map((f) => (f.path ? `${f.path}: ${f.message}` : f.message)).join('; ')
  }
  return {
    kind: status === 422 || status === 400 ? 'validation' : status >= 500 ? 'server' : 'request',
    status,
    fields,
    message: message || `The server returned an error (${status}).`,
  }
}

client.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err))
)

export default client
