import * as signalR from '@microsoft/signalr';
import { Notification } from '@/types';
import { config } from '@/config';

class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  async connect(userId: string) {
    if (this.isConnected || this.connectionPromise) {
      return this.connectionPromise;
    }

    console.log('🔄 Starting SignalR connection to:', config.signalR.hubUrl);

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(config.signalR.hubUrl, {
        accessTokenFactory: () => localStorage.getItem('authToken') || '',
        withCredentials: true
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount <= 3) return 5000;
          return 10000;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Обработка событий соединения
    this.connection.onreconnecting(() => {
      console.log('🔄 SignalR reconnecting...');
      this.isConnected = false;
    });

    this.connection.onreconnected(() => {
      console.log('✅ SignalR reconnected');
      this.isConnected = true;
      // Повторно присоединяемся к группе пользователя
      if (userId) {
        this.connection?.invoke('JoinUserGroup', userId).catch(console.error);
      }
    });

    this.connection.onclose(() => {
      console.log('❌ SignalR connection closed');
      this.isConnected = false;
      this.connectionPromise = null;
    });

    this.connectionPromise = this.connection.start()
      .then(async () => {
        this.isConnected = true;
        console.log('✅ SignalR connected successfully');
        
        // Присоединяемся к группе пользователя
        if (userId) {
          await this.connection!.invoke('JoinUserGroup', userId);
          console.log(`✅ Joined user group: ${userId}`);
        }
      })
      .catch(error => {
        console.error('❌ SignalR connection failed:', error);
        this.isConnected = false;
        this.connectionPromise = null;
        throw error;
      });

    return this.connectionPromise;
  }

  async disconnect() {
    if (this.connection && this.isConnected) {
      await this.connection.stop();
      this.isConnected = false;
      this.connection = null;
    }
  }

  onNotificationReceived(callback: (notification: Notification) => void) {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
    }
  }

  offNotificationReceived() {
    if (this.connection) {
      this.connection.off('ReceiveNotification');
    }
  }

  async joinGroup(groupName: string) {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('JoinGroup', groupName);
    }
  }

  async leaveGroup(groupName: string) {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('LeaveGroup', groupName);
    }
  }
}

export const notificationService = new NotificationService();
