// Serviciu notificări cu suport SignalR
import { config, getSignalRUrl } from '@/config';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {
    InAppNotificationRequestDto,
    NotificationDto,
} from '../types/api';
import { apiClient, PagedResult } from './api';

export class NotificationService {
  private static hubConnection: HubConnection | null = null;
  private static listeners: ((notification: NotificationDto) => void)[] = [];

  // Inițializarea serviciului (alias pentru initializeSignalR)
  static async initialize(): Promise<void> {
    return this.initializeSignalR();
  }

  // Curățarea serviciului (alias pentru closeSignalR)  
  static async cleanup(): Promise<void> {
    return this.closeSignalR();
  }

  // Inițializarea conexiunii SignalR
  static async initializeSignalR(): Promise<void> {
    if (this.hubConnection) {
      return;
    }

    try {
      const signalRUrl = getSignalRUrl();
      console.log('🔧 Initializing SignalR with URL:', signalRUrl);
      
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(signalRUrl, {
          accessTokenFactory: () => localStorage.getItem('authToken') || '',
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.elapsedMilliseconds < 60000) {
              return config.signalR.reconnectInterval;
            } else {
              return null; // Stop retrying after 1 minute
            }
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Procesarea primirii notificărilor
      this.hubConnection.on('ReceiveNotification', (notification: NotificationDto) => {
        this.listeners.forEach(listener => listener(notification));
      });

      await this.hubConnection.start();
      console.log('✅ SignalR connection established successfully');
    } catch (error) {
      console.error('🔴 SignalR connection error:', error);
    }
  }

  // Закрытие SignalR соединения
  static async closeSignalR(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  // Подписка на уведомления
  static onNotificationReceived(callback: (notification: NotificationDto) => void): void {
    this.listeners.push(callback);
  }

  // Отписка от уведомлений
  static offNotificationReceived(callback: (notification: NotificationDto) => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Получить уведомления текущего пользователя
  static async getUserNotifications(): Promise<NotificationDto[]> {
    try {
      const result = await apiClient.get<NotificationDto[]>('/notifications/user');
      console.log('🔔 User notifications API result:', result);
      
      // Если результат не массив, возвращаем пустой массив
      if (!Array.isArray(result)) {
        console.warn('⚠️ API returned non-array for notifications:', result);
        return [];
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error getting user notifications:', error);
      return [];
    }
  }

  // Получить количество непрочитанных уведомлений
  static async getUnreadCount(): Promise<number> {
    return apiClient.get<number>('/notifications/user/unread-count');
  }

  // Получить уведомления с пагинацией
  static async getPagedNotifications(page: number = 1, pageSize: number = 10): Promise<PagedResult<NotificationDto>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    return apiClient.get<PagedResult<NotificationDto>>(`/notifications/user/paged?${params.toString()}`);
  }

  // Отметить уведомление как прочитанное
  static async markAsRead(notificationId: string): Promise<void> {
    return apiClient.put(`/notifications/${notificationId}/mark-read`);
  }

  // Отметить все уведомления как прочитанные
  static async markAllAsRead(): Promise<void> {
    return apiClient.put('/notifications/mark-all-read');
  }

  // Удалить уведомление
  static async deleteNotification(notificationId: string): Promise<void> {
    return apiClient.delete(`/notifications/${notificationId}`);
  }

  // Отправить уведомление (только для администраторов)
  static async sendNotification(data: InAppNotificationRequestDto): Promise<void> {
    return apiClient.post('/notifications/notify-inapp', data);
  }
}
