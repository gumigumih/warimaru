export interface DishPayment {
  id: string;
  paidBy: string;
  amount: string;
}

export interface Dish {
  id: string;
  name: string;
  price: string;
  eaters: string[];
  paidBy: string;
  payments?: DishPayment[];
}
