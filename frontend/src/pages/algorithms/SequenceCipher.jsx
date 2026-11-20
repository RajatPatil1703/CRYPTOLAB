import { useState } from 'react'
import AlgorithmPage from '../../components/layout/AlgorithmPage'
import TerminalEmpty from '../../components/visualizations/TerminalEmpty.jsx'
import client from '../../services/api/client'

const fieldClass = 'w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none'

export default function SequenceCipher({ cipher }) {
  const isRC4 = cipher === 'rc4'
  const title = isRC4 ? 'RC4' : 'Transposition Cipher'
  const defaultKey = isRC4 ? 'Key' : '3, 1, 4, 2'
  const [text, setText] = useState('')
  const [key, setKey] = useState(defaultKey)
  const [operation, setOperation] = useState('encrypt')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setText('')
    setKey(defaultKey)
    setOperation('encrypt')
    setResult(null)
    setError('')
  }

  const execute = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)
    let parsedKey = key
    if (isRC4) {
      const keyLength = new TextEncoder().encode(key).length
      if (!keyLength || keyLength > 256) {
        setError('The key must contain 1 to 256 UTF-8 bytes.')
        return
      }
      const compact = text.replace(/\s/g, '')
      if (operation === 'decrypt' && (!compact || compact.length % 2 || !/^[0-9a-f]+$/i.test(compact))) {
        setError('Enter hexadecimal ciphertext with two digits per byte.')
        return
      }
      const byteCount = operation === 'encrypt' ? new TextEncoder().encode(text).length : compact.length / 2
      if (!byteCount || byteCount > 32768) {
        setError('Input must contain 1 to 32,768 bytes.')
        return
      }
    } else {
      const parts = key.trim().split(/[\s,]+/)
      parsedKey = parts.map(Number)
      if (parts.some((part) => !/^\d+$/.test(part)) || parsedKey.length < 2 || [...parsedKey].sort((a, b) => a - b).some((value, i) => value !== i + 1)) {
        setError('The key must contain each position from 1 to its length exactly once, for example: 3, 1, 4, 2.')
        return
      }
      const normalized = text.toUpperCase().replace(/[^A-Z]/g, '')
      if (!normalized) {
        setError('Input must contain at least one English letter.')
        return
      }
      if (operation === 'decrypt' && normalized.length % parsedKey.length) {
        setError(`Ciphertext must contain a multiple of ${parsedKey.length} English letters.`)
        return
      }
    }
    setLoading(true)
    try {
      const response = await client.post(`/algorithms/${cipher}/execute`, {
        operation, inputs: { text, key: parsedKey }, options: { show_steps: true },
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

  const inputs = <form onSubmit={execute} className="space-y-4">
    <fieldset disabled={loading} className="space-y-4">
      <div>
        <label htmlFor={`${cipher}-text`} className="block text-sm font-medium mb-1">{isRC4 && operation === 'decrypt' ? 'Ciphertext (hexadecimal)' : 'Input text'}</label>
        <textarea id={`${cipher}-text`} value={text} onChange={(e) => setText(e.target.value)} required rows={4} className={`${fieldClass} font-mono`} placeholder={isRC4 && operation === 'decrypt' ? 'BBF316E8D940AF0AD3' : 'Enter text to process...'} />
        <p className="text-xs text-gray-500 mt-1">{isRC4 ? 'Encryption preserves UTF-8 text, including spaces and punctuation. Paste hexadecimal output here to decrypt with the same key. Maximum 32,768 input bytes.' : 'Only English letters are retained and converted to uppercase. X padding completes the final block; decryption keeps padding.'}</p>
      </div>
      <div>
        <label htmlFor={`${cipher}-key`} className="block text-sm font-medium mb-1">{isRC4 ? 'Key (UTF-8 text)' : 'Permutation key'}</label>
        <input id={`${cipher}-key`} value={key} onChange={(e) => setKey(e.target.value)} required className={`${fieldClass} font-mono`} />
        <p className="text-xs text-gray-500 mt-1">{isRC4 ? 'Use the exact same key for encryption and decryption (1â€“256 UTF-8 bytes).' : 'Separate positions with commas or spaces. For 3, 1, 4, 2, the block ABCD becomes CADB.'}</p>
      </div>
      <div>
        <label htmlFor={`${cipher}-mode`} className="block text-sm font-medium mb-1">Mode</label>
        <select id={`${cipher}-mode`} value={operation} onChange={(e) => setOperation(e.target.value)} className={fieldClass}>
          <option value="encrypt">Encrypt</option><option value="decrypt">Decrypt</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Processing...' : '▶ Run cipher'}</button>
        <button type="button" onClick={reset} className="px-4 py-2.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
      </div>
    </fieldset>
    {error && <p role="alert" className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</p>}
  </form>

  const output = <div aria-live="polite" aria-busy={loading} className="min-h-[300px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 space-y-5">
    {!result ? <TerminalEmpty loading={loading} /> : <>
      <div className="p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-semibold text-green-800 dark:text-green-400">{result.operation === 'encrypt' ? isRC4 ? 'Ciphertext (hexadecimal)' : 'Ciphertext' : 'Decrypted text'}</h3>
        <p className="font-mono text-lg break-all whitespace-pre-wrap mt-1">{result.output_text}</p>
      </div>
      {isRC4 ? <p className="text-sm">Processed {result.byte_count} bytes. Steps below show hexadecimal bytes.</p> : <div className="text-sm space-y-2 break-all">
        <p><strong>Effective permutation: </strong>{result.effective_key.join(', ')}</p>
        <p><strong>Prepared blocks: </strong>{result.blocks.join(' ')}</p>
        <p>Padding added: {result.preparation.padding_count}.</p>
      </div>}
      <h3 className="font-semibold">{isRC4 ? 'Keystream XOR steps' : 'Block rearrangement steps'}</h3>
      {result.steps_truncated && <p className="text-sm text-gray-500">Showing the first 256 bytes. The result includes the complete input.</p>}
      <ol className="space-y-3 max-h-96 overflow-y-auto">
        {result.execution_steps.map((step) => <li key={step.step} className="p-3 border border-gray-200 dark:border-gray-700 rounded text-sm">
          {isRC4 ? <p className="font-mono">{step.step}. {step.input_hex} XOR {step.keystream_hex} = {step.output_hex}</p> : <>
            <p className="font-mono font-semibold">{step.step}. {step.input_block} â†’ {step.output_block}</p>
            {step.calculations.map((move) => <p key={move.output_position} className="mt-1">Output position {move.output_position} takes input position {move.input_position}: <span className="font-mono">{move.character}</span></p>)}
          </>}
        </li>)}
      </ol>
    </>}
  </div>

  return <AlgorithmPage title={title} category={isRC4 ? 'Symmetric Cryptography' : 'Classical Cryptography'} playgroundInputs={inputs} outputConsole={output}
    theoryContent={<div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <p>{isRC4 ? 'RC4 schedules a 256-byte permutation using the key, generates a keystream, and XORs each input byte with one keystream byte. Applying the same keystream again recovers the input. This demonstration starts at stream offset zero without dropping bytes.' : 'This block transposition cipher divides text into equal blocks and rearranges their letters using a permutation. Each key entry selects the input position for that output position. Decryption applies the inverse permutation.'}</p>
      <p>{isRC4 ? 'RC4 is obsolete and unsafe for real-world security. This implementation is for educational experiments.' : 'Transposition preserves letter frequencies and is unsuitable for protecting sensitive information.'}</p>
    </div>}
    formulasContent={<div className="space-y-2 text-sm font-mono">{isRC4 ? <><p>C[i] = P[i] XOR Z[i]</p><p>P[i] = C[i] XOR Z[i]</p><p>Z = RC4 keystream generated from the key</p></> : <><p>C[i] = P[key[i] - 1]</p><p>Decrypt with the inverse permutation</p><p>Key contains positions 1 through n exactly once</p></>}</div>} />
}

