import { createSlice } from '@reduxjs/toolkit';

import {
  getProductsByQuery,
  getDailyMeals,
  addMeal,
  deleteMeal,
} from './products-operations.js';

const initialState = {
  productsOptions: [],
  dailyMeals: [],
  date: '',
  isLoading: false,
  error: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,

  reducers: {
    setDate: (state, { payload }) => {
      state.date = payload;
    },
  },

  extraReducers: builder => {
    builder
      // Ürün arama
      .addCase(getProductsByQuery.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getProductsByQuery.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.productsOptions = payload;
      })
      .addCase(getProductsByQuery.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Products could not be loaded.';
      })

      // Günlük öğünleri getirme
      .addCase(getDailyMeals.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getDailyMeals.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.dailyMeals = payload;
      })
      .addCase(getDailyMeals.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Daily meals could not be loaded.';
      })

      // Öğün ekleme
      .addCase(addMeal.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(addMeal.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.dailyMeals = [...state.dailyMeals, payload];
        state.productsOptions = [];
      })
      .addCase(addMeal.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Meal could not be added.';
      })

      // Öğün silme
      .addCase(deleteMeal.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(deleteMeal.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.dailyMeals = state.dailyMeals.filter(
          item => item._id !== payload
        );
      })
      .addCase(deleteMeal.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Meal could not be deleted.';
      });
  },
});

export const { setDate } = productsSlice.actions;
export default productsSlice.reducer;
