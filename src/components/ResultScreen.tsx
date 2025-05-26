import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas-pro';
import warimaruLogo from '../assets/logo-white.png';

interface ResultScreenProps {
  onBack: () => void;
}

interface Transfer {
  from: string;
  to: string;
  amount: number;
  textColor: string;
}

export const ResultScreen = ({ onBack }: ResultScreenProps) => {
  const people = useSelector((state: RootState) => state.people.people);
  const isDetailMode = useSelector((state: RootState) => state.people.isDetailMode);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Redux Store State:', { people, isDetailMode });
  }, [people, isDetailMode]);

  // 合計金額を計算
  const totalAmount = people.reduce((sum, person) => {
    return sum + person.payments.reduce((personSum, payment) => personSum + payment.amount, 0);
  }, 0);

  // 1人あたりの金額を計算
  const perPersonAmount = Math.ceil(totalAmount / people.length);

  // 最大支払金額を計算
  const maxPayment = Math.max(...people.map(person => 
    person.payments.reduce((sum, payment) => sum + payment.amount, 0)
  ));

  // 各人の支払い状況を計算
  const paymentStatus = people.map((person, index) => {
    const paidAmount = person.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const difference = paidAmount - perPersonAmount;
    const colors = [
      'bg-yellow-400',
      'bg-green-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-blue-400',
      'bg-orange-400',
    ];
    const textColors = [
      'text-yellow-600',
      'text-green-600',
      'text-purple-600',
      'text-pink-600',
      'text-blue-600',
      'text-orange-600',
    ];
    return {
      person,
      paidAmount,
      difference,
      color: colors[index % colors.length],
      textColor: textColors[index % textColors.length],
    };
  });

  // 最適な送金方法を計算
  const calculateTransfers = (): Transfer[] => {
    const transfers: Transfer[] = [];
    const balances = paymentStatus.map(status => ({
      name: status.person.name,
      balance: status.difference,
      textColor: status.textColor,
    }));

    // プラスの残高を持つ人とマイナスの残高を持つ人を分ける
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

    // 送金を計算
    for (const debtor of debtors) {
      let remainingDebt = Math.abs(debtor.balance);

      for (const creditor of creditors) {
        if (remainingDebt === 0) break;
        if (creditor.balance === 0) continue;

        const transferAmount = Math.min(remainingDebt, creditor.balance);
        if (transferAmount > 0) {
          transfers.push({
            from: debtor.name,
            to: creditor.name,
            amount: transferAmount,
            textColor: creditor.textColor,
          });

          remainingDebt -= transferAmount;
          creditor.balance -= transferAmount;
        }
      }
    }

    return transfers;
  };

  const transfers = calculateTransfers();

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    // ロゴを表示
    const logoElement = document.getElementById('result-logo');
    if (logoElement) {
      logoElement.classList.remove('hidden');
    }

    try {
      const canvas = await html2canvas(resultRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'わりまる_計算結果.png';
      link.click();
    } catch (error) {
      console.error('画像の生成に失敗しました:', error);
    }

    // ロゴを非表示に戻す
    if (logoElement) {
      logoElement.classList.add('hidden');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          修正する
        </button>
      </div>

      <div ref={resultRef} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
        <div className="space-y-4 border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計金額</span>
            <span className="text-lg font-bold">{totalAmount.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">1人あたり</span>
            <span className="text-lg font-bold">{perPersonAmount.toLocaleString()}円</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-4">支払い状況</h3>
        <div className="space-y-4">
          <div className="space-y-4 relative pb-8">
            {paymentStatus.map(({ person, paidAmount, color }) => {
              const percentage = (paidAmount / maxPayment) * 100;
              const perPersonPercentage = (perPersonAmount / maxPayment) * 100;
              return (
                <div key={person.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-gray-600 text-sm font-medium relative z-10">
                      {paidAmount.toLocaleString()}円
                    </span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden relative flex-1 bar-container">
                    <div className="h-full flex">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                        style={{ width: `${Math.min(percentage, perPersonPercentage)}%` }}
                      />
                      {percentage > perPersonPercentage && (
                        <div
                          className={`h-full ${color} transition-all duration-300 ease-in-out`}
                          style={{ width: `${percentage - perPersonPercentage}%` }}
                        />
                      )}
                      <div className="h-full w-full absolute top-0 left-0 pointer-events-none rounded-full border-2 border-gray-300" />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500"
              style={{ left: `${(perPersonAmount / maxPayment) * 100}%` }}
            />
            <div 
              className="absolute text-xs text-red-500 font-medium"
              style={{ 
                left: `${(perPersonAmount / maxPayment) * 100}%`,
                bottom: '0%',
                width: '5rem',
                textAlign: 'center',
                transform: 'translateX(-50%)',
                marginTop: '0.5rem'
              }}
            >
              {perPersonAmount.toLocaleString()}円
            </div>
          </div>
        </div>

        {transfers.length > 0 && (
          <div className="bg-white-50/80 backdrop-blur-sm mt-4 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">精算金額</h3>
            <div className="space-y-4">
              {transfers.map((transfer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{transfer.from}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium">{transfer.to}</span>
                  </div>
                  <span className={`text-lg font-bold ${transfer.textColor}`}>
                    {transfer.amount.toLocaleString()}円
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ロゴを配置（デフォルトで非表示） */}
        <div className="mt-4 p-4 flex flex-col items-center bg-sky-500 text-white rounded-lg hidden" id="result-logo">
          <div className="w-24 flex items-center justify-center">
            <img src={warimaruLogo} alt="わりまる" className="w-full h-full object-contain"/>
          </div>
          <p className="mt-1 text-center text-sm">https://warimaru.meggumi.com</p>
        </div>

      </div>

      {isDetailMode && (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
        >
          <h3 className="text-lg font-bold">支払い内訳</h3>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transform transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isDetailsOpen && (
          <div className="p-4 border-t border-gray-300">
            <div className="space-y-4">
              {paymentStatus.map(({ person }) => (
                <div key={person.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{person.name}</span>
                  </div>
                  {person.payments.length > 0 && (
                    <div className="space-y-2">
                      {person.payments.map(payment => (
                        <div key={`${person.id}-${payment.id}`} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{payment.description}</span>
                          <span className="font-medium">{payment.amount.toLocaleString()}円</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleDownloadImage}
          className="w-full px-8 py-4 bg-lime-500 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 font- bold text-lg"
        >
          <FontAwesomeIcon icon={faDownload} />
          画像保存
        </button>
      </div>
    </div>
  );
}; 