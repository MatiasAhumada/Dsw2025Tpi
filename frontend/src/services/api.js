import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:5142/api',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente a las peticiones
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;