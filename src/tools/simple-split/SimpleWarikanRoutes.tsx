import { useMemo, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCalculator,
} from '@fortawesome/free-solid-svg-icons';
import { AmountInput, BrandHeader, DownloadBanner, ResultReportCard, ResultShareActions, StepIntro } from '../../shared/components';
import { defaultSplitOptions, roundingLabels } from '../../shared/domain/split';
import { AccountingSettings, RoundingSettings } from '../../shared/components';
import { calculateSimpleResult, decodeSimpleData } from './calculation';
import type { SimpleWarikanData } from './calculation';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);

const encodeData = (data: SimpleWarikanData) => encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: 2, ...data }))));

const decodeData = (search: string): SimpleWarikanData | null => {
  const encoded = new URLSearchParams(search).get('data');
  if (!encoded) return null;

  try {
    return decodeSimpleData(JSON.parse(decodeURIComponent(atob(encoded.replace(/ /g, '+')))));
  } catch {
    return null;
  }
};

const SimpleWarikanHeader = () => (
  <BrandHeader
    icon={faCalculator}
    tag="simple"
    title="1人がまとめて払った会計を割る"
    subtitle="飲み会・ランチ・タクシーなどを人数で分ける"
    accent="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500"
  />
);

const SimpleWarikanInputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restoredData = useMemo(() => decodeData(location.search), [location.search]);
  const [totalAmount, setTotalAmount] = useState(restoredData?.totalAmount ?? '');
  const [peopleCount, setPeopleCount] = useState(restoredData?.peopleCount ?? '2');
  const [options, setOptions] = useState(restoredData?.options ?? defaultSplitOptions);
  const data = { totalAmount, peopleCount, options };
  const result = calculateSimpleResult(data);

  const clear = () => {
    setTotalAmount('');
    setPeopleCount('2');
    setOptions(defaultSplitOptions);
  };

  const showResult = () => {
    if (!result.isValid) return;
    navigate(`/simple/result?data=${encodeData(data)}`);
  };

  return (
    <div className="space-y-5 text-slate-950">
      <SimpleWarikanHeader />

      <StepIntro
        currentStep={1}
        totalSteps={2}
        title="誰で・何を割る？"
        description="人数と合計金額を入れるだけで、1人あたりの目安を出します。"
        accentClassName="bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500"
        endAction={
          <button
            type="button"
            onClick={clear}
            className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
          >
            クリア
          </button>
        }
      />

      <section className="glass-card p-4 space-y-4">
        <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          合計金額
          <AmountInput
            value={totalAmount}
            onChange={setTotalAmount}
            title="合計金額を入力"
            placeholder="12000"
            className="w-full h-12 rounded-xl bg-white px-3 py-2.5 border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          人数
          <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
            <input
              value={peopleCount}
              type="number"
              min="1"
              max="300"
              aria-label="人数"
              onChange={event => setPeopleCount(event.target.value)}
              inputMode="numeric"
              placeholder="4"
              className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
            />
            <span className="ml-2 text-sm font-bold text-slate-500">人</span>
          </div>
        </label>

        <p className="text-xs text-slate-500">税・割引・丸め方は、結果を見ながら調整できます。</p>
        {!result.isValid && (totalAmount !== '' || options.taxRate !== '' || options.serviceRate !== '' || options.discount !== '') && (
          <p role="alert" className="text-sm text-red-700">金額は正の整数、人数は1〜300人で入力してください。</p>
        )}
      </section>

      <div className="sticky bottom-4 z-10">
        <button
          type="button"
          onClick={showResult}
          disabled={!result.isValid}
          className="btn btn-simple w-full text-lg shadow-lg"
        >
          計算結果へ
          <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SimpleWarikanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sharedData = useMemo(() => decodeData(location.search), [location.search]);
  const [data, setData] = useState(sharedData);
  const [draftOptions, setDraftOptions] = useState(sharedData?.options ?? defaultSplitOptions);
  const resultRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <Navigate to="/simple" replace />;
  }

  const result = calculateSimpleResult(data);

  if (!result.isValid) {
    return <Navigate to="/simple" replace />;
  }

  const validAdjustment = calculateSimpleResult({ ...data, options: draftOptions }).isValid;
  const hasUnappliedChanges = JSON.stringify(draftOptions) !== JSON.stringify(data.options);
  const applyAdjustment = () => {
    if (!validAdjustment) return;
    setData({ ...data, options: draftOptions });
    navigate(`/simple/result?data=${encodeData({ ...data, options: draftOptions })}`, { replace: true });
  };

  const resultUrl = `${window.location.origin}${window.location.pathname}#/simple/result?data=${encodeData(data)}`;

  return (
    <div className="space-y-5 text-slate-950">
      <SimpleWarikanHeader />

      <StepIntro
        currentStep={2}
        totalSteps={2}
        title="結果を見る"
        description="負担額を確認し、必要なら細かく調整して共有できます。"
        accentClassName="bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500"
        action={
          <button
            type="button"
            onClick={() => navigate(`/simple?data=${encodeData(data)}`)}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
            aria-label="入力に戻る"
            title="入力に戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            入力に戻る
          </button>
        }
        endAction={
          <button
            type="button"
            onClick={() => navigate('/simple')}
            className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
          >
            クリア
          </button>
        }
      />

      <details className="glass-card px-4 py-3">
        <summary className="cursor-pointer text-sm font-bold text-slate-800">細かく調整する（任意）</summary>
        <div className="mt-4 space-y-4">
          <AccountingSettings options={draftOptions} onChange={setDraftOptions} />
          <RoundingSettings options={draftOptions} onChange={rounding => setDraftOptions({ ...draftOptions, ...rounding })} />
          {!validAdjustment && <p role="alert" className="text-sm text-red-700">税率・サービス料は0〜10000%、割引額は0以上の整数で入力してください。</p>}
          <button className="btn btn-simple w-full" disabled={!validAdjustment} onClick={applyAdjustment}>結果に反映</button>
        </div>
      </details>

      {hasUnappliedChanges && <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">変更はまだ反映されていません。下の負担額は変更前の結果です。「結果に反映」を押してください。反映するまで共有・画像保存はできません。</p>}

      <ResultReportCard
        ref={resultRef}
        accentGradient="from-slate-700 via-slate-600 to-slate-500"
        reportLabel="simple split report"
        subtitle="1人あたりと余りをすぐ確認できます"
        total={formatCurrency(result.total)}
        participantSummary={`${result.people}人で割る`}
      >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">1人あたり</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatCurrency(result.baseAmount)}
              </p>
              <p className="text-xs text-slate-500 mt-1">丸めた金額（差額調整前）</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">{result.remainder < 0 ? '超過分' : '不足分'}</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatCurrency(Math.abs(result.remainder))}
              </p>
              <p className="text-xs text-slate-500 mt-1">下の負担額で調整済み</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                最終会計 {formatCurrency(result.total)} を {result.people}人で割ります。
              </p>
              {result.groups.map(([amount, count]) => <p key={amount}>{count}人が {formatCurrency(amount)} を負担します。</p>)}
              <p>丸め方：{roundingLabels[data.options.roundingMode ?? 'floor']}・{data.options.roundingUnit.toLocaleString()}円単位 ／ 差額は{data.options.remainderRecipient === 'payer' ? '立替者で調整' : '全員で調整'}</p>
              {(data.options.taxRate || data.options.serviceRate || data.options.discount) && <p>小計 {formatCurrency(result.subtotal)} ／税 {data.options.taxRate || '0'}% ／サービス料 {data.options.serviceRate || '0'}% ／割引 {data.options.discount || '0'}円</p>}
            </div>
          </div>

        <DownloadBanner title="シンプル割り勘 計算結果" url="https://warimaru.meggumi.com/" />
      </ResultReportCard>

      <ResultShareActions
        resultRef={resultRef}
        disabled={hasUnappliedChanges}
        buttonClassName="btn btn-simple"
        downloadFilename="シンプル割り勘_計算結果"
        shareTitle="シンプル割り勘 計算結果"
        shareText={`${formatCurrency(result.total)}を${result.people}人で割りました。`}
        shareUrl={resultUrl}
        showCopyAlert
      />
    </div>
  );
};

export const SimpleWarikanRoutes = () => {
  const location = useLocation();
  return (
  <Routes>
    <Route index element={<SimpleWarikanInputPage key={location.search} />} />
    <Route path="result" element={<SimpleWarikanResultPage key={location.search} />} />
    <Route path="*" element={<Navigate to="/simple" replace />} />
  </Routes>
);
};
