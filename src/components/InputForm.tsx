import { useState, useEffect } from 'react';
import type { Person, PaymentItem } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPlus, faCheck, faTimes, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface InputFormProps {
  onAddPerson: () => void;
  onAddPayment: (personId: string, payment: Omit<PaymentItem, 'id'>) => void;
  onUpdatePersonName: (personId: string, newName: string) => void;
  onUpdatePayment: (personId: string, paymentId: string, payment: Omit<PaymentItem, 'id'>) => void;
  onDeletePerson: (personId: string) => void;
  onDeletePayment: (personId: string, paymentId: string) => void;
  people: Person[];
}

export const InputForm = ({ onAddPerson, onAddPayment, onUpdatePersonName, onUpdatePayment, onDeletePerson, onDeletePayment, people }: InputFormProps) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleteMode
              ? 'bg-red-600 focus:ring-red-500'
              : 'bg-gray-200 focus:ring-gray-500'
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
          <span className="absolute right-2 text-xs font-medium text-white">
            {isDeleteMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {people.map((person) => (
        <div key={person.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white relative">
          <PersonPaymentForm
            person={person}
            onAddPayment={onAddPayment}
            onUpdateName={onUpdatePersonName}
            onUpdatePayment={onUpdatePayment}
            onDeletePerson={onDeletePerson}
            onDeletePayment={onDeletePayment}
            isDeleteMode={isDeleteMode}
          />
        </div>
      ))}

      <button
        onClick={onAddPerson}
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
  onUpdatePayment: (personId: string, paymentId: string, payment: Omit<PaymentItem, 'id'>) => void;
  onDeletePerson: (personId: string) => void;
  onDeletePayment: (personId: string, paymentId: string) => void;
  isDeleteMode: boolean;
}

const PersonPaymentForm = ({ person, onAddPayment, onUpdateName, onUpdatePayment, onDeletePerson, onDeletePayment, isDeleteMode }: PersonPaymentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [inputRows, setInputRows] = useState<{ amount: string; description: string }[]>([{ amount: '', description: '' }]);

  const handleAddRow = () => {
    setInputRows([...inputRows, { amount: '', description: '' }]);
  };

  const handleRowChange = (index: number, field: 'amount' | 'description', value: string) => {
    const newRows = [...inputRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setInputRows(newRows);
  };

  const handleKeyDown = (index: number, field: 'amount' | 'description', e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentRow = inputRows[index];
    const isRowEmpty = !currentRow.amount && !currentRow.description;
    const isRowComplete = currentRow.amount && currentRow.description;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRowComplete) {
        onAddPayment(person.id, {
          amount: Number(currentRow.amount),
          description: currentRow.description,
        });
        const newRows = inputRows.filter((_, i) => i !== index);
        setInputRows(newRows.length > 0 ? newRows : [{ amount: '', description: '' }]);
      } else if (index === inputRows.length - 1 && !isRowEmpty) {
        handleAddRow();
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

  const handleNameUpdate = () => {
    if (editedName.trim() && editedName !== person.name) {
      const nameWithoutSan = editedName.replace(/さん$/, '');
      onUpdateName(person.id, `${nameWithoutSan}さん`);
    }
    setIsEditing(false);
  };

  const renderPaymentRow = (payment: PaymentItem | { amount: string; description: string }, index: number, isInput: boolean) => {
    const amount = isInput ? payment.amount : String(payment.amount);
    const description = payment.description;
    const id = isInput ? undefined : (payment as PaymentItem).id;

    return (
      <div key={isInput ? `input-${index}` : id} className="flex gap-2 items-center">
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            if (isInput) {
              handleRowChange(index, 'amount', e.target.value);
            } else {
              onUpdatePayment(person.id, id!, {
                ...payment as PaymentItem,
                amount: Number(e.target.value),
              });
            }
          }}
          onKeyDown={isInput ? (e) => handleKeyDown(index, 'amount', e) : undefined}
          data-row={isInput ? index : undefined}
          data-field={isInput ? 'amount' : undefined}
          placeholder={isInput ? "金額" : undefined}
          className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => {
            if (isInput) {
              handleRowChange(index, 'description', e.target.value);
            } else {
              onUpdatePayment(person.id, id!, {
                ...payment as PaymentItem,
                description: e.target.value,
              });
            }
          }}
          onKeyDown={isInput ? (e) => handleKeyDown(index, 'description', e) : undefined}
          data-row={isInput ? index : undefined}
          data-field={isInput ? 'description' : undefined}
          placeholder={isInput ? "項目名" : undefined}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {isDeleteMode && (
          <button
            onClick={() => {
              onDeletePayment(person.id, id!);
              if (person.payments.length <= 1) {
                setInputRows([{ amount: '', description: '' }]);
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
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
              onClick={handleNameUpdate}
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
        {person.payments.map((payment, index) => renderPaymentRow(payment, index, false))}
      </div>
      <div className="space-y-2 pt-2 border-gray-200">
        {inputRows.map((row, index) => renderPaymentRow(row, index, true))}
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