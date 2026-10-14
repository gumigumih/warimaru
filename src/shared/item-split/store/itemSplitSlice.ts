import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Participant, Dish } from '../domain/entities';
import type { SplitOptions } from '../domain/entities';
import { defaultSplitOptions } from '../../domain/split';

type ItemSplitState = {
  participants: Participant[];
  dishes: Dish[];
  options: SplitOptions;
  legacy: boolean;
};

const initialState: ItemSplitState = {
  participants: [],
  dishes: [],
  options: defaultSplitOptions,
  legacy: false,
};

export const itemSplitSlice = createSlice({
  name: 'itemSplit',
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
    resetItemSplit: () => initialState,
  },
});

export const { setParticipants, setDishes, setOptions, setLegacy, resetItemSplit } = itemSplitSlice.actions;
export default itemSplitSlice.reducer;
