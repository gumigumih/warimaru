import type { RefObject } from 'react';

interface CalculatorDisplayProps {
  value: string;
  error?: string;
  inputRef?: RefObject<HTMLDivElement | null>;
}

export const CalculatorDisplay = ({ value, error, inputRef }: CalculatorDisplayProps) => (
  <>
    <div className="p-4 bg-gray-50 min-h-[56px] text-right text-2xl font-mono select-none rounded-t">
      <div ref={inputRef} className="truncate">
        {value ? value : <span className="text-gray-400">金額を入力</span>}
      </div>
    </div>
    {error && <div className="text-red-500 text-xs px-4 pt-1">{error}</div>}
  </>
); 