// API Service для Mathematics Consultation Platform
// Базовый HTTP клиент с поддержкой авторизации и обработкой ошибок

import { config } from '@/config';
import { toCamelCase } from '@/utils/apiTransform';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationDto {
  page: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private csrfToken: string | null = null;
  private disableCSRF: boolean = false;
  private autoTransformToCamelCase: boolean = true; // 🔥 AUTO CAMELCASE TRANSFORM

  constructor(baseURL: string = config.api.baseUrl) {
    this.baseURL = baseURL;
    console.log('🔧 ApiClient initialized with baseURL:', this.baseURL);
    console.log('🔧 Config details:', {
      'config.api.baseUrl': config.api.baseUrl,
      'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
      'VITE_BACKEND_URL': import.meta.env.VITE_BACKEND_URL,
      'Expected backend should be running on': this.baseURL
    });
    this.token = localStorage.getItem('authToken');
    
    // В development режиме можем отключить CSRF для тестирования
    this.disableCSRF = import.meta.env.VITE_DISABLE_CSRF === 'true';
    
    // Автоматическая трансформация PascalCase → camelCase
    // Backend: ASP.NET Core PropertyNamingPolicy = null (PascalCase)
    // Frontend: JavaScript/TypeScript conventions (camelCase)
    this.autoTransformToCamelCase = import.meta.env.VITE_DISABLE_CAMEL_TRANSFORM !== 'true';
    
    if (this.autoTransformToCamelCase) {
      console.log('✅ Auto camelCase transformation: ENABLED');
    } else {
      console.warn('⚠️ Auto camelCase transformation: DISABLED');
    }
    
    if (!this.disableCSRF) {
      this.initializeCSRF();
    } else {
      console.warn('⚠️ CSRF protection disabled for development');
    }
  }

  // Инициализация CSRF токена
  private async initializeCSRF() {
    try {
      // Сначала попытка получить CSRF из meta тега
      const metaCSRF = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (metaCSRF) {
        this.csrfToken = metaCSRF;
        console.log('🔒 CSRF token found in meta tag');
        return;
      }

      // Попытка получить из cookies
      const cookieCSRF = this.getCookieValue('XSRF-TOKEN') || this.getCookieValue('csrf_token');
      if (cookieCSRF) {
        this.csrfToken = cookieCSRF;
        console.log('🔒 CSRF token found in cookies');
        return;
      }

      // Попытка получить CSRF токен с сервера
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrfToken || data.token;
        console.log('🔒 CSRF token obtained from server');
      } else {
        console.warn('⚠️ CSRF token not available, continuing without it');
      }
    } catch (error) {
      console.warn('⚠️ Failed to get CSRF token:', error);
      // Продолжаем без CSRF токена - возможно сервер его не требует
    }
  }

  // Получение значения cookie
  private getCookieValue(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  // Установка токена авторизации
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Очистка токена
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Încearcă să reîmprospăteze access token folosind refresh token din HttpOnly cookie
   * @returns true dacă refresh a avut succes, false altfel
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      console.log('🔄 Attempting to refresh access token...');
      
      // Apelăm endpoint-ul de refresh - refresh token-ul va fi luat automat din HttpOnly cookie
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Esențial pentru a trimite HttpOnly cookies
      });

      if (!response.ok) {
        console.warn('❌ Token refresh failed:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      
      if (data.accessToken) {
        console.log('✅ Access token refreshed successfully');
        this.setToken(data.accessToken);
        return true;
      } else {
        console.warn('⚠️ Refresh response missing accessToken');
        return false;
      }
    } catch (error) {
      console.error('❌ Error during token refresh:', error);
      return false;
    }
  }

  // Получение нового CSRF токена
  async refreshCSRFToken(): Promise<void> {
    await this.initializeCSRF();
  }

  // Базовый метод для HTTP запросов
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 Making request to:', url);
    console.log('🔧 Base URL:', this.baseURL);
    console.log('🔧 Endpoint:', endpoint);
    console.log('🔧 Request method:', options.method);
    console.log('🔧 Request body:', options.body);
    
    // Добавляем информацию о пользователе для debugging
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    console.log('👤 Current user role:', userRole);
    console.log('👤 Current user ID:', userId);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('🔑 Token added to request:', this.token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ NO TOKEN available for request!');
    }

    // Добавляем CSRF токен если он есть и это не GET запрос
    if (!this.disableCSRF && this.csrfToken && options.method !== 'GET') {
      headers['X-CSRF-Token'] = this.csrfToken;
      // headers['X-Requested-With'] = 'XMLHttpRequest'; // Временно отключено для отладки CORS
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Важно для передачи cookies с CSRF
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // ⚠️ ВАЖНО: response.text() можно вызвать ТОЛЬКО ОДИН РАЗ!
        // Читаем body здесь и используем переменную везде
        const responseText = await response.text();
        
        if (response.status === 401) {
          console.warn('🔐 Unauthorized response (401) - token might be expired');
          console.warn('Response body:', responseText.substring(0, 200));
          
          // 🔄 Încercăm să reîmprospătăm token-ul automat
          // Dar DOAR dacă:
          // 1. Nu suntem deja pe endpoint-ul de refresh (evităm loop infinit)
          // 2. Nu suntem pe endpoint-uri de autentificare (login/register nu necesită token)
          const isAuthEndpoint = endpoint.includes('/auth/login') || 
                                  endpoint.includes('/auth/register') ||
                                  endpoint.includes('/auth/refresh-token');
          
          if (!isAuthEndpoint) {
            console.log('🔄 Attempting automatic token refresh...');
            const refreshSuccess = await this.refreshAccessToken();
            
            if (refreshSuccess) {
              console.log('✅ Token refreshed, retrying original request...');
              // Retry request-ul original cu noul token
              return this.request<T>(endpoint, options);
            } else {
              console.warn('❌ Token refresh failed, clearing auth state');
            }
          }
          
          // Dacă refresh-ul a eșuat sau suntem pe endpoint-uri de auth, clear token
          this.clearToken();
          
          // Pentru endpoint-uri de autentificare, aruncăm eroarea cu mesajul din response
          if (isAuthEndpoint) {
            let errorMessage = 'Authentication failed';
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorMessage;
            } catch {
              errorMessage = responseText || errorMessage;
            }
            throw new Error(errorMessage);
          }
          
          throw new Error('Authentication expired');
        }
        
        if (response.status === 403) {
          console.warn('🚫 Forbidden response (403):', responseText.substring(0, 200));
          
          // Проверяем, связано ли это с CSRF
          if (responseText.includes('CSRF') || responseText.includes('csrf')) {
            console.log('🔄 CSRF token expired, refreshing...');
            await this.initializeCSRF();
            
            // Повторяем запрос с новым CSRF токеном
            if (this.csrfToken) {
              const newHeaders = { ...headers };
              if (options.method !== 'GET') {
                newHeaders['X-CSRF-Token'] = this.csrfToken;
              }
              const retryResponse = await fetch(url, {
                ...config,
                headers: newHeaders,
              });
              if (retryResponse.ok) {
                const contentType = retryResponse.headers.get('content-type');
                const retryText = await retryResponse.text();
                if (contentType && contentType.includes('application/json')) {
                  return retryText.trim() ? JSON.parse(retryText) : {} as T;
                }
                return retryResponse as unknown as T;
              }
            }
            throw new Error('Токен CSRF недействителен');
          }
          
          // Если это не CSRF, возможно проблема с правами доступа
          console.error('🚨 Access Denied (403) - недостаточно прав для доступа к ресурсу');
          console.error('🔍 Current role:', localStorage.getItem('userRole'));
          console.error('🔍 Request URL:', url);
        }
        
        // Парсим ошибку из responseText (уже прочитанного)
        let errorData: { message?: string; errors?: Record<string, string[]> } | null;
        try {
          errorData = responseText ? JSON.parse(responseText) : null;
        } catch {
          errorData = { message: responseText || `HTTP Error: ${response.status}` };
        }
        
        const errorMessage = errorData?.message || `HTTP Error: ${response.status}`;
        
        console.error(`❌ API Error ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorMessage
        });
        
        // 🔍 LOG DETALIAT pentru debugging
        console.error('🔍 FULL ERROR DATA:', JSON.stringify(errorData, null, 2));
        
        // Создаем ошибку с правильным статусом
        const error = new Error(errorMessage) as Error & { status?: number; data?: unknown };
        error.status = response.status;
        error.data = errorData;
        
        throw error;
      }

      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      console.log('🔍 API Response details:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        responseText: responseText.substring(0, 500), // Первые 500 символов
        url: url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (contentType && contentType.includes('application/json')) {
        if (responseText.trim()) {
          try {
            const parsed = JSON.parse(responseText);
            
            // 🔥 AUTO TRANSFORM: PascalCase → camelCase
            if (this.autoTransformToCamelCase) {
              const transformed = toCamelCase<T>(parsed);
              console.log('🔄 Response transformed to camelCase');
              return transformed;
            }
            
            return parsed;
          } catch (jsonError) {
            console.error('❌ JSON Parse Error:', jsonError);
            console.error('❌ Response text that failed to parse:', responseText);
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
          }
        } else {
          // Для успешных запросов без содержимого возвращаем пустой объект
          return {} as T;
        }
      } else {
        console.warn('⚠️ Response is not JSON:', contentType);
        console.warn('📄 HTML Response received (potential auth redirect):', responseText.substring(0, 200));
        
        // Если получаем HTML вместо JSON, это обычно означает проблему с аутентификацией
        if (contentType && contentType.includes('text/html')) {
          // Проверяем, не является ли это страницей логина
          if (responseText.includes('login') || responseText.includes('Login') || responseText.includes('sign-in')) {
            console.error('🔐 Received login page instead of API response - authentication failed');
            this.clearToken();
            window.location.href = '/login';
            throw new Error('Authentication expired - redirected to login');
          }
          
          throw new Error(`Server returned HTML instead of JSON. URL: ${url}`);
        }
        
        return response as unknown as T;
      }
    } catch (error) {
      console.error('❌ API Request failed:', error);
      console.error('❌ Request details:', {
        url,
        method: options.method || 'GET',
        headers,
        hasBody: !!config.body
      });
      
      // Специальная обработка для сетевых ошибок
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network error - backend might not be running or CORS issue');
        throw new Error('Не удается подключиться к серверу. Проверьте, что бэкенд запущен на ' + this.baseURL);
      }
      
      throw error;
    }
  }

  // HTTP методы
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Загрузка файлов
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  }
}

// Экспорт единственного экземпляра API клиента
export const apiClient = new ApiClient();
