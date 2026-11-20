import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Search, ArrowUpRight, BookOpen } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { lessons } from './lessons.js'

export default function Sidebar({ open, onClose }) {
  const { query, setQuery, status, visibleUnits } = useCatalog()
  const dialog = useRef(null)
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal()
    if (!open && dialog.current.open) dialog.current.close()
  }, [open])
  const items = status === 'ready' ? visibleUnits.flatMap((unit) => unit.algorithms) : lessons.filter((lesson) => lesson.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <dialog ref={dialog} className="course-drawer" onCancel={onClose} onClick={(event) => { if (event.target === dialog.current) onClose() }}>
      <div className="drawer-inner">
        <div className="drawer-heading"><BookOpen size={19} /><strong>Course contents</strong><button className="icon-button" onClick={onClose} aria-label="Close course contents"><X size={21} /></button></div>
        <label className="drawer-search"><Search size={16} /><input aria-label="Search algorithms" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an algorithm…" /></label>
        <nav onClick={(event) => { if (event.target.closest('a')) onClose() }}>
          <NavLink to="/" end>Overview <ArrowUpRight size={16} /></NavLink>
          <p className="eyebrow">THE CRYPTOGRAPHY PATH</p>
          {items.map((lesson, index) => <NavLink key={lesson.slug} to={`/algorithms/${lesson.slug}`}><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>{lesson.name}</NavLink>)}
          {items.length === 0 && <p className="drawer-empty">No matching algorithms.</p>}
          <p className="eyebrow">RESOURCES</p>
          {[['theory-notes', 'Theory notes'], ['practice', 'Practice sets'], ['references', 'References'], ['about', 'About CryptoLab']].map(([path, label]) => <NavLink key={path} to={`/${path}`}>{label}<ArrowUpRight size={15} /></NavLink>)}
        </nav>
        <p className="drawer-note">A little theory. A little experimentation.<br />A whole new way to understand cryptography.</p>
      </div>
    </dialog>
  )
}

