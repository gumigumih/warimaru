import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowLeft, faShareAlt } from "@fortawesome/free-solid-svg-icons";
const WAKETABE_LOGO_URL = "https://waketabe.meggumi.com/ogp.png";
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

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    const logoElement = document.getElementById("result-logo");
    if (logoElement) {
      logoElement.classList.remove("hidden");
    }

    const transferListElement = resultRef.current.querySelector(
      ".bg-white-50\\/80"
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

      <div ref={resultRef} className="glass-card p-4">
        <div className="space-y-4 border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計金額</span>
            <span className="text-lg font-bold">{formatCurrency(calculationResult.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">参加者数</span>
            <span className="text-lg font-bold">{participants.length}人</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">参加者別の支払い状況</h3>
          <div className="space-y-3">
            {calculationResult.participants.map((participant) => (
              <div key={participant.participantId} className="bg-white/50 rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{participant.participantName}</span>
                  <span className={`font-bold ${participant.netAmount > 0 ? 'text-green-600' : participant.netAmount < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {participant.netAmount > 0 ? '+' : ''}
                    {formatCurrency(participant.netAmount)}
                  </span>
                </div>
                {participant.dishes.length > 0 && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {participant.dishes.map((dish: DishContribution) => (
                      <div key={dish.dishId} className="flex justify-between">
                        <span>{dish.dishName}</span>
                        <span>{formatCurrency(dish.contribution)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {transfers.length > 0 && (
          <div className="bg-white-50/80 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">精算方法</h3>
            <div className="space-y-2">
              {transfers.map((transfer, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-gray-700">
                    <span className="font-medium">{transfer.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{transfer.to}</span>
                  </span>
                  <span className="font-bold text-orange-600">{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-6 flex flex-col items-center bg-orange-500 text-white rounded-lg hidden" id="result-logo">
          <div className="w-48 h-12 flex items-center justify-center mb-2">
            <img src={WAKETABE_LOGO_URL} alt="わけたべ" className="w-full h-full object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
          <p className="text-center text-sm font-medium">https://waketabe.meggumi.com</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-center items-center">
        <button onClick={handleDownloadImage} className="btn btn-primary w-full text-lg">
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          画像保存
        </button>
        <button onClick={handleShareUrl} className="btn btn-secondary w-full text-lg">
          <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
          {isWebShareSupported ? 'シェア' : 'URLコピー'}
        </button>
        {shareMsg && <div className="text-center text-green-600 font-semibold mt-2">{shareMsg}</div>}
      </div>
    </div>
  );
};
