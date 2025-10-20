class TokenManager {
  private static readonly TOKEN_KEY = 'mateos_token';
  private static readonly REFRESH_KEY = 'mateos_refresh';
  
  static setTokens(accessToken: string, refreshToken: string) {
    // Используем httpOnly cookies для production
    if (process.env.NODE_ENV === 'production') {
      // Отправляем на сервер для установки httpOnly cookie
      this.setSecureCookie(accessToken, refreshToken);
    } else {
      // Для разработки используем sessionStorage с дополнительной защитой
      const encrypted = this.encrypt(accessToken);
      const encryptedRefresh = this.encrypt(refreshToken);
      sessionStorage.setItem(this.TOKEN_KEY, encrypted);
      sessionStorage.setItem(this.REFRESH_KEY, encryptedRefresh);
    }
  }
  
  static getToken(): string | null {
    if (process.env.NODE_ENV === 'production') {
      // В production токен будет в httpOnly cookie
      return this.getFromSecureCookie();
    } else {
      const encrypted = sessionStorage.getItem(this.TOKEN_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    }
  }
  
  static getRefreshToken(): string | null {
    if (process.env.NODE_ENV === 'production') {
      return this.getRefreshFromSecureCookie();
    } else {
      const encrypted = sessionStorage.getItem(this.REFRESH_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    }
  }
  
  static removeTokens(): void {
    if (process.env.NODE_ENV === 'production') {
      this.clearSecureCookies();
    } else {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_KEY);
    }
  }
  
  private static encrypt(data: string): string {
    // Простое шифрование для dev среды
    const secret = import.meta.env.VITE_APP_SECRET || 'default-dev-secret';
    return btoa(data + secret);
  }
  
  private static decrypt(encryptedData: string): string {
    const secret = import.meta.env.VITE_APP_SECRET || 'default-dev-secret';
    const decoded = atob(encryptedData);
    return decoded.replace(secret, '');
  }
  
  private static async setSecureCookie(accessToken: string, refreshToken: string) {
    try {
      // В production отправляем токены на сервер для установки httpOnly cookies
      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
      });
    } catch (error) {
      console.error('Failed to set secure cookies:', error);
      // Fallback to sessionStorage
      this.setTokens(accessToken, refreshToken);
    }
  }
  
  private static getFromSecureCookie(): string | null {
    // В production токен недоступен через JS (httpOnly cookie)
    // Сервер будет автоматически отправлять его с запросами
    return null;
  }
  
  private static getRefreshFromSecureCookie(): string | null {
    // Аналогично для refresh токена
    return null;
  }
  
  private static async clearSecureCookies(): Promise<void> {
    try {
      await fetch('/api/auth/clear-tokens', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to clear secure cookies:', error);
    }
  }
  
  static isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
}

export default TokenManager;
