import { useState } from 'react';
import { Button } from '../atoms/Button';
import { TextInput } from '../atoms/TextInput';
import { PersonNameEditor } from '../molecules/PersonNameEditor';
import type { Participant } from '../../domain/entities';

export const ParticipantInput = ({ onComplete, initialParticipants = [] }: { 
  onComplete?: (participants: Participant[]) => void;
  initialParticipants?: Participant[];
}) => {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [inputName, setInputName] = useState('');

  const handleAdd = () => {
    if (!inputName.trim()) return;
    setParticipants([
      ...participants,
      { id: crypto.randomUUID(), name: inputName.trim() },
    ]);
    setInputName('');
  };

  const handleDelete = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleUpdateName = (id: string, newName: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  return (
    <>
      <div className="max-w-md mx-auto glass-card p-6 mt-4">
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-800">参加者を登録してください</div>
          <div className="text-sm text-gray-500 mt-1">（ニックネームや本名どちらでもOK）</div>
        </div>
        <form
          className="flex gap-2 mb-4"
          onSubmit={e => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <TextInput
            type="text"
            className="flex-1"
            placeholder="名前を入力"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
          />
          <Button type="submit">
            追加
          </Button>
        </form>
        <ul className="space-y-2">
          {participants.map(p => (
            <li key={p.id} className="bg-white rounded p-2 shadow-sm">
              <PersonNameEditor
                personId={p.id}
                name={p.name}
                onUpdateName={handleUpdateName}
                onDeletePerson={handleDelete}
              />
            </li>
          ))}
        </ul>
      </div>
      {onComplete && (
        <button
          className="btn btn-primary mt-6 w-full text-lg"
          onClick={() => onComplete(participants)}
          disabled={participants.length === 0}
        >
          次へ
        </button>
      )}
    </>
  );
};

