const authRequestInterceptor = config => {
  const accessToken = localStorage.getItem('slimMomAccessToken');

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

export default authRequestInterceptor;
