import { AmountInput } from '../../../../shared/components';

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
  const handleCalculatorInputFormChange = (newValue: string) => {
    onChange(newValue);
    const amount = Number(newValue.replace(/,/g, '')) || 0;
    savePayment(personId, '', amount);
  };

  const getTitle = () => {
    const person = personName || 'この人';
    return `${person}さんの金額`;
  };

  return (
    <div className="relative flex-1 min-w-0 h-full">
      <div className="w-full h-full rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer calculator-input-form flex items-center">
        <AmountInput
          value={value}
          onChange={handleCalculatorInputFormChange}
          allowNegative
          className="w-full h-full px-3 py-2.5 pr-10 text-base"
          placeholder="金額を入力"
          title={getTitle()}
          description="プラスは立替、マイナスは返金・買取・減額として入力できます"
        />
      </div>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
    </div>
  );
};
