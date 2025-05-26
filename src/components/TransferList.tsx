interface Transfer {
  from: string;
  to: string;
  amount: number;
  textColor: string;
}

interface TransferListProps {
  transfers: Transfer[];
}

export const TransferList = ({ transfers }: TransferListProps) => {
  if (transfers.length === 0) return null;

  return (
    <div className="bg-white-50/80 backdrop-blur-sm mt-4 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">精算金額</h3>
      <div className="space-y-4">
        {transfers.map((transfer, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{transfer.from}</span>
              <span className="text-gray-500">→</span>
              <span className="font-medium">{transfer.to}</span>
            </div>
            <span className={`text-lg font-bold ${transfer.textColor}`}>
              {transfer.amount.toLocaleString()}円
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 