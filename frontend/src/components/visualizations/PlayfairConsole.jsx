import React, { useState, useEffect } from 'react';
import PlayfairMatrix from './PlayfairMatrix';

const formatPosition = (pos) => {
  if (!pos) return '—';
  if (typeof pos === 'string') return pos;
  if (Array.isArray(pos) && pos.length >= 2) {
    return `Row ${pos[0]}, Column ${pos[1]}`;
  }
  if (typeof pos === 'object') {
    const row = pos.row ?? pos.r;
    const col = pos.column ?? pos.col ?? pos.c;
    if (row !== undefined && col !== undefined) {
      return `Row ${row}, Column ${col}`;
    }
  }
  return String(pos);
};

const PlayfairConsole = ({ data = null, status = 'idle' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = data?.execution_steps || [];
  const prepSteps = data?.preparation_steps || [];
  const digraphs = data?.digraphs || [];
  const matrix = data?.matrix || [];
  const maxSteps = steps.length;

  useEffect(() => {
    setCurrentStep(maxSteps);
    setCopied(false);
  }, [data, maxSteps]);

  const handleCopy = () => {
    if (data?.output_text) {
      navigator.clipboard.writeText(data.output_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (status === 'idle' || !data) {
    return (
      <div className="h-full min-h-[340px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
        Configure your plaintext/ciphertext and keyword, then click Execute / Compute to inspect the 5×5 matrix, digraphs, and step-by-step trace.
      </div>
    );
  }

  const activeStep = currentStep > 0 && currentStep <= maxSteps ? steps[currentStep - 1] : null;

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Console Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Playfair Output Console
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded">
          Computation Successful
        </span>
      </div>

      {/* Playback Controls */}
      {maxSteps > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentStep(0)}
            disabled={currentStep === 0}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Reset Steps
          </button>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
            disabled={currentStep === maxSteps}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 px-1">
            Step {currentStep} / {maxSteps}
          </span>
          <button
            onClick={() => setCurrentStep(maxSteps)}
            disabled={currentStep === maxSteps}
            className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 rounded hover:bg-green-200 disabled:opacity-40 ml-auto"
          >
            Execute All
          </button>
        </div>
      )}

      {/* Scrollable Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {/* Phase 2: Interactive 5x5 Matrix */}
        <PlayfairMatrix matrix={matrix} activeStep={activeStep} />

        {/* Phase 3: Plaintext Preprocessing */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Preprocessing &amp; Normalization
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              I &amp; J share a single matrix cell
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Input Text</div>
              <div className="text-gray-800 dark:text-gray-200 break-all">{data.input_text}</div>
            </div>
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Normalized Text</div>
              <div className="text-gray-800 dark:text-gray-200 break-all">{data.normalized_text}</div>
            </div>
          </div>

          {prepSteps.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Digraph Preparation Steps:
              </div>
              <ul className="space-y-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                {prepSteps.map((pStep, idx) => (
                  <li
                    key={`prep-${idx}`}
                    className="px-2.5 py-1.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                  >
                    {typeof pStep === 'string' ? (
                      pStep
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {pStep.action && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                            {pStep.action}
                          </span>
                        )}
                        {pStep.pair && <span className="font-bold">{pStep.pair}</span>}
                        <span>{pStep.explanation || pStep.description || pStep.detail || JSON.stringify(pStep)}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Phase 4: Digraph Visualization */}
        {digraphs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Digraph Pairs ({data.total_digraphs ?? digraphs.length})
              </div>
              <span className="text-xs text-gray-400">Click any pair to jump to step</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {digraphs.map((pair, idx) => {
                const isActive = currentStep - 1 === idx;
                const isProcessed = idx < currentStep;
                return (
                  <button
                    key={`digraph-${idx}`}
                    type="button"
                    onClick={() => setCurrentStep(idx + 1)}
                    className={`px-3 py-1.5 rounded-md font-mono font-bold text-sm border transition-all ${
                      isActive
                        ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200 ring-2 ring-green-400/40'
                        : isProcessed
                        ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                        : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {pair}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 5: Execution Trace Steps */}
        <div className="space-y-3 font-mono text-sm">
          {currentStep === 0 && maxSteps > 0 && (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              Click <strong>Next</strong> or select a digraph above to step through the transformation.
            </div>
          )}

          {steps.slice(0, currentStep).map((step, idx) => {
            const isLatest = idx === currentStep - 1;
            const stepNum = step.step ?? step.step_number ?? idx + 1;
            const inputPair = step.input_pair ?? step.pair ?? '—';
            const outputPair = step.output_pair ?? step.result_pair ?? '—';
            const firstPos = formatPosition(step.first_position ?? step.pos1 ?? step.positions?.[0]);
            const secondPos = formatPosition(step.second_position ?? step.pos2 ?? step.positions?.[1]);
            const rule = step.rule ?? step.applied_rule ?? '—';
            const explanation = step.explanation ?? step.description ?? '';

            return (
              <div
                key={`exec-${idx}`}
                className={`p-3.5 bg-white dark:bg-gray-800 rounded-lg border shadow-sm transition-colors ${
                  isLatest
                    ? 'border-green-400 dark:border-green-600 ring-1 ring-green-400/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white">Step {stepNum}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Rule: {rule}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Input pair: </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{inputPair}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Output pair: </span>
                    <span className="font-bold text-green-600 dark:text-green-400">{outputPair}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">First position: </span>
                    <span className="text-gray-800 dark:text-gray-200">{firstPos}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Second position: </span>
                    <span className="text-gray-800 dark:text-gray-200">{secondPos}</span>
                  </div>
                </div>

                {explanation && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 font-sans">
                    {explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phase 7: Final Output Block */}
        {currentStep === maxSteps && data.output_text && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg relative">
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-semibold text-sm text-green-800 dark:text-green-400">
                Final {data.operation === 'decrypt' ? 'Plaintext' : 'Ciphertext'}:
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Output'}
              </button>
            </div>
            <div className="break-all text-lg font-mono font-bold text-gray-900 dark:text-white">
              {data.output_text}
            </div>
            {data.operation === 'decrypt' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Note: Playfair decryption preserves filler/padding characters (such as trailing X) as returned by the backend.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairConsole;