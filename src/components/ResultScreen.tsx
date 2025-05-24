import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface ResultScreenProps {
  onBack: () => void;
}

export const ResultScreen = ({ onBack }: ResultScreenProps) => {
  const people = useSelector((state: RootState) => state.people);

  // 合計金額を計算
  const totalAmount = people.reduce((sum, person) => {
    return sum + person.payments.reduce((personSum, payment) => personSum + payment.amount, 0);
  }, 0);

  // 1人あたりの金額を計算
  const perPersonAmount = Math.ceil(totalAmount / people.length);

  // 各人の支払い状況を計算
  const paymentStatus = people.map(person => {
    const paidAmount = person.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const difference = paidAmount - perPersonAmount;
    return {
      person,
      paidAmount,
      difference,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">計算結果</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          戻る
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計金額</span>
            <span className="text-lg font-bold">{totalAmount.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">1人あたり</span>
            <span className="text-lg font-bold">{perPersonAmount.toLocaleString()}円</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paymentStatus.map(({ person, paidAmount, difference }) => (
          <div key={person.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{person.name}</span>
                <span className={difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {difference >= 0 ? '+' : ''}{difference.toLocaleString()}円
                </span>
              </div>
              <div className="text-sm text-gray-600">
                支払い済み: {paidAmount.toLocaleString()}円
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 