import React, { useState, useEffect } from 'react';
import TerminalEmpty from './TerminalEmpty.jsx';

const MonoalphabeticConsole = ({ steps = [], outputText, status = 'idle', cipherKey = '', operation = 'encrypt' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const maxSteps = steps ? steps.length : 0;

  // The standard alphabet
  const plainAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  // The user's provided key alphabet (fallback to standard if empty)
  const keyArray = (cipherKey || "ABCDEFGHIJKLMNOPQRSTUVWXYZ").toUpperCase().split("");

  useEffect(() => {
    setCurrentStep(maxSteps);
  }, [steps, maxSteps]);

  const handleCopy = () => {
    if (outputText) navigator.clipboard.writeText(outputText);
  };

  if (status === 'idle') {
    return (
      <TerminalEmpty />
    );
  }

  // Determine the active character mapping for the current step
  const activeStep = currentStep > 0 && currentStep <= maxSteps ? steps[currentStep - 1] : null;

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Monoalphabetic Execution Trace
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
          Computation Successful
        </span>
      </div>

      {/* Playback Controls */}
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

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        
        {/* Visual Key Mapping Component */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Active Key Mapping</div>
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
            {plainAlphabet.map((plainChar, index) => {
              const cipherChar = keyArray[index] || "?";
              
              // Check if this specific column should be highlighted based on the current trace step
              let isHighlighted = false;
              if (activeStep && activeStep.transformed) {
                if (operation === 'encrypt' && activeStep.input_character.toUpperCase() === plainChar) isHighlighted = true;
                if (operation === 'decrypt' && activeStep.input_character.toUpperCase() === cipherChar) isHighlighted = true;
              }

              return (
                <div 
                  key={plainChar} 
                  className={`flex flex-col items-center min-w-[28px] p-1 border rounded transition-colors ${
                    isHighlighted 
                      ? 'bg-green-100 border-green-500 dark:bg-green-900/50 dark:border-green-400' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{plainChar}</span>
                  <span className="text-gray-400 text-[10px] my-0.5">↓</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{cipherChar}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Backend Trace Output */}
        <div className="space-y-3 font-mono text-sm">
          {steps.slice(0, currentStep).map((step, index) => (
            <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
              <div className="font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                Step {index + 1}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div><span className="text-gray-500 mr-2">Position:</span>{step.position}</div>
                <div><span className="text-gray-500 mr-2">Input:</span><span className="font-bold text-gray-900 dark:text-gray-100">{step.input_character}</span></div>
                <div>
                  <span className="text-gray-500 mr-2">Mapping:</span>
                  {step.transformed ? (
                    <span className="text-blue-600 dark:text-blue-400">{step.mapping}</span>
                  ) : (
                    <span className="text-gray-400 italic">None (Preserved)</span>
                  )}
                </div>
                <div><span className="text-gray-500 mr-2">Output:</span><span className="font-bold text-green-600 dark:text-green-400">{step.output_character}</span></div>
              </div>
            </div>
          ))}
          
          {/* Final Result Block */}
          {currentStep === maxSteps && outputText && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded relative group">
              <div className="font-semibold text-green-800 dark:text-green-400 mb-2">Final Result:</div>
              <div className="break-all text-lg font-sans text-gray-900 dark:text-white">{outputText}</div>
              <button 
                onClick={handleCopy}
                className="absolute right-3 top-3 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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

export default MonoalphabeticConsole;
