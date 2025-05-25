import { configureStore } from '@reduxjs/toolkit';
import peopleReducer, { initializeStore } from './peopleSlice';

// デバッグ用ミドルウェア
const debugMiddleware = (store) => (next) => (action) => {
  console.group(`%c${action.type}`, 'color: #2196F3; font-weight: bold');
  console.log('%cPrevious State:', 'color: #9E9E9E; font-weight: bold', store.getState());
  console.log('%cAction:', 'color: #4CAF50; font-weight: bold', action);
  
  const result = next(action);
  
  console.log('%cNext State:', 'color: #FF9800; font-weight: bold', store.getState());
  console.groupEnd();
  
  return result;
};

export const store = configureStore({
  reducer: {
    people: peopleReducer,
  },
  preloadedState: {
    people: initializeStore(undefined),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(debugMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 