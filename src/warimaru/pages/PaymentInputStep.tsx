import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import type { RootState, AppDispatch } from '../store/store';
import { addPerson, deletePerson, setDetailMode, updatePersonName } from '../store/peopleSlice';
import { PayerInputCard } from '../components/molecules/PayerInputCard';
import { StepIntro } from '../../shared/components';
import { getRandomName } from '../../utils/randomName';

interface PaymentInputStepProps {
  onNext: () => void;
  onClear: () => void;
}

export const PaymentInputStep = ({ onNext, onClear }: PaymentInputStepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.people);
  const [error, setError] = useState('');
  const handleNext = () => {
    const total = people.reduce((sum, person) => sum + person.payments.reduce((amount, payment) => amount + payment.amount, 0), 0);
    if (people.length === 0 || people.length > 300 || people.some(person => !person.name.trim() || person.payments.some(payment => !Number.isSafeInteger(payment.amount))) || !Number.isSafeInteger(total) || total <= 0) {
      setError('立替者の名前と整数の金額を入力してください。マイナスは返金・買取・減額として使えます。合計は1円以上としてください。');
      return;
    }
    setError('');
    onNext();
  };

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

  const handleRandomName = (personId: string) => {
    dispatch(updatePersonName({
      personId,
      newName: getRandomName(people.map(person => person.name)),
    }));
  };

  return (
    <div className="space-y-4">
      <StepIntro
        currentStep={1}
        totalSteps={3}
        title="誰が払った？"
        description="立て替えた人の名前と、払った合計金額を入力します。"
        accentClassName="bg-gradient-to-b from-blue-500 via-sky-500 to-cyan-400"
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

      <div className="space-y-4 glass-card p-4">
        <div className="flex flex-col gap-2 text-lg font-semibold text-slate-900 w-full">
          <span>支払い</span>
          <span className="text-sm font-normal text-slate-500">払った人だけ追加して、名前と金額を入力してください。マイナスは返金・買取・減額に使えます。</span>
        </div>
        {people.map((person) => (
          <div key={person.id}>
            <PayerInputCard
              person={person}
              onRandomName={handleRandomName}
              onDeletePerson={handleDeletePerson}
              dispatch={dispatch}
              isDetailMode={false}
            />
          </div>
        ))}

        <div className="space-y-4">
          <button
            onClick={handleAddPerson}
            className="btn btn-add w-full"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            人物追加
          </button>
        </div>
      </div>

      <div className="sticky bottom-4 z-10">
        {error && <p role="alert" className="mb-2 text-sm text-red-700">{error}</p>}
        <button
          onClick={handleNext}
          className="btn btn-equal-split w-full text-lg shadow-lg"
        >
          次へ
        </button>
      </div>
    </div>
  );
};
