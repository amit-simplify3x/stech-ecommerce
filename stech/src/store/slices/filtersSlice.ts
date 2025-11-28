import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterState, SortOption } from '../../types';

const initialState: FilterState = {
  category: 'all',
  minRating: 0,
  sortBy: 'none',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.category = 'all';
      state.minRating = 0;
      state.sortBy = 'none';
    },
  },
});

export const { setCategory, setMinRating, setSortBy, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

