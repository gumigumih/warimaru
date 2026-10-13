import type { Dish, DishPayment } from '../entities';

// Keep old single-payer dishes readable without changing their shared data.
export const getDishPayments = (dish: Dish): DishPayment[] =>
  dish.payments ?? [{ id: dish.id, paidBy: dish.paidBy, amount: dish.price }];
