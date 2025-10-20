// Сервис авторизации
import {
    LoginRequestDto,
    LoginResponse,
    RegisterRequestDto,
    RegisterResponse,
    TokenRequestDto,
} from '../types/api';
import type {
    DeviceInfoDto,
    SessionDto
} from '../types/security';
import { convertKeysToPascalCase } from '../utils/caseConverter';
import { apiClient } from './api';

export class AuthService {
  // Регистрация нового пользователя
  static async register(data: RegisterRequestDto): Promise<RegisterResponse> {
    const result = await apiClient.post<RegisterResponse>('/auth/register', data);
    console.log('✅ AuthService register result:', result);
    
    // ⚠️ Register НЕ возвращает success согласно документации!
    // Проверяем только наличие token
    if (result.token) {
      apiClient.setToken(result.token);
    }
    return result;
  }

  // Вход в систему
  static async login(data: LoginRequestDto): Promise<LoginResponse> {
    const result = await apiClient.post<LoginResponse>('/auth/login', data);
    console.log('✅ AuthService login result:', result);
    
    if (result.success && result.token) {
      apiClient.setToken(result.token);
    }
    return result;
  }

  // Обновление токена
  static async refreshToken(data: TokenRequestDto): Promise<LoginResponse> {
    const result = await apiClient.post<LoginResponse>('/auth/refresh-token', data);
    if (result.token) {
      apiClient.setToken(result.token);
    }
    return result;
  }

  // Отзыв токена
  // 🔐 SECURITY: Nu mai trimitem refreshToken ca parametru
  // Backend-ul îl va citi automat din HttpOnly cookie
  static async revokeToken(): Promise<void> {
    await apiClient.post('/auth/revoke-token', {});
  }

  // Выход из системы
  // 🔐 SECURITY: Apelăm endpoint-ul de logout care clear-uiește cookie-ul HttpOnly
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Error during logout API call:', error);
      // Continuăm cu local cleanup chiar dacă API call-ul eșuează
    } finally {
      // Întotdeauna curățăm token-ul local
      apiClient.clearToken();
    }
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Смена пароля
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const data = {
      CurrentPassword: currentPassword,
      NewPassword: newPassword,
    };
    await apiClient.post('/auth/change-password', data);
  }

  // Получение текущего пользователя
  static getCurrentUser(): string | null {
    return localStorage.getItem('user');
  }

  // ========== DEVICE TRACKING METHODS ==========

  /**
   * Вход в систему с информацией об устройстве
   * @param credentials - Email и пароль
   * @param deviceInfo - Информация об устройстве
   * @param rememberDevice - Запомнить устройство (по умолчанию false)
   */
  static async loginWithDeviceInfo(
    credentials: LoginRequestDto,
    deviceInfo: DeviceInfoDto,
    rememberDevice = false
  ): Promise<LoginResponse> {
    const loginData = {
      ...credentials,
      ...deviceInfo,
      rememberDevice,
    };

    console.log('🔍 Login Data (camelCase):', JSON.stringify(loginData, null, 2));
    
    // Convert to PascalCase for C# backend
    const loginDataPascalCase = convertKeysToPascalCase(loginData);
    
    console.log('🔍 Login Data (PascalCase for backend):', JSON.stringify(loginDataPascalCase, null, 2));

    const result = await apiClient.post<LoginResponse>(
      '/auth/login',
      loginDataPascalCase
    );
    
    console.log('✅ AuthService loginWithDeviceInfo result:', result);

    if (result.success && result.token) {
      apiClient.setToken(result.token);

      // Сохраняем информацию о сессии
      if (result.session) {
        this.setCurrentSession(result.session);
      }
    }

    return result;
  }

  /**
   * Регистрация с информацией об устройстве
   * @param userData - Данные пользователя
   * @param deviceInfo - Информация об устройстве
   */
  static async registerWithDeviceInfo(
    userData: RegisterRequestDto,
    deviceInfo: DeviceInfoDto
  ): Promise<RegisterResponse> {
    const registerData = {
      ...userData,
      ...deviceInfo,
    };

    console.log('🔍 Register Data (camelCase):', JSON.stringify(registerData, null, 2));
    
    // Convert to PascalCase for C# backend
    const registerDataPascalCase = convertKeysToPascalCase(registerData);
    
    console.log('🔍 Register Data (PascalCase for backend):', JSON.stringify(registerDataPascalCase, null, 2));

    const result = await apiClient.post<RegisterResponse>(
      '/auth/register',
      registerDataPascalCase
    );
    
    console.log('✅ AuthService registerWithDeviceInfo result:', result);

    // ⚠️ Register НЕ возвращает success/session согласно документации
    // Проверяем только token
    if (result.token) {
      apiClient.setToken(result.token);
    }

    return result;
  }

  // ========== SESSION MANAGEMENT ==========

  /**
   * Получить текущую сессию из localStorage
   */
  static getCurrentSession(): SessionDto | null {
    try {
      const sessionStr = localStorage.getItem('currentSession');
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  }

  /**
   * Сохранить текущую сессию в localStorage
   */
  static setCurrentSession(session: SessionDto): void {
    try {
      localStorage.setItem('currentSession', JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Очистить информацию о сессии
   */
  static clearSession(): void {
    localStorage.removeItem('currentSession');
  }

  /**
   * Проверить, является ли текущее устройство новым
   */
  static isNewDevice(): boolean {
    const session = this.getCurrentSession();
    return session?.isNewDevice ?? false;
  }

  /**
   * Проверить, является ли текущее устройство доверенным
   */
  static isTrustedDevice(): boolean {
    const session = this.getCurrentSession();
    return session?.isTrusted ?? false;
  }
}
