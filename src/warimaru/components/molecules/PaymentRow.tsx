import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CalculatorInputForm } from '@gumigumih/react-calculator-input-form';
import type { AppDispatch } from '../../store/store';
import { deletePayment } from '../../store/peopleSlice';
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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(row.description);

  const handleCalculatorInputFormChange = (newValue: string) => {
    onAmountChange(index, newValue);
    if (row.id) {
      const amount = Number(newValue.replace(/,/g, '')) || 0;
      savePayment(personId, row.id, amount, row.description);
    }
  };

  const handleDescriptionChange = (newValue: string) => {
    setTempDescription(newValue);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (tempDescription !== row.description) {
      onDescriptionChange(index, tempDescription);
      if (row.id) {
        const amount = Number(row.amount.replace(/,/g, '')) || 0;
        savePayment(personId, row.id, amount, tempDescription);
      }
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDescriptionBlur();
    } else if (e.key === 'Escape') {
      setTempDescription(row.description);
      setIsEditingDescription(false);
    }
  };

  const getTitle = () => {
    const person = personName || 'この人';
    const item = row.description || '項目';
    return `${person}さんの${item}の金額`;
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <div className="relative flex-1 min-w-0 h-12">
        <div className="w-full h-full rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer calculator-input-form flex items-center">
          <CalculatorInputForm
            value={row.amount}
            onChange={handleCalculatorInputFormChange}
            className="w-full h-12 px-3 py-2.5 pr-10 text-base"
            placeholder="金額を入力"
            title={getTitle()}
            description="金額を計算して入力できます（税込・税抜対応）"
            enableTaxCalculation={true}
          />
        </div>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
      </div>
      <div className="relative flex-1 min-w-0 h-12">
        {isEditingDescription ? (
          <input
            type="text"
            value={tempDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            className="w-full h-full rounded-lg bg-white p-2.5 border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            placeholder="項目名を入力"
            autoFocus
          />
        ) : (
          <div
            className="w-full h-full rounded-lg bg-white p-2.5 border border-slate-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => setIsEditingDescription(true)}
            title="クリックして項目名を編集"
          >
            <div className="text-left truncate">
              {row.description ? (
                <span className="text-gray-900">{row.description}</span>
              ) : (
                <span className="text-gray-400">項目名</span>
              )}
            </div>
          </div>
        )}
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
