import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faDownload, faRotateLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { BrandHeader } from '../components/templates/BrandHeader';
import { captureElementToImage } from '../infrastructure/html2canvas';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);

const parseNumber = (value: string) => {
  const numeric = Number(value.replace(/[^\d]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

export const SimpleWarikanPage = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('simple');
    if (!encoded) return;

    try {
      const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
      if (typeof decoded.totalAmount === 'string') {
        setTotalAmount(decoded.totalAmount);
      }
      if (typeof decoded.peopleCount === 'string') {
        setPeopleCount(decoded.peopleCount);
      }
    } catch {
      // 不正データは無視
    }
  }, []);

  const result = useMemo(() => {
    const total = parseNumber(totalAmount);
    const people = Math.max(0, parseNumber(peopleCount));

    if (total <= 0 || people <= 0) {
      return {
        total,
        people,
        baseAmount: 0,
        extraPeople: 0,
      };
    }

    return {
      total,
      people,
      baseAmount: Math.floor(total / people),
      extraPeople: total % people,
    };
  }, [peopleCount, totalAmount]);

  const hasResult = result.total > 0 && result.people > 0;

  const reset = () => {
    setTotalAmount('');
    setPeopleCount('2');
  };

  const createShareUrl = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ totalAmount, peopleCount })));
    return `${window.location.origin}${window.location.pathname}?simple=${encoded}#/simple`;
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current || !hasResult) return;

    const canvas = await captureElementToImage(resultRef.current);
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      '_' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `シンプル割り勘_計算結果_${timestamp}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!hasResult) return;

    const url = createShareUrl();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'シンプル割り勘 計算結果',
          text: `${formatCurrency(result.total)}を${result.people}人で割りました。`,
          url,
        });
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
    <div className="space-y-5 text-slate-950">
      <BrandHeader
        icon={faCalculator}
        tag="simple"
        title="合計金額を人数で割る"
        subtitle="合計金額と人数だけで、1人あたりと余りをすぐ確認"
        accent="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="btn btn-neutral px-4 py-2 text-sm shadow-sm"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="h-4 w-4" />
          リセット
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-4 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">入力</h2>
          <div className="mt-4 space-y-4">
            <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
              合計金額
              <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
                <span className="mr-2 text-sm font-bold text-slate-500">¥</span>
                <input
                  value={totalAmount}
                  onChange={event => setTotalAmount(event.target.value)}
                  inputMode="numeric"
                  placeholder="12000"
                  className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
              人数
              <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
                <input
                  value={peopleCount}
                  onChange={event => setPeopleCount(event.target.value)}
                  inputMode="numeric"
                  placeholder="4"
                  className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
                />
                <span className="ml-2 text-sm font-bold text-slate-500">人</span>
              </div>
            </label>
          </div>
        </div>

        <div ref={resultRef} className="glass-card p-4 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">計算結果</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500">1人あたり</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {hasResult ? formatCurrency(result.baseAmount) : '-'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500">余り</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {hasResult ? formatCurrency(result.extraPeople) : '-'}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
            {hasResult ? (
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  合計 {formatCurrency(result.total)} を {result.people}人で割ります。
                </p>
                {result.extraPeople > 0 ? (
                  <p>
                    {result.extraPeople}人が {formatCurrency(result.baseAmount + 1)}、残り
                    {result.people - result.extraPeople}人が {formatCurrency(result.baseAmount)} 払うとぴったりです。
                  </p>
                ) : (
                  <p>全員が同じ金額でぴったり割れます。</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">合計金額と人数を入力すると結果が表示されます。</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 justify-center items-center bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={!hasResult}
            className="btn btn-neutral w-full text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            画像保存
          </button>
          <button
            onClick={handleShare}
            disabled={!hasResult}
            className="btn btn-neutral w-full text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
            シェア
          </button>
        </div>
        {shareMsg && <div className="text-center text-emerald-700 font-semibold mt-1 text-sm">{shareMsg}</div>}
        <p className="text-xs text-slate-500 text-center">
          結果が表示されているときに、画像保存とURL共有ができます。
        </p>
      </div>
    </div>
  );
};
