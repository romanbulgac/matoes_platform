// Централизованная конфигурация приложения

// Export security configuration
export * from './security';

export interface AppConfig {
  // API настройки
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  // SignalR настройки  
  signalR: {
    hubUrl: string;
    reconnectAttempts: number;
    reconnectInterval: number;
  };
  
  // Общие настройки
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    frontendPort: string;
  };
}

// Определяем переменные окружения
const isDevelopment = import.meta.env.MODE === 'development';
const FRONTEND_PORT = import.meta.env.VITE_FRONTEND_PORT || '3000';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5217';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? BACKEND_URL : 'https://api.mateos.ro');

// Логирование для отладки
console.log('🔧 Environment variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_BASE_URL,
  BACKEND_URL,
  isDevelopment
});
const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || (isDevelopment ? `${BACKEND_URL}/notificationHub` : 'https://api.mateos.ro/notificationHub');

// Экспортируем конфигурацию
export const config: AppConfig = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 30000, // 30 секунд
  },
  
  signalR: {
    hubUrl: SIGNALR_URL,
    reconnectAttempts: 5,
    reconnectInterval: 3000, // 3 секунды
  },
  
  app: {
    name: 'Mathematics Consultation Platform',
    version: '1.0.0',
    environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
    frontendPort: FRONTEND_PORT,
  },
};

// Утилитарные функции
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getBackendUrl = (): string => {
  return BACKEND_URL;
};

export const getSignalRUrl = (): string => {
  return config.signalR.hubUrl;
};

export const getFrontendUrl = (): string => {
  return isDevelopment ? `http://localhost:${config.app.frontendPort}` : window.location.origin;
};

// Логирование конфигурации в development режиме
if (isDevelopment) {
  console.log('🔧 App Configuration:', {
    api: config.api,
    signalR: config.signalR,
    app: config.app,
    backendUrl: BACKEND_URL,
  });
}
