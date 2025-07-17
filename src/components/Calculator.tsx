import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (value: string | { amount: string; description: string }) => void;
  initialValue?: string;
  initialDescription?: string;
  personName?: string;
  isDetailMode?: boolean;
}

const BUTTONS = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['0', 'C', '←', '+'],
];

function formatNumber(value: string) {
  if (!value) return '';
  return value.replace(/\d+(?=(?:[^\d]*\d)*$)/g, (num) => Number(num).toLocaleString());
}

function calculateExpression(expr: string): string {
  try {
    const sanitized = expr.replace(/,/g, '').replace(/×/g, '*').replace(/÷/g, '/');
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    if (isNaN(result) || !isFinite(result)) return '0';
    return String(Math.round(result));
  } catch {
    return '0';
  }
}

export const Calculator = ({
  isOpen,
  onClose,
  onCalculate,
  initialValue = '',
  initialDescription = '',
  personName,
  isDetailMode,
}: CalculatorProps) => {
  const [input, setInput] = useState(initialValue || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInput(initialValue || '');
      setDescription(initialDescription || '');
      setError('');
    }
  }, [isOpen, initialValue, initialDescription]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (document.activeElement && (document.activeElement as HTMLElement).tagName === 'INPUT') return;
      if (e.key >= '0' && e.key <= '9') {
        handleButtonClick(e.key);
        e.preventDefault();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleButtonClick(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
        e.preventDefault();
      } else if (e.key === 'Backspace') {
        handleButtonClick('←');
        e.preventDefault();
      } else if (e.key === 'Enter' || e.key === '=') {
        handleDecide();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      } else if (e.key === 'c' || e.key === 'C') {
        handleButtonClick('C');
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, input, description]);

  const handleButtonClick = (val: string) => {
    setError('');
    if (val === 'C') {
      setInput('');
    } else if (val === '←') {
      setInput((prev) => prev.slice(0, -1));
    } else if (['+', '-', '×', '÷'].includes(val)) {
      if (!input || /[+\-×÷]$/.test(input)) return;
      setInput((prev) => prev + val);
    } else {
      setInput((prev) => (prev === '0' ? val : prev + val));
    }
  };

  const handleEqual = () => {
    if (!input) return;
    const result = calculateExpression(input);
    setInput(result);
  };

  const handleDecide = () => {
    if (!input) {
      setError('金額を入力してください');
      return;
    }
    const result = calculateExpression(input);
    if (isDetailMode) {
      onCalculate({ amount: result, description });
    } else {
      onCalculate(result);
    }
    onClose();
  };

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg w-full max-w-xs shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="font-bold text-lg text-gray-900">
            {personName ? `${personName}さんの金額` : '金額入力'}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
        {/* Description input（ディスプレイの上） */}
        {isDetailMode && (
          <div className="px-4 pt-4">
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="項目名を入力"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base mb-2"
              autoFocus
            />
          </div>
        )}
        {/* Display */}
        <div className="p-4 bg-gray-50 min-h-[56px] text-right text-2xl font-mono select-none rounded-t">
          <div ref={inputRef} className="truncate">
            {input ? formatNumber(input) : <span className="text-gray-400">金額を入力</span>}
          </div>
        </div>
        {/* Error */}
        {error && <div className="text-red-500 text-xs px-4 pt-1">{error}</div>}
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 p-4">
          {BUTTONS.flat().map((btn, i) => (
            <button
              key={btn + i}
              className="py-3 rounded-md bg-gray-100 hover:bg-blue-100 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleButtonClick(btn)}
              tabIndex={0}
            >
              {btn === '←' ? <FontAwesomeIcon icon={faBackspace} /> : btn}
            </button>
          ))}
          <button
            className="col-span-2 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleEqual}
          >
            =
          </button>
          <button
            className="col-span-2 py-3 rounded-md bg-lime-500 hover:bg-lime-600 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-lime-500"
            onClick={handleDecide}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
} 