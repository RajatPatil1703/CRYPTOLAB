import { Link } from 'react-router-dom'
import { ArrowUpRight, LockKeyhole } from 'lucide-react'

export default function AlgorithmCard({ algorithm, index = 0 }) {
  const { slug, name, description, kind, available } = algorithm
  const content = <><div className="card-top"><span className="card-number">{String(index + 1).padStart(2, '0')}</span><LockKeyhole size={19} /></div><h3>{name}</h3><p>{description || 'Explore the theory and experiment with your own inputs.'}</p><div className="card-bottom"><span>{kind || 'INTERACTIVE LAB'}</span>{available ? <ArrowUpRight size={18} /> : <span>Coming soon</span>}</div></>
  return available ? <Link className="algorithm-card" to={`/algorithms/${slug}`}>{content}</Link> : <div className="algorithm-card unavailable" aria-disabled="true">{content}</div>
}

