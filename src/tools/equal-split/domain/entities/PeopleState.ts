import type { PersonInterface } from './Person';
import type { RoundingOptions, SplitMember } from '../../../../shared/domain/split';
 
export interface PeopleState {
  people: PersonInterface[];
  isDetailMode: boolean;
  totalParticipants: number;
  nonPayingParticipants: number;
  members: SplitMember[];
  rounding: RoundingOptions;
  legacy: boolean;
}
