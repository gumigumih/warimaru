export interface RoundingOptions {
  roundingUnit: 1 | 100 | 500 | 1000;
  roundingMode?: 'floor' | 'ceil' | 'nearest';
  remainderRecipient: 'payer' | 'fraction';
}

export const roundingLabels = { floor: '切り捨て', ceil: '切り上げ', nearest: '四捨五入' };

export interface SplitOptions extends RoundingOptions {
  taxRate: string;
  serviceRate: string;
  discount: string;
}

export interface SplitMember {
  id: string;
  name: string;
  burdenRate: number;
  displayOnly: boolean;
}

export const defaultSplitOptions: SplitOptions = {
  roundingUnit: 1,
  roundingMode: 'floor',
  remainderRecipient: 'fraction',
  taxRate: '',
  serviceRate: '',
  discount: '',
};

export const parseAmount = (value: string): number => {
  const text = value.replace(/[,¥￥\s]/g, '');
  if (text === '') return 0;
  if (!/^\d+$/.test(text)) return NaN;
  const amount = Number(text);
  return Number.isSafeInteger(amount) ? amount : NaN;
};

export const parseRate = (value: string): number => {
  if (value.trim() === '') return 0;
  if (!/^\d+(\.\d+)?$/.test(value.trim())) return NaN;
  const rate = Number(value);
  return Number.isFinite(rate) && rate <= 10000 ? rate : NaN;
};

export const isValidOptions = (options: SplitOptions): boolean =>
  [1, 100, 500, 1000].includes(options.roundingUnit) &&
  [undefined, 'floor', 'ceil', 'nearest'].includes(options.roundingMode) &&
  ['payer', 'fraction'].includes(options.remainderRecipient) &&
  Number.isFinite(parseRate(options.taxRate)) &&
  Number.isFinite(parseRate(options.serviceRate)) &&
  Number.isFinite(parseAmount(options.discount));

export const decodeOptions = (value: unknown): SplitOptions | null => {
  if (value === undefined) return { ...defaultSplitOptions };
  if (!value || typeof value !== 'object') return null;
  const options = { ...defaultSplitOptions, ...value } as SplitOptions;
  if (typeof options.taxRate !== 'string' || typeof options.serviceRate !== 'string' || typeof options.discount !== 'string') return null;
  return isValidOptions(options) ? options : null;
};

export const adjustedAmount = (subtotal: number, options: SplitOptions): number => {
  if (!Number.isSafeInteger(subtotal) || subtotal < 0 || !isValidOptions(options)) return NaN;
  const total = Math.max(0, Math.round(subtotal * (1 + parseRate(options.taxRate) / 100 + parseRate(options.serviceRate) / 100) - parseAmount(options.discount)));
  return Number.isSafeInteger(total) ? total : NaN;
};

export const roundAmount = (amount: number, options: RoundingOptions): number => {
  const round = options.roundingMode === 'ceil' ? Math.ceil : options.roundingMode === 'nearest' ? Math.round : Math.floor;
  return round(amount / options.roundingUnit) * options.roundingUnit;
};

// Reconcile rounded shares with the bill without negative payments or charging excluded members.
export const allocateAmount = (
  total: number,
  weights: number[],
  options: RoundingOptions = defaultSplitOptions,
  payerIndex = -1,
): number[] => {
  if (!Number.isSafeInteger(total) || total < 0 || ![1, 100, 500, 1000].includes(options.roundingUnit) ||
    ![undefined, 'floor', 'ceil', 'nearest'].includes(options.roundingMode) ||
    !['payer', 'fraction'].includes(options.remainderRecipient) ||
    weights.some(weight => !Number.isFinite(weight) || weight < 0)) throw new Error('配分条件が不正です。');
  const maxWeight = Math.max(0, ...weights);
  if (maxWeight === 0) {
    if (total > 0) throw new Error('負担する人を1人以上選んでください。');
    return weights.map(() => 0);
  }
  const sum = weights.reduce((value, weight) => value + weight / maxWeight, 0);
  const exact = weights.map(weight => total * (weight / maxWeight / sum));
  const floors = exact.map(amount => Math.floor(amount / options.roundingUnit) * options.roundingUnit);
  const amounts = exact.map(amount => roundAmount(amount, options));
  // Subtract rounding deltas separately so a rounded-up sum cannot exceed safe integer precision.
  let remainder = total - floors.reduce((value, amount) => value + amount, 0) -
    amounts.reduce((value, amount, index) => value + (amount - floors[index]), 0);
  const direction = remainder >= 0 ? 1 : -1;
  const order = weights.map((weight, index) => ({ weight, index }))
    .filter(item => item.weight > 0)
    .sort((left, right) => direction * ((exact[right.index] - amounts[right.index]) - (exact[left.index] - amounts[left.index])));
  if (options.remainderRecipient === 'payer' && weights[payerIndex] > 0 && amounts[payerIndex] + remainder >= 0) {
    amounts[payerIndex] += remainder;
    return amounts;
  }
  for (const { index } of order) {
    if (Math.abs(remainder) < options.roundingUnit) break;
    if (direction < 0 && amounts[index] < options.roundingUnit) continue;
    amounts[index] += direction * options.roundingUnit;
    remainder -= direction * options.roundingUnit;
  }
  const partialRecipient = order.filter(item => amounts[item.index] + remainder >= 0).reduce((best, item) =>
    direction * (exact[item.index] - amounts[item.index]) > direction * (exact[best.index] - amounts[best.index]) ? item : best,
  );
  amounts[partialRecipient.index] += remainder;
  return amounts;
};

export const settleBalances = (balances: { id: string; balance: number }[]) => {
  const creditors = balances.filter(item => item.balance > 0).map(item => ({ ...item })).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(item => item.balance < 0).map(item => ({ ...item })).sort((a, b) => a.balance - b.balance);
  const transfers: { from: string; to: string; amount: number }[] = [];
  let creditorIndex = 0;
  for (const debtor of debtors) {
    while (debtor.balance < 0 && creditorIndex < creditors.length) {
      const creditor = creditors[creditorIndex];
      const amount = Math.min(-debtor.balance, creditor.balance);
      transfers.push({ from: debtor.id, to: creditor.id, amount });
      debtor.balance += amount;
      creditor.balance -= amount;
      if (creditor.balance < 0.000001) creditorIndex += 1;
      if (Math.abs(debtor.balance) < 0.000001) debtor.balance = 0;
    }
  }
  return transfers;
};
