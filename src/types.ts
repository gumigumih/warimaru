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
  amount: number;
  description: string;
}

export interface Person {
  id: string;
  name: string;
  payments: PaymentItem[];
} 