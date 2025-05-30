import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { AppDispatch } from '../../store/store';
import { deletePayment } from '../../store/peopleSlice';
import Cleave from 'cleave.js/react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface PaymentRowProps {
  row: { id: string; amount: string; description: string };
  index: number;
  personId: string;
  dispatch: AppDispatch;
  onAmountChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onKeyDown: (index: number, field: 'amount' | 'description', e: KeyboardEvent<HTMLInputElement>) => void;
  savePayment: (personId: string, paymentId: string, amount: number, description: string) => void;
}

export const PaymentRow = ({
  row,
  index,
  personId,
  dispatch,
  onAmountChange,
  onDescriptionChange,
  onKeyDown,
  savePayment,
}: PaymentRowProps) => {
  return (
    <div className="flex gap-2 items-center w-full">
      <div className="relative flex-1 min-w-0">
        <Cleave
          value={row.amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onAmountChange(index, e.target.value);
            if (row.id) {
              const amount = Number(e.target.value.replace(/,/g, '')) || 0;
              savePayment(personId, row.id, amount, row.description);
            }
          }}
          onBlur={() => {
            if (row.id) {
              const amount = Number(row.amount.replace(/,/g, '')) || 0;
              savePayment(personId, row.id, amount, row.description);
            }
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => onKeyDown(index, 'amount', e)}
          data-row={index}
          data-row-id={row.id}
          data-field="amount"
          placeholder="金額"
          className="w-full rounded-md bg-white/80 p-2 pr-8 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralDecimalScale: 0,
            numeralPositiveOnly: true,
            stripLeadingZeroes: true,
            numeralIntegerScale: 10,
            rawValueTrimPrefix: true,
            numeralDecimalMark: '.',
            delimiter: ',',
            prefix: '',
            noImmediatePrefix: true,
          }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
      </div>
      <input
        type="text"
        value={row.description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onDescriptionChange(index, e.target.value);
          if (row.id) {
            const amount = Number(row.amount.replace(/,/g, '')) || 0;
            savePayment(personId, row.id, amount, e.target.value);
          }
        }}
        onBlur={() => {
          if (row.id) {
            const amount = Number(row.amount.replace(/,/g, '')) || 0;
            savePayment(personId, row.id, amount, row.description);
          }
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => onKeyDown(index, 'description', e)}
        data-row={index}
        data-row-id={row.id}
        data-field="description"
        placeholder="項目名"
        className="flex-1 min-w-0 rounded-md bg-white/80 p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
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