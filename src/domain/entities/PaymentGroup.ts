import { Person } from './Person';

export class PaymentGroup {
  constructor(
    public people: Person[],
    public nonPayingParticipants: number = 0,
    public isDetailMode: boolean = false
  ) {}

  get totalAmount(): number {
    return this.people.reduce((sum, person) => sum + person.totalAmount, 0);
  }

  get totalParticipants(): number {
    return this.people.length + this.nonPayingParticipants;
  }

  get averageAmount(): number {
    if (this.totalParticipants === 0) return 0;
    return this.totalAmount / this.totalParticipants;
  }

  addPerson(): Person {
    const nextName = this.generateNextName();
    const person = new Person(crypto.randomUUID(), nextName, []);
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