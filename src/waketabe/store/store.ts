import { configureStore } from '@reduxjs/toolkit';
import mealSplitReducer from './waketabeSlice';

const reducer = { mealSplit: mealSplitReducer };
export const mealSplitStore = configureStore({ reducer });
export const potluckSplitStore = configureStore({ reducer });

export type MealSplitRootState = ReturnType<typeof mealSplitStore.getState>;
export type MealSplitDispatch = typeof mealSplitStore.dispatch;
