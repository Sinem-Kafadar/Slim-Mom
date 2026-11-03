import axiosInstance from './api/axiosInstance.js';

// Herkes için günlük kalori hesaplama
export const calculateDailyIntake = async personalData => {
  const { data } = await axiosInstance.post(
    '/daily-intake',
    personalData
  );

  return data;
};

// Giriş yapan kullanıcı için kalori hesaplama ve kaydetme
export const saveUserDailyIntake = async personalData => {
  const { data } = await axiosInstance.post(
    '/daily-intake/user',
    personalData
  );

  return data;
};
