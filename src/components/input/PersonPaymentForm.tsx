import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Person } from '../../types';
import type { AppDispatch } from '../../store/store';
import { addPayment, updatePayment, updateSimplePayment } from '../../store/peopleSlice';
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

  // 統一された保存関数
  const savePayment = (personId: string, paymentId: string, amount: number | string, description?: string) => {
    if (isDetailMode) {
      const numericAmount = typeof amount === 'string' ? Number(amount.replace(/,/g, '')) || 0 : amount;
      dispatch(updatePayment({
        personId,
        paymentId,
        payment: {
          amount: numericAmount,
          description: description || '',
        }
      }));
    } else {
      if (amount) {
        const numericAmount = typeof amount === 'string' ? Number(amount.replace(/,/g, '')) || 0 : amount;
        dispatch(updateSimplePayment({
          personId,
          amount: numericAmount,
        }));
      }
    }
  };

  const handleSavePayment = (personId: string, paymentId: string, amount: number, description: string) => {
    dispatch(updatePayment({
      personId,
      paymentId,
      payment: {
        amount,
        description,
      }
    }));
  };

  // ストアの状態と入力フォームの状態を同期
  useEffect(() => {
    if (isDetailMode) {
      // 詳細モードの場合、支払い情報を入力行に反映
      const newRows = person.payments.map(payment => ({
        id: payment.id,
        amount: String(payment.amount),
        description: payment.description,
      }));
      setInputRows(newRows);
    } else {
      // シンプルモードの場合、合計額を反映
      const total = person.payments.reduce((sum, payment) => sum + payment.amount, 0);
      setSimpleTotal(String(total));
    }
  }, [person.payments, isDetailMode, person.id]);

  // 初期化時に0円の支払いを追加
  useEffect(() => {
    if (person.payments.length === 0) {
      dispatch(addPayment({
        personId: person.id,
        payment: {
          amount: 0,
          description: '',
        }
      }));
    }
  }, [person.id, person.payments.length, dispatch]);



  const handleAddRow = () => {
    const newId = crypto.randomUUID();
    const newRow = { id: newId, amount: '', description: '' };
    setInputRows([...inputRows, newRow]);
    // 新しい行を追加する際にストアにも追加
    dispatch(addPayment({
      personId: person.id,
      payment: {
        amount: 0,
        description: '',
      }
    }));
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
                personName={person.name}
                dispatch={dispatch}
                onAmountChange={(_index, value) => {
                  const amount = Number(value.replace(/,/g, '')) || 0;
                  savePayment(person.id, row.id, amount, row.description);
                }}
                onDescriptionChange={(_index, value) => {
                  const amount = Number(row.amount.replace(/,/g, '')) || 0;
                  savePayment(person.id, row.id, amount, value);
                }}

                savePayment={handleSavePayment}
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
            onChange={setSimpleTotal}
            savePayment={savePayment}
            personId={person.id}
            personName={person.name}
          />
        )}
      </div>
    </div>
  );
}; 