import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Person, PaymentItem } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPlus, faCheck, faTimes, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import {
  addPerson,
  updatePersonName,
  deletePerson,
  addPayment,
  updatePayment,
  deletePayment,
} from '../store/peopleSlice';

interface InputFormProps {
  onShowResult: () => void;
}

export const InputForm = ({ onShowResult }: InputFormProps) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people);

  useEffect(() => {
    console.log('Redux Store State:', people);
  }, [people]);

  const handleAddPerson = () => {
    dispatch(addPerson());
  };

  const handleDeletePerson = (personId: string) => {
    if (window.confirm('この人物を削除してもよろしいですか？\n関連する支払い情報もすべて削除されます。')) {
      dispatch(deletePerson(personId));
    }
  };

  const handleShowResult = () => {
    // 各人物の入力行を保存
    people.forEach(person => {
      // 既存の項目をクリア
      person.payments.forEach(payment => {
        dispatch(deletePayment({
          personId: person.id,
          paymentId: payment.id,
        }));
      });

      const personForm = document.querySelector(`[data-person-id="${person.id}"]`) as HTMLElement;
      if (personForm) {
        const inputRows = Array.from(personForm.querySelectorAll('input[data-row]')) as HTMLInputElement[];
        const rows: { amount: string; description: string }[] = [];
        
        // 2つずつ（金額と項目名）グループ化
        for (let i = 0; i < inputRows.length; i += 2) {
          const amountInput = inputRows[i];
          const descriptionInput = inputRows[i + 1];
          
          if (amountInput && descriptionInput) {
            const amount = amountInput.value;
            const description = descriptionInput.value;
            
            // 金額か項目名のどちらかが入力されている場合
            if (amount || description) {
              rows.push({
                amount: amount || '0',
                description: description || '未入力',
              });
            }
          }
        }

        // 入力された行を保存
        rows.forEach(row => {
          dispatch(addPayment({
            personId: person.id,
            payment: {
              amount: Number(row.amount),
              description: row.description,
            }
          }));
        });
      }
    });

    onShowResult();
  };

  const handleAddPayment = (personId: string, payment: Omit<PaymentItem, 'id'>) => {
    console.log('Adding payment:', { personId, payment });
    dispatch(addPayment({ personId, payment }));
  };

  const handleUpdatePersonName = (personId: string, newName: string) => {
    console.log('Updating person name:', { personId, newName });
    dispatch(updatePersonName({ personId, newName }));
  };

  const handleUpdatePayment = (personId: string, paymentId: string, updatedPayment: Omit<PaymentItem, 'id'>) => {
    console.log('Updating payment:', { personId, paymentId, updatedPayment });
    dispatch(updatePayment({ personId, paymentId, payment: updatedPayment }));
  };

  const handleDeletePayment = (personId: string, paymentId: string) => {
    if (window.confirm('この項目を削除してもよろしいですか？')) {
      console.log('Deleting payment:', { personId, paymentId });
      dispatch(deletePayment({ personId, paymentId }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={handleShowResult}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          計算結果を見る
        </button>
        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleteMode
              ? 'bg-red-600 focus:ring-red-500'
              : 'bg-gray-300 focus:ring-gray-500'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
              isDeleteMode ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={`absolute left-2 text-sm transition-colors ${
              isDeleteMode ? 'text-white' : 'text-gray-600'
            }`}
          />
          <span className={`absolute right-2 text-xs font-medium ${
              isDeleteMode ? 'text-red-600' : 'text-gray-600'
            }`}>
            {isDeleteMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {people.map((person) => (
        <div key={person.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm relative">
          <PersonPaymentForm
            person={person}
            onAddPayment={handleAddPayment}
            onUpdateName={handleUpdatePersonName}
            onDeletePerson={handleDeletePerson}
            isDeleteMode={isDeleteMode}
            dispatch={dispatch}
          />
        </div>
      ))}

      <button
        onClick={handleAddPerson}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
        人物追加
      </button>
    </div>
  );
};

interface PersonPaymentFormProps {
  person: Person;
  onAddPayment: (personId: string, payment: Omit<PaymentItem, 'id'>) => void;
  onUpdateName: (personId: string, newName: string) => void;
  onDeletePerson: (personId: string) => void;
  isDeleteMode: boolean;
  dispatch: AppDispatch;
}

const PersonPaymentForm = ({ person, onAddPayment, onUpdateName, onDeletePerson, isDeleteMode, dispatch }: PersonPaymentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [inputRows, setInputRows] = useState<{ id: string; amount: string; description: string }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時のみ実行
  useEffect(() => {
    if (!isInitialized) {
      if (person.payments.length > 0) {
        setInputRows(
          person.payments.map(payment => ({
            id: payment.id,
            amount: String(payment.amount),
            description: payment.description,
          }))
        );
      } else {
        setInputRows([{ id: crypto.randomUUID(), amount: '', description: '' }]);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 支払いが削除された場合のみ更新
  useEffect(() => {
    if (isInitialized && person.payments.length === 0) {
      setInputRows([{ id: crypto.randomUUID(), amount: '', description: '' }]);
    }
  }, [person.payments.length, isInitialized]);

  const handleAddRow = () => {
    setInputRows([...inputRows, { id: crypto.randomUUID(), amount: '', description: '' }]);
  };

  const handleRowChange = (index: number, field: 'amount' | 'description', value: string) => {
    const newRows = [...inputRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setInputRows(newRows);

    // 行の値を更新（空の値も含む）
    const row = newRows[index];
    if (row.id) {
      dispatch(updatePayment({
        personId: person.id,
        paymentId: row.id,
        payment: {
          amount: Number(row.amount) || 0,
          description: row.description || '',
        }
      }));
    }
  };

  const handleKeyDown = (index: number, field: 'amount' | 'description', e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentRow = inputRows[index];
    const isRowEmpty = !currentRow.amount && !currentRow.description;
    const isRowComplete = currentRow.amount && currentRow.description;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRowComplete) {
        // 新しい支払いを追加
        const newPaymentId = crypto.randomUUID();
        dispatch(addPayment({
          personId: person.id,
          payment: {
            amount: Number(currentRow.amount),
            description: currentRow.description,
          }
        }));
        // 新しい空の行を追加
        setInputRows([...inputRows, { id: newPaymentId, amount: '', description: '' }]);
        // 次の行の入力フィールドにフォーカス
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-row="${index + 1}"][data-field="${field}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      } else if (index === inputRows.length - 1 && !isRowEmpty) {
        // 新しい空の行を追加
        const newPaymentId = crypto.randomUUID();
        setInputRows([...inputRows, { id: newPaymentId, amount: '', description: '' }]);
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-row="${index + 1}"][data-field="${field}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      } else if (index < inputRows.length - 1) {
        const nextInput = document.querySelector(`input[data-row="${index + 1}"][data-field="${field}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentInput = e.currentTarget;
      const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
      const currentIndex = allInputs.indexOf(currentInput);
      if (currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentInput = e.currentTarget;
      const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
      const currentIndex = allInputs.indexOf(currentInput);
      if (currentIndex > 0) {
        allInputs[currentIndex - 1].focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentInput = e.currentTarget;
      const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
      const currentIndex = allInputs.indexOf(currentInput);
      const inputsPerRow = 2; // 金額と項目名の2つ
      const nextIndex = currentIndex + inputsPerRow;
      if (nextIndex < allInputs.length) {
        allInputs[nextIndex].focus();
      } else if (index === inputRows.length - 1 && !isRowEmpty) {
        handleAddRow();
        setTimeout(() => {
          const newInput = document.querySelector(`input[data-row="${index + 1}"][data-field="${field}"]`) as HTMLInputElement;
          if (newInput) {
            newInput.focus();
          }
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentInput = e.currentTarget;
      const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
      const currentIndex = allInputs.indexOf(currentInput);
      const inputsPerRow = 2; // 金額と項目名の2つ
      const prevIndex = currentIndex - inputsPerRow;
      if (prevIndex >= 0) {
        allInputs[prevIndex].focus();
      }
    }
  };

  const renderPaymentRow = (row: { id: string; amount: string; description: string }, index: number) => {
    return (
      <div key={row.id} className="flex gap-2 items-center">
        <input
          type="number"
          value={row.amount}
          onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, 'amount', e)}
          data-row={index}
          data-field="amount"
          placeholder="金額"
          className="w-32 rounded-md bg-white/80 p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
        />
        <input
          type="text"
          value={row.description}
          onChange={(e) => handleRowChange(index, 'description', e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, 'description', e)}
          data-row={index}
          data-field="description"
          placeholder="項目名"
          className="flex-1 rounded-md bg-white/80 p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {isDeleteMode && row.id && (
          <button
            onClick={() => {
              if (window.confirm('この項目を削除してもよろしいですか？')) {
                dispatch(deletePayment({ personId: person.id, paymentId: row.id }));
              }
            }}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="項目を削除"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4" data-person-id={person.id}>
      <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedName.replace(/さん$/, '')}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-lg font-medium text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedName(person.name);
              }}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedName(person.name);
              }}
              className="text-gray-600 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            {isDeleteMode && (
              <button
                onClick={() => onDeletePerson(person.id)}
                className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                title="人物を削除"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {inputRows.map((row, index) => renderPaymentRow(row, index))}
        <button
          onClick={handleAddRow}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          行追加
        </button>
      </div>
    </div>
  );
}; 