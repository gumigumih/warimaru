import { Calculator } from '../Calculator';
import { useState } from 'react';

interface SimplePaymentInputProps {
  value: string;
  onChange: (value: string) => void;
  savePayment: (personId: string, paymentId: string, amount: number | string, description?: string) => void;
  personId: string;
  personName?: string;
}

export const SimplePaymentInput = ({
  value,
  onChange,
  savePayment,
  personId,
  personName,
}: SimplePaymentInputProps) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleCalculatorResult = (result: string) => {
    onChange(result);
    const amount = Number(result.replace(/,/g, '')) || 0;
    savePayment(personId, '', amount);
  };

  return (
    <div className="relative flex-1 min-w-0">
      <div
        className="w-full rounded-md bg-white/80 p-2 pr-8 border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsCalculatorOpen(true)}
        title="クリックして電卓を開く"
      >
        <div className="text-left">
          {value ? (
            <span className="text-gray-900">{value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          ) : (
            <span className="text-gray-400">金額</span>
          )}
        </div>
      </div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
      <Calculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onCalculate={handleCalculatorResult}
        initialValue={value}
        personName={personName}
        isDetailMode={false}
      />
    </div>
  );
}; 