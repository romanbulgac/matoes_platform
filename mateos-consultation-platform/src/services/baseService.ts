/**
 * Базовый сервис для API запросов
 * 
 * Интегрируется с системой Alert уведомлений через error-handler.ts
 * Все ошибки автоматически обрабатываются и отображаются пользователю
 * при использовании useErrorHandler хука в компонентах.
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export abstract class BaseService {
  protected baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response.text() as unknown as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError(
        'Network error or server unavailable',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: { message?: string; code?: string } = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, use status text
      errorData = { message: response.statusText };
    }

    const message = errorData.message || `Request failed with status ${response.status}`;
    
    throw new APIError(message, response.status, errorData.code);
  }

  private getAuthHeaders(): Record<string, string> {
    // Импортируем getToken локально чтобы избежать циклических зависимостей
    const getToken = () => {
      try {
        return sessionStorage.getItem('mateos_token') || localStorage.getItem('token');
      } catch {
        return null;
      }
    };
    
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Retry logic for failed requests
  protected async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
