import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { setTotalParticipants } from '../../store/peopleSlice';

interface ParticipantCountStepProps {
  onNext: () => void;
}

export const ParticipantCountStep = ({ onNext }: ParticipantCountStepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleCount = useSelector((state: RootState) => state.people.people.length);
  const totalParticipants = useSelector((state: RootState) => state.people.totalParticipants);
  const [inputValue, setInputValue] = useState(totalParticipants);

  useEffect(() => {
    setInputValue(Math.max(peopleCount, totalParticipants));
  }, [peopleCount, totalParticipants]);

  const handleNext = () => {
    const nextValue = Math.max(peopleCount, Math.min(300, Number(inputValue) || 0));
    dispatch(setTotalParticipants(nextValue));
    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="glass-card p-4 bg-white/90 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">フェーズ 1 / 2</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">総人数を入力</h2>
            <p className="text-base text-slate-700 mt-1">
              参加者全員の人数を入力してください。支払い人数との差分から除外する人数を自動で計算します。
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 space-y-4">
        <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          全体の参加者数
          <div className="flex items-center gap-3">
            <input
              id="totalParticipants"
              type="number"
              min={peopleCount}
              max={300}
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setInputValue(peopleCount);
                  return;
                }
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                  setInputValue(parsed);
                }
              }}
              className="w-full h-12 rounded-xl bg-white px-3 py-2.5 border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              placeholder={String(peopleCount)}
            />
            <span className="text-sm text-slate-600 whitespace-nowrap">人</span>
          </div>
        </label>
      </div>

      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleNext}
          className="btn btn-warimaru w-full text-lg shadow-lg"
        >
          次へ（支払い入力）
        </button>
      </div>
    </div>
  );
};
