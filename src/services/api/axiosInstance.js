import axios from 'axios';

import authRequestInterceptor from './interceptor.js';

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aynı anda gelen 401 istekleri için tek bir refresh isteği kullan.
let refreshPromise = null;

// Her isteğe access token ekle.
axiosInstance.interceptors.request.use(
  authRequestInterceptor,
  error => Promise.reject(error)
);

// Access token süresi dolduğunda otomatik yenile.
axiosInstance.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    const isAuthRequest = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout',
    ].some(path => requestUrl.includes(path));

    // 401 değilse veya aynı istek daha önce yenilendiyse devam etme.
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(
      'slimMomRefreshToken'
    );

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Yeni token isteğini başlat.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(response => {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data;

            if (!accessToken || !newRefreshToken) {
              throw new Error('Token refresh response is incomplete.');
            }

            // Yeni tokenları kaydet.
            localStorage.setItem(
              'slimMomAccessToken',
              accessToken
            );

            localStorage.setItem(
              'slimMomRefreshToken',
              newRefreshToken
            );

            if (response.data.user) {
              localStorage.setItem(
                'slimMomUser',
                JSON.stringify(response.data.user)
              );
            }

            return accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Yenileme işleminin tamamlanmasını bekle.
      const newAccessToken = await refreshPromise;

      // Başarısız olan ilk isteği yeni token ile tekrar gönder.
      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh token da geçersizse yerel oturumu temizle.
      localStorage.removeItem('slimMomAccessToken');
      localStorage.removeItem('slimMomRefreshToken');
      localStorage.removeItem('slimMomUser');

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
