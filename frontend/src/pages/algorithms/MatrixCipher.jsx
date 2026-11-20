import { useState } from 'react'
import AlgorithmPage from '../../components/layout/AlgorithmPage'
import TerminalEmpty from '../../components/visualizations/TerminalEmpty.jsx'
import client from '../../services/api/client'

const EXAMPLE_MATRICES = {
  2: [[3, 3], [2, 5]],
  3: [[6, 24, 1], [13, 16, 10], [20, 17, 15]],
}
const fieldClass = 'w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none'
const letters = (text) => text.toUpperCase().replace(/[^A-Z]/g, '')

function Matrix({ values, title }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <table className="border-collapse font-mono text-center" aria-label={title}>
        <tbody>{values.map((row, i) => (
          <tr key={i}>{row.map((value, j) => (
            <td key={j} className="border border-gray-300 dark:border-gray-700 p-2 min-w-10">{value}</td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  )
}

export default function MatrixCipher({ cipher }) {
  const isPlayfair = cipher === 'playfair'
  const title = isPlayfair ? 'Playfair Cipher' : 'Hill Cipher'
  const [text, setText] = useState('')
  const [keyword, setKeyword] = useState('MONARCHY')
  const [matrix, setMatrix] = useState(EXAMPLE_MATRICES[2])
  const [operation, setOperation] = useState('encrypt')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setText('')
    setKeyword('MONARCHY')
    setMatrix(EXAMPLE_MATRICES[2])
    setOperation('encrypt')
    setResult(null)
    setError('')
  }

  const execute = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)
    const normalized = letters(text)
    if (!normalized) {
      setError('Input text must contain at least one English letter.')
      return
    }
    if (isPlayfair && !letters(keyword)) {
      setError('The keyword must contain at least one English letter.')
      return
    }
    if (!isPlayfair && matrix.some((row) => row.some((value) => String(value).trim() === '' || !Number.isSafeInteger(Number(value))))) {
      setError('Every matrix cell must contain a whole number.')
      return
    }
    const blockSize = isPlayfair ? 2 : matrix.length
    if (operation === 'decrypt' && normalized.length % blockSize !== 0) {
      setError(`Ciphertext must contain a multiple of ${blockSize} English letters.`)
      return
    }
    setLoading(true)
    try {
      const response = await client.post(`/algorithms/${cipher}/execute`, {
        operation,
        inputs: isPlayfair ? { text, key: keyword } : { text, key_matrix: matrix.map((row) => row.map(Number)) },
        options: { show_steps: true },
      })
      if (!response.data?.success || typeof response.data.data?.output_text !== 'string') {
        throw new Error('The backend returned an invalid result.')
      }
      setResult(response.data.data)
    } catch (err) {
      setError(err.message || 'Execution failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputs = (
    <form onSubmit={execute} className="space-y-4">
      <fieldset disabled={loading} className="space-y-4">
        <div>
          <label htmlFor={`${cipher}-text`} className="block text-sm font-medium mb-1">Input text</label>
          <textarea id={`${cipher}-text`} value={text} onChange={(e) => setText(e.target.value)} rows={3} required className={fieldClass} placeholder="Enter plaintext or ciphertext..." />
          <p className="text-xs text-gray-500 mt-1">English letters are converted to uppercase; spaces and punctuation are removed.</p>
        </div>
        {isPlayfair ? (
          <div>
            <label htmlFor="playfair-key" className="block text-sm font-medium mb-1">Keyword</label>
            <input id="playfair-key" value={keyword} onChange={(e) => setKeyword(e.target.value)} required className={fieldClass} />
            <p className="text-xs text-gray-500 mt-1">I and J share a cell. Repeated letters and odd plaintext lengths receive fillers; decryption keeps fillers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <label htmlFor="hill-size" className="block text-sm font-medium">Key matrix size</label>
            <select id="hill-size" value={matrix.length} onChange={(e) => setMatrix(EXAMPLE_MATRICES[e.target.value])} className={fieldClass}>
              <option value="2">2 Ã— 2</option>
              <option value="3">3 Ã— 3</option>
            </select>
            <div className="grid gap-2 max-w-xs" style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}>
              {matrix.map((row, i) => row.map((value, j) => (
                <input key={`${i}-${j}`} aria-label={`Key matrix row ${i + 1}, column ${j + 1}`} type="number" step="1" required value={value}
                  onChange={(e) => setMatrix((current) => current.map((r, ri) => r.map((v, ci) => ri === i && ci === j ? e.target.value : v)))} className={`${fieldClass} text-center font-mono`} />
              )))}
            </div>
            <p className="text-xs text-gray-500">The determinant must be coprime with 26. Plaintext is padded with X to complete a block; decryption keeps padding.</p>
          </div>
        )}
        <div>
          <label htmlFor={`${cipher}-mode`} className="block text-sm font-medium mb-1">Mode</label>
          <select id={`${cipher}-mode`} value={operation} onChange={(e) => setOperation(e.target.value)} className={fieldClass}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Processing...' : '▶ Run cipher'}</button>
          <button type="button" onClick={reset} className="px-4 py-2.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
        </div>
      </fieldset>
      {error && <p role="alert" className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</p>}
    </form>
  )

  const output = (
    <div aria-live="polite" aria-busy={loading} className="min-h-[300px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 space-y-5">
      {!result ? <TerminalEmpty loading={loading} /> : <>
        <div className="p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-400">{result.operation === 'encrypt' ? 'Ciphertext' : 'Decrypted text'}</h3>
          <p className="font-mono text-lg break-all mt-1">{result.output_text}</p>
        </div>
        <Matrix values={isPlayfair ? result.matrix : result.effective_matrix} title={isPlayfair ? 'Keyword matrix (I/J combined)' : 'Effective transformation matrix'} />
        <p className="text-sm break-all"><strong>Prepared input: </strong>{isPlayfair ? result.digraphs.join(' ') : result.blocks.join(' ')}</p>
        {!isPlayfair && <p className="text-sm">Key determinant: {result.determinant}. Padding added: {result.preparation.padding_count}.</p>}
        {isPlayfair && result.preparation_steps.length > 0 && <details>
          <summary className="cursor-pointer font-semibold">Input preparation</summary>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">{result.preparation_steps.map((step, i) => <li key={i}><span className="font-mono">{step.digraph}</span>: {step.explanation}</li>)}</ul>
        </details>}
        <div>
          <h3 className="font-semibold mb-2">Execution steps</h3>
          <ol className="space-y-3 max-h-96 overflow-y-auto">
            {result.execution_steps.map((step) => <li key={step.step} className="p-3 border border-gray-200 dark:border-gray-700 rounded text-sm">
              <p className="font-mono font-semibold">{step.step}. {isPlayfair ? step.input_pair : step.input_block} â†’ {isPlayfair ? step.output_pair : step.output_block}</p>
              {isPlayfair ? <p className="mt-1">{step.explanation}</p> : <>
                <p className="font-mono mt-1">[{step.input_vector.join(', ')}] â†’ [{step.output_vector.join(', ')}]</p>
                {step.calculations.map((calculation) => <p key={calculation.row} className="font-mono mt-1">Row {calculation.row}: ({calculation.multiplications.join(' + ')}) mod 26 = {calculation.modulo_result}</p>)}
              </>}
            </li>)}
          </ol>
        </div>
      </>}
    </div>
  )

  return <AlgorithmPage title={title} category="Classical Cryptography" playgroundInputs={inputs} outputConsole={output}
    theoryContent={<div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <p>{isPlayfair ? 'Playfair encrypts pairs of letters using a 5 Ã— 5 keyword matrix. Letters in the same row shift horizontally, letters in the same column shift vertically, and rectangle pairs exchange columns. Decryption reverses the shifts.' : 'Hill encrypts blocks of letters by multiplying their numeric column vectors by a key matrix modulo 26 (A = 0 through Z = 25). Decryption uses the modular inverse of the key matrix.'}</p>
      <p>These historical ciphers are for learning and are unsuitable for protecting sensitive information.</p>
    </div>}
    formulasContent={<div className="space-y-2 text-sm font-mono">
      {isPlayfair ? <><p>Same row: column Â± 1 (mod 5)</p><p>Same column: row Â± 1 (mod 5)</p><p>Rectangle: exchange columns</p></> : <><p>C = K Ã— P mod 26</p><p>P = inverse(K) Ã— C mod 26</p><p>gcd(det(K), 26) = 1</p></>}
    </div>} />
}

