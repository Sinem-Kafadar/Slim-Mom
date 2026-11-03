import axiosInstance from './api/axiosInstance.js';

// Yeni kullanıcı kaydı
export const registerUser = async userData => {
  const response = await axiosInstance.post(
    '/auth/register',
    userData
  );

  return response.data;
};

// Kullanıcı girişi
export const loginUser = async credentials => {
  const response = await axiosInstance.post(
    '/auth/login',
    credentials
  );

  return response.data;
};

// Giriş yapmış kullanıcının bilgilerini getir
export const getCurrentUser = async accessToken => {
  const response = await axiosInstance.get('/auth/me', {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });

  return response.data;
};

export default axiosInstance;
