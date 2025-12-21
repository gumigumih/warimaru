import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PaymentItem } from '../domain/entities/PaymentItem';
import type { PeopleState } from '../domain/entities/PeopleState';

const initialState: PeopleState = {
  people: [
    {
      id: crypto.randomUUID(),
      name: 'Aさん',
      payments: [{
        id: crypto.randomUUID(),
        amount: 0,
        description: '',
      }],
    }
  ],
  isDetailMode: false,
  totalParticipants: 2,
  nonPayingParticipants: 1,
};

const updateNonPayingFromTotal = (state: PeopleState) => {
  state.nonPayingParticipants = Math.max(0, state.totalParticipants - state.people.length);
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson: (state) => {
      let nextName = '';
      const currentCount = state.people.length;
      
      if (currentCount < 26) {
        nextName = String.fromCharCode(65 + currentCount) + 'さん';
      } else {
        const firstChar = String.fromCharCode(65 + Math.floor((currentCount - 26) / 26));
        const secondChar = String.fromCharCode(65 + ((currentCount - 26) % 26));
        nextName = firstChar + secondChar + 'さん';
      }
      
      state.people.push({
        id: crypto.randomUUID(),
        name: nextName,
        payments: [{
          id: crypto.randomUUID(),
          amount: 0,
          description: '',
        }],
      });
      if (state.people.length > state.totalParticipants) {
        state.totalParticipants = state.people.length;
      }
      updateNonPayingFromTotal(state);
    },
    updatePersonName: (state, action: PayloadAction<{ personId: string; newName: string }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        person.name = action.payload.newName;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.people = state.people.filter(p => p.id !== action.payload);
      if (state.people.length > state.totalParticipants) {
        state.totalParticipants = state.people.length;
      }
      updateNonPayingFromTotal(state);
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
    setNonPayingParticipants: (state, action: PayloadAction<number>) => {
      state.nonPayingParticipants = Math.max(0, action.payload);
      state.totalParticipants = state.people.length + state.nonPayingParticipants;
    },
    setTotalParticipants: (state, action: PayloadAction<number>) => {
      state.totalParticipants = Math.max(state.people.length, action.payload);
      updateNonPayingFromTotal(state);
    },
    updateSimplePayment: (state, action: PayloadAction<{ personId: string; amount: number }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        person.payments = [];
        person.payments.push({
          id: crypto.randomUUID(),
          amount: action.payload.amount,
          description: '',
        });
      }
    },
    setPeople: (state, action: PayloadAction<{ name: string; payments: { amount: number }[] }[]>) => {
      state.people = action.payload.map(person => ({
        id: crypto.randomUUID(),
        name: person.name,
        payments: person.payments.map(pay => ({
          id: crypto.randomUUID(),
          amount: pay.amount,
          description: '',
        })),
      }));
      if (state.people.length > state.totalParticipants) {
        state.totalParticipants = state.people.length;
      }
      updateNonPayingFromTotal(state);
    },
  },
});

export const initializeStore = (state: PeopleState | undefined) => {
  if (!state) {
    return initialState;
  }
  const peopleCount = state.people.length;
  const totalParticipants = Math.max(
    state.totalParticipants ?? peopleCount,
    peopleCount + (state.nonPayingParticipants ?? 0),
    peopleCount,
  );

  return {
    ...state,
    totalParticipants,
    nonPayingParticipants: Math.max(0, totalParticipants - peopleCount),
  };
};

export const {
  addPerson,
  updatePersonName,
  deletePerson,
  addPayment,
  updatePayment,
  deletePayment,
  setDetailMode,
  setNonPayingParticipants,
  setTotalParticipants,
  updateSimplePayment,
  setPeople,
} = peopleSlice.actions;

export default peopleSlice.reducer;
