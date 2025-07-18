import type { PersonInterface } from './Person';
 
export interface PeopleState {
  people: PersonInterface[];
  isDetailMode: boolean;
  nonPayingParticipants: number;
} 