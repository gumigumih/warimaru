import type { PersonInterface } from './Person';
import {
  calculateTotalAmount,
  calculateTotalParticipants,
  calculatePerPersonAmount
} from '../usecases/calculatePayments';

export class PaymentGroup {
  constructor(
    public people: PersonInterface[],
    public nonPayingParticipants: number = 0,
    public isDetailMode: boolean = false
  ) {}

  get totalAmount(): number {
    return calculateTotalAmount(this.people);
  }

  get totalParticipants(): number {
    return calculateTotalParticipants(this.people, this.nonPayingParticipants);
  }

  get averageAmount(): number {
    return calculatePerPersonAmount(this.totalAmount, this.totalParticipants);
  }

  addPerson(): PersonInterface {
    const nextName = this.generateNextName();
    const person: PersonInterface = {
      id: crypto.randomUUID(),
      name: nextName,
      payments: []
    };
    this.people.push(person);
    return person;
  }

  removePerson(personId: string): void {
    this.people = this.people.filter(p => p.id !== personId);
  }

  private generateNextName(): string {
    const currentCount = this.people.length;
    if (currentCount < 26) {
      return String.fromCharCode(65 + currentCount) + 'さん';
    } else {
      const firstChar = String.fromCharCode(65 + Math.floor((currentCount - 26) / 26));
      const secondChar = String.fromCharCode(65 + ((currentCount - 26) % 26));
      return firstChar + secondChar + 'さん';
    }
  }
}

