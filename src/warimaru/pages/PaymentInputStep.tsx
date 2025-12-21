import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { RootState, AppDispatch } from '../store/store';
import { addPerson, deletePerson, setDetailMode } from '../store/peopleSlice';
import { PayerInputCard } from '../components/molecules/PayerInputCard';

interface PaymentInputStepProps {
  onShowResult: (shareData: { people: { name: string; payments: { amount: number }[] }[]; totalParticipants: number; nonPayingParticipants: number }) => void;
  onBack: () => void;
}

export const PaymentInputStep = ({ onShowResult, onBack }: PaymentInputStepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.people);
  const totalParticipants = useSelector((state: RootState) => state.people.totalParticipants);
  const nonPayingParticipants = useSelector((state: RootState) => state.people.nonPayingParticipants);

  // シンプル入力のみ（各人の合計だけ）を使う
  useEffect(() => {
    dispatch(setDetailMode(false));
  }, [dispatch]);

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
      people: people.map((p) => ({
        name: p.name,
        payments: p.payments.map((pay) => ({ amount: pay.amount }))
      })),
      totalParticipants,
      nonPayingParticipants
    };
    onShowResult(shareData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="btn btn-neutral">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          戻る
        </button>
      </div>

      <div className="glass-card p-4 bg-white/90 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">フェーズ 2 / 2</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">支払いを入力</h2>
            <p className="text-base text-slate-700 mt-1">
              立て替えた人ごとの合計金額を入力してください。人数を追加し終わったら計算結果へ進めます。
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">総人数</p>
            <p className="text-lg font-semibold text-slate-900">{totalParticipants}人</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">支払い人数</p>
            <p className="text-lg font-semibold text-blue-600">{people.length}人</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">未払い人数</p>
            <p className="text-lg font-semibold text-slate-800">{nonPayingParticipants}人</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 glass-card p-4">
        <div className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          <span>支払い</span>
          <span className="text-sm font-normal text-slate-500">立て替えた人の合計金額を入力してください。</span>
        </div>
        {people.map((person) => (
          <div key={person.id}>
            <PayerInputCard
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
