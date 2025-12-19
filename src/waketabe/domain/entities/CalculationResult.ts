import type { ParticipantPayment } from './ParticipantPayment';

export interface CalculationResult {
  participants: ParticipantPayment[];
  totalAmount: number;
}

