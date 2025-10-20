import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor для обработки ошибок
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Токен истек - пытаемся обновить
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh-token', {
            token: localStorage.getItem('authToken'),
            refreshToken,
          });
          
          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('authToken', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Повторяем оригинальный запрос
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
  } catch {
          // Refresh не удался - перенаправляем на логин
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // Нет refresh токена - перенаправляем на логин
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
