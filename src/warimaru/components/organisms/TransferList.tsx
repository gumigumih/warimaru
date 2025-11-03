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

  const groupedByToAndAmount: { [key: string]: { from: string[]; to: string; amount: number; textColor: string } } = {};
  
  transfers.forEach(transfer => {
    const key = `${transfer.to}_${transfer.amount}`;
    if (!groupedByToAndAmount[key]) {
      groupedByToAndAmount[key] = {
        from: [],
        to: transfer.to,
        amount: transfer.amount,
        textColor: transfer.textColor
      };
    }
    groupedByToAndAmount[key].from.push(transfer.from);
  });

  const sortedGroups = Object.values(groupedByToAndAmount).sort((a, b) => {
    const fromA = a.from[0];
    const fromB = b.from[0];
    if (fromA !== fromB) {
      return fromA.localeCompare(fromB);
    }
    return a.to.localeCompare(b.to);
  });

  return (
    <div className="glass-card mt-4 p-4">
      <h3 className="text-lg font-bold mb-4">精算金額</h3>
      <div className="space-y-3">
        {sortedGroups.map((group, index) => {
          const showFrom = index === 0 || sortedGroups[index - 1].from[0] !== group.from[0];
          const showDivider = index > 0 && showFrom;
          
          return (
            <div key={index}>
              {showDivider && (
                <div className="border-t border-gray-200 my-3"></div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 whitespace-pre-line">
                    {showFrom ? (
                      group.from.length > 1 
                        ? `${group.from[0]}\n〜${group.from[group.from.length - 1]}` 
                        : group.from[0]
                    ) : (
                      <span className="text-transparent">-</span>
                    )}
                  </div>
                  <div className="text-gray-500">→</div>
                  <div className="">{group.to}</div>
                </div>
                <div className={`text-lg font-bold ${group.textColor}`}>
                  {group.amount.toLocaleString()}円
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

