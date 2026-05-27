import { configureStore } from '@reduxjs/toolkit';
import mealSplitReducer from './waketabeSlice';

export const mealSplitStore = configureStore({
  reducer: {
    mealSplit: mealSplitReducer,
  },
});

export type MealSplitRootState = ReturnType<typeof mealSplitStore.getState>;
export type MealSplitDispatch = typeof mealSplitStore.dispatch;
