import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import PlayfairConsole from '../../components/visualizations/PlayfairConsole';
import client from '../../services/api/client';

const PlayfairCipher = () => {
  const [inputData, setInputData] = useState({
    text: '',
    key: 'MONARCHY',
    operation: 'encrypt',
  });
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!inputData.text.trim() || !inputData.key.trim()) {
      setError('Both text and keyword are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        operation: inputData.operation,
        inputs: {
          text: inputData.text,
          key: inputData.key,
        },
        options: {
          show_steps: true,
        },
      };

      const response = await client.post('/algorithms/playfair/execute', payload);

      if (response.data && response.data.success) {
        setExecutionData(response.data.data);
      } else {
        throw new Error('Invalid response format received from backend.');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Execution failed. Verify the backend is running and your inputs are valid.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = () => {
    setError(null);
    if (inputData.operation === 'decrypt') {
      setInputData({
        text: 'GATLMZCLRQXA',
        key: 'MONARCHY',
        operation: 'decrypt',
      });
    } else {
      setInputData({
        text: 'INSTRUMENTS',
        key: 'MONARCHY',
        operation: 'encrypt',
      });
    }
  };

  const handleClear = () => {
    setInputData({ text: '', key: '', operation: 'encrypt' });
    setExecutionData(null);
    setError(null);
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <p>
        The <strong>Playfair Cipher</strong> is a symmetric digraph substitution cipher. Instead of
        encrypting single letters, it encrypts pairs of letters (digraphs) using a 5×5 key square
        constructed from a keyword, combining <strong>I</strong> and <strong>J</strong> into one cell.
      </p>
      <ol className="list-decimal pl-5 space-y-1.5">
        <li>
          <strong>Key Matrix:</strong> Fill the 5×5 grid with unique letters of the keyword (J → I),
          followed by the remaining letters of the alphabet.
        </li>
        <li>
          <strong>Digraph Preparation:</strong> Split text into pairs. Separate duplicate letters in a
          pair with a filler (e.g., X) and pad odd-length text with a trailing filler.
        </li>
        <li>
          <strong>Transformation:</strong> Apply the Same Row, Same Column, or Rectangle rule to each
          digraph.
        </li>
      </ol>
      <h3 className="font-semibold text-gray-900 dark:text-white pt-1">Security Analysis</h3>
      <p>
        Significantly stronger than monoalphabetic ciphers because there are 676 possible digraphs
        instead of 26 single letters, flattening single-letter frequency distributions. However, it
        remains vulnerable to digraph frequency analysis with sufficient ciphertext.
      </p>
    </div>
  );

  const formulasContent = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded font-mono text-xs">
          Same Row: (r, (c ± 1) mod 5)
        </div>
        <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded font-mono text-xs">
          Same Col: ((r ± 1) mod 5, c)
        </div>
        <div className="px-3 py-2 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded font-mono text-xs">
          Rectangle: (r₁, c₂), (r₂, c₁)
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">+1</code> for encryption and{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">-1</code> for decryption.
      </p>
    </div>
  );

  const playgroundInputs = (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputData.operation === 'decrypt' ? 'Ciphertext *' : 'Plaintext *'}
        </label>
        <textarea
          value={inputData.text}
          onChange={(e) => setInputData({ ...inputData, text: e.target.value })}
          className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          rows="3"
          placeholder={
            inputData.operation === 'decrypt'
              ? 'e.g. GATLMZCLRQXA'
              : 'e.g. INSTRUMENTS'
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Keyword *</label>
          <input
            type="text"
            value={inputData.key}
            onChange={(e) => setInputData({ ...inputData, key: e.target.value })}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm uppercase"
            placeholder="e.g. MONARCHY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Operation</label>
          <select
            value={inputData.operation}
            onChange={(e) => setInputData({ ...inputData, operation: e.target.value })}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-sm"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={handleExecute}
          disabled={loading || !inputData.text.trim() || !inputData.key.trim()}
          className="flex-1 min-w-[150px] px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : 'Execute / Compute'}
        </button>
        <button
          type="button"
          onClick={handleLoadPreset}
          className="px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          Load Preset
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <AlgorithmPage
      title="Playfair Cipher"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <PlayfairConsole
          data={executionData}
          status={executionData ? 'success' : 'idle'}
        />
      }
    />
  );
};

export default PlayfairCipher;