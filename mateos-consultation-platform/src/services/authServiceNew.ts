/**
 * Сервис авторизации с интеграцией Alert системы
 * 
 * Все ошибки автоматически обрабатываются в компонентах через useErrorHandler:
 * - handleAuthError() для критичных ошибок аутентификации
 * - handleValidationError() для ошибок валидации данных
 * - handleNetworkError() для проблем с сетью
 * 
 * @example
 * ```tsx
 * const errorHandler = useErrorHandler();
 * 
 * try {
 *   await AuthService.login(credentials);
 * } catch (error) {
 *   errorHandler.handleAuthError(error);
 * }
 * ```
 */

import { env } from '../config/environment';
import TokenManager from '../lib/tokenManager';
import { RegisterForm, User } from '../types';
import { BaseService } from './baseService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

class AuthService extends BaseService {
  constructor() {
    super(env.apiBaseUrl);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Сохраняем токены безопасно
    if (response.token && response.refreshToken) {
      TokenManager.setTokens(response.token, response.refreshToken);
    }

    return response;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Сохраняем токены безопасно
    if (response.token && response.refreshToken) {
      TokenManager.setTokens(response.token, response.refreshToken);
    }

    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Обновляем токены
    if (response.token && response.refreshToken) {
      TokenManager.setTokens(response.token, response.refreshToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        // Log error but don't throw - we still want to clear local storage
        console.warn('Logout request failed:', error);
      }
    }

    // Clear tokens regardless of API call result
    TokenManager.removeTokens();
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<void> {
    await this.request('/auth/resend-verification', {
      method: 'POST',
    });
  }

  // Проверяем валидность текущего токена
  isTokenValid(): boolean {
    const token = TokenManager.getToken();
    
    if (!token) {
      return false;
    }

    return !TokenManager.isTokenExpired(token);
  }

  // Автоматическое обновление токена при необходимости
  async ensureValidToken(): Promise<string | null> {
    const token = TokenManager.getToken();
    
    if (!token) {
      return null;
    }

    if (TokenManager.isTokenExpired(token)) {
      try {
        const response = await this.refreshToken();
        return response.token;
      } catch (error) {
        // Если не удалось обновить токен, пользователь должен войти заново
        TokenManager.removeTokens();
        return null;
      }
    }

    return token;
  }
}

export const authService = new AuthService();
