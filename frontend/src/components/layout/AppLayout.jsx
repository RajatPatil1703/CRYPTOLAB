import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import { lessons } from './lessons.js'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const index = lessons.findIndex((lesson) => pathname === `/algorithms/${lesson.slug}`)
  const lesson = lessons[index]
  useEffect(() => { setMenuOpen(false) }, [pathname])
  return (
    <div className="app-shell">
      <Header onMenu={() => setMenuOpen(true)} lesson={lesson} index={index} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className={`app-main ${lesson ? 'is-lesson' : ''}`}><Outlet /></main>
      <footer className="lesson-footer">
        <button className="pixel-button footer-menu" onClick={() => setMenuOpen(true)} aria-label="Open course contents"><List size={19} /></button>
        <div className="footer-label"><strong>{lesson?.name || 'Cryptography & Network Security'}</strong><span>{lesson ? `Lesson ${index + 1} of ${lessons.length}` : 'Your cryptography learning adventure'} <b className="little-badge">{lesson ? 'LAB' : 'EXPLORER'}</b></span></div>
        <div className="footer-actions">
          <Link className="pixel-button" to={index > 0 ? `/algorithms/${lessons[index - 1].slug}` : '/'}><ChevronLeft size={15} /> Back</Link>
          <Link className="pixel-button yellow-button" to={index === lessons.length - 1 ? '/' : `/algorithms/${lessons[index + 1].slug}`}>
            {index === lessons.length - 1 ? 'All lessons' : index < 0 ? 'Start learning' : 'Next'} <ChevronRight size={15} />
          </Link>
        </div>
      </footer>
    </div>
  )
}

