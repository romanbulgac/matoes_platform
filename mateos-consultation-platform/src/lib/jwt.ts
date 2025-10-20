// Утилиты для работы с JWT токенами
import TokenManager from './tokenManager';

export interface JWTPayload {
  sub: string;
  email: string;
  jti: string;
  nameid: string;
  unique_name: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

// Декодирование JWT токена (без проверки подписи)
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Извлечение данных пользователя из JWT токена
export function getUserFromJWT(token: string) {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  // Разбираем unique_name на firstname и lastname
  const fullName = payload.unique_name || '';
  const nameParts = fullName.split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  return {
    id: payload.sub,
    email: payload.email,
    firstname,
    lastname,
    role: payload.role,
    lastLoginAt: undefined
  };
}

// Безопасное получение токена
export const getToken = (): string | null => TokenManager.getToken();

// Безопасное сохранение токенов
export const setToken = (token: string, refreshToken?: string): void => {
  if (refreshToken) {
    TokenManager.setTokens(token, refreshToken);
  } else {
    // Если только access token, сохраняем его с пустым refresh
    TokenManager.setTokens(token, '');
  }
};

// Безопасное удаление токенов
export const removeToken = (): void => TokenManager.removeTokens();

// Проверка истечения токена
export const isTokenExpired = (token: string): boolean => TokenManager.isTokenExpired(token);
