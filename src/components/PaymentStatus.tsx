import type { Person } from '../types';

interface PaymentStatusProps {
  paymentStatus: {
    person: Person;
    paidAmount: number;
    difference: number;
    color: string;
    textColor: string;
  }[];
  maxPayment: number;
  perPersonAmount: number;
}

export const PaymentStatus = ({ paymentStatus, maxPayment, perPersonAmount }: PaymentStatusProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">支払い状況</h3>
      <div className="space-y-4 pb-3 relative">
        <div className="relative pb-2">
          {paymentStatus.map(({ person, paidAmount, color }) => {
            const percentage = (paidAmount / maxPayment) * 100;
            const perPersonPercentage = (perPersonAmount / maxPayment) * 100;
            return (
              <div key={person.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{person.name}</span>
                  <span className="text-gray-600 text-sm font-medium relative z-10">
                    {paidAmount.toLocaleString()}円
                  </span>
                </div>
                <div className="h-4 rounded-full overflow-hidden relative flex-1 bar-container">
                  <div className="h-full flex">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.min(percentage, perPersonPercentage)}%` }}
                    />
                    {percentage > perPersonPercentage && (
                      <div
                        className={`h-full ${color} transition-all duration-300 ease-in-out`}
                        style={{ width: `${percentage - perPersonPercentage}%` }}
                      />
                    )}
                    <div className="h-full w-full absolute top-0 left-0 pointer-events-none rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="absolute top-0 bottom-0 w-0.5 h-full bg-red-500"
            style={{ left: `${(perPersonAmount / maxPayment) * 100}%` }}
          />
        </div>
        <div 
            className="absolute text-xs text-red-500 font-medium"
            style={{ 
              left: `${(perPersonAmount / maxPayment) * 100}%`,
              bottom: '0%',
              width: '5rem',
              textAlign: 'center',
              transform: 'translateX(-50%)',
              marginTop: '0.5rem'
            }}
          >
            {perPersonAmount.toLocaleString()}円
          </div>

      </div>
    </div>
  );
}; 