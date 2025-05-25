import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Person, PaymentItem } from '../types';

interface PeopleState {
  people: Person[];
  isDetailMode: boolean;
}

const initialState: PeopleState = {
  people: [
    { id: '1', name: 'Aさん', payments: [] },
    { id: '2', name: 'Bさん', payments: [] },
  ],
  isDetailMode: false,
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson: (state) => {
      state.people.push({
        id: crypto.randomUUID(),
        name: '新しい人物',
        payments: [],
      });
    },
    updatePersonName: (state, action: PayloadAction<{ personId: string; newName: string }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        person.name = action.payload.newName;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.people = state.people.filter(p => p.id !== action.payload);
    },
    addPayment: (state, action: PayloadAction<{ personId: string; payment: Omit<PaymentItem, 'id'> }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        person.payments.push({
          id: crypto.randomUUID(),
          ...action.payload.payment,
        });
      }
    },
    updatePayment: (state, action: PayloadAction<{ personId: string; paymentId: string; payment: Omit<PaymentItem, 'id'> }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        const payment = person.payments.find(p => p.id === action.payload.paymentId);
        if (payment) {
          Object.assign(payment, action.payload.payment);
        }
      }
    },
    deletePayment: (state, action: PayloadAction<{ personId: string; paymentId: string }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        person.payments = person.payments.filter(p => p.id !== action.payload.paymentId);
      }
    },
    setDetailMode: (state, action: PayloadAction<boolean>) => {
      state.isDetailMode = action.payload;
    },
  },
});

export const {
  addPerson,
  updatePersonName,
  deletePerson,
  addPayment,
  updatePayment,
  deletePayment,
  setDetailMode,
} = peopleSlice.actions;

export default peopleSlice.reducer; 