import { Menu, Sun, Moon, Shield, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { lessons } from './lessons.js'

export default function Header({ onMenu, lesson, index }) {
  const { theme, toggle } = useTheme()
  return (
    <header className="top-bar">
      <Link to="/" className="brand-mark"><Shield size={23} /><span>CryptoLab<span className="brand-dot">.</span></span></Link>
      <div className="breadcrumbs"><Link to="/">Cryptography</Link><span>/</span><strong>{lesson?.name || 'Explorer'}</strong></div>
      <div className="course-position" aria-label={lesson ? `Lesson ${index + 1} of ${lessons.length}` : 'Six interactive lessons'}>
        <div className="progress-track"><span style={{ width: lesson ? `${((index + 1) / lessons.length) * 100}%` : '0%' }} /></div>
        <span>{lesson ? `${index + 1} / ${lessons.length}` : 'LET’S LEARN'}</span>
      </div>
      <div className="top-actions">
        <span className="learning-status"><i /> Learning mode</span>
        <button className="icon-button" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} workspace`} title="Toggle workspace theme">{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
        <button className="pixel-button course-button" onClick={onMenu}><BookOpen size={16} /><span>Course contents</span><Menu size={16} /></button>
      </div>
    </header>
  )
}

