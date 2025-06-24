import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Person, PaymentItem, PeopleState } from '../types';

const initialState: PeopleState = {
  people: [
    { id: crypto.randomUUID(), name: 'Aさん', payments: [] },
    { id: crypto.randomUUID(), name: 'Bさん', payments: [] },
  ],
  isDetailMode: false,
  nonPayingParticipants: 0,
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson: (state) => {
      // 文字生成ロジックを改善（A, B, C... Z, AA, AB... のように拡張）
      let nextName = '';
      const currentCount = state.people.length;
      
      if (currentCount < 26) {
        // A-Z（26文字）
        nextName = String.fromCharCode(65 + currentCount) + 'さん';
      } else {
        // 27文字目以降は AA, AB, AC... のように2文字で表現
        const firstChar = String.fromCharCode(65 + Math.floor((currentCount - 26) / 26));
        const secondChar = String.fromCharCode(65 + ((currentCount - 26) % 26));
        nextName = firstChar + secondChar + 'さん';
      }
      
      state.people.push({
        id: crypto.randomUUID(),
        name: nextName,
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
    setNonPayingParticipants: (state, action: PayloadAction<number>) => {
      state.nonPayingParticipants = action.payload;
    },
    updateSimplePayment: (state, action: PayloadAction<{ personId: string; amount: number }>) => {
      const person = state.people.find(p => p.id === action.payload.personId);
      if (person) {
        // 既存の支払いをクリア
        person.payments = [];
        // 新しい支払いを追加
        person.payments.push({
          id: crypto.randomUUID(),
          amount: action.payload.amount,
          description: '',
        });
      }
    },
  },
});

// ストアの初期化時に実行される関数
export const initializeStore = (state: PeopleState | undefined) => {
  if (!state) {
    return initialState;
  }
  return state;
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
  updateSimplePayment,
} = peopleSlice.actions;

export default peopleSlice.reducer; 