interface Transfer {
  from: string;
  to: string;
  amount: number;
  textColor: string;
}

interface SettlementRouteListProps {
  transfers: Transfer[];
}

export const SettlementRouteList = ({ transfers }: SettlementRouteListProps) => {
  if (transfers.length === 0) return null;

  return (
    <div className="glass-card mt-4 p-4">
      <h3 className="text-lg font-bold mb-4">精算金額</h3>
      <div className="space-y-3">
        {transfers.map((transfer, index) => (
          <div key={index} className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <span className="break-all">{transfer.from}</span>
              <span className="text-gray-500">→</span>
              <span className="break-all">{transfer.to}</span>
            </div>
            <div className={`text-lg font-bold ${transfer.textColor}`}>{transfer.amount.toLocaleString()}円</div>
          </div>
        ))}
      </div>
    </div>
  );
};
