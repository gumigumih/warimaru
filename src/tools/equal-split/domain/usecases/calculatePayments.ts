import type { PersonInterface } from '../entities/Person';
import { settleBalances } from '../../../../shared/domain/split';

export function calculateTotalAmount(people: PersonInterface[]): number {
  return people.reduce(
    (sum, person) =>
      sum + person.payments.reduce((personSum, payment) => personSum + payment.amount, 0),
    0
  );
}

export function calculateTotalParticipants(people: PersonInterface[], nonPayingParticipants: number): number {
  return people.length + nonPayingParticipants;
}

export function calculatePerPersonAmount(totalAmount: number, totalParticipants: number): number {
  return totalParticipants === 0 ? 0 : Math.ceil(totalAmount / totalParticipants);
}

export function calculateMaxPayment(people: PersonInterface[]): number {
  return Math.max(
    ...people.map((person) =>
      person.payments.reduce((sum, payment) => sum + payment.amount, 0)
    )
  );
}

export function calculatePaymentStatus(
  people: PersonInterface[],
  perPersonAmount: number,
  colors: { backgrounds: readonly string[]; text: readonly string[] }
) {
  return people.map((person, index) => {
    const paidAmount = person.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const difference = paidAmount - perPersonAmount;
    return {
      person,
      paidAmount,
      difference,
      color: colors.backgrounds[index % colors.backgrounds.length],
      textColor: colors.text[index % colors.text.length],
    };
  });
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
  textColor: string;
}

export function calculateTransfers(
  paymentStatus: ReturnType<typeof calculatePaymentStatus>,
  nonPayingParticipants: number,
  perPersonAmount: number,
  people: PersonInterface[],
  colors: { text: readonly string[] }
): Transfer[] {
  const payingBalances = paymentStatus.map((status) => ({
    id: status.person.id,
    name: status.person.name,
    balance: status.difference,
    textColor: status.textColor,
  }));

  const nonPayingBalances = [];
  for (let i = 0; i < nonPayingParticipants; i++) {
    nonPayingBalances.push({
      id: `guest-${i}`,
      name: `参加者${i + 1}`,
      balance: -perPersonAmount,
      textColor: colors.text[(people.length + i) % colors.text.length],
    });
  }

  const allBalances = [...payingBalances, ...nonPayingBalances];
  return settleBalances(allBalances).map(transfer => ({
    from: allBalances.find(item => item.id === transfer.from)?.name ?? '',
    to: allBalances.find(item => item.id === transfer.to)?.name ?? '',
    amount: transfer.amount,
    textColor: allBalances.find(item => item.id === transfer.to)?.textColor ?? '',
  }));
}
