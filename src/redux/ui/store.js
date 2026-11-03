import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/auth-slice.js';
import productsReducer from '../products/products-slice.js';
import uiReducer from './uiSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    ui: uiReducer,
  },

  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
