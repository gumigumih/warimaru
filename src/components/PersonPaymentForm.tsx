import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Person } from '../types';
import type { AppDispatch } from '../store/store';
import { addPayment } from '../store/peopleSlice';
import type { KeyboardEvent } from 'react';
import { PersonNameEditor } from './PersonNameEditor';
import { PaymentRow } from './PaymentRow';
import { SimplePaymentInput } from './SimplePaymentInput';

interface PersonPaymentFormProps {
  person: Person;
  onDeletePerson: (personId: string) => void;
  dispatch: AppDispatch;
  isDetailMode: boolean;
}

export const PersonPaymentForm = ({ person, onDeletePerson, dispatch, isDetailMode }: PersonPaymentFormProps) => {
  const [inputRows, setInputRows] = useState<{ id: string; amount: string; description: string }[]>([]);
  const [simpleTotal, setSimpleTotal] = useState('');

  // ストアの状態と入力フォームの状態を同期
  useEffect(() => {
    if (isDetailMode) {
      // 詳細モードの場合、支払い情報を入力行に反映
      const newRows = person.payments.map(payment => ({
        id: payment.id,
        amount: String(payment.amount),
        description: payment.description,
      }));
      // 空の行が1つもない場合は追加
      if (newRows.length === 0 || newRows.every(row => row.amount || row.description)) {
        newRows.push({ id: crypto.randomUUID(), amount: '', description: '' });
      }
      setInputRows(newRows);
    } else {
      // シンプルモードの場合、合計額を反映
      const total = person.payments.reduce((sum, payment) => sum + payment.amount, 0);
      setSimpleTotal(String(total));
    }
  }, [person.payments, isDetailMode]);

  const handleAddRow = () => {
    setInputRows([...inputRows, { id: crypto.randomUUID(), amount: '', description: '' }]);
  };

  const handleKeyDown = (index: number, field: 'amount' | 'description', e: KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <div className="space-y-4" data-person-id={person.id}>
      <div className="flex items-center gap-2 pb-2">
        <PersonNameEditor
          personId={person.id}
          name={person.name}
          dispatch={dispatch}
          onDeletePerson={onDeletePerson}
        />
      </div>
      <div className="space-y-2">
        {isDetailMode ? (
          <>
            {inputRows.map((row, index) => (
              <PaymentRow
                key={row.id}
                row={row}
                index={index}
                personId={person.id}
                dispatch={dispatch}
                onAmountChange={(index, value) => {
                  const newRows = [...inputRows];
                  newRows[index] = { ...newRows[index], amount: value };
                  setInputRows(newRows);
                }}
                onDescriptionChange={(index, value) => {
                  const newRows = [...inputRows];
                  newRows[index] = { ...newRows[index], description: value };
                  setInputRows(newRows);
                }}
                onKeyDown={handleKeyDown}
              />
            ))}
            <button
              onClick={handleAddRow}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              行追加
            </button>
          </>
        ) : (
          <SimplePaymentInput
            value={simpleTotal}
            personId={person.id}
            dispatch={dispatch}
            onChange={setSimpleTotal}
          />
        )}
      </div>
    </div>
  );
}; 