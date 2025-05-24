import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Person, PaymentItem } from '../types';

const initialState: Person[] = [
  { id: '1', name: 'Aさん', payments: [] },
  { id: '2', name: 'Bさん', payments: [] },
];

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<Person[]>) => {
      return action.payload;
    },
    addPerson: (state) => {
      const newId = String(state.length + 1);
      const newName = String.fromCharCode(65 + state.length) + 'さん';
      state.push({ id: newId, name: newName, payments: [] });
    },
    updatePersonName: (state, action: PayloadAction<{ personId: string; newName: string }>) => {
      const person = state.find(p => p.id === action.payload.personId);
      if (person) {
        person.name = action.payload.newName;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      return state.filter(person => person.id !== action.payload);
    },
    addPayment: (state, action: PayloadAction<{ personId: string; payment: Omit<PaymentItem, 'id'> }>) => {
      const person = state.find(p => p.id === action.payload.personId);
      if (person) {
        person.payments.push({
          ...action.payload.payment,
          id: String(Date.now()),
        });
      }
    },
    updatePayment: (state, action: PayloadAction<{ personId: string; paymentId: string; payment: Omit<PaymentItem, 'id'> }>) => {
      const person = state.find(p => p.id === action.payload.personId);
      if (person) {
        const payment = person.payments.find(p => p.id === action.payload.paymentId);
        if (payment) {
          Object.assign(payment, action.payload.payment);
        }
      }
    },
    deletePayment: (state, action: PayloadAction<{ personId: string; paymentId: string }>) => {
      const person = state.find(p => p.id === action.payload.personId);
      if (person) {
        person.payments = person.payments.filter(p => p.id !== action.payload.paymentId);
      }
    },
  },
});

export const {
  setPeople,
  addPerson,
  updatePersonName,
  deletePerson,
  addPayment,
  updatePayment,
  deletePayment,
} = peopleSlice.actions;

export default peopleSlice.reducer; 