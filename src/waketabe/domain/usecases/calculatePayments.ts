import type { Dish, Participant, CalculationResult, ParticipantPayment } from '../entities';

export const calculatePayments = (
  dishes: Dish[],
  participants: Participant[]
): CalculationResult => {
  const participantPayments: ParticipantPayment[] = participants.map(p => ({
    participantId: p.id,
    participantName: p.name,
    totalPaid: 0,
    totalOwed: 0,
    netAmount: 0,
    dishes: []
  }));

  let totalAmount = 0;

  dishes.forEach(dish => {
    const dishPrice = parseInt(dish.price, 10);
    if (isNaN(dishPrice) || dishPrice <= 0) return;

    totalAmount += dishPrice;
    const eaterCount = dish.eaters.length;
    if (eaterCount === 0) return;

    const amountPerPerson = dishPrice / eaterCount;

    dish.eaters.forEach(eaterId => {
      const participantPayment = participantPayments.find(p => p.participantId === eaterId);
      if (!participantPayment) return;

      participantPayment.totalOwed += amountPerPerson;
      participantPayment.dishes.push({
        dishId: dish.id,
        dishName: dish.name,
        dishPrice: dishPrice,
        contribution: amountPerPerson
      });
    });
  });

  participantPayments.forEach(payment => {
    payment.netAmount = payment.totalPaid - payment.totalOwed;
  });

  return {
    participants: participantPayments,
    totalAmount
  };
};

