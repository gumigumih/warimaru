import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowLeft, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import waketabeLogoSrc from "../../../assets/waketabe-logo-white.png";
import type { Dish, Participant, DishContribution } from "../../domain/entities";
import { calculatePayments, calculateTransfers } from "../../domain/usecases";
import { formatCurrency } from "../../domain/usecases/formatCurrency";
import { captureElementToImage } from "../../../infrastructure/html2canvas";

interface CalculationResultScreenProps {
  participants: Participant[];
  dishes: Dish[];
  onBack: () => void;
}

export const CalculationResultScreen = ({ participants, dishes, onBack }: CalculationResultScreenProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [shareMsg, setShareMsg] = useState('');

  const calculationResult = calculatePayments(dishes, participants);
  const transfers = calculateTransfers(calculationResult);
  const perPersonAverage =
    participants.length > 0 ? Math.round(calculationResult.totalAmount / participants.length) : 0;
  const positiveCount = calculationResult.participants.filter((p) => p.netAmount > 0).length;
  const negativeCount = calculationResult.participants.filter((p) => p.netAmount < 0).length;

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    const logoElement = document.getElementById("result-logo");
    if (logoElement) {
      logoElement.classList.remove("hidden");
    }

    const transferListElement = resultRef.current.querySelector(
      '[data-download-highlight="transfers"]'
    ) as HTMLElement;
    if (transferListElement) {
      transferListElement.classList.add("border-2", "border-orange-500");
    }

    const resultElement = resultRef.current;
    const originalBackground = resultElement.style.background;
    resultElement.style.background = "white";

    try {
      const canvas = await captureElementToImage(resultRef.current);
      const image = canvas.toDataURL("image/png");
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
      link.href = image;
      link.download = `わけたべ_計算結果_${timestamp}.png`;
      link.click();
    } catch (error) {
      console.error("画像の生成に失敗しました:", error);
    } finally {
      resultElement.style.background = originalBackground;
      if (transferListElement) {
        transferListElement.classList.remove("border-2", "border-orange-500");
      }
      if (logoElement) {
        logoElement.classList.add("hidden");
      }
    }
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isWebShareSupported = isMobile && typeof navigator !== 'undefined' && !!navigator.share;

  const handleShareUrl = async () => {
    const shareData = { participants, dishes };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = `${base}#/waketabe/result?data=${encoded}`;

    if (isWebShareSupported) {
      try {
        await navigator.share({ title: 'わけたべ 計算結果', url });
        setShareMsg('シェアしました！');
      } catch {
        setShareMsg('シェアをキャンセルしました');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg('URLをコピーしました！');
        alert('URLをコピーしました！');
      } catch {
        setShareMsg('コピーに失敗しました');
      }
    }
    setTimeout(() => setShareMsg(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="btn btn-neutral">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          修正する
        </button>
      </div>

      <div ref={resultRef} className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] opacity-90">waketabe report</p>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">計算結果を共有しましょう</h2>
            <p className="text-sm opacity-90">合計・精算ルートを一目で確認できます</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-right min-w-[180px]">
            <p className="text-xs opacity-80">合計</p>
            <p className="text-2xl font-semibold leading-tight">{formatCurrency(calculationResult.totalAmount)}</p>
            <p className="text-xs opacity-80">{participants.length}人 / {dishes.length}品</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-white via-white to-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">1人あたり目安</p>
              <p className="text-xl font-semibold text-slate-900">{formatCurrency(perPersonAverage)}</p>
              <p className="text-xs text-slate-500 mt-1">均等割りだとこの金額</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">受け取る人</p>
              <p className="text-xl font-semibold text-emerald-600">{positiveCount}人</p>
              <p className="text-xs text-slate-500 mt-1">プラス収支</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">支払う人</p>
              <p className="text-xl font-semibold text-rose-600">{negativeCount}人</p>
              <p className="text-xs text-slate-500 mt-1">マイナス収支</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">参加者別の支払い状況</h3>
              <span className="text-xs text-slate-500">タップで明細を確認</span>
            </div>
            <div className="space-y-3">
              {calculationResult.participants.map((participant) => (
                <div
                  key={participant.participantId}
                  className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{participant.participantName}</p>
                      <p className="text-xs text-slate-500">合計 {formatCurrency(participant.dishes.reduce((sum, dish) => sum + dish.contribution, 0))}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        participant.netAmount > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : participant.netAmount < 0
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {participant.netAmount > 0 ? '+' : ''}
                      {formatCurrency(participant.netAmount)}
                    </span>
                  </div>
                  {participant.dishes.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                      {participant.dishes.map((dish: DishContribution) => (
                        <div key={dish.dishId} className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                          <span className="truncate">{dish.dishName}</span>
                          <span className="font-medium text-slate-800">{formatCurrency(dish.contribution)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {transfers.length > 0 && (
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-4 sm:p-5 shadow-sm" data-download-highlight="transfers">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">精算方法</h3>
                  <p className="text-sm text-slate-600">誰が誰にいくら渡すかをまとめました</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">最少ステップ</span>
              </div>
              <div className="space-y-2">
                {transfers.map((transfer, index) => (
                  <div key={index} className="flex justify-between items-center px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <span className="text-slate-800">
                      <span className="font-semibold">{transfer.from}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <span className="font-semibold">{transfer.to}</span>
                    </span>
                    <span className="text-base font-bold text-emerald-700">{formatCurrency(transfer.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 p-6 flex flex-col items-center bg-slate-900 text-white rounded-2xl hidden" id="result-logo">
            <div className="w-48 h-12 flex items-center justify-center mb-2">
              <img src={waketabeLogoSrc} alt="わけたべ" className="w-full h-full object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <p className="text-center text-sm font-medium">https://waketabe.meggumi.com</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 justify-center items-center bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={handleDownloadImage} className="btn btn-primary w-full text-base sm:text-lg">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            画像保存
          </button>
          <button onClick={handleShareUrl} className="btn btn-secondary w-full text-base sm:text-lg">
            <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
            {isWebShareSupported ? 'シェア' : 'URLコピー'}
          </button>
        </div>
        {shareMsg && <div className="text-center text-emerald-700 font-semibold mt-1 text-sm">{shareMsg}</div>}
        <p className="text-xs text-slate-500 text-center">
          画像保存はロゴ入り・枠線付きで出力されます。共有前に内容を確認してください。
        </p>
      </div>
    </div>
  );
};
