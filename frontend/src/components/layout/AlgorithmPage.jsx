import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen, Code2, Terminal, FlaskConical, ArrowDown, Lightbulb } from 'lucide-react'
import { lessons } from './lessons.js'

export default function AlgorithmPage({ title, category, theoryContent, formulasContent, accordions, playgroundInputs, outputConsole }) {
  const [activeTab, setActiveTab] = useState('playground')
  const { pathname } = useLocation()
  const index = lessons.findIndex((lesson) => pathname.endsWith(`/${lesson.slug}`))
  return (
    <div className="exercise-layout">
      <section className="lesson-panel" aria-label="Lesson and instructions">
        <div className="panel-bar"><span><BookOpen size={15} /> Exercise</span><span className="bar-meta">{category}</span></div>
        <div className="lesson-scroll">
          <div className="lesson-intro">
            <p className="eyebrow">THE CRYPTOGRAPHY PATH <span>/ {String(index + 1).padStart(2, '0')}</span></p>
            <h1>{String(index + 1).padStart(2, '0')}. {title}</h1>
            <h2><span>#</span> Let’s crack the code.</h2>
            <div className="theory-copy">{theoryContent}</div>
            <div className="formula-heading"><Code2 size={15} /> THE RULES OF THE CIPHER</div>
            <div className="formula-block">{formulasContent}</div>
            {accordions && <div className="lesson-accordions">{accordions}</div>}
          </div>
          <div className="panel-bar instruction-bar">Instructions <ArrowDown size={14} /></div>
          <div className="instruction-copy">
            <p>Time to put the theory into practice. Use the playground to see exactly how the {title} transforms your message.</p>
            <ol className="instruction-steps">
              <li><span>1</span><div><strong>Write your message</strong><p>Enter plaintext to encrypt, or ciphertext to decrypt.</p></div></li>
              <li><span>2</span><div><strong>Set your key</strong><p>Adjust the cipher settings and choose your mode.</p></div></li>
              <li><span>3</span><div><strong>Run the experiment</strong><p>Select Run cipher and follow the results in the terminal.</p></div></li>
            </ol>
            <div className="tip-box"><Lightbulb size={19} /><p><strong>Try this</strong><br />Change just the key, run again, and compare the results. What changed?</p></div>
            <p className="lesson-signoff">Small experiments. Big discoveries. <span>✦</span></p>
          </div>
        </div>
      </section>
      <section className="experiment-panel" aria-label="Interactive cipher workspace">
        <div className="workspace-tabs" role="tablist" aria-label="Workspace view">
          <button id="playground-tab" role="tab" aria-selected={activeTab === 'playground'} aria-controls="playground-panel" onClick={() => setActiveTab('playground')} className={activeTab === 'playground' ? 'active' : ''}><FlaskConical size={16} /> Playground<span className="tab-dot" /></button>
          <button id="formulas-tab" role="tab" aria-selected={activeTab === 'formulas'} aria-controls="formulas-panel" onClick={() => setActiveTab('formulas')} className={activeTab === 'formulas' ? 'active' : ''}><Code2 size={16} /> Cipher rules</button>
          <span className="workspace-language">INTERACTIVE LAB</span>
        </div>
        <div className="workspace-editor">
          <div id="playground-panel" role="tabpanel" aria-labelledby="playground-tab" hidden={activeTab !== 'playground'}>
            <div className="editor-comment">// Your message. Your key. Your experiment.</div>
            <div className="cipher-inputs">{playgroundInputs}</div>
          </div>
          <div id="formulas-panel" role="tabpanel" aria-labelledby="formulas-tab" hidden={activeTab !== 'formulas'} className="rules-reference"><p className="editor-comment">// Reference · {title}</p><h2>Cipher rules</h2>{formulasContent}<p>Choose Playground to enter your message and run the cipher.</p></div>
        </div>
        <div className="terminal-panel">
          <div className="panel-bar"><span><Terminal size={15} /> Terminal</span><span className="bar-meta">OUTPUT & EXECUTION TRACE</span></div>
          <div className="terminal-content">{outputConsole}</div>
        </div>
      </section>
    </div>
  )
}

