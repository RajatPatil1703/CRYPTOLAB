import React, { useState } from 'react';

const hexToBinary = (hex = '') => {
  const val = parseInt(hex, 16);
  if (Number.isNaN(val)) return '00000000';
  return val.toString(2).padStart(8, '0');
};

const hexToDecimal = (hex = '') => {
  const val = parseInt(hex, 16);
  return Number.isNaN(val) ? '—' : val;
};

const hexToPrintableAscii = (hex = '') => {
  const val = parseInt(hex, 16);
  if (Number.isNaN(val) || val < 32 || val > 126) return null;
  return String.fromCharCode(val);
};

const RC4XORVisualizer = ({ stepData, operation = 'encrypt' }) => {
  const [hoveredBit, setHoveredBit] = useState(null);

  if (!stepData) return null;

  const inputBin = hexToBinary(stepData.input_hex);
  const keyBin = hexToBinary(stepData.keystream_hex);
  const outputBin = hexToBinary(stepData.output_hex);

  const inputLabel = operation === 'decrypt' ? 'Ciphertext' : 'Plaintext';
  const outputLabel = operation === 'decrypt' ? 'Plaintext' : 'Ciphertext';

  const inputChar = hexToPrintableAscii(stepData.input_hex);
  const outputChar = hexToPrintableAscii(stepData.output_hex);

  const rows = [
    {
      label: inputLabel,
      hex: stepData.input_hex,
      dec: hexToDecimal(stepData.input_hex),
      char: inputChar,
      bits: inputBin.split(''),
      color: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Keystream',
      hex: stepData.keystream_hex,
      dec: hexToDecimal(stepData.keystream_hex),
      char: null,
      bits: keyBin.split(''),
      color: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
    },
    {
      label: outputLabel,
      hex: stepData.output_hex,
      dec: hexToDecimal(stepData.output_hex),
      char: outputChar,
      bits: outputBin.split(''),
      color: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Byte {stepData.step} — Bitwise XOR Breakdown
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          0x{stepData.input_hex} ⊕ 0x{stepData.keystream_hex} = 0x{stepData.output_hex}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[340px] space-y-2 font-mono text-xs">
          {/* Bit Index Header */}
          <div className="grid grid-cols-[110px_repeat(8,minmax(26px,1fr))_88px] gap-1 items-center text-[10px] text-gray-400 text-center">
            <div className="text-left">Operand</div>
            {[7, 6, 5, 4, 3, 2, 1, 0].map((bitPos, idx) => (
              <div key={bitPos} className={hoveredBit === idx ? 'text-green-600 font-bold' : ''}>
                b{bitPos}
              </div>
            ))}
            <div className="text-right">Hex / Dec</div>
          </div>

          {rows.map((row, rIdx) => (
            <React.Fragment key={row.label}>
              {rIdx === 2 && (
                <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 my-1" />
              )}
              <div className="grid grid-cols-[110px_repeat(8,minmax(26px,1fr))_88px] gap-1 items-center">
                <div className="font-sans font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  {rIdx === 1 && <span className="text-purple-500 font-bold">⊕</span>}
                  <span>{row.label}</span>
                </div>

                {row.bits.map((bit, bIdx) => (
                  <div
                    key={`${row.label}-${bIdx}`}
                    onMouseEnter={() => setHoveredBit(bIdx)}
                    onMouseLeave={() => setHoveredBit(null)}
                    className={`h-7 flex items-center justify-center rounded border font-bold cursor-default transition-transform ${
                      row.color
                    } ${hoveredBit === bIdx ? 'ring-2 ring-amber-400 scale-105' : ''}`}
                  >
                    {bit}
                  </div>
                ))}

                <div className="text-right text-[11px] text-gray-600 dark:text-gray-300">
                  <span className="font-bold">0x{row.hex}</span>{' '}
                  <span className="text-gray-400">({row.dec})</span>
                  {row.char && (
                    <span className="ml-1 px-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      '{row.char}'
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400">
        {hoveredBit !== null ? (
          <>
            Bit column <strong>b{7 - hoveredBit}</strong>:{' '}
            <span className="font-mono font-bold">
              {inputBin[hoveredBit]} ⊕ {keyBin[hoveredBit]} = {outputBin[hoveredBit]}
            </span>{' '}
            ({inputBin[hoveredBit] === keyBin[hoveredBit] ? 'same bits → 0' : 'different bits → 1'}).
          </>
        ) : (
          'Hover over any bit column to inspect the individual XOR gate rule (same → 0, different → 1).'
        )}
      </p>
    </div>
  );
};

export default RC4XORVisualizer;