import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Participant, Dish, DishPayment, SplitOptions } from '../domain/entities';
import { AmountInput, StepIntro } from '../../shared/components';
import { parseAmount, adjustedAmount, defaultSplitOptions } from '../../shared/domain/split';
import { getDishPayments } from '../domain/usecases/dishPayments';
import { decodeMealShareData } from '../domain/usecases/shareData';

const fieldClass = 'h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-emerald-400 focus:ring-emerald-200';
const createPayment = (): DishPayment => ({ id: crypto.randomUUID(), paidBy: '', amount: '' });

export const PotluckInputStep = ({ participants, options = defaultSplitOptions, onComplete, onBack, initialDishes = [], onClear }: {
  participants: Participant[];
  options?: SplitOptions;
  onComplete?: (dishes: Dish[]) => void;
  onBack?: (dishes: Dish[]) => void;
  initialDishes?: Dish[];
  onClear?: () => void;
}) => {
  const [dishes, setDishes] = useState<Dish[]>(() => initialDishes.map(dish => ({
    ...dish,
    paidBy: '',
    payments: getDishPayments(dish).map(payment => ({
      ...payment,
      paidBy: participants.some(p => p.id === payment.paidBy && !p.displayOnly) ? payment.paidBy : '',
    })),
    eaters: dish.eaters.filter(id => participants.some(p => p.id === id)),
  })));
  const [selectedId, setSelectedId] = useState(initialDishes[0]?.id ?? '');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const dish = dishes.find(item => item.id === selectedId) ?? dishes[0];
  const eligible = participants.filter(p => !p.displayOnly && p.burdenRate > 0);
  const total = dishes.reduce((sum, item) => sum + parseAmount(item.price), 0);

  const handleAddDish = () => {
    const name = newName.trim();
    if (!name) return;
    const existing = dishes.find(item => item.name.trim() === name);
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const item: Dish = { id: crypto.randomUUID(), name, price: '0', eaters: [], paidBy: '', payments: [createPayment()] };
      setDishes([...dishes, item]);
      setSelectedId(item.id);
    }
    setNewName('');
    setError('');
  };

  const updateDish = (changes: Partial<Dish>) => {
    if (!dish) return;
    setDishes(dishes.map(item => item.id === dish.id ? { ...item, ...changes } : item));
    setError('');
  };

  const updatePayments = (payments: DishPayment[]) => {
    updateDish({ payments, price: String(payments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0)) });
  };

  const handleDeleteDish = () => {
    if (!dish || !window.confirm('この費目と立替の入力を削除してもよろしいですか？')) return;
    const remaining = dishes.filter(item => item.id !== dish.id);
    setDishes(remaining);
    setSelectedId(remaining[0]?.id ?? '');
    setError('');
  };

  const handleComplete = () => {
    const invalidPayment = dishes.find(item => getDishPayments(item).some(payment => !Number.isSafeInteger(parseAmount(payment.amount)) ||
      (parseAmount(payment.amount) < 0 && !payment.paidBy)));
    if (invalidPayment) {
      setSelectedId(invalidPayment.id);
      setError('金額は整数で入力してください。マイナスの金額には対象者を指定してください。');
      return;
    }
    const normalized = dishes.map(item => {
      const payments = getDishPayments(item).filter(payment => parseAmount(payment.amount) !== 0);
      return { ...item, paidBy: '', payments, price: String(payments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0)) };
    });
    const subtotal = normalized.reduce((sum, item) => sum + parseAmount(item.price), 0);
    if (!Number.isSafeInteger(adjustedAmount(subtotal, options))) {
      setError('合計金額（税・サービス料込み）が計算できる上限を超えています。金額を小さくしてください。');
      return;
    }
    const decoded = decodeMealShareData({ version: 3, participants, dishes: normalized, options });
    if (!decoded) {
      const invalid = normalized.find(item => !decodeMealShareData({ version: 3, participants, dishes: [item], options }));
      if (invalid) setSelectedId(invalid.id);
      setError('「' + (invalid?.name || '費目') + '」に、名前・正の合計金額・負担する参加者を入力し、マイナスの金額には対象者を指定してください。');
      return;
    }
    setError('');
    onComplete?.(decoded.dishes);
  };

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={2}
        totalSteps={3}
        title="費目と支払いを登録"
        description="酒代は飲む人だけ、料理代は全員など、費目ごとに参加者と複数人の立替額を登録します。"
        accentClassName="bg-gradient-to-b from-orange-500 via-amber-500 to-yellow-500"
        action={<button onClick={() => onBack?.(dishes)} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-500 transition hover:text-slate-950" aria-label="戻る">
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />戻る
        </button>}
        endAction={<button type="button" onClick={() => { setDishes([]); setSelectedId(''); setNewName(''); setError(''); onClear?.(); }} className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950">クリア</button>}
      />

      <div className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-4">
        <form className="flex flex-col sm:flex-row items-end gap-2" onSubmit={event => { event.preventDefault(); handleAddDish(); }}>
          <label className="flex w-full flex-col gap-1 text-sm font-medium text-slate-700">
            新しい費目・品目
            <input className={fieldClass} value={newName} onChange={event => setNewName(event.target.value)} placeholder="例：酒代、温泉代、料理名" />
          </label>
          <button type="submit" disabled={!newName.trim()} className="btn btn-add w-full sm:w-auto shrink-0"><FontAwesomeIcon icon={faPlus} className="mr-2" />費目を登録</button>
        </form>
        {dishes.length > 0 ? <>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            入力する費目
            <select className={fieldClass} value={dish?.id ?? ''} onChange={event => { setSelectedId(event.target.value); setError(''); }}>
              {dishes.map(item => <option key={item.id} value={item.id}>{item.name || '名前未入力'}（{Number.isFinite(parseAmount(item.price)) ? parseAmount(item.price).toLocaleString() + '円' : '金額を確認'}）</option>)}
            </select>
          </label>
          <p className="text-sm text-slate-600">{dishes.length}費目 ／ 入力合計 {Number.isFinite(total) ? total.toLocaleString() + '円' : '金額を確認してください'}</p>
        </> : <p className="text-sm text-slate-500">最初に費目を登録してください。同じ費目を登録すると、登録済みの費目を選択します。</p>}
      </div>

      {dish && <section className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-5">
        <div className="flex items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
            費目名・品目名
            <input className={fieldClass} value={dish.name} onChange={event => updateDish({ name: event.target.value })} />
          </label>
          <button type="button" onClick={handleDeleteDish} className="icon-field-button icon-field-button-danger" aria-label="この費目を削除"><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800">この費目に参加した人（負担する人）</h3>
          <p className="text-xs text-slate-500">立替者とは別に選びます。この設定は、この費目のすべての支払いに適用されます。</p>
          <div className="flex flex-wrap gap-2">
            {eligible.map(p => <button key={p.id} type="button" aria-pressed={dish.eaters.includes(p.id)}
              onClick={() => updateDish({ eaters: dish.eaters.includes(p.id) ? dish.eaters.filter(id => id !== p.id) : [...dish.eaters, p.id] })}
              className={'px-3 py-2 rounded-full border text-sm font-medium transition-colors ' + (dish.eaters.includes(p.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200')}>
              {p.name || '名前未入力'}{p.burdenRate !== 1 ? ' (' + Math.round(p.burdenRate * 100) + '%)' : ''}
            </button>)}
          </div>
          <button type="button" className="text-sm font-semibold text-emerald-700" onClick={() => updateDish({ eaters: eligible.map(p => p.id) })}>全員を選ぶ</button>
          {participants.some(p => p.displayOnly) && <p className="text-xs text-slate-500">表示のみの参加者は負担する人から除外されます。</p>}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800">この費目を誰がいくら払った？</h3>
          <p className="text-xs text-slate-500">プラスは立替、マイナスは返金・買取・減額です。マイナスの金額にも対象者を指定してください。</p>
          {getDishPayments(dish).map((payment, index, payments) => <div key={payment.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-end gap-2 rounded-lg border border-slate-200 p-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {'立替者（' + (index + 1) + '件目）'}
              <select className={fieldClass} value={payment.paidBy} onChange={event => updatePayments(payments.map(item => item.id === payment.id ? { ...item, paidBy: event.target.value } : item))}>
                <option value="">未会計（負担額だけ計算）</option>
                {participants.filter(p => !p.displayOnly).map(p => <option key={p.id} value={p.id}>{p.name || '名前未入力'}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {'金額（' + (index + 1) + '件目・マイナス可）'}
              <AmountInput className={fieldClass} value={payment.amount} onChange={amount => updatePayments(payments.map(item => item.id === payment.id ? { ...item, amount } : item))}
                title={dish.name + 'の支払・減額を入力（' + (index + 1) + '件目）'} placeholder="3000" allowNegative />
            </label>
            <button type="button" disabled={payments.length === 1} aria-label={'立替を削除（' + (index + 1) + '件目）'} className="icon-field-button icon-field-button-danger disabled:opacity-40"
              onClick={() => { if (window.confirm('この立替の入力を削除してもよろしいですか？')) updatePayments(payments.filter(item => item.id !== payment.id)); }}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>)}
          <button type="button" className="btn btn-add w-full" onClick={() => updatePayments([...getDishPayments(dish), createPayment()])}><FontAwesomeIcon icon={faPlus} className="mr-2" />立替を追加</button>
          <p className="text-sm font-semibold text-slate-700">この費目の合計 {Number.isFinite(parseAmount(dish.price)) ? parseAmount(dish.price).toLocaleString() + '円' : '金額を確認してください'}</p>
        </div>
      </section>}

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {onComplete && <button className="btn btn-potluck-split w-full text-lg" onClick={handleComplete} disabled={dishes.length === 0}>計算結果へ</button>}
    </div>
  );
};
