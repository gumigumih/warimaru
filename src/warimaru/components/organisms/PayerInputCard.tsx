import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { PersonInterface } from '../../domain/entities/Person';
import type { AppDispatch } from '../../store/store';
import { addPayment, updatePayment, updateSimplePayment } from '../../store/peopleSlice';
import { PaymentRow } from '../molecules/PaymentRow';
import { SimplePaymentInput } from '../molecules/SimplePaymentInput';
import { calculateTotalAmount } from '../../domain/usecases/calculatePayments';
import { updatePersonName } from '../../store/peopleSlice';

interface PayerInputCardProps {
  person: PersonInterface;
  onDeletePerson: (personId: string) => void;
  dispatch: AppDispatch;
  isDetailMode: boolean;
}

export const PayerInputCard = ({ person, onDeletePerson, dispatch, isDetailMode }: PayerInputCardProps) => {
  const [inputRows, setInputRows] = useState<{ id: string; amount: string; description: string }[]>([]);
  const [simpleTotal, setSimpleTotal] = useState('');

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

  useEffect(() => {
    if (isDetailMode) {
      const newRows = person.payments.map(payment => ({
        id: payment.id,
        amount: String(payment.amount),
        description: payment.description,
      }));
      setInputRows(newRows);
    } else {
      const total = calculateTotalAmount([person]);
      setSimpleTotal(String(total));
    }
  }, [person.payments, isDetailMode, person.id]);

  const handleAddRow = () => {
    const newId = crypto.randomUUID();
    const newRow = { id: newId, amount: '', description: '' };
    setInputRows([...inputRows, newRow]);
    dispatch(addPayment({
      personId: person.id,
      payment: {
        amount: 0,
        description: '',
      }
    }));
  };

  return (
    <div className="space-y-3" data-person-id={person.id}>
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_auto] gap-2 items-center">
        <div className="flex flex-col gap-1 h-12">
          <label className="sr-only">名前</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => dispatch(updatePersonName({ personId: person.id, newName: e.target.value }))}
            className="w-full h-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="参加者名"
          />
        </div>
        <div className="flex flex-col gap-1 h-12">
          <label className="sr-only">支払金額</label>
          {isDetailMode ? (
            <div className="space-y-2 h-full">
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
                className="btn btn-neutral w-full"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                行追加
              </button>
            </div>
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
        <div className="flex justify-end">
          <button
            onClick={() => onDeletePerson(person.id)}
            className="h-12 w-12 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
            title="人物を削除"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
    </div>
  );
};
