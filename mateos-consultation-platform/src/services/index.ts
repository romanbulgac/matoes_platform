// Главный файл экспорта всех сервисов
export { adminService } from './adminService';
export type {
    AdminStatistics,
    ContactRequestDto,
    CreateGroupDto,
    CreateUserDto,
    GroupDto,
    SubscriptionStatsDto,
    TeacherApplicationActionDto,
    UpdateUserDto
} from './adminService';
export { apiClient } from './api';
export { AuthService } from './authService';
export { ConsultationService } from './consultationService';
export { NotificationService } from './notificationService';
export { PaymentService } from './paymentService';
export { SessionService } from './sessionService';
export { StudentRegistrationService } from './studentRegistrationService';
export { SubscriptionService } from './subscriptionService';
export { TeacherService } from './teacherService';
export { UserService } from './userService';

// SignalR Services
export { securitySignalRService } from './securitySignalR';
export { notificationService } from './signalr';

// Экспорт типов
export * from '../types/api';
export type { PagedResult, PaginationDto } from './api';

// Импорты для ServiceManager
import { NotificationService } from './notificationService';

// Инициализация сервисов
export class ServiceManager {
  private static initialized = false;

  // Инициализация всех сервисов
  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('Инициализация сервисов...');
      
      // Временно отключаем SignalR из-за проблем с backend роутингом
      // await NotificationService.initialize();
      console.log('SignalR временно отключен');
      
      this.initialized = true;
      console.log('Сервисы успешно инициализированы');
    } catch (error) {
      console.error('Ошибка при инициализации сервисов:', error);
      throw error;
    }
  }  // Очистка всех сервисов
  static async cleanup(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      console.log('Очистка сервисов...');
      
      // Закрытие SignalR соединения
      await NotificationService.cleanup();
      
      this.initialized = false;
      console.log('Сервисы успешно очищены');
    } catch (error) {
      console.error('Ошибка очистки сервисов:', error);
    }
  }

  // Проверка инициализации
  static isInitialized(): boolean {
    return this.initialized;
  }

  // Переинициализация сервисов
  static async reinitialize(): Promise<void> {
    await this.cleanup();
    await this.initialize();
  }
}

// Хуки для интеграции с React (если используется)
export const useApiError = () => {
  const handleError = (error: unknown) => {
    console.error('API Error:', error);
    
    // Можно добавить логику обработки ошибок
    const msg = ((): string | null => {
      if (typeof error === 'string') return error;
      if (typeof error === 'object' && error && 'message' in error) {
        const m = (error as { message?: unknown }).message;
        return typeof m === 'string' ? m : null;
      }
      return null;
    })();

    if (msg && (msg.includes('401') || msg.includes('Sesiunea a expirat'))) {
      // Перенаправление на страницу входа
      window.location.href = '/login';
    }
  };

  return { handleError };
};
