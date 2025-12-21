import { CalculatorInputForm, type CalculatorInputFormProps } from '@gumigumih/react-calculator-input-form';

type AmountInputProps = Omit<
  CalculatorInputFormProps,
  'enableTaxCalculation' | 'decimalPlaces' | 'numberFormatOptions'
>;

export const AmountInput = (props: AmountInputProps) => {
  return (
    <CalculatorInputForm
      {...props}
      enableTaxCalculation={true}
      decimalPlaces={0}
      numberFormatOptions={{
        prefix: '¥',
        thousandSeparator: true,
        decimalScale: 0,
        allowNegative: false,
      }}
    />
  );
};

