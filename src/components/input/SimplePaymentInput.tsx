import Cleave from 'cleave.js/react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface SimplePaymentInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  savePayment: (personId: string, paymentId: string, amount: number | string, description?: string) => void;
  personId: string;
}

export const SimplePaymentInput = ({
  value,
  onChange,
  onKeyDown,
  savePayment,
  personId,
}: SimplePaymentInputProps) => {
  return (
    <div className="relative flex-1 min-w-0">
      <Cleave
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          const amount = Number(e.target.value.replace(/,/g, '')) || 0;
          savePayment(personId, '', amount);
        }}
        onBlur={() => {
          const amount = Number(value.replace(/,/g, '')) || 0;
          savePayment(personId, '', amount);
        }}
        onKeyDown={onKeyDown}
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
  );
}; 