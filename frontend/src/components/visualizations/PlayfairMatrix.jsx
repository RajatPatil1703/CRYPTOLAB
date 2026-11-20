import React from 'react';

const normalizeCellMatch = (cellValue, targetChar) => {
  if (!cellValue || !targetChar) return false;
  const cell = String(cellValue).toUpperCase();
  const target = String(targetChar).toUpperCase();
  if (cell === target) return true;
  if ((cell === 'I/J' || cell === 'I' || cell === 'J') && (target === 'I' || target === 'J')) {
    return true;
  }
  return false;
};

const findCharCoords = (matrix, char) => {
  if (!Array.isArray(matrix) || !char) return null;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (normalizeCellMatch(matrix[r][c], char)) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

const getRuleStyle = (rule = '') => {
  const normalized = String(rule).toLowerCase();
  if (normalized.includes('row')) {
    return {
      label: 'Same Row Rule',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      band: 'bg-amber-50/80 dark:bg-amber-900/20',
    };
  }
  if (normalized.includes('col')) {
    return {
      label: 'Same Column Rule',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      band: 'bg-purple-50/80 dark:bg-purple-900/20',
    };
  }
  if (normalized.includes('rect')) {
    return {
      label: 'Rectangle Rule',
      badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300 dark:border-sky-700',
      band: 'bg-sky-50/80 dark:bg-sky-900/20',
    };
  }
  return {
    label: rule || 'Active Step',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    band: '',
  };
};

const PlayfairMatrix = ({ matrix = [], activeStep = null }) => {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return null;
  }

  const inputPair = activeStep?.input_pair || activeStep?.pair || '';
  const outputPair = activeStep?.output_pair || activeStep?.result_pair || '';
  const rule = activeStep?.rule || activeStep?.applied_rule || '';

  const inChar1 = inputPair[0] || null;
  const inChar2 = inputPair[1] || null;
  const outChar1 = outputPair[0] || null;
  const outChar2 = outputPair[1] || null;

  const pos1 = findCharCoords(matrix, inChar1);
  const pos2 = findCharCoords(matrix, inChar2);
  const ruleStyle = getRuleStyle(rule);

  const isInRuleRegion = (r, c) => {
    if (!pos1 || !pos2) return false;
    const lowerRule = String(rule).toLowerCase();

    if (lowerRule.includes('row') && pos1.row === pos2.row) {
      return r === pos1.row;
    }
    if (lowerRule.includes('col') && pos1.col === pos2.col) {
      return c === pos1.col;
    }
    if (lowerRule.includes('rect')) {
      const minR = Math.min(pos1.row, pos2.row);
      const maxR = Math.max(pos1.row, pos2.row);
      const minC = Math.min(pos1.col, pos2.col);
      const maxC = Math.max(pos1.col, pos2.col);
      return r >= minR && r <= maxR && c >= minC && c <= maxC;
    }
    return false;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          5×5 Playfair Key Matrix
        </div>
        {activeStep && rule && (
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${ruleStyle.badge}`}>
            {ruleStyle.label}
          </span>
        )}
      </div>

      {/* Column Headers */}
      <div className="max-w-xs mx-auto">
        <div className="grid grid-cols-6 gap-1.5 mb-1 text-center text-[11px] font-mono text-gray-400">
          <div />
          {[1, 2, 3, 4, 5].map((colNum) => (
            <div key={`col-${colNum}`}>C{colNum}</div>
          ))}
        </div>

        {/* 5x5 Grid */}
        <div className="space-y-1.5">
          {matrix.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="grid grid-cols-6 gap-1.5 items-center">
              <div className="text-center text-[11px] font-mono text-gray-400">R{rIdx + 1}</div>
              {row.map((cell, cIdx) => {
                const isInput = normalizeCellMatch(cell, inChar1) || normalizeCellMatch(cell, inChar2);
                const isOutput = normalizeCellMatch(cell, outChar1) || normalizeCellMatch(cell, outChar2);
                const inRegion = isInRuleRegion(rIdx, cIdx);

                let cellClasses =
                  'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';

                if (inRegion) {
                  cellClasses = `${ruleStyle.band} border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white`;
                }
                if (isInput && isOutput) {
                  cellClasses =
                    'bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/60 dark:to-green-900/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/50';
                } else if (isInput) {
                  cellClasses =
                    'bg-blue-100 dark:bg-blue-900/60 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-400/40';
                } else if (isOutput) {
                  cellClasses =
                    'bg-green-100 dark:bg-green-900/60 border-green-500 text-green-900 dark:text-green-200 ring-2 ring-green-400/40';
                }

                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    className={`h-11 flex items-center justify-center rounded-md border font-mono font-bold text-sm transition-all duration-200 ${cellClasses}`}
                    title={`Row ${rIdx + 1}, Column ${cIdx + 1}: ${cell}`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-500 dark:bg-blue-900/60" />
          Input Pair
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-500 dark:bg-green-900/60" />
          Output Pair
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-100 border border-sky-400 dark:bg-sky-900/40" />
          Rule Region
        </span>
      </div>
    </div>
  );
};

export default PlayfairMatrix;