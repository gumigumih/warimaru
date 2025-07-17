import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { AppDispatch } from '../../store/store';
import { deletePayment } from '../../store/peopleSlice';
import { Calculator } from '../Calculator';
import { useState } from 'react';

interface PaymentRowProps {
  row: { id: string; amount: string; description: string };
  index: number;
  personId: string;
  dispatch: AppDispatch;
  onAmountChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  savePayment: (personId: string, paymentId: string, amount: number, description: string) => void;
  personName?: string;
}

export const PaymentRow = ({
  row,
  index,
  personId,
  dispatch,
  onAmountChange,
  onDescriptionChange,
  savePayment,
  personName,
}: PaymentRowProps) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleCalculatorResult = (result: string | { amount: string; description: string }) => {
    if (typeof result === 'string') {
      onAmountChange(index, result);
      if (row.id) {
        const amount = Number(result.replace(/,/g, '')) || 0;
        savePayment(personId, row.id, amount, row.description);
      }
    } else {
      onAmountChange(index, result.amount);
      onDescriptionChange(index, result.description);
      if (row.id) {
        const amount = Number(result.amount.replace(/,/g, '')) || 0;
        savePayment(personId, row.id, amount, result.description);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <div className="relative flex-1 min-w-0">
        <div
          className="w-full rounded-md bg-white/80 p-2 pr-8 border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsCalculatorOpen(true)}
          title="クリックして電卓を開く"
        >
          <div className="text-left">
            {row.amount ? (
              <span className="text-gray-900">{row.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
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
          initialValue={row.amount}
          initialDescription={row.description}
          personName={personName}
          isDetailMode={true}
        />
      </div>
      <div className="relative flex-1 min-w-0">
        <div
          className="w-full rounded-md bg-white/80 p-2 border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsCalculatorOpen(true)}
          title="クリックして電卓を開く"
        >
          <div className="text-left truncate">
            {row.description ? (
              <span className="text-gray-900">{row.description}</span>
            ) : (
              <span className="text-gray-400">項目名</span>
            )}
          </div>
        </div>
      </div>
      {row.id && (
        <button
          onClick={() => {
            if (window.confirm('この項目を削除してもよろしいですか？')) {
              dispatch(deletePayment({ personId, paymentId: row.id }));
            }
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="項目を削除"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}; 