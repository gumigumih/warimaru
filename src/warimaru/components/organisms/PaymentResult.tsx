import { useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShareAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { captureElementToImage } from "../../../infrastructure/html2canvas";
import warimaruLogoSrc from "../../../assets/warimaru-logo-white.png";
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
    const logo = document.getElementById("result-logo");
    if (logo) logo.classList.remove("hidden");
    const canvas = await captureElementToImage(resultRef.current);
    if (logo) logo.classList.add("hidden");
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `わけまる_計算結果_${timestamp}.png`;
    link.click();
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleShare = () => {
    const shareData = {
      people: people.map(p => ({
        name: p.name,
        payments: p.payments.map(pay => ({ amount: pay.amount }))
      })),
      nonPayingParticipants
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const base = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${base}#/warimaru/result?data=${encoded}`;

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
          className="btn btn-neutral"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          修正する
        </button>
      </div>

      <div
        ref={resultRef}
        className="glass-card p-0 overflow-hidden shadow-2xl"
      >
        <div className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] opacity-90">warimaru report</p>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">計算結果を共有しましょう</h2>
            <p className="text-sm opacity-90">合計・1人あたり・精算ルートをまとめています</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-right min-w-[180px]">
            <p className="text-xs opacity-80">合計</p>
            <p className="text-2xl font-semibold leading-tight">{totalAmount.toLocaleString()}円</p>
            <p className="text-xs opacity-80">{totalParticipants}人（支払 {people.length}人）</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-white via-white to-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">1人あたり</p>
              <p className="text-xl font-semibold text-slate-900">{perPersonAmount.toLocaleString()}円</p>
              <p className="text-xs text-slate-500 mt-1">均等割りの目安</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">支払い人数</p>
              <p className="text-xl font-semibold text-blue-600">{people.length}人</p>
              <p className="text-xs text-slate-500 mt-1">立て替えた人数</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">未支払い人数</p>
              <p className="text-xl font-semibold text-slate-800">{nonPayingParticipants}人</p>
              <p className="text-xs text-slate-500 mt-1">計算から除外</p>
            </div>
          </div>

          <PaymentStatus
            paymentStatus={paymentStatus}
            maxPayment={maxPayment}
            perPersonAmount={perPersonAmount}
          />

          <TransferList transfers={transfers} />

          <div
            className="mt-4 p-4 flex flex-col items-center bg-slate-900 text-white rounded-lg hidden"
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
      </div>

      {isDetailMode && <PaymentDetails paymentStatus={paymentStatus} />}

      <div className="flex flex-col gap-3 justify-center items-center bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleDownloadImage}
            className="btn btn-warimaru w-full text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            画像保存
          </button>
          <button
            onClick={handleShare}
            className="btn btn-warimaru w-full text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
            シェア
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          画像保存はロゴ入り・枠線付きで出力されます。共有前に内容を確認してください。
        </p>
      </div>
    </div>
  );
};
