import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import TranspositionConsole from '../../components/visualizations/TranspositionConsole';
import client from '../../services/api/client';

const extractErrorMessage = (err) => {
  const detail = err.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(' | ');
  }
  if (detail && typeof detail === 'object') {
    return detail.message || JSON.stringify(detail);
  }
  return err.message || 'Execution failed. Verify the backend is running and your inputs are valid.';
};

const TranspositionCipher = () => {
  const [text, setText] = useState('ABCDEFGH');
  const [keyInput, setKeyInput] = useState('2,4,1,3');
  const [operation, setOperation] = useState('encrypt');
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parsePermutationKey = (rawKey) => {
    const trimmed = rawKey.trim();
    if (!trimmed) {
      return { valid: false, message: 'Permutation key is required (e.g., 2,4,1,3).' };
    }
    const parts = trimmed.split(',').map((p) => p.trim());
    if (parts.some((p) => p === '' || !/^-?\d+$/.test(p))) {
      return {
        valid: false,
        message: 'Key must contain comma-separated integers only (e.g., 2,4,1,3).',
      };
    }
    return { valid: true, keyArray: parts.map((p) => parseInt(p, 10)) };
  };

  const handleExecute = async () => {
    if (!text.trim()) {
      setError('Input text is required.');
      return;
    }

    const parsedKey = parsePermutationKey(keyInput);
    if (!parsedKey.valid) {
      setError(parsedKey.message);
      return;
    }

    setLoading(true);
    setError(null);
    setExecutionData(null);

    try {
      const payload = {
        operation,
        inputs: {
          text,
          key: parsedKey.keyArray,
        },
        options: {
          show_steps: true,
        },
      };

      const response = await client.post('/algorithms/transposition/execute', payload);

      if (response.data && response.data.success === true) {
        setExecutionData(response.data.data);
      } else {
        setError(response.data?.error || response.data?.detail || 'Backend returned an unsuccessful response.');
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setKeyInput('');
    setOperation('encrypt');
    setExecutionData(null);
    setError(null);
  };

  const loadPreset = (preset) => {
    setError(null);
    setExecutionData(null);
    if (preset === 'encrypt') {
      setOperation('encrypt');
      setText('ABCDEFGH');
      setKeyInput('2,4,1,3');
    } else if (preset === 'decrypt') {
      setOperation('decrypt');
      setText('BDACFHEG');
      setKeyInput('2,4,1,3');
    } else if (preset === 'padding') {
      setOperation('encrypt');
      setText('ABCDE');
      setKeyInput('2,4,1,3');
    }
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <p>
        A <strong>Transposition Cipher</strong> encrypts a message by rearranging character positions
        without changing the characters themselves.
      </p>
      <p>
        This implementation uses a <strong>block-based permutation key</strong>. The input text is
        divided into fixed-size blocks matching the key length, and each key entry specifies the
        1-based input position selected for the corresponding output position.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Padding:</strong> If the final encryption block is incomplete, padding characters
          are appended so it matches the block size.
        </li>
        <li>
          <strong>Decryption:</strong> Reverses the rearrangement using the inverse permutation key
          computed by the backend.
        </li>
      </ul>
    </div>
  );

  const formulasContent = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
          Cᵢ = Pₖᵢ
        </div>
        <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded font-mono text-sm">
          Pᵢ = Cₖ⁻¹ᵢ
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        For key <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">[2, 4, 1, 3]</code>, output
        position 1 takes input position 2, output position 2 takes input position 4, and so on.
      </p>
    </div>
  );

  const playgroundInputs = (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">
          {operation === 'decrypt' ? 'Ciphertext *' : 'Plaintext *'}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          rows="2"
          placeholder={operation === 'decrypt' ? 'e.g. BDACFHEG' : 'e.g. ABCDEFGH'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Permutation Key *</label>
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
            placeholder="e.g. 2,4,1,3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma-separated 1-based integers (e.g., 2,4,1,3).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-sm"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500">Presets:</span>
        <button
          type="button"
          onClick={() => loadPreset('encrypt')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          Encrypt (ABCDEFGH)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('decrypt')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          Decrypt (BDACFHEG)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('padding')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          Padding (ABCDE)
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleExecute}
          disabled={loading || !text.trim() || !keyInput.trim()}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : 'Execute / Compute'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <AlgorithmPage
      title="Transposition Cipher"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <TranspositionConsole
          data={executionData}
          status={executionData ? 'success' : 'idle'}
        />
      }
    />
  );
};

export default TranspositionCipher;