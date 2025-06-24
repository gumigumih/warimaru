import { useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas-pro';
import warimaruLogo from '../../assets/logo-white.png';
import { PaymentStatus } from './PaymentStatus';
import { TransferList } from './TransferList';
import { PaymentDetails } from './PaymentDetails';
import { COLORS } from '../../constants/colors';

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
  const nonPayingParticipants = useSelector((state: RootState) => state.people.nonPayingParticipants);
  const resultRef = useRef<HTMLDivElement>(null);

  // 合計金額を計算
  const totalAmount = people.reduce((sum, person) => {
    return sum + person.payments.reduce((personSum, payment) => personSum + payment.amount, 0);
  }, 0);

  // 総参加者数を計算（支払いをした人 + 支払いをしていない人）
  const totalParticipants = people.length + nonPayingParticipants;

  // 1人あたりの金額を計算（総参加者数で割る）
  const perPersonAmount = Math.ceil(totalAmount / totalParticipants);

  // 最大支払金額を計算
  const maxPayment = Math.max(...people.map(person => 
    person.payments.reduce((sum, payment) => sum + payment.amount, 0)
  ));

  // 各人の支払い状況を計算
  const paymentStatus = people.map((person, index) => {
    const paidAmount = person.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const difference = paidAmount - perPersonAmount;
    return {
      person,
      paidAmount,
      difference,
      color: COLORS.backgrounds[index % COLORS.backgrounds.length],
      textColor: COLORS.text[index % COLORS.text.length],
    };
  });

  // 最適な送金方法を計算
  const calculateTransfers = (): Transfer[] => {
    const transfers: Transfer[] = [];
    
    // 支払いをした人の残高を計算
    const payingBalances = paymentStatus.map(status => ({
      name: status.person.name,
      balance: status.difference,
      textColor: status.textColor,
    }));

    // 支払いをしていない人の残高を計算（全員が1人あたりの金額を支払う必要がある）
    const nonPayingBalances = [];
    for (let i = 0; i < nonPayingParticipants; i++) {
      nonPayingBalances.push({
        name: `参加者${i + 1}`,
        balance: -perPersonAmount, // 1人あたりの金額を支払う必要がある
        textColor: COLORS.text[(people.length + i) % COLORS.text.length],
      });
    }

    // 全員の残高を結合
    const allBalances = [...payingBalances, ...nonPayingBalances];

    // プラスの残高を持つ人とマイナスの残高を持つ人を分ける
    const creditors = allBalances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = allBalances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

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

    // 精算金額のボックスにボーダーを追加
    const transferListElement = resultRef.current.querySelector('.bg-white-50\\/80') as HTMLElement;
    if (transferListElement) {
      transferListElement.classList.add('border-2', 'border-sky-500');
    }

    // 背景を不透明に変更
    const resultElement = resultRef.current;
    const originalBackground = resultElement.style.background;
    resultElement.style.background = 'white';

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // より高品質な画像を生成
      });
      const image = canvas.toDataURL('image/png');
      
      // タイムスタンプを生成
      const now = new Date();
      const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      const link = document.createElement('a');
      link.href = image;
      link.download = `わりまる_計算結果_${timestamp}.png`;
      link.click();
    } catch (error) {
      console.error('画像の生成に失敗しました:', error);
    } finally {
      // 背景を元に戻す
      resultElement.style.background = originalBackground;
      
      // 精算金額のボックスのボーダーを元に戻す
      if (transferListElement) {
        transferListElement.classList.remove('border-2', 'border-sky-500');
      }
      
      // ロゴを非表示に戻す
      if (logoElement) {
        logoElement.classList.add('hidden');
      }
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
            <span className="text-gray-600">総参加者数</span>
            <span className="text-lg font-bold">{totalParticipants}人</span>
          </div>
          <div className="flex justify-between items-center pl-4">
            <span className="text-sm text-gray-500">支払いをした人数</span>
            <span className="text-sm font-medium">{people.length}人</span>
          </div>
          <div className="flex justify-between items-center pl-4">
            <span className="text-sm text-gray-500">支払いをしていない人数</span>
            <span className="text-sm font-medium">{nonPayingParticipants}人</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">1人あたり</span>
            <span className="text-lg font-bold">{perPersonAmount.toLocaleString()}円</span>
          </div>
        </div>

        <PaymentStatus
          paymentStatus={paymentStatus}
          maxPayment={maxPayment}
          perPersonAmount={perPersonAmount}
        />

        <TransferList transfers={transfers} />

        {/* ロゴを配置（デフォルトで非表示） */}
        <div className="mt-4 p-4 flex flex-col items-center bg-sky-500 text-white rounded-lg hidden" id="result-logo">
          <div className="w-24 flex items-center justify-center">
            <img src={warimaruLogo} alt="わりまる" className="w-full h-full object-contain"/>
          </div>
          <p className="mt-1 text-center text-sm">https://warimaru.meggumi.com</p>
        </div>
      </div>

      {isDetailMode && (
        <PaymentDetails paymentStatus={paymentStatus} />
      )}

      <div className="flex justify-center">
        <button
          onClick={handleDownloadImage}
          className="w-full px-8 py-4 bg-lime-500 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 font-bold text-lg"
        >
          <FontAwesomeIcon icon={faDownload} />
          画像保存
        </button>
      </div>
    </div>
  );
}; 