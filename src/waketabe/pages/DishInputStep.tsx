import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Participant, Dish, SplitOptions } from '../domain/entities';
import { AmountInput } from '../../components/atoms/AmountInput';
import { StepIntro } from '../../components/templates/StepIntro';
import { parseAmount, adjustedAmount, defaultSplitOptions } from '../../domain/split';

export const DishInputStep = ({ participants, options = defaultSplitOptions, onComplete, onBack, initialDishes = [], onClear }: {
  participants: Participant[]; 
  options?: SplitOptions;
  onComplete?: (dishes: Dish[]) => void;
  onBack?: () => void;
  initialDishes?: Dish[];
  onClear?: () => void;
}) => {
  const [dishes, setDishes] = useState<Dish[]>(() => initialDishes.map(dish => ({
    ...dish,
    paidBy: participants.some(p => p.id === dish.paidBy && !p.displayOnly) ? dish.paidBy : '',
    eaters: dish.eaters.filter(id => participants.some(p => p.id === id)),
  })));
  const [error, setError] = useState<string>('');

  const handleAddDish = () => {
    setDishes([
      ...dishes,
      { id: crypto.randomUUID(), name: '', price: '', eaters: [], paidBy: '' }
    ]);
  };

  const handleUpdateDish = (id: string, field: 'name' | 'price' | 'paidBy', value: string) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleUpdateEaters = (id: string, eaters: string[]) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, eaters } : d));
  };

  const handleDeleteDish = (id: string) => {
    if (window.confirm('この項目を削除してもよろしいですか？')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  const handleComplete = () => {
    // 最低限のバリデーション: 空の項目を除外し、対象者がいない行はエラー
    const validDishes = dishes.filter(d => d.name.trim() || d.price.trim() || d.eaters.length > 0);
    if (validDishes.length === 0) {
      setError('項目を1つ以上入力してください。');
      return;
    }
    if (validDishes.some(d => d.name.trim() === '' || !Number.isSafeInteger(parseAmount(d.price)) || parseAmount(d.price) <= 0 ||
      !d.eaters.some(id => participants.some(p => p.id === id && !p.displayOnly && p.burdenRate > 0)) ||
      (d.paidBy !== '' && !participants.some(p => p.id === d.paidBy && !p.displayOnly)))) {
      setError('項目名・正の整数の金額・負担する対象者を入力し、立替者を確認してください。');
      return;
    }
    const subtotal = validDishes.reduce((sum, dish) => sum + parseAmount(dish.price), 0);
    if (!Number.isSafeInteger(adjustedAmount(subtotal, options))) {
      setError('合計金額（税・サービス料込み）が計算できる上限を超えています。金額を小さくしてください。');
      return;
    }
    setError('');
    onComplete?.(validDishes);
  };

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={2}
        totalSteps={3}
        title="何を割る？"
        description="項目名・金額と、負担する人を選びます。支払い済みなら立替者も指定してください。"
        accentClassName="bg-gradient-to-b from-orange-500 via-amber-500 to-yellow-500"
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
            onClick={() => {
              setDishes([]);
              onClear?.();
            }}
            className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
          >
            クリア
          </button>
        }
      />

      <div className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-4">
        <div className="text-lg font-semibold text-slate-900">項目の行を追加して入力してください</div>

        <div className="space-y-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  <span>項目名</span>
                  <input
                    type="text"
                    value={dish.name}
                    onChange={(e) => handleUpdateDish(dish.id, 'name', e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                    placeholder="項目名（例：宿代）"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  <span>立替者</span>
                  <select
                    value={dish.paidBy}
                    onChange={(e) => handleUpdateDish(dish.id, 'paidBy', e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                  >
                    <option value="">未会計（負担額だけ計算）</option>
                    {participants.filter(participant => !participant.displayOnly).map(participant => (
                      <option key={participant.id} value={participant.id}>{participant.name || '名前未入力'}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  <span>金額</span>
                  <AmountInput
                    value={dish.price}
                    onChange={(value) => handleUpdateDish(dish.id, 'price', value)}
                    title={dish.name ? `${dish.name}の金額を入力` : '項目の金額を入力'}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                    placeholder="3000"
                  />
                </label>
                <div className="flex justify-end pt-5 sm:pt-0">
                  <button
                    onClick={() => handleDeleteDish(dish.id)}
                    className="icon-field-button icon-field-button-danger"
                    title="この項目を削除"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm font-medium text-slate-700 min-w-[60px]">対象者</div>
                <div className="flex flex-wrap gap-2">
                  {participants.filter(p => !p.displayOnly && p.burdenRate > 0).map((p) => {
                    const checked = dish.eaters.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => {
                          const next = checked
                            ? dish.eaters.filter(id => id !== p.id)
                            : [...dish.eaters, p.id];
                          handleUpdateEaters(dish.id, next);
                        }}
                        className={`px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                          checked
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-200'
                        }`}
                      >
                          {p.name || '名前未入力'}{p.burdenRate !== 1 ? ` (${Math.round(p.burdenRate * 100)}%)` : ''}
                        </button>
                      );
                    })}
                </div>
                {participants.some(p => p.displayOnly) && (
                  <div className="text-xs text-slate-500">表示のみの参加者は精算対象から除外されます。</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <div className="flex">
          <button type="button" onClick={handleAddDish} className="btn btn-add w-full">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            項目追加
          </button>
        </div>
      </div>

      {onComplete && (
        <button
          className="btn btn-meal-split w-full text-lg"
          onClick={handleComplete}
          disabled={dishes.length === 0}
        >
          計算結果へ
        </button>
      )}
    </div>
  );
};
