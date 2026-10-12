import { decodeOptions } from '../../../domain/split';
import type { SplitMember, RoundingOptions } from '../../../domain/split';
import type { PersonInterface } from '../entities/Person';
import { equalMembers } from './settlement';

export interface EqualShareData {
  people: PersonInterface[];
  totalParticipants: number;
  members: SplitMember[];
  rounding: RoundingOptions;
  legacy: boolean;
}

export const decodeEqualShareData = (data: unknown): EqualShareData | null => {
  if (!data || typeof data !== 'object') return null;
  const value = data as { version?: unknown; people?: unknown; totalParticipants?: unknown; nonPayingParticipants?: unknown; members?: unknown; rounding?: unknown };
  if (value.version !== undefined && value.version !== 2) return null;
  if (!Array.isArray(value.people) || value.people.length === 0 || value.people.length > 300) return null;
  const people: PersonInterface[] = [];
  for (const raw of value.people) {
    if (!raw || typeof raw !== 'object') return null;
    const person = raw as Partial<PersonInterface>;
    if (typeof person.name !== 'string' || !Array.isArray(person.payments)) return null;
    const id = person.id ?? `payer-${people.length}`;
    if (typeof id !== 'string' || !id || id.startsWith('guest-') || people.some(item => item.id === id)) return null;
    const payments = [];
    for (const rawPayment of person.payments) {
      if (!rawPayment || typeof rawPayment !== 'object') return null;
      const payment = rawPayment as { amount?: unknown };
      if (typeof payment.amount !== 'number' || !Number.isSafeInteger(payment.amount) || payment.amount < 0) return null;
      payments.push({ id: `${id}-payment-${payments.length}`, description: '', amount: payment.amount });
    }
    people.push({ id, name: person.name, payments });
  }
  const total = value.totalParticipants ?? (typeof value.nonPayingParticipants === 'number' ? people.length + value.nonPayingParticipants : NaN);
  if (typeof total !== 'number' || !Number.isInteger(total) || total < people.length || total > 300) return null;
  const rounding = decodeOptions(value.rounding);
  if (!rounding) return null;
  let members = equalMembers(people, total, []);
  if (value.members !== undefined) {
    if (!Array.isArray(value.members) || value.members.length !== total) return null;
    const decoded: SplitMember[] = [];
    for (const raw of value.members) {
      if (!raw || typeof raw !== 'object') return null;
      const member = raw as SplitMember;
      if (typeof member.id !== 'string' || !members.some(item => item.id === member.id) || decoded.some(item => item.id === member.id) || typeof member.name !== 'string' || typeof member.displayOnly !== 'boolean' || !Number.isFinite(member.burdenRate) || member.burdenRate < 0 || member.burdenRate > 100) return null;
      if (member.displayOnly && people.some(person => person.id === member.id && person.payments.some(payment => payment.amount > 0))) return null;
      decoded.push({ id: member.id, name: member.name, burdenRate: member.burdenRate, displayOnly: member.displayOnly });
    }
    members = equalMembers(people, total, decoded);
  }
  if (!members.some(member => !member.displayOnly && member.burdenRate > 0) || !Number.isSafeInteger(people.reduce((sum, person) => sum + person.payments.reduce((amount, payment) => amount + payment.amount, 0), 0))) return null;
  return { people, totalParticipants: total, members, rounding: { roundingUnit: rounding.roundingUnit, roundingMode: rounding.roundingMode, remainderRecipient: rounding.remainderRecipient }, legacy: value.version !== 2 };
};
