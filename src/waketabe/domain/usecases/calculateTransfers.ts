import type { CalculationResult, Transfer } from '../entities';

export const calculateTransfers = (calculationResult: CalculationResult): Transfer[] => {
  const { participants } = calculationResult;
  const debtors = participants.filter(p => p.netAmount < 0).sort((a, b) => a.netAmount - b.netAmount);
  const creditors = participants.filter(p => p.netAmount > 0).sort((a, b) => b.netAmount - a.netAmount);

  const transfers: Transfer[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const transferAmount = Math.min(Math.abs(debtor.netAmount), creditor.netAmount);
    if (transferAmount > 0) {
      transfers.push({
        from: debtor.participantName,
        to: creditor.participantName,
        amount: transferAmount
      });
    }
    debtor.netAmount += transferAmount;
    creditor.netAmount -= transferAmount;
    if (Math.abs(debtor.netAmount) < 0.01) debtorIndex++;
    if (creditor.netAmount < 0.01) creditorIndex++;
  }
  return transfers;
};

