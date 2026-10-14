import { adjustedAmount, allocateAmount, decodeOptions, defaultSplitOptions, parseAmount, roundAmount } from '../shared/domain/split';
import type { SplitOptions } from '../shared/domain/split';

export interface SimpleWarikanData {
  totalAmount: string;
  peopleCount: string;
  options: SplitOptions;
}

export const decodeSimpleData = (data: unknown): SimpleWarikanData | null => {
  if (!data || typeof data !== 'object') return null;
  const value = data as Partial<SimpleWarikanData> & { version?: unknown };
  if (value.version !== undefined && value.version !== 2) return null;
  if (typeof value.totalAmount !== 'string' || typeof value.peopleCount !== 'string') return null;
  const options = decodeOptions(value.options);
  if (!options) return null;
  const result = { totalAmount: value.totalAmount, peopleCount: value.peopleCount, options };
  return calculateSimpleResult(result).isValid ? result : null;
};

export const calculateSimpleResult = ({ totalAmount, peopleCount, options = defaultSplitOptions }: SimpleWarikanData) => {
  const subtotal = parseAmount(totalAmount);
  const people = Number(peopleCount);
  const total = adjustedAmount(subtotal, options);
  const isValid = subtotal > 0 && Number.isSafeInteger(total) && Number.isInteger(people) && people > 0 && people <= 300;
  const shares = isValid ? allocateAmount(total, Array(people).fill(1), options, 0) : [];
  const baseAmount = isValid ? roundAmount(total / people, options) : 0;
  const groups = new Map<number, number>();
  shares.forEach(amount => groups.set(amount, (groups.get(amount) ?? 0) + 1));
  return { subtotal, total, people, baseAmount, remainder: isValid ? total - baseAmount * people : 0, groups: [...groups], isValid };
};
