import { Code2 } from 'lucide-react'

export default function TerminalEmpty({ loading = false }) {
  return <div className="terminal-empty" role="status"><Code2 size={32} strokeWidth={1.5} /><p>{loading ? 'Running your experiment…' : 'Run your cipher to view the results'}</p><small>{loading ? 'Computing the output and execution trace.' : 'Your output and every calculation will appear here.'}</small></div>
}
