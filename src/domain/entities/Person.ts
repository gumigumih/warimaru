import type { PaymentItem } from './PaymentItem';

export class Person {
  constructor(
    public readonly id: string,
    public name: string,
    public payments: PaymentItem[]
  ) {}

  get totalAmount(): number {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  addPayment(amount: number, description: string = ''): void {
    this.payments.push({
      id: crypto.randomUUID(),
      amount,
      description,
    });
  }

  removePayment(paymentId: string): void {
    this.payments = this.payments.filter(p => p.id !== paymentId);
  }

  updatePayment(paymentId: string, amount: number, description: string): void {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.amount = amount;
      payment.description = description;
    }
  }
}

// 型としても使用できるようにinterfaceもexport
export interface PersonInterface {
  id: string;
  name: string;
  payments: PaymentItem[];
} 