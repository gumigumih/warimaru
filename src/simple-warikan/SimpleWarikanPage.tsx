import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalculator, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { BrandHeader } from '../components/templates/BrandHeader';

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
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');

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

  return (
    <div className="space-y-5 text-slate-950">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="btn btn-neutral px-4 py-2 text-sm shadow-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        ツール一覧へ
      </button>

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

        <div className="glass-card p-4 space-y-4">
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
    </div>
  );
};
