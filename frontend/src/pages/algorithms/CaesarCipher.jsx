import React, { useState } from 'react';
import AlgorithmPage from '../../components/layout/AlgorithmPage';
import OutputConsole from '../../components/visualizations/OutputConsole';
import client from '../../services/api/client';

const CaesarCipher = () => {
  const [inputData, setInputData] = useState({ text: '', key: 3, operation: 'encrypt' });
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!inputData.text) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        operation: inputData.operation,
        inputs: {
          text: inputData.text,
          key: parseInt(inputData.key, 10)
        },
        options: {
          show_steps: true
        }
      };
      
      const response = await client.post('/algorithms/caesar/execute', payload);
      
      if (response.data && response.data.success) {
        setExecutionData(response.data.data);
      } else {
        throw new Error('Invalid response format received from backend.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Execution failed. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputData({ text: '', key: 3, operation: 'encrypt' });
    setExecutionData(null);
    setError(null);
  };

  const theoryContent = (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <p>The Caesar Cipher is a substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet.</p>
      <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Security Analysis</h3>
      <p>Highly insecure. Vulnerable to brute-force attacks (only 25 possible keys) and frequency analysis.</p>
    </div>
  );

  const formulasContent = (
    <div className="flex flex-wrap gap-3">
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
        E(x) = (x + k) mod 26
      </div>
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
        D(x) = (x - k) mod 26
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
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Key (Shift) *</label>
            <input 
              type="number" 
              value={inputData.key}
              onChange={(e) => setInputData({...inputData, key: e.target.value})}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex-1">
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
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button 
            onClick={handleExecute}
            disabled={loading || !inputData.text}
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
      title="Caesar Cipher"
      category="Symmetric Cryptography"
      theoryContent={theoryContent}
      formulasContent={formulasContent}
      playgroundInputs={playgroundInputs}
      outputConsole={
        <OutputConsole 
          steps={executionData?.steps} 
          outputText={executionData?.output_text} 
          status={executionData ? 'success' : 'idle'} 
        />
      }
    />
  );
};

export default CaesarCipher;