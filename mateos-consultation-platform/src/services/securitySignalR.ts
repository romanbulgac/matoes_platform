import * as signalR from '@microsoft/signalr';
import { config } from '@/config';
import type { 
  SecurityNotificationDto, 
  NewDeviceNotificationDto,
  SessionRevokedNotificationDto 
} from '@/types/security';

/**
 * Security-focused SignalR service for real-time security notifications
 * Extends existing notification infrastructure with security-specific events
 */
class SecuritySignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize SignalR connection for security notifications
   */
  async connect(userId: string): Promise<void> {
    if (this.isConnected || this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('🔒 Security SignalR already connected');
      return;
    }

    console.log('🔒 Starting Security SignalR connection...');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(config.signalR.hubUrl, {
        accessTokenFactory: () => localStorage.getItem('authToken') || '',
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          this.reconnectAttempts = retryContext.previousRetryCount;
          
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            console.error('🔒 Max reconnect attempts reached');
            return null; // Stop reconnecting
          }
          
          // Exponential backoff: 0s, 2s, 5s, 10s, 30s
          const delays = [0, 2000, 5000, 10000, 30000];
          return delays[Math.min(retryContext.previousRetryCount, delays.length - 1)];
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers(userId);

    try {
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('✅ Security SignalR connected');

      // Join user's security group
      await this.joinSecurityGroup(userId);
    } catch (error) {
      console.error('❌ Security SignalR connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Setup SignalR event handlers
   */
  private setupEventHandlers(userId: string): void {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      console.log('🔄 Security SignalR reconnecting...');
      this.isConnected = false;
    });

    this.connection.onreconnected(async () => {
      console.log('✅ Security SignalR reconnected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Rejoin security group after reconnection
      await this.joinSecurityGroup(userId);
    });

    this.connection.onclose((error) => {
      console.log('❌ Security SignalR connection closed', error);
      this.isConnected = false;
    });
  }

  /**
   * Join user's security notification group
   */
  private async joinSecurityGroup(userId: string): Promise<void> {
    if (!this.connection || !this.isConnected) return;

    try {
      await this.connection.invoke('JoinSecurityGroup', userId);
      console.log(`✅ Joined security group for user: ${userId}`);
    } catch (error) {
      console.error('❌ Failed to join security group:', error);
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        this.connection = null;
        console.log('🔒 Security SignalR disconnected');
      } catch (error) {
        console.error('❌ Error disconnecting Security SignalR:', error);
      }
    }
  }

  /**
   * Subscribe to generic security notifications
   */
  onSecurityNotification(callback: (notification: SecurityNotificationDto) => void): void {
    if (!this.connection) {
      console.warn('🔒 Cannot subscribe: SignalR not connected');
      return;
    }

    this.connection.on('SecurityNotification', (notification: SecurityNotificationDto) => {
      console.log('🔔 Security notification received:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to new device login notifications
   */
  onNewDeviceLogin(callback: (notification: NewDeviceNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('NewDeviceLogin', (notification: NewDeviceNotificationDto) => {
      console.log('🆕 New device login:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to session revoked notifications
   */
  onSessionRevoked(callback: (notification: SessionRevokedNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('SessionRevoked', (notification: SessionRevokedNotificationDto) => {
      console.log('🚫 Session revoked:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to suspicious activity alerts
   */
  onSuspiciousActivity(callback: (notification: SecurityNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('SuspiciousActivity', (notification: SecurityNotificationDto) => {
      console.log('⚠️ Suspicious activity detected:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to password change notifications
   */
  onPasswordChanged(callback: (notification: SecurityNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('PasswordChanged', (notification: SecurityNotificationDto) => {
      console.log('🔑 Password changed:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to device trusted notifications
   */
  onDeviceTrusted(callback: (notification: SecurityNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('DeviceTrusted', (notification: SecurityNotificationDto) => {
      console.log('✅ Device trusted:', notification);
      callback(notification);
    });
  }

  /**
   * Subscribe to multiple failed login attempts
   */
  onMultipleFailedLogins(callback: (notification: SecurityNotificationDto) => void): void {
    if (!this.connection) return;

    this.connection.on('MultipleFailedLogins', (notification: SecurityNotificationDto) => {
      console.log('🚨 Multiple failed logins:', notification);
      callback(notification);
    });
  }

  /**
   * Unsubscribe from all security events
   */
  offAllSecurityEvents(): void {
    if (!this.connection) return;

    const events = [
      'SecurityNotification',
      'NewDeviceLogin',
      'SessionRevoked',
      'SuspiciousActivity',
      'PasswordChanged',
      'DeviceTrusted',
      'MultipleFailedLogins',
    ];

    events.forEach(event => {
      this.connection?.off(event);
    });

    console.log('🔒 Unsubscribed from all security events');
  }

  /**
   * Get connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const securitySignalRService = new SecuritySignalRService();
