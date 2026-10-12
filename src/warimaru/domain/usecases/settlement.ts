import { allocateAmount, defaultSplitOptions, settleBalances } from '../../../domain/split';
import type { RoundingOptions, SplitMember } from '../../../domain/split';
import type { PersonInterface } from '../entities/Person';
import { calculatePaymentStatus, calculateTotalAmount, calculateTransfers } from './calculatePayments';

export const equalMembers = (people: PersonInterface[], total: number, settings: SplitMember[]) => {
  const members: SplitMember[] = people.map(person => ({
    id: person.id, name: person.name,
    burdenRate: settings.find(member => member.id === person.id)?.burdenRate ?? 1,
    displayOnly: person.payments.some(payment => payment.amount > 0) ? false : settings.find(member => member.id === person.id)?.displayOnly ?? false,
  }));
  for (let index = 0; index < Math.max(0, total - people.length); index += 1) {
    const id = `guest-${index}`;
    members.push(settings.find(member => member.id === id) ?? { id, name: `参加者${index + 1}`, burdenRate: 1, displayOnly: false });
  }
  return members;
};

export const calculateEqualSettlement = (
  people: PersonInterface[], total: number, settings: SplitMember[],
  rounding: RoundingOptions = defaultSplitOptions, legacy = false,
  colors: { backgrounds: readonly string[]; text: readonly string[] },
) => {
  const totalAmount = calculateTotalAmount(people);
  const members = equalMembers(people, total, settings);
  const paid = members.map(member => people.find(person => person.id === member.id)?.payments.reduce((sum, payment) => sum + payment.amount, 0) ?? 0);
  const shares = legacy ? members.map(() => Math.ceil(totalAmount / total)) : allocateAmount(
    totalAmount, members.map(member => member.displayOnly ? 0 : member.burdenRate), rounding,
    members.findIndex((member, index) => !member.displayOnly && member.burdenRate > 0 && paid[index] > 0),
  );
  const charges = members.map((member, index) => ({ ...member, paidAmount: paid[index], owedAmount: shares[index], difference: paid[index] - shares[index] }));
  const paymentStatus = people.map((person, index) => ({
    person, paidAmount: paid[index], difference: charges[index].difference,
    color: colors.backgrounds[index % colors.backgrounds.length], textColor: colors.text[index % colors.text.length],
  }));
  const transfers = legacy ? calculateTransfers(calculatePaymentStatus(people, Math.ceil(totalAmount / total), colors), total - people.length, Math.ceil(totalAmount / total), people, colors) :
    settleBalances(charges.map(member => ({ id: member.id, balance: member.difference }))).map(transfer => ({
      from: charges.find(member => member.id === transfer.from)?.name ?? '',
      to: charges.find(member => member.id === transfer.to)?.name ?? '', amount: transfer.amount,
      textColor: colors.text[Math.max(0, charges.findIndex(member => member.id === transfer.to)) % colors.text.length],
    }));
  return { totalAmount, charges, paymentStatus, transfers };
};
