import { createAsyncThunk } from '@reduxjs/toolkit';
import * as productsApi from '../../services/api/products.js';

// Ürün arama
export const getProductsByQuery = createAsyncThunk(
  'products/getProductsByQuery',
  async (query, { rejectWithValue }) => {
    try {
      return await productsApi.getProductsByQuery(query);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Products could not be loaded.'
      );
    }
  }
);

// Seçilen tarihin öğünlerini getirme
export const getDailyMeals = createAsyncThunk(
  'products/getDailyMeals',
  async (payload, { rejectWithValue }) => {
    try {
      return await productsApi.getDailyMeals(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Daily meals could not be loaded.'
      );
    }
  }
);

// Günlüğe öğün ekleme
export const addMeal = createAsyncThunk(
  'products/addMeal',
  async (newMeal, { rejectWithValue }) => {
    try {
      return await productsApi.addMeal(newMeal);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Meal could not be added.'
      );
    }
  }
);

// Günlükten öğün silme
export const deleteMeal = createAsyncThunk(
  'products/deleteMeal',
  async (mealId, { rejectWithValue }) => {
    try {
      await productsApi.deleteMeal(mealId);
      return mealId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Meal could not be deleted.'
      );
    }
  }
);
