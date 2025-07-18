export interface Payment {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
} 