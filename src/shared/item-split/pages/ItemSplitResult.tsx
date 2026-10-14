import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { Dish, Participant, DishContribution, SplitOptions } from "../domain/entities";
import { calculatePayments, calculateTransfers } from "../domain/usecases";
import { formatCurrency } from "../domain/usecases/formatCurrency";
import { DownloadBanner, ParticipantAdjustment, ResultReportCard, ResultShareActions, StepIntro, AccountingSettings, RoundingSettings } from '../../components';
import { parseAmount, roundingLabels } from '../../domain/split';
import { decodeMealShareData } from '../domain/usecases/shareData';
import { getDishPayments } from '../domain/usecases/dishPayments';

interface ItemSplitResultProps {
  basePath: string;
  potluck?: boolean;
  participants: Participant[];
  dishes: Dish[];
  options: SplitOptions;
  legacy?: boolean;
  onBack: () => void;
  onClear: () => void;
  onAdjust: (participants: Participant[], options: SplitOptions) => void;
}

export const ItemSplitResult = ({ basePath, potluck = false, participants: initialParticipants, dishes, options: initialOptions, legacy: initialLegacy = false, onBack, onClear, onAdjust }: ItemSplitResultProps) => {
  const toolTitle = potluck ? '持ち寄り飲み会を精算する' : 'レストランで食べた分だけ割る';
  const accentGradient = potluck ? 'from-emerald-500 via-teal-500 to-cyan-500' : 'from-orange-500 via-amber-500 to-yellow-500';
  const accentBorder = potluck ? 'border-emerald-500' : 'border-orange-500';
  const actionButtonClass = potluck ? 'btn btn-potluck-split' : 'btn btn-meal-split';
  const [applied, setApplied] = useState({ participants: initialParticipants, options: initialOptions, legacy: initialLegacy });
  const { participants, options, legacy } = applied;
  const [draftParticipants, setDraftParticipants] = useState(initialParticipants);
  const [draftOptions, setDraftOptions] = useState(initialOptions);
  const adjustedData = decodeMealShareData({ version: potluck ? 3 : 2, participants: draftParticipants, dishes, options: draftOptions });
  const resultRef = useRef<HTMLDivElement>(null);
  const hasUnappliedChanges = JSON.stringify(draftParticipants) !== JSON.stringify(participants) ||
    JSON.stringify(draftOptions) !== JSON.stringify(options);

  const calculationResult = calculatePayments(dishes, participants, options, legacy);
  const transfers = calculateTransfers(calculationResult);
  const eligibleCount = participants.filter(participant => !participant.displayOnly && participant.burdenRate > 0).length;
  const perPersonAverage = eligibleCount > 0 ? Math.round(calculationResult.totalAmount / eligibleCount) : 0;
  const positiveCount = calculationResult.participants.filter((p) => p.netAmount > 0).length;
  const negativeCount = calculationResult.participants.filter((p) => p.netAmount < 0).length;

  const applyAdjustment = () => {
    if (!adjustedData) return;
    setApplied({ participants: adjustedData.participants, options: adjustedData.options, legacy: false });
    onAdjust(adjustedData.participants, adjustedData.options);
  };
  const shareData = legacy ? { participants: participants.map(({ id, name }) => ({ id, name })), dishes: dishes.map(({ id, name, price, eaters }) => ({ id, name, price, eaters })) } : { version: potluck ? 3 : 2, participants, dishes, options };
  const encodedShareData = btoa(encodeURIComponent(JSON.stringify(shareData)));
  const resultUrl = typeof window === 'undefined'
    ? ''
    : `${window.location.origin}${window.location.pathname}#${basePath}/result?data=${encodeURIComponent(encodedShareData)}`;

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={3}
        totalSteps={3}
        title="結果を見る"
        description={potluck ? '費目ごとの立替と参加者別の負担をまとめて精算し、必要なら調整して共有できます。' : '料理ごとの負担額を確認し、必要なら調整して共有できます。'}
        accentClassName={`bg-gradient-to-b ${accentGradient}`}
        action={
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
            aria-label="戻る"
            title="戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            戻る
          </button>
        }
        endAction={
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
          >
            クリア
          </button>
        }
      />

      <details className="glass-card px-4 py-3">
        <summary className="cursor-pointer text-sm font-bold text-slate-800">細かく調整する（任意）</summary>
        <div className="mt-4 space-y-4">
          <p className="text-xs leading-relaxed text-slate-500">100%を基準に、50%は半分、200%は2倍。途中参加や子ども料金にも使えます。名前だけ残す人は「表示のみ」にできます。変更後に「結果に反映」を押してください。</p>
          {draftParticipants.map(participant => <div key={participant.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm font-bold text-slate-800">{participant.name}</p>
            <ParticipantAdjustment value={participant} hasPayment={dishes.some(dish => getDishPayments(dish).some(payment => payment.paidBy === participant.id && parseAmount(payment.amount) !== 0))}
              onChange={changes => setDraftParticipants(draftParticipants.map(item => item.id === participant.id ? { ...item, ...changes } : item))} />
          </div>)}
          <AccountingSettings options={draftOptions} onChange={setDraftOptions} />
          <RoundingSettings options={draftOptions} onChange={rounding => setDraftOptions({ ...draftOptions, ...rounding })} />
          {!adjustedData && <p role="alert" className="text-sm text-red-700">各項目に負担する対象者を1人以上残してください。負担率・税率・サービス料は0〜10000%、割引額は0以上の整数で入力してください。</p>}
          <button className={`${actionButtonClass} w-full`} disabled={!adjustedData} onClick={applyAdjustment}>結果に反映</button>
        </div>
      </details>

      {hasUnappliedChanges && <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">変更はまだ反映されていません。下の負担額・精算金額は変更前の結果です。「結果に反映」を押してください。反映するまで共有・画像保存はできません。</p>}

      <ResultReportCard
        ref={resultRef}
        accentGradient={accentGradient}
        reportLabel="item split report"
        subtitle="合計・精算ルートを一目で確認できます"
        total={formatCurrency(calculationResult.totalAmount)}
        participantSummary={`${participants.length}人 / ${dishes.length}項目`}
      >
          {!legacy && <p className="text-xs text-slate-600">丸め方：{roundingLabels[options.roundingMode ?? 'floor']}・{options.roundingUnit.toLocaleString()}円単位 ／ 差額は{options.remainderRecipient === 'payer' ? '立替者で調整' : '全員で調整'}</p>}
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

          {potluck && !legacy && <section className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">費目ごとの立替</h3>
            <p className="text-xs text-slate-500">入力した金額です。税・サービス料・割引の調整がある場合は、下の参加者別の金額に反映されます。</p>
            {dishes.map(dish => <div key={dish.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm space-y-2">
              <p className="flex justify-between gap-2 font-semibold text-slate-800"><span>{dish.name}</span><span>{formatCurrency(parseAmount(dish.price))}</span></p>
              <p className="text-xs text-slate-500">負担する人：{participants.filter(p => dish.eaters.includes(p.id) && !p.displayOnly && p.burdenRate > 0).map(p => p.name).join('、')}</p>
              {getDishPayments(dish).map(payment => <p key={payment.id} className="flex justify-between gap-2 text-slate-600">
                <span>{participants.find(p => p.id === payment.paidBy)?.name ?? '未会計'}</span><span>{formatCurrency(parseAmount(payment.amount))}</span>
              </p>)}
            </div>)}
          </section>}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">参加者別の支払い状況</h3>
              <span className="text-xs text-slate-500">項目別の明細</span>
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
                      {participant.displayOnly && <p className="text-xs text-slate-500">表示のみ（精算対象外）</p>}
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-sm font-bold bg-slate-100 text-slate-800"
                    >
                      負担 {formatCurrency(participant.totalOwed)}
                    </span>
                  </div>
                  {participant.totalPaid > 0 && (
                    <p className="mt-1 text-xs text-slate-500">立替 {formatCurrency(participant.totalPaid)}</p>
                  )}
                  {!legacy && participant.totalOwed !== participant.dishes.reduce((sum, dish) => sum + dish.contribution, 0) && <p className="mt-1 text-xs text-slate-500">丸め・差額調整 {formatCurrency(participant.totalOwed - participant.dishes.reduce((sum, dish) => sum + dish.contribution, 0))}</p>}
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
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">受け渡し</span>
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

          {dishes.some(dish => getDishPayments(dish).some(payment => !payment.paidBy && parseAmount(payment.amount) > 0)) && <p className="text-sm text-slate-600">負担額だけを表示しています。すべての支払いに立替者を指定すると、受け渡しも計算できます。</p>}
          {!legacy && (options.taxRate || options.serviceRate || options.discount) && <p className="text-xs text-slate-500">税 {options.taxRate || '0'}% ／サービス料 {options.serviceRate || '0'}% ／割引 {options.discount || '0'}円</p>}

          <DownloadBanner title={`${toolTitle} 計算結果`} url="https://warimaru.meggumi.com/" />
      </ResultReportCard>

      <ResultShareActions
        resultRef={resultRef}
        disabled={hasUnappliedChanges}
        buttonClassName={actionButtonClass}
        downloadFilename={`${toolTitle}_計算結果`}
        shareTitle={`${toolTitle} 計算結果`}
        shareUrl={resultUrl}
        showCopyAlert
        onBeforeDownload={element => {
          const transferListElement = element.querySelector('[data-download-highlight="transfers"]') as HTMLElement | null;
          transferListElement?.classList.add('border-2', accentBorder);
          const originalBackground = element.style.background;
          element.style.background = 'white';
          return () => {
            element.style.background = originalBackground;
            transferListElement?.classList.remove('border-2', accentBorder);
          };
        }}
      />
    </div>
  );
};
