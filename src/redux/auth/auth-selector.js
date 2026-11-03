// Kullanıcı bilgileri
export const selectUser = state => state.auth.user;

// Kullanıcının giriş durumu
export const selectIsLoggedIn = state => state.auth.isLoggedIn;

// Kullanıcının access token bilgisi
export const selectAccessToken = state => state.auth.accessToken;

// Kullanıcının refresh token bilgisi
export const selectRefreshToken = state => state.auth.refreshToken;

// Kayıt ve giriş işlemlerinin yüklenme durumu
export const selectAuthIsLoading = state => state.auth.isLoading;

// Kayıt ve giriş hataları
export const selectAuthError = state => state.auth.error;

// Kullanıcının kişisel bilgileri
export const selectPersonalData = state => state.auth.personalData;

// Kullanıcının günlük beslenme hedefi
export const selectDailyDiet = state => state.auth.dailyDiet;

// Son kalori hesaplama sonucu
export const selectDailyIntakeResult = state => state.auth.dailyIntakeResult;

// Kalori hesaplama işleminin yüklenme durumu
export const selectDailyIntakeLoading = state => state.auth.dailyIntakeLoading;

// Kalori hesaplama hatası
export const selectDailyIntakeError = state => state.auth.dailyIntakeError;

// Kullanıcının günlük kalori ihtiyacı
export const selectDailyCalories = state =>
  state.auth.dailyDiet?.calories ??
  state.auth.dailyIntakeResult?.calories ??
  null;

// Kullanıcının kan grubuna göre yenmemesi gereken ürünler
export const selectNotAllowedProducts = state =>
  state.auth.dailyDiet?.notAllowedProduct ??
  state.auth.dailyIntakeResult?.notAllowedProduct ??
  [];
