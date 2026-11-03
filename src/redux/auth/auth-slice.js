import { createSlice } from '@reduxjs/toolkit';

import {
  register,
  login,
  fetchCurrentUser,
  logout,
  calculateDailyIntake,
  saveUserDailyIntake,
} from './auth-operations';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('slimMomUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,

  accessToken: localStorage.getItem('slimMomAccessToken') || null,
  refreshToken: localStorage.getItem('slimMomRefreshToken') || null,

  isLoggedIn: Boolean(localStorage.getItem('slimMomAccessToken')),

  // Kullanıcının kişisel bilgileri
  personalData: storedUser?.personalData || null,

  // Kullanıcının günlük beslenme hedefi
  dailyDiet: storedUser?.dailyDiet || null,

  // Kalori hesaplama sonucu
  dailyIntakeResult: null,

  isLoading: false,
  error: null,

  // Kalori işlemleri için ayrı yüklenme ve hata durumları
  dailyIntakeLoading: false,
  dailyIntakeError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    clearAuthError(state) {
      state.error = null;
    },

    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;

      state.personalData = null;
      state.dailyDiet = null;
      state.dailyIntakeResult = null;

      state.isLoading = false;
      state.error = null;

      state.dailyIntakeLoading = false;
      state.dailyIntakeError = null;
    },

    clearDailyIntakeError(state) {
      state.dailyIntakeError = null;
    },
  },

  extraReducers: builder => {
    builder

      // -----------------------------
      // KULLANICI KAYDI
      // -----------------------------

      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed.';
      })

      // -----------------------------
      // KULLANICI GIRISI
      // -----------------------------

      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.user = action.payload.user || null;

        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        state.isLoggedIn = Boolean(action.payload.accessToken);

        state.personalData = state.user?.personalData || null;

        state.dailyDiet = state.user?.dailyDiet || null;
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed.';
      })

      // -----------------------------
      // KULLANICI BILGILERINI GETIR
      // -----------------------------

      .addCase(fetchCurrentUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.user = action.payload.user || action.payload;

        state.personalData = state.user?.personalData || null;

        state.dailyDiet = state.user?.dailyDiet || null;

        if (state.user) {
          localStorage.setItem('slimMomUser', JSON.stringify(state.user));
        }
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load user information.';
      })

      // -----------------------------
      // KULLANICI CIKISI
      // -----------------------------

      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isLoggedIn = false;

        state.personalData = null;
        state.dailyDiet = null;
        state.dailyIntakeResult = null;

        state.isLoading = false;
        state.error = null;

        state.dailyIntakeLoading = false;
        state.dailyIntakeError = null;
      })

      // -----------------------------
      // HERKES ICIN KALORI HESAPLAMA
      // -----------------------------

      .addCase(calculateDailyIntake.pending, state => {
        state.dailyIntakeLoading = true;
        state.dailyIntakeError = null;
      })

      .addCase(calculateDailyIntake.fulfilled, (state, action) => {
        state.dailyIntakeLoading = false;
        state.dailyIntakeError = null;

        state.dailyIntakeResult = action.payload;
      })

      .addCase(calculateDailyIntake.rejected, (state, action) => {
        state.dailyIntakeLoading = false;
        state.dailyIntakeError =
          action.payload || 'Calorie calculation failed.';
      })

      // -----------------------------
      // GIRIS YAPAN KULLANICI ICIN
      // KALORI HESAPLAMA VE KAYDETME
      // -----------------------------

      .addCase(saveUserDailyIntake.pending, state => {
        state.dailyIntakeLoading = true;
        state.dailyIntakeError = null;
      })

      .addCase(saveUserDailyIntake.fulfilled, (state, action) => {
        state.dailyIntakeLoading = false;
        state.dailyIntakeError = null;

        state.dailyIntakeResult = action.payload;
        state.dailyDiet = action.payload;

        state.personalData = action.meta.arg;

        if (state.user) {
          state.user.personalData = action.meta.arg;
          state.user.dailyDiet = action.payload;

          localStorage.setItem('slimMomUser', JSON.stringify(state.user));
        }
      })

      .addCase(saveUserDailyIntake.rejected, (state, action) => {
        state.dailyIntakeLoading = false;
        state.dailyIntakeError =
          action.payload || 'Unable to save daily calorie intake.';
      });
  },
});

export const { clearAuthError, clearAuth, clearDailyIntakeError } =
  authSlice.actions;

export default authSlice.reducer;
