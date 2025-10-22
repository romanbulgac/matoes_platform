const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_SIGNALR_URL',
] as const;

const optionalEnvVars = [
  'VITE_SENTRY_DSN',
  'VITE_ANALYTICS_ID',
  'VITE_APP_SECRET',
] as const;

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: Record<string, string> = {};

  private constructor() {
    this.validateAndLoad();
  }

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private validateAndLoad() {
    // Проверяем обязательные переменные
    const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }

    // Загружаем все переменные
    [...requiredEnvVars, ...optionalEnvVars].forEach(key => {
      const value = import.meta.env[key];
      if (value !== undefined) {
        this.config[key] = value;
      }
    });

    // Валидация URL форматов
    this.validateUrls();
  }

  private validateUrls() {
    const urlVars = ['VITE_API_BASE_URL', 'VITE_SIGNALR_URL'];
    
    urlVars.forEach(key => {
      const url = this.config[key];
      if (url && !this.isValidUrl(url)) {
        throw new Error(`Invalid URL format for ${key}: ${url}`);
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  get apiBaseUrl(): string {
    return this.config.VITE_API_BASE_URL || 'http://localhost:5000/api';
  }

  get signalRUrl(): string {
    return this.config.VITE_SIGNALR_URL || 'http://localhost:5000/hubs';
  }

  get sentryDsn(): string | undefined {
    return this.config.VITE_SENTRY_DSN;
  }

  get analyticsId(): string | undefined {
    return this.config.VITE_ANALYTICS_ID;
  }

  get appSecret(): string {
    return this.config.VITE_APP_SECRET || 'default-dev-secret';
  }

  get isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  get isProduction(): boolean {
    return import.meta.env.PROD;
  }
}

export const env = EnvironmentConfig.getInstance();
