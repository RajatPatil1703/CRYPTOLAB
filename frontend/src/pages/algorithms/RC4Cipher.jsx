import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import RC4FlowDiagram from '../../components/visualizations/RC4FlowDiagram';
import RC4Console from '../../components/visualizations/RC4Console';
import client from '../../services/api/client';

const extractErrorMessage = (err) => {
  if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
    return 'Request timed out. The backend may be waking up from a cold start—please retry in a few seconds.';
  }
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

const ACCORDION_ITEMS = [
  {
    id: 'history',
    title: 'History, Origin & Historical Applications',
    body: 'Designed by Ron Rivest in 1987 for RSA Security, RC4 (Rivest Cipher 4) was kept as a trade secret until it was leaked anonymously in 1994. Its simplicity and speed led to widespread adoption in WEP, WPA (TKIP), SSL/TLS, PDF encryption, and Microsoft Office—before cryptanalytic attacks led to its deprecation.',
  },
  {
    id: 'mechanics',
    title: 'How KSA & PRGA Work',
    body: 'RC4 maintains a 256-byte state permutation S[0..255]. During the Key Scheduling Algorithm (KSA), S is initialized to the identity permutation and scrambled over 256 iterations using the secret key. During the Pseudo-Random Generation Algorithm (PRGA), pointers i and j update S via swaps and emit one keystream byte per step, which is XORed with the input byte.',
  },
  {
    id: 'security',
    title: 'Security Weaknesses & Why RC4 Is Deprecated',
    body: 'RC4 exhibits statistical biases in its initial keystream bytes (Fluhrer–Mantin–Shamir attack against WEP), single-byte and double-byte keystream biases (exploitable in TLS), and catastrophic keystream reuse vulnerabilities when a key/nonce is reused. RFC 7465 officially prohibits RC4 in TLS; modern systems use ChaCha20-Poly1305 or AES-GCM.',
  },
];

const RC4Cipher = () => {
  const [text, setText] = useState('HELLO');
  const [key, setKey] = useState('KEY');
  const [operation, setOperation] = useState('encrypt');
  const [showSteps, setShowSteps] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [executionData, setExecutionData] = useState(null);
  const [lastRequestMeta, setLastRequestMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (loading) return;

    if (!text.trim()) {
      setError(
        operation === 'decrypt'
          ? 'Hex ciphertext is required for decryption.'
          : 'Plaintext message is required for encryption.'
      );
      return;
    }
    if (!key.trim()) {
      setError('Secret key is required.');
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
          key,
        },
        options: {
          show_steps: showSteps,
        },
      };

      const response = await client.post('/algorithms/rc4/execute', payload);

      if (response.data && response.data.success === true) {
        setExecutionData(response.data.data);
        setLastRequestMeta({ text, key, operation });
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
    setKey('');
    setOperation('encrypt');
    setShowSteps(true);
    setExecutionData(null);
    setLastRequestMeta(null);
    setError(null);
  };

  const loadPreset = (mode) => {
    setError(null);
    setExecutionData(null);
    if (mode === 'decrypt') {
      setOperation('decrypt');
      setText('DD25B018F9');
      setKey('KEY');
    } else {
      setOperation('encrypt');
      setText('HELLO');
      setKey('KEY');
    }
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      {/* Mandatory Security Warning */}
      <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-900/25 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
        <strong className="uppercase tracking-wide block mb-0.5">Security Warning</strong>
        RC4 is considered cryptographically insecure and is prohibited in modern secure communication
        systems. This implementation is intended strictly for educational purposes.
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
          Type: Stream Cipher
        </span>
        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
          Difficulty: Intermediate
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-medium">
          Status: Educational / Deprecated
        </span>
      </div>

      <p>
        <strong>RC4 (Rivest Cipher 4)</strong> is a classic symmetric <strong>stream cipher</strong>.
        Unlike block ciphers that process fixed-size chunks, a stream cipher generates a continuous
        pseudorandom byte sequence (the <em>keystream</em>) and combines it byte-by-byte with the
        plaintext using bitwise XOR.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">Advantages</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Very fast in software with minimal memory (256-byte S-box).</li>
            <li>No padding required; handles arbitrary byte lengths.</li>
            <li>Identical XOR structure for encryption and decryption.</li>
          </ul>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">Limitations</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Initial keystream bytes are statistically biased.</li>
            <li>Never reuse the same key across two messages.</li>
            <li>Provides no built-in integrity or authentication.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const formulasContent = (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
          KSA: j = (j + S[i] + K[i mod L]) mod 256
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
          PRGA: t = (S[i] + S[j]) mod 256
        </div>
        <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded font-mono text-xs">
          Cᵢ = Pᵢ ⊕ Kᵢ
        </div>
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded font-mono text-xs">
          Pᵢ = Cᵢ ⊕ Kᵢ
        </div>
      </div>

      <RC4FlowDiagram />
    </div>
  );

  const accordions = ACCORDION_ITEMS.map((item) => {
    const isOpen = openAccordion === item.id;
    return (
      <div
        key={item.id}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
      >
        <button
          type="button"
          onClick={() => setOpenAccordion(isOpen ? null : item.id)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
        >
          <span>{item.title}</span>
          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="px-4 pb-3.5 pt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800">
            {item.body}
          </div>
        )}
      </div>
    );
  });

  const playgroundInputs = (
    <div className="space-y-5">
      {/* Operation Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {[
          { value: 'encrypt', label: 'Encrypt (UTF-8 → Hex)' },
          { value: 'decrypt', label: 'Decrypt (Hex → UTF-8)' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setOperation(opt.value);
              setError(null);
            }}
            className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              operation === opt.value
                ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {operation === 'decrypt' ? 'Ciphertext (Hex) *' : 'Plaintext Message *'}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          rows="3"
          placeholder={
            operation === 'decrypt'
              ? 'Enter hexadecimal ciphertext (e.g. DD25B018F9)'
              : 'Enter plaintext message (e.g. HELLO)'
          }
        />
      </div>

      {/* Secret Key */}
      <div>
        <label className="block text-sm font-medium mb-1">Secret Key (UTF-8) *</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          placeholder="Enter secret key (e.g. KEY)"
        />
      </div>

      {/* Show Steps Toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showSteps}
          onChange={(e) => setShowSteps(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span>Include byte-by-byte execution trace &amp; XOR breakdown</span>
      </label>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500">Presets:</span>
        <button
          type="button"
          onClick={() => loadPreset('encrypt')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          Encrypt (HELLO / KEY)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('decrypt')}
          className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
        >
          Decrypt (DD25B018F9 / KEY)
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleExecute}
          disabled={loading || !text.trim() || !key.trim()}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Executing RC4...' : 'Execute / Compute'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <AlgorithmPage
      title="RC4 – Rivest Cipher 4"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      accordions={accordions}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <RC4Console
          data={executionData}
          requestMeta={lastRequestMeta}
          status={executionData ? 'success' : 'idle'}
        />
      }
    />
  );
};

export default RC4Cipher;