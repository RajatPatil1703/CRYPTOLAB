import React from 'react';

const AlgorithmLayout = ({ title, leftContent, rightContent }) => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* LEFT PANEL: Theory & Concepts */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          {leftContent}
        </div>
      </div>

      {/* RIGHT PANEL: Interactive Playground */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmLayout;