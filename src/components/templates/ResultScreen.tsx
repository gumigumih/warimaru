import { useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { captureElementToImage } from "../../infrastructure/html2canvas";
import warimaruLogo from "../../assets/logo-white.svg";
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

interface ResultScreenProps {
  onBack: () => void;
}

export const ResultScreen = ({ onBack }: ResultScreenProps) => {
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
    const canvas = await captureElementToImage(resultRef.current);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "warimaru-result.png";
    link.click();
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
              src={warimaruLogo}
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
