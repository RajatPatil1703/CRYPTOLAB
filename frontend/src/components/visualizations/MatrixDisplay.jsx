import React from 'react';

const MatrixDisplay = ({ matrix = [], label = '', accent = 'gray', compact = false }) => {
  if (!Array.isArray(matrix) || matrix.length === 0) return null;

  const isVector = !Array.isArray(matrix[0]);
  const rows = isVector ? matrix.map((val) => [val]) : matrix;
  const colCount = rows[0]?.length || 1;

  const accentClasses = {
    gray: 'border-gray-400 dark:border-gray-500 text-gray-900 dark:text-gray-100',
    blue: 'border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-200',
    green: 'border-green-500 dark:border-green-400 text-green-900 dark:text-green-200',
    purple: 'border-purple-500 dark:border-purple-400 text-purple-900 dark:text-purple-200',
    amber: 'border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200',
  };

  const borderColor = accentClasses[accent] || accentClasses.gray;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
      <div
        className={`inline-grid border-l-2 border-r-2 rounded-sm px-2 py-1.5 font-mono font-semibold ${borderColor} ${
          compact ? 'gap-1 text-xs' : 'gap-2 text-sm'
        }`}
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(${compact ? '1.75rem' : '2.25rem'}, auto))` }}
      >
        {rows.map((row, rIdx) =>
          row.map((val, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="text-center px-1 py-0.5 rounded bg-gray-100/70 dark:bg-gray-800/80"
            >
              {val}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixDisplay;