import React, { useState, useEffect } from 'react';
import RC4XORVisualizer from './RC4XORVisualizer';

const RC4Console = ({ data = null, requestMeta = null, status = 'idle' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const steps = data?.execution_steps || [];
  const maxSteps = steps.length;
  const keystreamHex = steps.map((s) => s.keystream_hex).join('');

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(maxSteps > 0 ? 1 : 0);
    setCopiedField(null);
  }, [data, maxSteps]);

  useEffect(() => {
    if (!isPlaying || maxSteps === 0) return undefined;
    if (currentStep >= maxSteps) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps) {
          setIsPlaying(false);
          return maxSteps;
        }
        return prev + 1;
      });
    }, 850);
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, maxSteps]);

  const handleCopy = (field, value) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1600);
  };

  if (status === 'idle' || !data) {
    return (
      <div className="h-full min-h-[380px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
        Enter a message and secret key, then click Execute / Compute to inspect the RC4 keystream, byte-by-byte trace, and binary XOR breakdown.
      </div>
    );
  }

  const activeStep = currentStep > 0 && currentStep <= maxSteps ? steps[currentStep - 1] : null;
  const isDecrypt = data.operation === 'decrypt';

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Console Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          RC4 Output Console
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded">
          Computation Successful
        </span>
      </div>

      {/* Step Navigation Bar */}
      {maxSteps > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
            }}
            disabled={currentStep <= 1 && !isPlaying}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(Math.max(1, currentStep - 1));
            }}
            disabled={currentStep <= 1}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentStep >= maxSteps) {
                setCurrentStep(1);
                setIsPlaying(true);
              } else {
                setIsPlaying((prev) => !prev);
              }
            }}
            className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded hover:bg-blue-200"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(Math.min(maxSteps, currentStep + 1));
            }}
            disabled={currentStep >= maxSteps}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 px-1">
            Step {currentStep} / {maxSteps}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(maxSteps);
            }}
            disabled={currentStep === maxSteps}
            className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 rounded hover:bg-green-200 disabled:opacity-40 ml-auto"
          >
            Show All
          </button>
        </div>
      )}

      {/* Scrollable Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Final Result Card */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-sm text-green-800 dark:text-green-400">
              {isDecrypt ? 'Decrypted Plaintext' : 'Ciphertext'} ({data.output_encoding || 'hex'})
            </div>
            <button
              type="button"
              onClick={() => handleCopy('output', data.output_text)}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              {copiedField === 'output' ? 'Copied!' : 'Copy Output'}
            </button>
          </div>
          <div className="break-all text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">
            {data.output_text}
          </div>
          {data.output_hex && data.output_hex !== data.output_text && (
            <div className="pt-2 border-t border-green-200/70 dark:border-green-800/60 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="text-gray-600 dark:text-gray-300 break-all">
                Hex: <strong>{data.output_hex}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleCopy('hex', data.output_hex)}
                className="text-green-700 dark:text-green-400 hover:underline shrink-0"
              >
                {copiedField === 'hex' ? 'Copied!' : 'Copy Hex'}
              </button>
            </div>
          )}
        </div>

        {/* Summary Result Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          {requestMeta?.text && (
            <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Input</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={requestMeta.text}>
                {requestMeta.text}
              </div>
            </div>
          )}
          {requestMeta?.key && (
            <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Secret Key</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={requestMeta.key}>
                {requestMeta.key}
              </div>
            </div>
          )}
          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-400 mb-0.5">Byte Count</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{data.byte_count} bytes</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-400 mb-0.5">Encoding</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 uppercase">
              {data.output_encoding || '—'}
            </div>
          </div>
        </div>

        {/* Generated Keystream Card (derived directly from backend execution_steps) */}
        {keystreamHex && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                PRGA Keystream (Hex)
              </span>
              <button
                type="button"
                onClick={() => handleCopy('keystream', keystreamHex)}
                className="text-xs text-purple-700 dark:text-purple-400 hover:underline"
              >
                {copiedField === 'keystream' ? 'Copied!' : 'Copy Keystream'}
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
              {keystreamHex}
            </div>
          </div>
        )}

        {/* Truncation Notice */}
        {data.steps_truncated && (
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            Execution trace was truncated by the backend for long inputs. Showing the first {maxSteps} bytes.
          </div>
        )}

        {/* Interactive Clickable Byte Strip */}
        {maxSteps > 0 && (
          <div className="bg-white dark:bg-gray-800 p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Byte-by-Byte Stream (Click any byte to inspect XOR)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {steps.map((s, idx) => {
                const isSelected = currentStep - 1 === idx;
                const isVisited = idx < currentStep;
                return (
                  <button
                    key={`byte-${s.step ?? idx}`}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(idx + 1);
                    }}
                    className={`px-2.5 py-1.5 rounded border font-mono text-xs transition-all text-center ${
                      isSelected
                        ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200 ring-2 ring-green-400/40'
                        : isVisited
                        ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                        : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">#{s.step}</div>
                    <div className="font-bold">{s.output_hex}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Step Bitwise XOR Visualizer */}
        {activeStep && <RC4XORVisualizer stepData={activeStep} operation={data.operation} />}

        {/* Step-by-Step Trace Table */}
        {maxSteps > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-3.5 py-2 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Execution Trace ({currentStep} of {maxSteps} shown)
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Step</th>
                    <th className="px-3 py-2">Input (Hex)</th>
                    <th className="px-3 py-2">Keystream (Hex)</th>
                    <th className="px-3 py-2">XOR Operation</th>
                    <th className="px-3 py-2">Output (Hex)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {steps.slice(0, currentStep).map((s, idx) => {
                    const isActive = idx === currentStep - 1;
                    return (
                      <tr
                        key={`row-${s.step ?? idx}`}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStep(idx + 1);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-green-50/80 dark:bg-green-900/25 font-semibold'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-500">#{s.step}</td>
                        <td className="px-3 py-2 text-blue-700 dark:text-blue-400">0x{s.input_hex}</td>
                        <td className="px-3 py-2 text-purple-700 dark:text-purple-400">0x{s.keystream_hex}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                          0x{s.input_hex} ⊕ 0x{s.keystream_hex}
                        </td>
                        <td className="px-3 py-2 text-green-700 dark:text-green-400 font-bold">
                          0x{s.output_hex}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Educational Note from Backend */}
        {data.educational_note && (
          <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            <strong>Educational Note:</strong> {data.educational_note}
          </div>
        )}
      </div>
    </div>
  );
};

export default RC4Console;