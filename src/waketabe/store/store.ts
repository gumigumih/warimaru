import { configureStore } from '@reduxjs/toolkit';
import waketabeReducer from './waketabeSlice';

export const waketabeStore = configureStore({
  reducer: {
    waketabe: waketabeReducer,
  },
});

export type WaketabeRootState = ReturnType<typeof waketabeStore.getState>;
export type WaketabeDispatch = typeof waketabeStore.dispatch;
