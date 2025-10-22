import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { securitySignalRService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  SecurityNotificationDto, 
  NewDeviceNotificationDto,
  SessionRevokedNotificationDto 
} from '@/types/security';

interface UseSecurityNotificationsOptions {
  onSecurityNotification?: (notification: SecurityNotificationDto) => void;
  onNewDeviceLogin?: (notification: NewDeviceNotificationDto) => void;
  onSessionRevoked?: (notification: SessionRevokedNotificationDto) => void;
  onSuspiciousActivity?: (notification: SecurityNotificationDto) => void;
  autoConnect?: boolean;
  autoInvalidateQueries?: boolean;
}

/**
 * Hook for managing security SignalR notifications
 * Handles connection, subscriptions, and automatic query invalidation
 */
export function useSecurityNotifications(options: UseSecurityNotificationsOptions = {}) {
  const {
    onSecurityNotification,
    onNewDeviceLogin,
    onSessionRevoked,
    onSuspiciousActivity,
    autoConnect = true,
    autoInvalidateQueries = true,
  } = options;

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Invalidate security-related queries
  const invalidateSecurityQueries = useCallback(() => {
    if (!autoInvalidateQueries) return;

    queryClient.invalidateQueries({ queryKey: ['security-stats'] });
    queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['security-activity'] });
  }, [queryClient, autoInvalidateQueries]);

  // Handle security notification with auto-invalidation
  const handleSecurityNotification = useCallback((notification: SecurityNotificationDto) => {
    onSecurityNotification?.(notification);
    invalidateSecurityQueries();
  }, [onSecurityNotification, invalidateSecurityQueries]);

  // Handle new device login with auto-invalidation
  const handleNewDeviceLogin = useCallback((notification: NewDeviceNotificationDto) => {
    onNewDeviceLogin?.(notification);
    invalidateSecurityQueries();
  }, [onNewDeviceLogin, invalidateSecurityQueries]);

  // Handle session revoked with auto-invalidation
  const handleSessionRevoked = useCallback((notification: SessionRevokedNotificationDto) => {
    onSessionRevoked?.(notification);
    invalidateSecurityQueries();
  }, [onSessionRevoked, invalidateSecurityQueries]);

  // Handle suspicious activity with auto-invalidation
  const handleSuspiciousActivity = useCallback((notification: SecurityNotificationDto) => {
    onSuspiciousActivity?.(notification);
    invalidateSecurityQueries();
  }, [onSuspiciousActivity, invalidateSecurityQueries]);

  // Setup SignalR connection and subscriptions
  useEffect(() => {
    if (!user?.id || !autoConnect) return;

    let isMounted = true;

    const setupConnection = async () => {
      try {
        await securitySignalRService.connect(user.id);

        if (!isMounted) return;

        // Subscribe to events
        if (onSecurityNotification) {
          securitySignalRService.onSecurityNotification(handleSecurityNotification);
        }
        if (onNewDeviceLogin) {
          securitySignalRService.onNewDeviceLogin(handleNewDeviceLogin);
        }
        if (onSessionRevoked) {
          securitySignalRService.onSessionRevoked(handleSessionRevoked);
        }
        if (onSuspiciousActivity) {
          securitySignalRService.onSuspiciousActivity(handleSuspiciousActivity);
        }

        console.log('✅ useSecurityNotifications initialized');
      } catch (error) {
        console.error('❌ useSecurityNotifications setup failed:', error);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      securitySignalRService.offAllSecurityEvents();
    };
  }, [
    user?.id,
    autoConnect,
    onSecurityNotification,
    onNewDeviceLogin,
    onSessionRevoked,
    onSuspiciousActivity,
    handleSecurityNotification,
    handleNewDeviceLogin,
    handleSessionRevoked,
    handleSuspiciousActivity,
  ]);

  // Return utility functions
  return {
    isConnected: securitySignalRService.connected,
    connectionState: securitySignalRService.getConnectionState(),
    connect: () => user?.id ? securitySignalRService.connect(user.id) : Promise.reject('No user'),
    disconnect: () => securitySignalRService.disconnect(),
    invalidateQueries: invalidateSecurityQueries,
  };
}
