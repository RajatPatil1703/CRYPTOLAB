import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, ChevronDown, Search, BookOpen, Code2, Layers, Info, X } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext.jsx'

const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-brand-soft text-brand-ink' : 'text-ink hover:bg-subtle'
  }`

export default function Sidebar({ open, onClose }) {
  const { status, visibleUnits, query, setQuery } = useCatalog()
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface transition-transform lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
          <span className="font-extrabold">Menu</span>
          <button onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 hover:bg-subtle"><X className="size-5" /></button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4" onClick={(e) => e.target.closest('a') && onClose()}>
          <NavLink to="/" end className={link}><LayoutDashboard className="size-5" /> Dashboard</NavLink>

          <button onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-subtle">
            <Database className="size-5" /> Algorithms
            <ChevronDown className={`ml-auto size-4 transition-transform ${expanded ? '' : '-rotate-90'}`} />
          </button>

          <label className="relative block">
            <span className="sr-only">Search algorithms</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search algorithms…"
              className="w-full rounded-lg border border-line bg-page py-2 pl-9 pr-3 text-sm placeholder:text-muted"
            />
          </label>

          {expanded && (
            <div className="mt-1 flex flex-col gap-3">
              {status === 'loading' && <p className="px-3 text-xs text-muted">Loading algorithms…</p>}
              {status === 'error' && <p className="px-3 text-xs text-muted">Algorithms unavailable.</p>}
              {status === 'ready' && visibleUnits.length === 0 && <p className="px-3 text-xs text-muted">No algorithms match “{query}”.</p>}
              {visibleUnits.map((unit) => (
                <div key={unit.key}>
                  <p className="px-3 pb-1 text-xs font-semibold text-muted">{unit.name}</p>
                  {unit.algorithms.map((a) => (
                    <NavLink key={a.slug} to={`/algorithms/${a.slug}`} className={link}>
                      <span className="truncate">{a.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          )}

          <hr className="my-3 border-line" />
          <NavLink to="/theory-notes" className={link}><BookOpen className="size-5" /> Theory Notes</NavLink>
          <NavLink to="/practice" className={link}><Code2 className="size-5" /> Practice Sets</NavLink>
          <NavLink to="/references" className={link}><Layers className="size-5" /> References</NavLink>
          <NavLink to="/about" className={link}><Info className="size-5" /> About</NavLink>
        </nav>
      </aside>
    </>
  )
}
