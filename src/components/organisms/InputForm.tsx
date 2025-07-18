import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import {
  addPerson,
  deletePerson,
  setDetailMode,
  setNonPayingParticipants,
  setPeople,
} from '../../store/peopleSlice';
import { PersonPaymentForm } from './PersonPaymentForm';

interface InputFormProps {
  onShowResult: (shareData: { people: { name: string; payments: { amount: number }[] }[]; nonPayingParticipants: number }) => void;
}

export const InputForm = ({ onShowResult }: InputFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.people);
  const isDetailMode = useSelector((state: RootState) => state.people.isDetailMode);
  const nonPayingParticipants = useSelector((state: RootState) => state.people.nonPayingParticipants);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        dispatch(setPeople(decoded.people));
        dispatch(setNonPayingParticipants(decoded.nonPayingParticipants));
      } catch {
        // データ不正時は何もしない
      }
    }
  }, []);

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

  const handleModeChange = () => {
    if (isDetailMode) {
      const hasMultipleRows = people.some(person => {
        const personForm = document.querySelector(`[data-person-id="${person.id}"]`) as HTMLElement;
        if (personForm) {
          const inputRows = Array.from(personForm.querySelectorAll('input[data-row]')) as HTMLInputElement[];
          return inputRows.length > 2;
        }
        return false;
      });
      
      if (hasMultipleRows) {
        if (!window.confirm('シンプルモードに切り替えると、入力した項目の内訳が消えます。\n合計金額のみが保持されます。\n\n続行しますか？')) {
          return;
        }
      }
    }
    dispatch(setDetailMode(!isDetailMode));
  };

  const handleNonPayingParticipantsChange = (value: number) => {
    dispatch(setNonPayingParticipants(value));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">詳細モード</span>
          <button
            onClick={handleModeChange}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDetailMode
                ? 'bg-blue-600 focus:ring-blue-500'
                : 'bg-gray-300 focus:ring-gray-500'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                isDetailMode ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
        {people.map((person) => (
          <div key={person.id} className="">
            <PersonPaymentForm
              person={person}
              onDeletePerson={handleDeletePerson}
              dispatch={dispatch}
              isDetailMode={isDetailMode}
            />
          </div>
        ))}

        <div className="space-y-4">
          <button
            onClick={handleAddPerson}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            人物追加
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="nonPayingParticipants" className="text-sm text-gray-700 font-medium">
            支払いをしていない人数:
          </label>
          <input
            id="nonPayingParticipants"
            type="number"
            min="0"
            max="100"
            value={nonPayingParticipants === 0 ? '' : nonPayingParticipants}
            onChange={e => {
              const v = e.target.value;
              if (v === '') return; // 空欄のときはdispatchしない
              const num = Number(v);
              if (!isNaN(num)) handleNonPayingParticipantsChange(num);
            }}
            className="w-20 rounded-md bg-white/80 p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">人</span>
        </div>
      </div>

      <button
        onClick={handleShowResult}
        className="w-full px-8 py-4 bg-lime-500 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 font-bold text-lg"
      >
        計算結果を見る
      </button>
    </div>
  );
}; 