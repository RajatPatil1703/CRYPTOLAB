import { useCatalog } from '../context/CatalogContext.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateViews.jsx'
import AlgorithmCard from '../components/dashboard/AlgorithmCard.jsx'

export default function Dashboard() {
  const { status, error, units, visibleUnits, query, setQuery, reload } = useCatalog()

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Algorithms</h1>
      <p className="mt-1 max-w-2xl text-muted">Pick an algorithm to read its theory, run it with your own values, and step through every calculation.</p>

      <div className="mt-8">
        {status === 'loading' && <LoadingState label="Loading algorithms…" />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'ready' && units.length === 0 && (
          <EmptyState title="No algorithms yet" hint="The backend returned an empty list." />
        )}
        {status === 'ready' && units.length > 0 && visibleUnits.length === 0 && (
          <EmptyState
            title={`No results for “${query}”`}
            hint="Try a shorter name or clear the search."
            action={<button onClick={() => setQuery('')} className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-subtle">Clear search</button>}
          />
        )}
        {status === 'ready' && visibleUnits.map((unit) => (
          <section key={unit.key} className="mb-10">
            <h2 className="mb-4 border-l-4 border-brand pl-3 text-lg font-bold">{unit.name}</h2>
            {unit.algorithms.length === 0 ? (
              <p className="text-sm text-muted">No algorithms in this unit yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {unit.algorithms.map((a) => <AlgorithmCard key={a.slug} algorithm={a} />)}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
