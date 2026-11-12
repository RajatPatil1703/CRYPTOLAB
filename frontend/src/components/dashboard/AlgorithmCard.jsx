import { Link } from 'react-router-dom'
import { ArrowRight, KeyRound } from 'lucide-react'

export default function AlgorithmCard({ algorithm }) {
  const { slug, name, description, kind, available } = algorithm
  const body = (
    <>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-ink"><KeyRound className="size-5" /></span>
        <div className="min-w-0">
          <h3 className="font-bold leading-tight">{name}</h3>
          {kind && <span className="mt-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-ink">{kind}</span>}
        </div>
      </div>
      {description && <p className="mt-3 line-clamp-3 text-sm text-muted">{description}</p>}
      <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-ink">
        {available ? <>Open lab <ArrowRight className="size-4" /></> : <span className="text-muted">Not available yet</span>}
      </p>
    </>
  )
  const cls = 'block rounded-xl border border-line bg-surface p-5'
  return available ? (
    <Link to={`/algorithms/${slug}`} className={`${cls} transition-colors hover:border-brand`}>{body}</Link>
  ) : (
    <div className={`${cls} opacity-70`} aria-disabled="true">{body}</div>
  )
}
