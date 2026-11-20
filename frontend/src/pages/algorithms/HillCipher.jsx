import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import HillConsole from '../../components/visualizations/HillConsole';
import MatrixDisplay from '../../components/visualizations/MatrixDisplay';
import client from '../../services/api/client';

const DEFAULT_2X2 = [
  ['3', '3'],
  ['2', '5'],
];

const DEFAULT_3X3 = [
  ['6', '24', '1'],
  ['13', '16', '10'],
  ['20', '17', '15'],
];

const extractErrorMessage = (err) => {
  const detail = err.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(' | ');
  }
  if (detail && typeof detail === 'object') {
    return detail.message || JSON.stringify(detail);
  }
  return err.message || 'Execution failed. Verify the backend is running and your key matrix is invertible mod 26.';
};

const HillCipher = () => {
  const [text, setText] = useState('HELP');
  const [operation, setOperation] = useState('encrypt');
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixInputs, setMatrixInputs] = useState(DEFAULT_2X2);
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSizeChange = (newSize) => {
    setMatrixSize(newSize);
    setMatrixInputs(newSize === 2 ? DEFAULT_2X2 : DEFAULT_3X3);
    setError(null);
  };

  const handleCellChange = (r, c, value) => {
    setMatrixInputs((prev) =>
      prev.map((row, rIdx) =>
        rIdx === r ? row.map((cell, cIdx) => (cIdx === c ? value : cell)) : row
      )
    );
  };

  const parseIntegerMatrix = () => {
    const parsed = [];
    for (let r = 0; r < matrixSize; r++) {
      const row = [];
      for (let c = 0; c < matrixSize; c++) {
        const raw = String(matrixInputs[r]?.[c] ?? '').trim();
        if (raw === '' || !/^-?\d+$/.test(raw)) {
          return { valid: false, message: `Matrix entry at Row ${r + 1}, Column ${c + 1} must be an integer.` };
        }
        row.push(parseInt(raw, 10));
      }
      parsed.push(row);
    }
    return { valid: true, matrix: parsed };
  };

  const handleExecute = async () => {
    if (!text.trim()) {
      setError('Input text is required.');
      return;
    }

    const matrixCheck = parseIntegerMatrix();
    if (!matrixCheck.valid) {
      setError(matrixCheck.message);
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
          key_matrix: matrixCheck.matrix,
        },
        options: {
          show_steps: true,
        },
      };

      const response = await client.post('/algorithms/hill/execute', payload);

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

  const handleReset = () => {
    setText('');
    setOperation('encrypt');
    setMatrixSize(2);
    setMatrixInputs(DEFAULT_2X2);
    setExecutionData(null);
    setError(null);
  };

  const loadPreset = (preset) => {
    setError(null);
    setExecutionData(null);
    if (preset === '2x2-enc') {
      setOperation('encrypt');
      setMatrixSize(2);
      setMatrixInputs(DEFAULT_2X2);
      setText('HELP');
    } else if (preset === '2x2-dec') {
      setOperation('decrypt');
      setMatrixSize(2);
      setMatrixInputs(DEFAULT_2X2);
      setText('HIAT');
    } else if (preset === '3x3-enc') {
      setOperation('encrypt');
      setMatrixSize(3);
      setMatrixInputs(DEFAULT_3X3);
      setText('ACT');
    }
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <p>
        The <strong>Hill Cipher</strong>, invented by mathematician <strong>Lester S. Hill</strong> in
        1929, is a classical <strong>polygraphic substitution cipher</strong> built on linear algebra
        over modulo 26 arithmetic.
      </p>
      <p>
        Because it encrypts fixed-size blocks of letters (digraphs for 2×2, trigraphs for 3×3)
        simultaneously via matrix multiplication, each ciphertext letter depends on every plaintext
        letter in its block—effectively masking single-letter frequencies.
      </p>
      <h3 className="font-semibold text-gray-900 dark:text-white pt-1">Applications &amp; Limitations</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Educational value:</strong> Demonstrates diffusion, modular matrix inversion, and
          invertibility conditions ($\gcd(\det(K), 26) = 1$).
        </li>
        <li>
          <strong>Vulnerability:</strong> Completely linear, making it vulnerable to{' '}
          <strong>known-plaintext attacks</strong> once $n$ linearly independent blocks are known.
        </li>
      </ul>
    </div>
  );

  const formulasContent = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
          C = (K · P) mod 26
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
          P = (K⁻¹ · C) mod 26
        </div>
        <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded font-mono text-xs">
          K⁻¹ = det(K)⁻¹ · adj(K) mod 26
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Invertibility requirement: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">gcd(det(K), 26) = 1</code>{' '}
        (det(K) must be odd and not divisible by 13).
      </p>
    </div>
  );

  const playgroundInputs = (
    <div className="space-y-5">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {operation === 'decrypt' ? 'Ciphertext *' : 'Plaintext *'}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          rows="2"
          placeholder={operation === 'decrypt' ? 'e.g. HIAT' : 'e.g. HELP or ACT'}
        />
      </div>

      {/* Operation & Matrix Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium mb-1">Key Matrix Size</label>
          <div className="grid grid-cols-2 gap-2">
            {[2, 3].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size)}
                className={`py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  matrixSize === size
                    ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300'
                    : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                {size}×{size} Matrix
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Key Matrix Editor */}
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Key Matrix ({matrixSize}×{matrixSize}) *
          </label>
          <span className="text-xs text-gray-500">Integers only</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(64px, 80px))` }}
          >
            {matrixInputs.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <input
                  key={`m-${rIdx}-${cIdx}`}
                  type="number"
                  step="1"
                  value={val}
                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                  className="w-full p-2 text-center font-mono text-sm border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                  aria-label={`Row ${rIdx + 1} Column ${cIdx + 1}`}
                />
              ))
            )}
          </div>

          <MatrixDisplay matrix={matrixInputs} label="Current K" accent="blue" compact />
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500">Presets:</span>
        <button
          type="button"
          onClick={() => loadPreset('2x2-enc')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          2×2 Encrypt (HELP)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('2x2-dec')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          2×2 Decrypt (HIAT)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('3x3-enc')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          3×3 Encrypt (ACT)
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={handleExecute}
          disabled={loading || !text.trim()}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Computing...' : 'Execute / Compute'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <AlgorithmPage
      title="Hill Cipher"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <HillConsole
          data={executionData}
          status={executionData ? 'success' : 'idle'}
        />
      }
    />
  );
};

export default HillCipher;