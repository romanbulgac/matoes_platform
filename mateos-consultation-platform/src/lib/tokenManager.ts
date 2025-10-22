/**
 * Token Manager - Gestionare JWT tokens
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class TokenManager {
  /**
   * Salvează token-ul de autentificare
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Salvează ambele token-uri (access + refresh)
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.setToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  /**
   * Returnează token-ul de autentificare
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Șterge token-ul de autentificare
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Salvează refresh token-ul
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  /**
   * Returnează refresh token-ul
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Șterge refresh token-ul
   */
  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Șterge toate token-urile (alias pentru compatibilitate)
   */
  removeTokens(): void {
    this.clearAll();
  }

  /**
   * Șterge toate token-urile
   */
  clearAll(): void {
    this.clearToken();
    this.clearRefreshToken();
  }

  /**
   * Verifică dacă un token a expirat
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Verifică dacă utilizatorul este autentificat
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new TokenManager();

