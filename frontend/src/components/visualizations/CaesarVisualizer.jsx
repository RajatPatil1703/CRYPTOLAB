import React, { useState, useEffect } from 'react';

const CaesarVisualizer = ({ data }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Assuming the backend contract returns: { result: "...", trace: [{ char, shifted_char, formula, index }, ...] }
  const trace = data.trace || [];
  const maxSteps = trace.length;

  useEffect(() => {
    setCurrentStep(0); // Reset step counter on new execution data
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.result);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium">Output Console</h3>
        <button onClick={handleCopy} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Copy Output
        </button>
      </div>
      
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded font-mono text-lg break-all">
        {data.result}
      </div>

      {maxSteps > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Execution Trace</h3>
          
          {/* Playback Controls */}
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
              disabled={currentStep === maxSteps}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
            <button 
              onClick={() => setCurrentStep(maxSteps)}
              disabled={currentStep === maxSteps}
              className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded disabled:opacity-50 text-sm ml-auto"
            >
              Execute All
            </button>
          </div>

          {/* Trace Visualization */}
          <div className="space-y-2">
            {trace.slice(0, currentStep).map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-700 animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded font-mono font-bold">
                  {step.char}
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded font-mono font-bold text-blue-700 dark:text-blue-300">
                  {step.shifted_char}
                </div>
                <div className="ml-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                  Backend operation: {step.formula}
                </div>
              </div>
            ))}
            {currentStep === 0 && (
              <div className="text-gray-500 text-sm italic">Click 'Next' to begin step-by-step visualization.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaesarVisualizer;