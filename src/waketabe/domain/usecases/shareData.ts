import { adjustedAmount, decodeOptions, parseAmount } from '../../../shared/domain/split';
import type { Participant, Dish, DishPayment, SplitOptions } from '../entities';

export interface MealShareData {
  version?: 2 | 3;
  participants: Participant[];
  dishes: Dish[];
  options: SplitOptions;
  legacy: boolean;
}

export const decodeMealShareData = (data: unknown): MealShareData | null => {
  if (!data || typeof data !== 'object') return null;
  const value = data as { version?: unknown; participants?: unknown; dishes?: unknown; options?: unknown };
  if (value.version !== undefined && value.version !== 2 && value.version !== 3) return null;
  if (!Array.isArray(value.participants) || !Array.isArray(value.dishes) || value.participants.length === 0 || value.participants.length > 300 || value.dishes.length === 0) return null;
  const options = decodeOptions(value.options);
  if (!options) return null;
  const participants: Participant[] = [];
  for (const raw of value.participants) {
    if (!raw || typeof raw !== 'object') return null;
    const participant = raw as Partial<Participant>;
    if (typeof participant.id !== 'string' || !participant.id || typeof participant.name !== 'string' || participants.some(item => item.id === participant.id)) return null;
    if (value.version !== undefined && !participant.name.trim()) return null;
    if (participant.displayOnly !== undefined && typeof participant.displayOnly !== 'boolean') return null;
    if (participant.burdenRate !== undefined && (!Number.isFinite(participant.burdenRate) || participant.burdenRate < 0 || participant.burdenRate > 100)) return null;
    participants.push({ id: participant.id, name: participant.name, displayOnly: participant.displayOnly ?? false, burdenRate: participant.burdenRate ?? 1 });
  }
  const dishes: Dish[] = [];
  for (const raw of value.dishes) {
    if (!raw || typeof raw !== 'object') return null;
    const dish = raw as Partial<Dish>;
    if (typeof dish.id !== 'string' || !dish.id || dishes.some(item => item.id === dish.id) || typeof dish.name !== 'string' || typeof dish.price !== 'string' || !Number.isFinite(parseAmount(dish.price)) || !Array.isArray(dish.eaters)) return null;
    if (value.version !== undefined && (!dish.name.trim() || parseAmount(dish.price) <= 0)) return null;
    if (dish.eaters.some(id => typeof id !== 'string' || !participants.some(participant => participant.id === id)) || new Set(dish.eaters).size !== dish.eaters.length) return null;
    if (dish.paidBy !== undefined && (typeof dish.paidBy !== 'string' || (dish.paidBy !== '' && !participants.some(participant => participant.id === dish.paidBy && !participant.displayOnly)))) return null;
    if (!dish.eaters.some(id => participants.some(participant => participant.id === id && !participant.displayOnly && participant.burdenRate > 0))) return null;
    let payments: DishPayment[] | undefined;
    if (dish.payments !== undefined) {
      if (value.version !== 3 || !Array.isArray(dish.payments) || dish.payments.length === 0) return null;
      payments = [];
      for (const rawPayment of dish.payments) {
        if (!rawPayment || typeof rawPayment !== 'object') return null;
        const payment = rawPayment as Partial<DishPayment>;
        if (typeof payment.id !== 'string' || !payment.id || payments.some(item => item.id === payment.id) ||
          typeof payment.amount !== 'string' || !Number.isSafeInteger(parseAmount(payment.amount)) || parseAmount(payment.amount) === 0 ||
          typeof payment.paidBy !== 'string' || (payment.paidBy === '' && parseAmount(payment.amount) < 0) ||
          (payment.paidBy !== '' && !participants.some(p => p.id === payment.paidBy && !p.displayOnly))) return null;
        payments.push({ id: payment.id, amount: payment.amount, paidBy: payment.paidBy });
      }
      const paidTotal = payments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0);
      if (!Number.isSafeInteger(paidTotal) || paidTotal !== parseAmount(dish.price) || (dish.paidBy !== undefined && dish.paidBy !== '')) return null;
    }
    dishes.push({ id: dish.id, name: dish.name, price: dish.price, eaters: dish.eaters, paidBy: dish.paidBy ?? '', ...(payments ? { payments } : {}) });
  }
  if (!Number.isSafeInteger(adjustedAmount(dishes.reduce((sum, dish) => sum + parseAmount(dish.price), 0), options))) return null;
  return { version: value.version as 2 | 3 | undefined, participants, dishes, options, legacy: value.version === undefined };
};
