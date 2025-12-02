import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5142/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath === '/login' || currentPath === '/customer-login';
      
      if (!isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;