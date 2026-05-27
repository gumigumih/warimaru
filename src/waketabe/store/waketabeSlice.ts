import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Participant, Dish } from '../domain/entities';

type MealSplitState = {
  participants: Participant[];
  dishes: Dish[];
};

const initialState: MealSplitState = {
  participants: [],
  dishes: [],
};

export const mealSplitSlice = createSlice({
  name: 'mealSplit',
  initialState,
  reducers: {
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    setDishes: (state, action: PayloadAction<Dish[]>) => {
      state.dishes = action.payload;
    },
    resetMealSplit: () => initialState,
  },
});

export const { setParticipants, setDishes, resetMealSplit } = mealSplitSlice.actions;
export default mealSplitSlice.reducer;
