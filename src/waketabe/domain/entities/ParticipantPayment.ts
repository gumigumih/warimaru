import type { DishContribution } from './DishContribution';

export interface ParticipantPayment {
  participantId: string;
  participantName: string;
  totalPaid: number;
  totalOwed: number;
  netAmount: number;
  dishes: DishContribution[];
}

