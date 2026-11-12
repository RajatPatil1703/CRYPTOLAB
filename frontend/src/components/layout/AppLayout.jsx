import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <Header onMenu={() => setMenuOpen(true)} />
      <div className="lg:flex">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
