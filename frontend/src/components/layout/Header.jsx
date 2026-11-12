import { Menu, Bell, Sun, Moon, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Header({ onMenu }) {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-surface px-4 lg:px-6">
      <button onClick={onMenu} aria-label="Open navigation" className="rounded-lg p-2 hover:bg-subtle lg:hidden">
        <Menu className="size-5" />
      </button>
      <Link to="/" className="flex items-center gap-2.5">
        <ShieldCheck className="size-8 text-brand" strokeWidth={1.8} />
        <span className="text-xl font-extrabold tracking-tight">CryptoLab</span>
      </Link>
      <span className="hidden h-6 w-px bg-line md:block" />
      <p className="hidden text-sm text-muted md:block">Cryptography &amp; Network Security Learning Platform</p>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className="rounded-full border border-line p-2 hover:bg-subtle">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <button aria-label="Notifications" className="rounded-full p-2 hover:bg-subtle"><Bell className="size-5" /></button>
        <button aria-label="Profile" className="grid size-9 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">S</button>
      </div>
    </header>
  )
}
