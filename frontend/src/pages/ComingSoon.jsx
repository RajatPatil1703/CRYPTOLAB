import { Link } from 'react-router-dom'

export default function ComingSoon({ title, note = 'This section is planned for a later phase.' }) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-2 text-muted">{note}</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Back to dashboard</Link>
    </div>
  )
}
