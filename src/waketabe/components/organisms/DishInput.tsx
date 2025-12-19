import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Participant, Dish } from '../../domain/entities';

export const DishInput = ({ participants, onComplete, onBack, initialDishes = [] }: { 
  participants: Participant[]; 
  onComplete?: (dishes: Dish[]) => void;
  onBack?: () => void;
  initialDishes?: Dish[];
}) => {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [error, setError] = useState<string>('');

  const handleAddDish = () => {
    setDishes([
      ...dishes,
      { id: crypto.randomUUID(), name: '', price: '', eaters: [] }
    ]);
  };

  const handleUpdateDish = (id: string, field: 'name' | 'price', value: string) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleUpdateEaters = (id: string, eaters: string[]) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, eaters } : d));
  };

  const handleDeleteDish = (id: string) => {
    if (window.confirm('この料理を削除してもよろしいですか？')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  const handleComplete = () => {
    // 最低限のバリデーション: 空の料理を除外し、食べた人がいない行はエラー
    const validDishes = dishes.filter(d => d.name.trim() || d.price.trim() || d.eaters.length > 0);
    if (validDishes.length === 0) {
      setError('料理を1つ以上入力してください。');
      return;
    }
    if (validDishes.some(d => d.name.trim() === '' || d.price.trim() === '' || d.eaters.length === 0)) {
      setError('料理名・金額・食べた人をすべて入力してください。');
      return;
    }
    setError('');
    onComplete?.(validDishes);
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <div className="flex justify-start mb-2">
          <button
            onClick={onBack}
            className="btn btn-neutral"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </div>
      )}

      <div className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">料理の行を追加して入力してください</div>
          <div className="text-sm text-slate-600 mt-1">料理名・金額・食べた人を順番に埋めてください。</div>
        </div>

        <div className="space-y-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  <input
                    type="text"
                    value={dish.name}
                    onChange={(e) => handleUpdateDish(dish.id, 'name', e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                    placeholder="料理名"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  <input
                    type="text"
                    value={dish.price}
                    onChange={(e) => handleUpdateDish(dish.id, 'price', e.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                    placeholder="3000"
                  />
                </label>
                <div className="flex justify-end pt-5 sm:pt-0">
                  <button
                    onClick={() => handleDeleteDish(dish.id)}
                    className="h-12 w-12 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    title="この料理を削除"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 space-y-1">
                <div className="text-sm font-medium text-slate-700 min-w-[60px]">食べた人</div>
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => {
                    const checked = dish.eaters.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
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
                        {p.name || '名前未入力'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <div className="flex">
          <button type="button" onClick={handleAddDish} className="btn btn-waketabe w-full">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            料理追加
          </button>
        </div>
      </div>

      {onComplete && (
        <button
          className="btn btn-waketabe w-full text-lg"
          onClick={handleComplete}
          disabled={dishes.length === 0}
        >
          次へ
        </button>
      )}
    </div>
  );
};
