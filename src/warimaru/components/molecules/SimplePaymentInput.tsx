import { CalculatorInputForm } from '@gumigumih/react-calculator-input-form';

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
    const amount = Number(newValue) || 0;
    savePayment(personId, '', amount);
  };

  const getTitle = () => {
    const person = personName || 'この人';
    return `${person}さんの金額`;
  };

  return (
    <div className="relative flex-1 min-w-0">
      <div className="w-full rounded-md bg-white/80 border-gray-300 shadow-sm overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer calculator-input-form">
        <CalculatorInputForm
          value={value}
          onChange={handleCalculatorInputFormChange}
          className="w-full p-2 pr-8"
          placeholder="金額を入力"
          title={getTitle()}
          description="金額を計算して入力できます（税込・税抜対応）"
          enableTaxCalculation={true}
        />
      </div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
    </div>
  );
};

