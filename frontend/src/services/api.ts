import axios from 'axios';

// Usar variável de ambiente ou fallback para localhost
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de request para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@RHPlus:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de response para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@RHPlus:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;