import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faUserPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Participant } from '../domain/entities';
import { StepIntro, ParticipantAdjustment } from '../../components';
import { getRandomName } from '../../../utils/randomName';

const createBlankParticipant = (): Participant => ({
  id: crypto.randomUUID(),
  name: '',
  displayOnly: false,
  burdenRate: 1,
});

export const ParticipantInputStep = ({ onComplete, initialParticipants = [], onClear, potluck = false }: {
  onComplete?: (participants: Participant[]) => void;
  initialParticipants?: Participant[];
  onClear?: () => void;
  potluck?: boolean;
}) => {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants.length > 0 ? initialParticipants : [createBlankParticipant()]
  );
  const validParticipants = participants.filter(participant => participant.name.trim() !== '');
  const needsRecovery = validParticipants.length > 0 && (!validParticipants.some(p => !p.displayOnly && p.burdenRate > 0) ||
    validParticipants.some(p => !Number.isFinite(p.burdenRate) || p.burdenRate < 0 || p.burdenRate > 100));

  const handleAdd = () => {
    setParticipants([
      ...participants,
      createBlankParticipant(),
    ]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('この参加者を削除してもよろしいですか？')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleUpdateName = (id: string, newName: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleRandomName = (id: string) => {
    const nextName = getRandomName(participants.map(participant => participant.name));
    handleUpdateName(id, nextName);
  };

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={1}
        totalSteps={3}
        title="誰で割る？"
        description="参加者の名前を登録します。負担率や表示のみの設定は、結果を見ながら調整できます。"
        accentClassName="bg-gradient-to-b from-orange-500 via-amber-500 to-yellow-500"
        endAction={
          <button
            type="button"
            onClick={() => {
              setParticipants([createBlankParticipant()]);
              onClear?.();
            }}
            className="text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
          >
            クリア
          </button>
        }
      />

      <div className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-lg font-semibold text-slate-900">参加者を登録してください</div>
            <div className="text-sm text-slate-600 mt-1">ニックネームでも本名でもOKです。</div>
          </div>
        </div>

        <div className="space-y-2">
          {participants.map(p => (
            <div key={p.id} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleUpdateName(p.id, e.target.value)}
                className="h-12 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                aria-label="参加者名"
                placeholder="名前"
              />
              <button
                type="button"
                onClick={() => handleRandomName(p.id)}
                className="icon-field-button"
                title="ランダムな名前を入れる"
                aria-label="ランダムな名前を入れる"
              >
                <FontAwesomeIcon icon={faDice} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="icon-field-button icon-field-button-danger"
                title="この参加者を削除"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              </div>
              {(p.displayOnly || p.burdenRate !== 1) && <p className="text-xs text-slate-500">{p.displayOnly ? '表示のみ' : `負担率 ${p.burdenRate * 100}%`}（結果画面で調整）</p>}
              {needsRecovery && <ParticipantAdjustment value={p} onChange={changes => setParticipants(participants.map(item => item.id === p.id ? { ...item, ...changes } : item))} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={handleAdd} className="btn btn-add w-full">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            人物追加
          </button>
        </div>
      </div>
      {onComplete && (
        <button
          className={`btn ${potluck ? 'btn-potluck-split' : 'btn-meal-split'} w-full text-lg`}
          onClick={() => onComplete(validParticipants)}
          disabled={validParticipants.length === 0 || validParticipants.length > 300 ||
            validParticipants.some(p => !Number.isFinite(p.burdenRate) || p.burdenRate < 0 || p.burdenRate > 100) ||
            !validParticipants.some(p => !p.displayOnly && p.burdenRate > 0)}
        >
          次へ
        </button>
      )}
      {needsRecovery && <p role="alert" className="text-sm text-red-700">負担する人がいなくなりました。上の設定で「表示のみ」を外し、負担率を0より大きくしてください。</p>}
    </div>
  );
};
