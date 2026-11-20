import React, { useState, useEffect } from 'react';
import TerminalEmpty from './TerminalEmpty.jsx';

const OutputConsole = ({ steps = [], outputText, status = 'idle' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const maxSteps = steps ? steps.length : 0;

  useEffect(() => {
    setCurrentStep(maxSteps);
  }, [steps, maxSteps]);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
    }
  };

  if (status === 'idle') {
    return (
      <TerminalEmpty />
    );
  }

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Output Console
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
          Computation Successful
        </span>
      </div>

      {maxSteps > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-850 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          <button 
            onClick={() => setCurrentStep(0)}
            disabled={currentStep === 0}
            className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-40"
          >
            Reset Steps
          </button>
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
            disabled={currentStep === maxSteps}
            className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-40"
          >
            Next
          </button>
          <button 
            onClick={() => setCurrentStep(maxSteps)}
            disabled={currentStep === maxSteps}
            className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 rounded hover:bg-green-200 disabled:opacity-40 ml-auto"
          >
            Execute All
          </button>
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm flex gap-4">
        <div className="flex flex-col text-right text-gray-400 select-none">
          {steps.slice(0, currentStep).map((_, i) => (
            <span key={`line-${i}`}>{i + 1}</span>
          ))}
        </div>
        
        <div className="flex-1 text-gray-800 dark:text-gray-300 space-y-1">
          {steps.slice(0, currentStep).map((step, index) => (
            <div key={index} className="flex flex-wrap items-baseline gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {step.character}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-xs text-gray-500">
                [pos: {step.original_position}, key: {step.normalized_key}]
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-blue-600 dark:text-blue-400">
                {step.formula}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                new_pos: {step.new_position}
              </span>
            </div>
          ))}
          
          {currentStep === maxSteps && outputText && (
            <div className="mt-4 p-3 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded relative group">
              <div className="font-semibold text-green-800 dark:text-green-400 mb-1">Final Result:</div>
              <div className="break-all text-lg">{outputText}</div>
              <button 
                onClick={handleCopy}
                className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputConsole;
