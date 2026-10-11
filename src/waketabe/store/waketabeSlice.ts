import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Participant, Dish } from '../domain/entities';
import type { SplitOptions } from '../domain/entities';
import { defaultSplitOptions } from '../../domain/split';

type MealSplitState = {
  participants: Participant[];
  dishes: Dish[];
  options: SplitOptions;
  legacy: boolean;
};

const initialState: MealSplitState = {
  participants: [],
  dishes: [],
  options: defaultSplitOptions,
  legacy: false,
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
    setOptions: (state, action: PayloadAction<SplitOptions>) => {
      state.options = action.payload;
    },
    setLegacy: (state, action: PayloadAction<boolean>) => {
      state.legacy = action.payload;
    },
    resetMealSplit: () => initialState,
  },
});

export const { setParticipants, setDishes, setOptions, setLegacy, resetMealSplit } = mealSplitSlice.actions;
export default mealSplitSlice.reducer;
