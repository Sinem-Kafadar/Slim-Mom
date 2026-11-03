import authApi from '../authApi.js';

// Kullanıcının access token bilgisini al.
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('slimMomAccessToken');

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {};
};

// Ürün arama
export const getProductsByQuery = async query => {
  const { data } = await authApi.get('/products', {
    params: {
      q: query,
    },
    headers: {
      ...getAuthHeaders(),
      'Cache-Control': 'no-cache',
    },
  });

  return data;
};

// Seçilen tarihin günlük öğünlerini getir
export const getDailyMeals = async payload => {
  const { data } = await authApi.post(
    '/dailynutritions/getdailymeals',
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
};

// Günlüğe yeni öğün ekle
export const addMeal = async newMeal => {
  const { data } = await authApi.post(
    '/dailynutritions/addmeal',
    newMeal,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
};

// Günlükten öğün sil
export const deleteMeal = async mealId => {
  const { data } = await authApi.delete(
    `/dailynutritions/${encodeURIComponent(mealId)}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
};
