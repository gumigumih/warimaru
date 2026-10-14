import type { CalculationResult, Transfer } from '../entities';
import { settleBalances } from '../../../domain/split';

export const calculateTransfers = (calculationResult: CalculationResult): Transfer[] => {
  const { participants } = calculationResult;
  const paid = participants.reduce((sum, participant) => sum + participant.totalPaid, 0);
  if (paid !== calculationResult.totalAmount) return [];
  const names = new Map(participants.map(participant => [participant.participantId, participant.participantName]));
  return settleBalances(participants.map(participant => ({ id: participant.participantId, balance: participant.netAmount })))
    .map(transfer => ({ ...transfer, from: names.get(transfer.from) ?? '', to: names.get(transfer.to) ?? '' }));
};
