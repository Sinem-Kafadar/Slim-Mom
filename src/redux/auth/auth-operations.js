import { createAsyncThunk } from '@reduxjs/toolkit';

import authApi, {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../../services/authApi.js';

import {
  calculateDailyIntake as calculateDailyIntakeApi,
  saveUserDailyIntake as saveUserDailyIntakeApi,
} from '../../services/dailyIntakeApi.js';

// Hata mesajlarını düzenle
const getErrorMessage = error => {
  const data = error.response?.data;

  if (data?.errors?.length) {
    return (
      data.errors[0].message ||
      data.errors[0].msg ||
      'Please check your information.'
    );
  }

  return (
    data?.message || error.message || 'Something went wrong. Please try again.'
  );
};

// Kullanıcı kaydı
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Kullanıcı girişi
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);

      if (!response.accessToken || !response.refreshToken) {
        return rejectWithValue(
          'The server did not return the required authentication tokens.'
        );
      }

      localStorage.setItem('slimMomAccessToken', response.accessToken);

      localStorage.setItem('slimMomRefreshToken', response.refreshToken);

      if (response.user) {
        localStorage.setItem('slimMomUser', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Giriş yapan kullanıcının bilgilerini getir
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken =
        state.auth.accessToken || localStorage.getItem('slimMomAccessToken');

      if (!accessToken) {
        return rejectWithValue('Please sign in first.');
      }

      return await getCurrentUser(accessToken);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Oturumu kapat
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState();

    const refreshToken =
      state.auth.refreshToken || localStorage.getItem('slimMomRefreshToken');

    try {
      if (refreshToken) {
        await authApi.post('/auth/logout', {
          refreshToken,
        });
      }
    } catch (error) {
      // Sunucuya ulaşılamasa bile yerel oturumu kapatacağız.
    } finally {
      localStorage.removeItem('slimMomAccessToken');
      localStorage.removeItem('slimMomRefreshToken');
      localStorage.removeItem('slimMomUser');
    }

    return true;
  }
);

// Herkes için günlük kalori hesaplama
export const calculateDailyIntake = createAsyncThunk(
  'auth/calculateDailyIntake',
  async (personalData, { rejectWithValue }) => {
    try {
      return await calculateDailyIntakeApi(personalData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Giriş yapan kullanıcı için kalori hesaplama ve kaydetme
export const saveUserDailyIntake = createAsyncThunk(
  'auth/saveUserDailyIntake',
  async (personalData, { rejectWithValue }) => {
    try {
      return await saveUserDailyIntakeApi(personalData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

