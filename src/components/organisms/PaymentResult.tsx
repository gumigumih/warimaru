import { useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShareAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { captureElementToImage } from "../../infrastructure/html2canvas";
import warimaruLogoSrc from "../../assets/logo-white.png";
import { PaymentStatus } from "../organisms/PaymentStatus";
import { TransferList } from "../organisms/TransferList";
import { PaymentDetails } from "../organisms/PaymentDetails";
import { COLORS } from "../../constants/colors";
import {
  calculateTotalAmount,
  calculateTotalParticipants,
  calculatePerPersonAmount,
  calculateMaxPayment,
  calculatePaymentStatus,
  calculateTransfers,
} from "../../domain/usecases/calculatePayments";

interface PaymentResultProps {
  onBack: () => void;
}

export const PaymentResult = ({ onBack }: PaymentResultProps) => {
  const people = useSelector((state: RootState) => state.people.people);
  const isDetailMode = useSelector(
    (state: RootState) => state.people.isDetailMode
  );
  const nonPayingParticipants = useSelector(
    (state: RootState) => state.people.nonPayingParticipants
  );
  const resultRef = useRef<HTMLDivElement>(null);

  // 計算ロジックをusecaseから呼び出し
  const totalAmount = calculateTotalAmount(people);
  const totalParticipants = calculateTotalParticipants(
    people,
    nonPayingParticipants
  );
  const perPersonAmount = calculatePerPersonAmount(
    totalAmount,
    totalParticipants
  );
  const maxPayment = calculateMaxPayment(people);
  const paymentStatus = calculatePaymentStatus(people, perPersonAmount, COLORS);
  const transfers = calculateTransfers(
    paymentStatus,
    nonPayingParticipants,
    perPersonAmount,
    people,
    COLORS
  );

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    // ロゴを一時的に表示
    const logo = document.getElementById("result-logo");
    if (logo) logo.classList.remove("hidden");

    // 画像生成
    const canvas = await captureElementToImage(resultRef.current);

    // ロゴを再び非表示
    if (logo) logo.classList.add("hidden");

    // タイムスタンプを生成
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    // ダウンロード処理
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `わけまる_計算結果_${timestamp}.png`;
    link.click();
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // シェアボタン
  const handleShare = () => {
    const shareData = {
      people: people.map(p => ({
        name: p.name,
        payments: p.payments.map(pay => ({ amount: pay.amount }))
      })),
      nonPayingParticipants
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}/result?data=${encoded}`;

    if (isMobile && navigator.share) {
      navigator.share({
        title: 'わりまる 計算結果',
        text: 'この割り勘結果をシェアします！',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('URLをコピーしました！');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-start items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          修正する
        </button>
      </div>

      <div
        ref={resultRef}
        className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
      >
        <div className="space-y-4 border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計金額</span>
            <span className="text-lg font-bold">
              {totalAmount.toLocaleString()}円
            </span>
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
            <span className="text-sm text-gray-500">
              支払いをしていない人数
            </span>
            <span className="text-sm font-medium">
              {nonPayingParticipants}人
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">1人あたり</span>
            <span className="text-lg font-bold">
              {perPersonAmount.toLocaleString()}円
            </span>
          </div>
        </div>

        <PaymentStatus
          paymentStatus={paymentStatus}
          maxPayment={maxPayment}
          perPersonAmount={perPersonAmount}
        />

        <TransferList transfers={transfers} />

        {/* ロゴを配置（デフォルトで非表示） */}
        <div
          className="mt-4 p-4 flex flex-col items-center bg-sky-500 text-white rounded-lg hidden"
          id="result-logo"
        >
          <div className="w-24 flex items-center justify-center">
            <img
              src={warimaruLogoSrc}
              alt="わりまる"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="mt-1 text-center text-sm">
            https://warimaru.meggumi.com
          </p>
        </div>
      </div>

      {isDetailMode && <PaymentDetails paymentStatus={paymentStatus} />}

      <div className="flex justify-center flex-col items-center space-y-2">
        <button
          onClick={handleDownloadImage}
          className="w-full px-8 py-4 bg-lime-500 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 font-bold text-lg"
        >
          <FontAwesomeIcon icon={faDownload} />
          画像保存
        </button>
        <button
          onClick={handleShare}
          className="w-full px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold text-lg"
        >
          <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
          シェア
        </button>
      </div>
    </div>
  );
};
