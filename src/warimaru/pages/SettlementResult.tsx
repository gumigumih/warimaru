import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShareAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { captureElementToImage } from "../../infrastructure/html2canvas";
import { withDownloadBanner } from "../../infrastructure/downloadBanner";
import { DownloadBanner, ParticipantAdjustment, RoundingSettings, StepIntro } from '../../shared/components';
import { PaymentStatusSummary } from "../components/organisms/PaymentStatusSummary";
import { SettlementRouteList } from "../components/molecules/SettlementRouteList";
import { PaymentDetailsSection } from "../components/organisms/PaymentDetailsSection";
import { COLORS } from "../constants/colors";
import {
  calculatePerPersonAmount,
  calculateMaxPayment,
} from "../domain/usecases/calculatePayments";
import { calculateEqualSettlement, equalMembers } from '../domain/usecases/settlement';
import type { EqualShareData } from '../domain/usecases/shareData';
import { setMembers, setRounding, setLegacyEqual } from '../store/peopleSlice';
import { roundingLabels, roundAmount } from '../../shared/domain/split';

interface SettlementResultProps {
  onBack: () => void;
  onClear: () => void;
  data?: EqualShareData;
}

export const SettlementResult = ({ onBack, onClear, data }: SettlementResultProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const stored = useSelector((state: RootState) => state.people);
  const dispatch = useDispatch<AppDispatch>();
  const source = data ?? stored;
  const { people, totalParticipants } = source;
  const [applied, setApplied] = useState({ members: source.members, rounding: source.rounding, legacy: source.legacy });
  const { members, rounding, legacy } = applied;
  const [draftMembers, setDraftMembers] = useState(() => equalMembers(people, totalParticipants, members));
  const [draftRounding, setDraftRounding] = useState(rounding);
  const validAdjustment = draftMembers.every(member => Number.isFinite(member.burdenRate) && member.burdenRate >= 0 && member.burdenRate <= 100) &&
    draftMembers.some(member => !member.displayOnly && member.burdenRate > 0);
  const isDetailMode = stored.isDetailMode;
  const nonPayingParticipants = totalParticipants - people.length;
  const resultRef = useRef<HTMLDivElement>(null);
  const [shareMsg, setShareMsg] = useState('');
  const hasUnappliedChanges = JSON.stringify(draftMembers) !== JSON.stringify(equalMembers(people, totalParticipants, members)) ||
    JSON.stringify(draftRounding) !== JSON.stringify(rounding);
  const sharedPeople = people.map(p => ({ id: p.id, name: p.name, payments: p.payments.map(pay => ({ amount: pay.amount })) }));
  const shareData = legacy ? { people: sharedPeople, totalParticipants, nonPayingParticipants } : {
    version: 2, people: sharedPeople, totalParticipants, members: equalMembers(people, totalParticipants, members), rounding,
  };
  const encodedResult = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(shareData))));
  useEffect(() => {
    if (!data && people.length > 0 && totalParticipants >= people.length && totalParticipants <= 300) {
      navigate(`${location.pathname}?data=${encodedResult}`, { replace: true });
    }
  }, [data, people.length, totalParticipants, location.pathname, encodedResult, navigate]);

  if (people.length === 0 || totalParticipants < people.length || totalParticipants > 300) return <Navigate to="/equal-split" replace />;
  const { totalAmount, charges, paymentStatus, transfers } = calculateEqualSettlement(people, totalParticipants, members, rounding, legacy, COLORS);
  const eligibleCount = charges.filter(member => !member.displayOnly && member.burdenRate > 0).length;
  const perPersonAmount = legacy ? calculatePerPersonAmount(totalAmount, totalParticipants) : roundAmount(totalAmount / eligibleCount, rounding);
  const maxPayment = calculateMaxPayment(people);
  if (totalAmount <= 0) return <Navigate to="/equal-split" replace />;

  const applyAdjustment = () => {
    if (!validAdjustment) return;
    setApplied({ members: draftMembers, rounding: draftRounding, legacy: false });
    dispatch(setMembers(draftMembers));
    dispatch(setRounding(draftRounding));
    dispatch(setLegacyEqual(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: 2, people: sharedPeople, totalParticipants, members: draftMembers, rounding: draftRounding }))));
    navigate(`${location.pathname}?data=${encoded}`, { replace: true });
    setShareMsg('');
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    const canvas = await withDownloadBanner(resultRef.current, () =>
      captureElementToImage(resultRef.current as HTMLDivElement)
    );
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
    link.download = `総額割り勘_計算結果_${timestamp}.png`;
    link.click();
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleShare = async () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${base}#/equal-split/result?data=${encodedResult}`;
    try {
      if (isMobile && navigator.share) {
        await navigator.share({ title: '立て替え精算 計算結果', url: shareUrl });
        setShareMsg('シェアしました！');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareMsg('URLをコピーしました！');
      }
    } catch {
      setShareMsg('共有できませんでした。ブラウザの設定を確認してください。');
    }
  };

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={3}
        totalSteps={3}
        title="結果を見る"
        description="1人あたりと、誰が誰にいくら渡すかを確認できます。"
        accentClassName="bg-gradient-to-b from-blue-500 via-sky-500 to-cyan-400"
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
        <summary className="cursor-pointer text-sm font-bold text-slate-800">割り方を調整（任意）</summary>
        <div className="mt-4 space-y-4">
          <p className="text-xs leading-relaxed text-slate-500">100%を基準に、50%は半分、200%は2倍。途中参加や子ども料金にも使えます。名前を共有結果に残す人は「表示のみ」を選べます。変更後に「結果に反映」を押してください。</p>
          {draftMembers.map(member => <div key={member.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
            {people.some(person => person.id === member.id) ? <p className="text-sm font-bold text-slate-800">{member.name || '名前未入力'}</p> :
              <label className="flex items-center gap-2 text-sm text-slate-700">参加者名<input className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3" value={member.name} onChange={event => setDraftMembers(draftMembers.map(item => item.id === member.id ? { ...item, name: event.target.value } : item))} /></label>}
            <ParticipantAdjustment value={member} hasPayment={people.some(person => person.id === member.id && person.payments.some(payment => payment.amount !== 0))}
              onChange={changes => setDraftMembers(draftMembers.map(item => item.id === member.id ? { ...item, ...changes } : item))} />
          </div>)}
          <RoundingSettings options={draftRounding} onChange={setDraftRounding} />
          {!validAdjustment && <p role="alert" className="text-sm text-red-700">負担率は0〜10000%とし、負担する人を1人以上残してください。</p>}
          <button className="btn btn-equal-split w-full" disabled={!validAdjustment} onClick={applyAdjustment}>結果に反映</button>
        </div>
      </details>

      {hasUnappliedChanges && <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">変更はまだ反映されていません。下の負担額・精算金額は変更前の結果です。「結果に反映」を押してください。反映するまで共有・画像保存はできません。</p>}

      <div
        ref={resultRef}
        className="glass-card p-0 overflow-hidden shadow-2xl"
      >
        <div className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] opacity-90">equal split report</p>
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
          {!legacy && <p className="text-xs text-slate-600">丸め方：{roundingLabels[rounding.roundingMode ?? 'floor']}・{rounding.roundingUnit.toLocaleString()}円単位 ／ 差額は{rounding.remainderRecipient === 'payer' ? '立替者で調整' : '全員で調整'}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">1人あたり</p>
              <p className="text-xl font-semibold text-slate-900">{perPersonAmount.toLocaleString()}円</p>
              <p className="text-xs text-slate-500 mt-1">{legacy ? '均等割りの目安' : '均等割り・差額調整前'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">支払い人数</p>
              <p className="text-xl font-semibold text-blue-600">{people.length}人</p>
              <p className="text-xs text-slate-500 mt-1">立て替えた人数</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">未支払い人数</p>
              <p className="text-xl font-semibold text-slate-800">{nonPayingParticipants}人</p>
              <p className="text-xs text-slate-500 mt-1">立て替えていない人数</p>
            </div>
          </div>

          <PaymentStatusSummary
            paymentStatus={paymentStatus}
            maxPayment={maxPayment}
            perPersonAmount={perPersonAmount}
          />

          {!legacy && <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">全員の負担額</h3>
            {charges.map(member => <div key={member.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="font-semibold text-slate-800">{member.name || '名前未入力'}{member.displayOnly ? '（表示のみ）' : member.burdenRate !== 1 ? `（${member.burdenRate * 100}%）` : ''}</span>
              <span>負担 {member.owedAmount.toLocaleString()}円 ／ 立替 {member.paidAmount.toLocaleString()}円</span>
            </div>)}
          </div>}

          <SettlementRouteList transfers={transfers} />

          <DownloadBanner title="総額割り勘 計算結果" url="https://warimaru.meggumi.com/" />
        </div>
      </div>

      {isDetailMode && <PaymentDetailsSection paymentStatus={paymentStatus} />}

      <div className="flex flex-col gap-3 justify-center items-center bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm">
        {shareMsg && <p role="status" className="text-sm text-slate-700">{shareMsg}</p>}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={hasUnappliedChanges}
            className="btn btn-equal-split w-full text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            画像保存
          </button>
          <button
            onClick={handleShare}
            disabled={hasUnappliedChanges}
            className="btn btn-equal-split w-full text-base sm:text-lg"
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
