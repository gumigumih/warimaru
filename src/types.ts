export interface Payment {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
}

export interface Participant {
  id: string;
  name: string;
}

export interface PaymentItem {
  id: string;
  description: string;
  amount: number;
}

export interface Person {
  id: string;
  name: string;
  payments: PaymentItem[];
}

export interface PeopleState {
  people: Person[];
  isDetailMode: boolean;
  nonPayingParticipants: number;
} 