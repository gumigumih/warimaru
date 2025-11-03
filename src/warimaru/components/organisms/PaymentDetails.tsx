import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { PersonInterface } from '../../domain/entities/Person';

interface PaymentDetailsProps {
  paymentStatus: {
    person: PersonInterface;
    paidAmount: number;
    difference: number;
    color: string;
    textColor: string;
  }[];
}

export const PaymentDetails = ({ paymentStatus }: PaymentDetailsProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        className="w-full p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="text-lg font-bold">支払い内訳</h3>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`transform transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isDetailsOpen && (
        <div className="p-4 border-t border-gray-300">
          <div className="space-y-4">
            {paymentStatus.map(({ person }) => (
              <div key={person.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{person.name}</span>
                </div>
                {person.payments.length > 0 && (
                  <div className="space-y-2">
                    {person.payments.map((payment: { id: string; amount: number; description: string }) => (
                      <div key={`${person.id}-${payment.id}`} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{payment.description}</span>
                        <span className="font-medium">{payment.amount.toLocaleString()}円</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

