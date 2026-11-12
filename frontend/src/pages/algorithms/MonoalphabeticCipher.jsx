import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import MonoalphabeticConsole from '../../components/visualizations/MonoalphabeticConsole';
import client from '../../services/api/client';

const MonoalphabeticCipher = () => {
  const [inputData, setInputData] = useState({ 
    text: '', 
    key: 'QWERTYUIOPASDFGHJKLZXCVBNM', 
    operation: 'encrypt' 
  });
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!inputData.text || !inputData.key) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        operation: inputData.operation,
        inputs: {
          text: inputData.text,
          key: inputData.key.toUpperCase()
        },
        options: {
          show_steps: true
        }
      };
      
      const response = await client.post('/algorithms/monoalphabetic/execute', payload);
      
      if (response.data && response.data.success) {
        setExecutionData(response.data.data);
      } else {
        throw new Error('Invalid response format received from backend.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Execution failed. Please check the API connection and your 26-letter key.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputData({ text: '', key: 'QWERTYUIOPASDFGHJKLZXCVBNM', operation: 'encrypt' });
    setExecutionData(null);
    setError(null);
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <p>The Monoalphabetic Substitution Cipher replaces each letter of the plaintext with a corresponding letter from a scrambled 26-letter cipher alphabet.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Keyspace:</strong> There are 26! (approx. 4 × 10²⁶) possible keys.</li>
        <li><strong>Mapping:</strong> The mapping is strictly one-to-one. 'A' will always encrypt to the same cipher letter throughout the entire message.</li>
      </ul>
      <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Security Analysis</h3>
      <p>While resistant to brute-force attacks due to the massive keyspace, it is easily broken using <strong>Frequency Analysis</strong>. Since the mapping is static, the natural frequency of letters in the English language (like 'E', 'T', 'A') is perfectly preserved in the ciphertext.</p>
    </div>
  );

  const formulasContent = (
    <div className="flex flex-wrap gap-3">
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
        E(x) = f(x)
      </div>
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
        D(y) = f⁻¹(y)
      </div>
      <div className="w-full text-xs text-gray-500 mt-2">
        Where <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">f</code> is the permutation function defined by the 26-letter key.
      </div>
    </div>
  );

  const playgroundInputs = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Input Text *</label>
          <textarea 
            value={inputData.text}
            onChange={(e) => setInputData({...inputData, text: e.target.value})}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            rows="3"
            placeholder="Enter text to process..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cipher Alphabet Key *</label>
          <input 
            type="text" 
            value={inputData.key}
            onChange={(e) => setInputData({...inputData, key: e.target.value})}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm uppercase"
            placeholder="Enter exactly 26 unique letters..."
            maxLength={26}
          />
          <p className="text-xs text-gray-500 mt-1">Must be exactly 26 unique characters representing A-Z.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select 
            value={inputData.operation}
            onChange={(e) => setInputData({...inputData, operation: e.target.value})}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button 
            onClick={handleExecute}
            disabled={loading || !inputData.text || inputData.key.length !== 26}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Execute / Compute'}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AlgorithmPage 
      title="Substitution Cipher"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <MonoalphabeticConsole 
          steps={executionData?.steps} 
          outputText={executionData?.output_text} 
          status={executionData ? 'success' : 'idle'} 
          cipherKey={inputData.key}
          operation={inputData.operation}
        />
      }
    />
  );
};

export default MonoalphabeticCipher;