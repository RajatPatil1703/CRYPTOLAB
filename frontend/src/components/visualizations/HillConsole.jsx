import React, { useState, useEffect } from 'react';
import MatrixDisplay from './MatrixDisplay';

const formatRowCalculation = (rowCalc, rowIdx) => {
  if (typeof rowCalc === 'string') {
    return (
      <div key={`rc-${rowIdx}`} className="text-xs font-mono text-gray-700 dark:text-gray-300">
        Row {rowIdx + 1}: {rowCalc}
      </div>
    );
  }

  const terms = rowCalc.terms || rowCalc.multiplications || rowCalc.products;
  const expr = rowCalc.expression || rowCalc.formula;
  const sum = rowCalc.sum ?? rowCalc.row_sum ?? rowCalc.dot_product;
  const mod = rowCalc.mod_26 ?? rowCalc.modulo ?? rowCalc.mod_result ?? rowCalc.result;
  const outChar = rowCalc.output_char ?? rowCalc.character ?? rowCalc.output_character;

  return (
    <div
      key={`rc-${rowIdx}`}
      className="p-2 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-xs font-mono space-y-0.5"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-semibold text-gray-500">Row {rowIdx + 1}:</span>
        {expr ? (
          <span className="text-gray-800 dark:text-gray-200">{expr}</span>
        ) : Array.isArray(terms) ? (
          <span className="text-gray-800 dark:text-gray-200">{terms.join(' + ')}</span>
        ) : null}
        {sum !== undefined && (
          <span className="text-blue-600 dark:text-blue-400 font-semibold">= {sum}</span>
        )}
        {mod !== undefined && (
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            → {sum !== undefined ? `${sum} mod 26` : 'mod 26'} = {mod}
          </span>
        )}
        {outChar && (
          <span className="text-green-600 dark:text-green-400 font-bold">→ '{outChar}'</span>
        )}
      </div>
    </div>
  );
};

const HillConsole = ({ data = null, status = 'idle' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = data?.execution_steps || [];
  const blocks = data?.blocks || [];
  const prep = data?.preparation || null;
  const inverse = data?.inverse_details || null;
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
      <div className="h-full min-h-[380px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
        Enter text and a valid invertible 2×2 or 3×3 key matrix, then click Execute / Compute to view matrix arithmetic, modular inverse steps, and block traces.
      </div>
    );
  }

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Console Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Hill Cipher Output Console
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded">
          Computation Successful
        </span>
      </div>

      {/* Step Controls */}
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
        {/* Prominent Final Result */}
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
                Note: Padding characters (such as trailing X) are intentionally retained during decryption because X may belong to the original plaintext.
              </p>
            )}
          </div>
        )}

        {/* Section D: Results Summary */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Execution Summary
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Original Input</div>
              <div className="text-gray-900 dark:text-gray-100 break-all font-semibold">{data.input_text}</div>
            </div>
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Normalized Text</div>
              <div className="text-gray-900 dark:text-gray-100 break-all font-semibold">
                {prep?.normalized_text ?? '—'}
              </div>
            </div>
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Block Size</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold">
                {data.block_size} ({data.block_size}×{data.block_size})
              </div>
            </div>
            <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
              <div className="text-gray-400 mb-0.5">Determinant</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold">{data.determinant}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <MatrixDisplay matrix={data.normalized_key_matrix} label="Key Matrix (K)" accent="blue" />
            <MatrixDisplay
              matrix={data.effective_matrix}
              label={data.operation === 'decrypt' ? 'Effective Matrix (K⁻¹)' : 'Effective Matrix (K)'}
              accent="green"
            />
          </div>
        </div>

        {/* Section F: Padding Visualization */}
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
                  : 'No Padding Needed'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400">Original Normalized: </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{prep.normalized_text}</span>
              </div>
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400">Padded Text: </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{prep.padded_text}</span>
              </div>
            </div>

            {prep.padding_count > 0 && (
              <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2.5">
                <strong>Why padding was applied:</strong> The selected {data.block_size}×{data.block_size} key
                matrix requires blocks of length {data.block_size}. Since "{prep.normalized_text}" has length{' '}
                {prep.normalized_text?.length}, {prep.padding_count} filler character
                {prep.padding_count > 1 ? 's' : ''} ({prep.padding_character || 'X'}) was appended to form{' '}
                <span className="font-mono font-bold">{prep.padded_text}</span>.
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

        {/* Decryption Modular Inverse Details */}
        {inverse && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Decryption Modular Inverse Calculation (K⁻¹ mod 26)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <div className="text-gray-500 dark:text-gray-400">Original det(K)</div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  {inverse.original_determinant ?? inverse.determinant ?? data.determinant}
                </div>
              </div>
              <div className="p-2.5 rounded bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <div className="text-gray-500 dark:text-gray-400">det(K) mod 26</div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  {inverse.determinant_mod_26 ?? inverse.det_mod_26 ?? '—'}
                </div>
              </div>
              <div className="p-2.5 rounded bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <div className="text-gray-500 dark:text-gray-400">det(K)⁻¹ mod 26</div>
                <div className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                  {inverse.determinant_inverse_mod_26 ??
                    inverse.determinant_inverse ??
                    inverse.det_inverse_mod_26 ??
                    '—'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-around gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              {inverse.cofactor_matrix && (
                <MatrixDisplay matrix={inverse.cofactor_matrix} label="Cofactor Matrix" accent="amber" compact />
              )}
              {inverse.adjugate_matrix && (
                <MatrixDisplay matrix={inverse.adjugate_matrix} label="Adjugate Matrix" accent="purple" compact />
              )}
              {inverse.inverse_matrix && (
                <MatrixDisplay matrix={inverse.inverse_matrix} label="Inverse Matrix (K⁻¹)" accent="green" compact />
              )}
            </div>
          </div>
        )}

        {/* Section E: Step-by-Step Block Execution */}
        <div className="space-y-3">
          {currentStep === 0 && maxSteps > 0 && (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              Click <strong>Next Step</strong> or select a block above to inspect the matrix multiplication trace.
            </div>
          )}

          {steps.slice(0, currentStep).map((step, idx) => {
            const isLatest = idx === currentStep - 1;
            const blockNum = step.block_index ?? step.step ?? idx + 1;
            const inputBlock = step.input_block ?? step.block ?? blocks[idx] ?? '—';
            const outputBlock = step.output_block ?? step.result_block ?? '—';
            const inputVec = step.input_vector ?? step.numeric_vector ?? step.plaintext_vector ?? [];
            const rawVec = step.raw_vector ?? step.product_vector ?? step.row_sums ?? [];
            const outputVec = step.output_vector ?? step.mod_vector ?? step.ciphertext_vector ?? [];
            const rowCalcs = step.row_calculations ?? step.calculations ?? step.rows ?? [];

            return (
              <div
                key={`hill-step-${idx}`}
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
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {inputBlock.split('').map((ch, i) => `${ch}=${inputVec[i] ?? '?'}`).join(', ')}
                  </span>
                </div>

                {/* Visual Matrix × Vector Multiplication */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  <MatrixDisplay matrix={data.effective_matrix} label="Matrix" accent="blue" compact />
                  <span className="font-mono font-bold text-gray-400 text-lg">×</span>
                  {inputVec.length > 0 && (
                    <MatrixDisplay matrix={inputVec} label="Input Vec" accent="gray" compact />
                  )}
                  {rawVec.length > 0 && (
                    <>
                      <span className="font-mono font-bold text-gray-400 text-lg">=</span>
                      <MatrixDisplay matrix={rawVec} label="Row Sums" accent="amber" compact />
                    </>
                  )}
                  {outputVec.length > 0 && (
                    <>
                      <span className="font-mono font-bold text-gray-400 text-xs">mod 26 =</span>
                      <MatrixDisplay matrix={outputVec} label="Output Vec" accent="green" compact />
                    </>
                  )}
                </div>

                {/* Detailed Row-by-Row Arithmetic */}
                {Array.isArray(rowCalcs) && rowCalcs.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {rowCalcs.map((rc, rIdx) => formatRowCalculation(rc, rIdx))}
                  </div>
                )}

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

export default HillConsole;