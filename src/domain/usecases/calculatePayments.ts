import type { PersonInterface } from '../entities/Person';

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
  const transfers: Transfer[] = [];

  // 支払いをした人の残高を計算
  const payingBalances = paymentStatus.map((status) => ({
    name: status.person.name,
    balance: status.difference,
    textColor: status.textColor,
  }));

  // 支払いをしていない人の残高を計算
  const nonPayingBalances = [];
  for (let i = 0; i < nonPayingParticipants; i++) {
    nonPayingBalances.push({
      name: `参加者${i + 1}`,
      balance: -perPersonAmount,
      textColor: colors.text[(people.length + i) % colors.text.length],
    });
  }

  const allBalances = [...payingBalances, ...nonPayingBalances];
  const creditors = allBalances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = allBalances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);

  for (const debtor of debtors) {
    let remainingDebt = Math.abs(debtor.balance);
    for (const creditor of creditors) {
      if (remainingDebt === 0) break;
      if (creditor.balance === 0) continue;
      const transferAmount = Math.min(remainingDebt, creditor.balance);
      if (transferAmount > 0) {
        transfers.push({
          from: debtor.name,
          to: creditor.name,
          amount: transferAmount,
          textColor: creditor.textColor,
        });
        remainingDebt -= transferAmount;
        creditor.balance -= transferAmount;
      }
    }
  }
  return transfers;
} 