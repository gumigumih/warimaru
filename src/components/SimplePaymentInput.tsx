import type { AppDispatch } from '../store/store';
import { updateSimplePayment } from '../store/peopleSlice';
import Cleave from 'cleave.js/react';
import type { ChangeEvent } from 'react';

interface SimplePaymentInputProps {
  value: string;
  personId: string;
  dispatch: AppDispatch;
  onChange: (value: string) => void;
}

export const SimplePaymentInput = ({
  value,
  personId,
  dispatch,
  onChange,
}: SimplePaymentInputProps) => {
  const handleBlur = (value: string) => {
    if (value) {
      const amount = Number(value.replace(/,/g, '')) || 0;
      dispatch(updateSimplePayment({
        personId,
        amount,
      }));
    }
  };

  return (
    <div className="relative">
      <Cleave
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={(e: ChangeEvent<HTMLInputElement>) => handleBlur(e.target.value)}
        data-simple-total
        placeholder="合計支払額"
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
  );
}; 