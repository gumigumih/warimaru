import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { RootState, AppDispatch } from '../store/store';
import { setTotalParticipants } from '../store/peopleSlice';
import { StepIntro } from '../../components/templates/StepIntro';

interface ParticipantCountStepProps {
  onNext: () => void;
  onBack: () => void;
  onClear: () => void;
}

export const ParticipantCountStep = ({ onNext, onBack, onClear }: ParticipantCountStepProps) => {
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
      <StepIntro
        currentStep={2}
        totalSteps={3}
        title="誰で割る？"
        description="払っていない人も含めて、割り勘に入る人数を決めます。"
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

      <div className="glass-card p-4 space-y-4">
        <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          割る人数
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
          className="btn btn-equal-split w-full text-lg shadow-lg"
        >
          結果を見る
        </button>
      </div>
    </div>
  );
};
