import type { Person } from './Person';

export interface PeopleState {
  people: Person[];
  isDetailMode: boolean;
  nonPayingParticipants: number;
} 