import { adjustedAmount, allocateAmount, allocateSignedAmount, defaultSplitOptions, parseAmount } from '../../../domain/split';
import type { Dish, Participant, CalculationResult, ParticipantPayment, SplitOptions } from '../entities';
import { getDishPayments } from './dishPayments';

export const calculatePayments = (
  dishes: Dish[],
  participants: Participant[],
  options: SplitOptions = defaultSplitOptions,
  legacy = false,
): CalculationResult => {
  const participantPayments: ParticipantPayment[] = participants.map(participant => ({
    participantId: participant.id,
    participantName: participant.name,
    displayOnly: participant.displayOnly,
    totalPaid: 0,
    totalOwed: 0,
    netAmount: 0,
    dishes: [],
  }));

  const validDishes = dishes
    .map(dish => ({ dish, price: parseAmount(dish.price) }))
    .filter(({ price }) => price > 0);
  const subtotal = validDishes.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = legacy ? subtotal : adjustedAmount(subtotal, options);
  const adjustedPrices = allocateAmount(totalAmount, validDishes.map(item => item.price));
  const unroundedShares = participants.map(() => 0);

  validDishes.forEach(({ dish, price }, index) => {
    const dishPrice = adjustedPrices[index];
    if (!legacy) {
      const payments = getDishPayments(dish);
      const paidAmounts = allocateSignedAmount(dishPrice, payments.map(payment => parseAmount(payment.amount)), options);
      payments.forEach((payment, paymentIndex) => {
        const payer = participantPayments.find(item => item.participantId === payment.paidBy);
        if (payer && !payer.displayOnly) payer.totalPaid += paidAmounts[paymentIndex];
      });
    }

    const targets = participants.filter(participant =>
      dish.eaters.includes(participant.id) &&
      !participant.displayOnly &&
      participant.burdenRate > 0,
    );
    const totalRate = targets.reduce((sum, participant) => sum + participant.burdenRate, 0);
    if (totalRate === 0) {
      if (!legacy) throw new Error('各項目に負担する人を1人以上選んでください。');
      return;
    }

    // Old meal links contained no payer and used fractional equal shares.
    const shares = legacy ? targets.map(() => dishPrice / targets.length) : allocateAmount(
      dishPrice, targets.map(participant => participant.burdenRate),
    );
    targets.forEach((participant, targetIndex) => {
      const contribution = shares[targetIndex];
      const payment = participantPayments.find(item => item.participantId === participant.id);
      if (!payment) return;
      unroundedShares[participants.findIndex(item => item.id === participant.id)] += price * (participant.burdenRate / totalRate);
      payment.totalOwed += contribution;
      payment.dishes.push({
        dishId: dish.id,
        dishName: dish.name,
        dishPrice,
        contribution,
      });
    });

  });

  // Round the combined burden once, so splitting an item cannot concentrate its remainder.
  const finalShares = legacy ? [] : allocateAmount(totalAmount, unroundedShares, options,
    participantPayments.findIndex((payment, index) => payment.totalPaid > 0 && unroundedShares[index] > 0));
  participantPayments.forEach((payment, index) => {
    if (!legacy) payment.totalOwed = finalShares[index];
    payment.netAmount = payment.totalPaid - payment.totalOwed;
  });

  return { participants: participantPayments, totalAmount };
};
