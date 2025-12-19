import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Participant, Dish } from '../domain/entities';

type WaketabeState = {
  participants: Participant[];
  dishes: Dish[];
};

const initialState: WaketabeState = {
  participants: [],
  dishes: [],
};

export const waketabeSlice = createSlice({
  name: 'waketabe',
  initialState,
  reducers: {
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    setDishes: (state, action: PayloadAction<Dish[]>) => {
      state.dishes = action.payload;
    },
    resetWaketabe: () => initialState,
  },
});

export const { setParticipants, setDishes, resetWaketabe } = waketabeSlice.actions;
export default waketabeSlice.reducer;
