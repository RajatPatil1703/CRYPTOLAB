import React, { useState, useEffect } from 'react';

const renderKeyBadges = (keyArr = [], accent = 'blue') => {
  if (!Array.isArray(keyArr) || keyArr.length === 0) return '—';
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
    purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300',
    green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {keyArr.map((val, idx) => (
        <span
          key={`k-${idx}`}
          className={`px-2 py-0.5 rounded border font-mono text-xs font-bold ${styles[accent] || styles.blue}`}
        >
          {val}
        </span>
      ))}
    </div>
  );
};

const TranspositionConsole = ({ data = null, status = 'idle' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = data?.execution_steps || [];
  const blocks = data?.blocks || [];
  const prep = data?.preparation || null;
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
      <div className="h-full min-h-[360px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
        Enter text and a permutation key (e.g., 2,4,1,3), then click Execute / Compute to inspect block rearrangements, inverse keys, and position mappings.
      </div>
    );
  }

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Console Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Transposition Output Console
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
            Previous Step
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
            disabled={currentStep === maxSteps}
            className="px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Next Step
          </button>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 px-1">
            Block {currentStep} / {maxSteps}
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
        {/* Final Output */}
        {data.output_text && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
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
            <div className="break-all text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">
              {data.output_text}
            </div>
            {data.operation === 'decrypt' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Note: Padding characters (such as trailing X) are intentionally preserved during decryption.
              </p>
            )}
          </div>
        )}

        {/* Key & Permutation Summary */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Permutation Key Summary
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Block Size: {data.block_size}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 space-y-1.5">
              <div className="text-gray-400">Normalized Key</div>
              {renderKeyBadges(data.normalized_key, 'blue')}
            </div>

            {data.inverse_key && (
              <div className="p-2.5 rounded bg-purple-50/50 dark:bg-purple-900/15 border border-purple-100 dark:border-purple-800 space-y-1.5">
                <div className="text-purple-700 dark:text-purple-400 font-medium">Inverse Key</div>
                {renderKeyBadges(data.inverse_key, 'purple')}
              </div>
            )}

            <div className="p-2.5 rounded bg-green-50/50 dark:bg-green-900/15 border border-green-100 dark:border-green-800 space-y-1.5">
              <div className="text-green-700 dark:text-green-400 font-medium">
                Effective Key ({data.operation})
              </div>
              {renderKeyBadges(data.effective_key, 'green')}
            </div>
          </div>

          {data.key_convention && (
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
              <strong>Key Convention:</strong> {data.key_convention}
            </p>
          )}
        </div>

        {/* Padding & Block Preparation */}
        {prep && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Block Preparation &amp; Padding
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  prep.padding_count > 0
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {prep.padding_count > 0
                  ? `${prep.padding_count} '${prep.padding_character || 'X'}' Added`
                  : 'No Padding Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400">Original Normalized: </span>
                <span className="font-bold text-gray-900 dark:text-gray-100 break-all">
                  {prep.normalized_text}
                </span>
              </div>
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400">Final Padded Text: </span>
                <span className="font-bold text-gray-900 dark:text-gray-100 break-all">
                  {prep.padded_text}
                </span>
              </div>
            </div>

            {prep.padding_count > 0 && (
              <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2.5">
                <strong>Padding applied:</strong> Added {prep.padding_count} padding character
                {prep.padding_count > 1 ? 's' : ''} ({prep.padding_character || 'X'}) so the text
                length is divisible by block size {data.block_size}.
              </p>
            )}

            {blocks.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Blocks (click to jump to step):
                </div>
                <div className="flex flex-wrap gap-2">
                  {blocks.map((blk, idx) => {
                    const isActive = currentStep - 1 === idx;
                    const isDone = idx < currentStep;
                    return (
                      <button
                        key={`blk-${idx}`}
                        type="button"
                        onClick={() => setCurrentStep(idx + 1)}
                        className={`px-3 py-1 rounded font-mono font-bold text-sm border transition-all ${
                          isActive
                            ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200 ring-2 ring-green-400/40'
                            : isDone
                            ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                            : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400'
                        }`}
                      >
                        [{blk}]
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step-by-Step Block Execution Trace */}
        <div className="space-y-3">
          {currentStep === 0 && maxSteps > 0 && (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              Click <strong>Next Step</strong> or select a block above to inspect character movement.
            </div>
          )}

          {steps.slice(0, currentStep).map((step, idx) => {
            const isLatest = idx === currentStep - 1;
            const blockNum = step.block_index ?? step.step ?? idx + 1;
            const inputBlock = step.input_block ?? step.block ?? blocks[idx] ?? '';
            const outputBlock = step.output_block ?? step.result_block ?? '';
            const mappings = step.mappings ?? step.position_mappings ?? step.movements ?? [];
            const effectiveKey = data.effective_key || [];

            return (
              <div
                key={`trans-step-${idx}`}
                className={`p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm space-y-3 ${
                  isLatest
                    ? 'border-green-400 dark:border-green-600 ring-1 ring-green-400/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                    Step {blockNum}: Block [{inputBlock}] → [{outputBlock}]
                  </span>
                </div>

                {/* Input & Output Character Strips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase text-gray-400">Input Block</div>
                    <div className="flex flex-wrap gap-1.5">
                      {String(inputBlock)
                        .split('')
                        .map((ch, cIdx) => (
                          <div
                            key={`in-${cIdx}`}
                            className="flex flex-col items-center px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                          >
                            <span className="text-[10px] font-mono text-gray-400">Pos {cIdx + 1}</span>
                            <span className="font-mono font-bold text-sm text-blue-900 dark:text-blue-200">
                              {ch}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase text-gray-400">Output Block</div>
                    <div className="flex flex-wrap gap-1.5">
                      {String(outputBlock)
                        .split('')
                        .map((ch, cIdx) => (
                          <div
                            key={`out-${cIdx}`}
                            className="flex flex-col items-center px-2.5 py-1 rounded bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                          >
                            <span className="text-[10px] font-mono text-gray-400">Pos {cIdx + 1}</span>
                            <span className="font-mono font-bold text-sm text-green-900 dark:text-green-200">
                              {ch}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Position Mapping & Character Movement */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700 font-mono text-xs">
                  {Array.isArray(mappings) && mappings.length > 0
                    ? mappings.map((m, mIdx) => {
                        if (typeof m === 'string') {
                          return (
                            <div
                              key={`map-${mIdx}`}
                              className="px-2.5 py-1.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {m}
                            </div>
                          );
                        }
                        const outPos = m.output_position ?? m.to_position ?? mIdx + 1;
                        const inPos = m.input_position ?? m.from_position ?? effectiveKey[mIdx];
                        const charVal = m.character ?? m.char ?? outputBlock[mIdx];
                        return (
                          <div
                            key={`map-${mIdx}`}
                            className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              Output position <strong className="text-green-600 dark:text-green-400">{outPos}</strong> ← Input position{' '}
                              <strong className="text-blue-600 dark:text-blue-400">{inPos}</strong>
                            </span>
                            {charVal && (
                              <span className="font-bold text-gray-900 dark:text-white">
                                '{charVal}'
                              </span>
                            )}
                          </div>
                        );
                      })
                    : effectiveKey.map((inPos, mIdx) => (
                        <div
                          key={`fallback-map-${mIdx}`}
                          className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            Output position <strong className="text-green-600 dark:text-green-400">{mIdx + 1}</strong> ← Input position{' '}
                            <strong className="text-blue-600 dark:text-blue-400">{inPos}</strong>
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            '{outputBlock[mIdx] ?? ''}'
                          </span>
                        </div>
                      ))}
                </div>

                {step.explanation && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 pt-1">
                    {step.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Educational Note */}
        {data.educational_note && (
          <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            <strong>Educational Note:</strong> {data.educational_note}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranspositionConsole;