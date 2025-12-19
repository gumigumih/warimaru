import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import type { RootState, AppDispatch } from '../../store/store';
import { addPerson, deletePerson, setDetailMode, setNonPayingParticipants, setPeople } from '../../store/peopleSlice';
import { PersonPaymentForm } from './PersonPaymentForm';

interface InputFormProps {
  onShowResult: (shareData: { people: { name: string; payments: { amount: number }[] }[]; nonPayingParticipants: number }) => void;
}

export const InputForm = ({ onShowResult }: InputFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.people);
  const nonPayingParticipants = useSelector((state: RootState) => state.people.nonPayingParticipants);
  const [totalParticipants, setTotalParticipants] = useState(Math.max(people.length, 2));

  // シンプル入力のみ（各人の合計だけ）を使う
  useEffect(() => {
    dispatch(setDetailMode(false));
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        dispatch(setPeople(decoded.people));
        dispatch(setNonPayingParticipants(decoded.nonPayingParticipants));
      } catch {
        // 不正データは無視
      }
    }
  }, [dispatch]);

  // 人数が減ったときも総人数の下限を合わせる
  useEffect(() => {
    setTotalParticipants((prev) => Math.max(prev, people.length));
    const nonPaying = Math.max(0, totalParticipants - people.length);
    dispatch(setNonPayingParticipants(nonPaying));
  }, [people.length, totalParticipants, dispatch]);

  const handleAddPerson = () => {
    dispatch(addPerson());
  };

  const handleDeletePerson = (personId: string) => {
    if (window.confirm('この人物を削除してもよろしいですか？\n関連する支払い情報もすべて削除されます。')) {
      dispatch(deletePerson(personId));
    }
  };

  const handleShowResult = () => {
    const shareData = {
      people: people.map(p => ({
        name: p.name,
        payments: p.payments.map(pay => ({ amount: pay.amount }))
      })),
      nonPayingParticipants
    };
    onShowResult(shareData);
  };

  const handleTotalParticipantsChange = (value: number) => {
    const num = Number(value);
    if (Number.isNaN(num) || num < people.length) {
      return;
    }
    setTotalParticipants(num);
    dispatch(setNonPayingParticipants(Math.max(0, num - people.length)));
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-3 bg-white/90">
        <p className="text-sm text-slate-600">
          立て替えた人ごとの支払合計だけを入力してください。必要な人数を追加し、合計入力後に結果へ進めます。
        </p>
      </div>

      <div className="space-y-4 glass-card p-4">
        <div className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          <span>支払い</span>
          <span className="text-sm font-normal text-slate-500">立て替えた人の合計金額を入力してください。</span>
        </div>
        {people.map((person) => (
          <div key={person.id}>
            <PersonPaymentForm
              person={person}
              onDeletePerson={handleDeletePerson}
              dispatch={dispatch}
              isDetailMode={false}
            />
          </div>
        ))}

        <div className="space-y-4">
          <button
            onClick={handleAddPerson}
            className="btn btn-warimaru w-full"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            人物追加
          </button>
        </div>
      </div>

      <div className="glass-card p-4 space-y-3">
        <label className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          総人数
          <div className="flex items-center gap-3">
            <input
              id="totalParticipants"
              type="number"
              min={people.length}
              max="300"
              value={totalParticipants}
              onChange={e => {
                if (e.target.value === '') return;
                handleTotalParticipantsChange(Number(e.target.value));
              }}
              className="w-full h-12 rounded-xl bg-white px-3 py-2.5 border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              placeholder={String(people.length)}
            />
            <span className="text-sm text-slate-600 whitespace-nowrap">人</span>
          </div>
        </label>
        <p className="text-xs text-slate-500">
          参加者の総人数を入れると、未払い人数が自動で計算されます（現在 {Math.max(0, totalParticipants - people.length)} 人除外）。
        </p>
      </div>

      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleShowResult}
          className="btn btn-warimaru w-full text-lg shadow-lg"
        >
          計算結果を見る
        </button>
      </div>
    </div>
  );
};
