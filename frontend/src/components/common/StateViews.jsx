import { Loader2, ServerCrash, SearchX, RefreshCw } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-muted">
      <Loader2 className="size-5 animate-spin text-brand" /> {label}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="mx-auto max-w-lg rounded-xl border border-line bg-surface p-8 text-center">
      <ServerCrash className="mx-auto size-8 text-muted" />
      <h2 className="mt-3 text-lg font-bold">Couldn’t load the algorithms</h2>
      <p className="mt-1 text-sm text-muted">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          <RefreshCw className="size-4" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-dashed border-line p-8 text-center">
      <SearchX className="mx-auto size-8 text-muted" />
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {action}
    </div>
  )
}
