import { configureStore } from '@reduxjs/toolkit';
import itemSplitReducer from './itemSplitSlice';

const reducer = { itemSplit: itemSplitReducer };
export const mealSplitStore = configureStore({ reducer });
export const potluckSplitStore = configureStore({ reducer });

export type ItemSplitRootState = ReturnType<typeof mealSplitStore.getState>;
export type ItemSplitDispatch = typeof mealSplitStore.dispatch;
