import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Participant } from '../domain/entities';

export const ParticipantInputStep = ({ onComplete, initialParticipants = [] }: { 
  onComplete?: (participants: Participant[]) => void;
  initialParticipants?: Participant[];
}) => {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

  const handleAdd = () => {
    setParticipants([
      ...participants,
      { id: crypto.randomUUID(), name: '' },
    ]);
  };

  const handleDelete = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleUpdateName = (id: string, newName: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 bg-white/90 space-y-2">
        <p className="text-sm text-slate-500">フェーズ 1 / 2</p>
        <h2 className="text-xl font-semibold text-slate-900">参加者を入力</h2>
        <p className="text-sm text-slate-700">
          食べた人を登録してください。次の画面で料理ごとに食べた人を選ぶと、自動で計算されます。
        </p>
      </div>

      <div className="glass-card p-4 sm:p-5 bg-white/95 border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-lg font-semibold text-slate-900">参加者を登録してください</div>
            <div className="text-sm text-slate-600 mt-1">ニックネームでも本名でもOKです。</div>
          </div>
        </div>

        <div className="space-y-2">
          {participants.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleUpdateName(p.id, e.target.value)}
                className="h-12 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
                placeholder="参加者名"
              />
              <button
                onClick={() => handleDelete(p.id)}
                className="h-12 w-12 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                title="この参加者を削除"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={handleAdd} className="btn btn-waketabe w-full">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            人物追加
          </button>
        </div>
      </div>
      {onComplete && (
        <button
          className="btn btn-waketabe w-full text-lg"
          onClick={() => onComplete(participants)}
          disabled={participants.length === 0}
        >
          次へ
        </button>
      )}
    </div>
  );
};
