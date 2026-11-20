import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Shield, Search, BookOpen, KeyRound } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext.jsx'
import { lessons } from '../components/layout/lessons.js'
import AlgorithmCard from '../components/dashboard/AlgorithmCard.jsx'

export default function Dashboard() {
  const { status, error, units, visibleUnits, query, setQuery, reload } = useCatalog()
  return (
    <div className="course-home">
      <div className="panel-bar"><span><BookOpen size={15} /> Course overview</span><span className="bar-meta">LEARN BY DOING</span></div>
      <div className="course-home-scroll">
        <section className="course-hero">
          <div>
            <p className="eyebrow"><span className="live-dot" /> YOUR NEXT DISCOVERY STARTS HERE</p>
            <h1>Keep it secret.<br /><span>Crack the code.</span></h1>
            <p className="hero-description">Go from curious to cryptographer. Explore the theory, experiment with real ciphers, and watch every calculation come to life.</p>
            <Link className="pixel-button yellow-button hero-cta" to="/algorithms/caesar">Start learning <ArrowRight size={18} /></Link>
            <div className="hero-facts"><span><BookOpen size={14} /> 6 interactive labs</span><span><Terminal size={14} /> Step-by-step results</span></div>
          </div>
          <div className="cipher-art" aria-label="Caesar cipher example: HELLO becomes KHOOR with shift 3">
            <div className="art-window-bar"><i /><i /><i /><span>caesar.lab</span><Shield size={14} /></div>
            <div className="art-content"><p>// A little shift. A new perspective.</p><span className="art-label">PLAINTEXT</span><div className="art-letters">{'HELLO'.split('').map((letter, i) => <span key={i}>{letter}</span>)}</div><div className="art-key"><span /> <KeyRound size={14} /> shift +3 <span /></div><span className="art-label">CIPHERTEXT</span><div className="art-letters encrypted">{'KHOOR'.split('').map((letter, i) => <span key={i}>{letter}</span>)}</div><div className="art-success"><span className="live-dot" /> Secret message unlocked.</div></div>
          </div>
        </section>
        <div className="catalog-heading"><div><p className="eyebrow">ONE CONCEPT AT A TIME</p><h2>Your cryptography path<span>_</span></h2></div><label className="catalog-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search course labs" placeholder="Find your next cipher…" /></label></div>
        {status === 'loading' && <p role="status" className="catalog-status">Loading the course catalog…</p>}
        {status === 'error' && <div className="catalog-status" role="status">The live catalog is unavailable. You can still open the six built-in labs below. <button onClick={reload}>Retry connection</button><details><summary>Connection details</summary>{error?.message || 'Could not connect to the catalog service.'}</details></div>}
        {status !== 'ready' && <div className="course-grid">{lessons.filter((lesson) => `${lesson.name} ${lesson.description}`.toLowerCase().includes(query.toLowerCase())).map((lesson, index) => <AlgorithmCard key={lesson.slug} algorithm={{ ...lesson, available: true }} index={index} />)}</div>}
        {status === 'ready' && units.length === 0 && <p className="catalog-status">No algorithms in the catalog yet.</p>}
        {status === 'ready' && units.length > 0 && visibleUnits.length === 0 && <div className="catalog-status">No labs match “{query}”. <button onClick={() => setQuery('')}>Clear search</button></div>}
        {status === 'ready' && visibleUnits.map((unit) => <section className="catalog-unit" key={unit.key}><h3>{unit.name}</h3><div className="course-grid">{unit.algorithms.map((algorithm, index) => <AlgorithmCard key={algorithm.slug} algorithm={algorithm} index={index} />)}</div></section>)}
        <p className="home-signoff"><Terminal size={15} /> Made for curious minds. Built for hands-on learning.</p>
      </div>
    </div>
  )
}

