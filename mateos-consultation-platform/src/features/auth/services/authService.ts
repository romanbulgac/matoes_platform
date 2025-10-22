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
 *   const result = await authService.login(credentials);
 *   errorHandler.showSuccess('Успешный вход в систему!');
 * } catch (error) {
 *   errorHandler.handleAuthError(error);
 * }
 * ```
 */

import TokenManager from '@/lib/tokenManager';
import { BaseService } from '@/services/baseService';
import { APIResponse, LoginForm, RegisterForm, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthServiceNew extends BaseService {
  constructor() {
    super(API_BASE_URL);
  }

  async login(credentials: LoginForm): Promise<APIResponse<{ user: User; token: string }>> {
    const response = await this.request<APIResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token securely
    if (response.data.token) {
      TokenManager.setTokens(response.data.token, ''); // Refresh token will be provided by backend
    }

    return response;
  }

  async register(userData: RegisterForm): Promise<APIResponse<{ user: User; token: string }>> {
    const response = await this.request<APIResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token securely
    if (response.data.token) {
      TokenManager.setTokens(response.data.token, ''); // Refresh token will be provided by backend
    }

    return response;
  }

  async logout(): Promise<APIResponse<void>> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        // Call logout endpoint
        await this.request<APIResponse<void>>('/auth/logout', {
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
    return { success: true, data: undefined };
  }

  async refreshToken(): Promise<APIResponse<{ user: User; token: string }>> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<APIResponse<{ user: User; token: string }>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update stored tokens
    if (response.data.token) {
      TokenManager.setTokens(response.data.token, refreshToken); // Keep existing refresh token unless new one provided
    }

    return response;
  }

  async updateProfile(profileData: Partial<User>): Promise<APIResponse<{ user: User }>> {
    const response = await this.request<APIResponse<{ user: User }>>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    return response;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    return response;
  }

  async resetPassword(email: string): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response;
  }

  async confirmResetPassword(token: string, newPassword: string): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/confirm-reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    return response;
  }

  async getCurrentUser(): Promise<APIResponse<{ user: User }>> {
    const response = await this.request<APIResponse<{ user: User }>>('/auth/me', {
      method: 'GET',
    });

    return response;
  }

  async verifyEmail(token: string): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    return response;
  }

  async resendEmailVerification(): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/resend-verification', {
      method: 'POST',
    });

    return response;
  }

  // Дополнительные методы для восстановления пароля
  async forgotPassword(email: string): Promise<APIResponse<void>> {
    const response = await this.request<APIResponse<void>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response;
  }

  // Утилитарные методы для проверки токенов
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
        return response.data.token;
      } catch {
        // Если не удалось обновить токен, пользователь должен войти заново
        TokenManager.removeTokens();
        return null;
      }
    }

    return token;
  }

  // Helper method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = TokenManager.getToken();
      if (!token) return false;

      // Verify token is not expired
      const isExpired = TokenManager.isTokenExpired(token);
      if (isExpired) {
        // Try to refresh token
        try {
          await this.refreshToken();
          return true;
        } catch {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthServiceNew();
