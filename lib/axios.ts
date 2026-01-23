import axios from 'axios';
import { BASE_URL_API, API_KEY } from './api';

// Configuración base de axios centralizada
const axiosInstance = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    'ApiKey': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
