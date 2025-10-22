import { FC, useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { securitySignalRService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ShieldAlert, 
  Smartphone, 
  LogOut, 
  Key,
  AlertTriangle,
  MapPin,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { SecurityNotificationDto, NewDeviceNotificationDto, SessionRevokedNotificationDto } from '@/types/security';

interface SecurityNotificationsProps {
  className?: string;
}

/**
 * Component for displaying real-time security notifications
 * Listens to SignalR security events and shows toast notifications
 */
export const SecurityNotifications: FC<SecurityNotificationsProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<SecurityNotificationDto[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Get severity-based styling
  const getSeverityConfig = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical':
        return {
          icon: ShieldAlert,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeVariant: 'secondary' as const,
        };
      default:
        return {
          icon: Shield,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badgeVariant: 'outline' as const,
        };
    }
  };

  // Get icon for security alert type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newDevice':
      case 'newLogin':
        return Smartphone;
      case 'sessionRevoked':
        return LogOut;
      case 'passwordChanged':
        return Key;
      case 'suspiciousActivity':
      case 'multipleFailedLogins':
        return ShieldAlert;
      default:
        return Shield;
    }
  };

  // Handle generic security notification
  const handleSecurityNotification = useCallback((notification: SecurityNotificationDto) => {
    console.log('🔔 Security notification:', notification);

    // Show toast notification
    toast({
      title: notification.title,
      description: (
        <div className="space-y-2">
          <p>{notification.message}</p>
          {notification.deviceName && (
            <p className="text-xs text-muted-foreground">
              Dispozitiv: {notification.deviceName}
            </p>
          )}
          {notification.location && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {notification.location}
            </p>
          )}
          {notification.ipAddress && (
            <p className="text-xs text-muted-foreground font-mono">
              IP: {notification.ipAddress}
            </p>
          )}
        </div>
      ),
      variant: notification.severity === 'critical' ? 'destructive' : 'default',
      duration: notification.severity === 'critical' ? 10000 : 5000,
    });

    // Add to local state
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10

    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['security-stats'] });
    queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['security-activity'] });
  }, [toast, queryClient]);

  // Handle new device login
  const handleNewDeviceLogin = useCallback((notification: NewDeviceNotificationDto) => {
    console.log('🆕 New device login:', notification);

    toast({
      title: '🆕 Autentificare Nouă Detectată',
      description: (
        <div className="space-y-2">
          <p>Un dispozitiv nou s-a conectat la contul tău</p>
          <p className="text-sm">
            <strong>Dispozitiv:</strong> {notification.deviceName}
          </p>
          <p className="text-sm">
            <strong>Tip:</strong> {notification.deviceType}
          </p>
          {notification.location && (
            <p className="text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {notification.location}
            </p>
          )}
          {notification.ipAddress && (
            <p className="text-xs font-mono">IP: {notification.ipAddress}</p>
          )}
        </div>
      ),
      variant: 'default',
      duration: 8000,
    });

    // Invalidate sessions
    queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['security-stats'] });
  }, [toast, queryClient]);

  // Handle session revoked
  const handleSessionRevoked = useCallback((notification: SessionRevokedNotificationDto) => {
    console.log('🚫 Session revoked:', notification);

    toast({
      title: '🚫 Sesiune Revocată',
      description: (
        <div className="space-y-2">
          <p>O sesiune a fost revocată de pe dispozitivul tău</p>
          <p className="text-sm">
            <strong>Dispozitiv:</strong> {notification.deviceName}
          </p>
          {notification.reason && (
            <p className="text-sm text-muted-foreground">
              Motiv: {notification.reason}
            </p>
          )}
          {notification.revokedBy && (
            <p className="text-xs text-muted-foreground">
              Revocat de: {notification.revokedBy}
            </p>
          )}
        </div>
      ),
      variant: 'default',
      duration: 6000,
    });

    // Invalidate sessions
    queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['security-stats'] });
  }, [toast, queryClient]);

  // Handle suspicious activity
  const handleSuspiciousActivity = useCallback((notification: SecurityNotificationDto) => {
    console.log('⚠️ Suspicious activity:', notification);

    toast({
      title: '⚠️ Activitate Suspectă',
      description: (
        <div className="space-y-2">
          <p className="font-semibold">{notification.message}</p>
          {notification.location && (
            <p className="text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {notification.location}
            </p>
          )}
          {notification.actionUrl && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = notification.actionUrl!}
            >
              Vezi Detalii
            </Button>
          )}
        </div>
      ),
      variant: 'destructive',
      duration: 15000, // Longer duration for suspicious activity
    });

    queryClient.invalidateQueries({ queryKey: ['security-activity'] });
    queryClient.invalidateQueries({ queryKey: ['security-stats'] });
  }, [toast, queryClient]);

  // Setup SignalR connection and listeners
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const setupConnection = async () => {
      try {
        await securitySignalRService.connect(user.id);
        
        if (!isMounted) return;

        setIsConnected(true);

        // Subscribe to all security events
        securitySignalRService.onSecurityNotification(handleSecurityNotification);
        securitySignalRService.onNewDeviceLogin(handleNewDeviceLogin);
        securitySignalRService.onSessionRevoked(handleSessionRevoked);
        securitySignalRService.onSuspiciousActivity(handleSuspiciousActivity);

        console.log('✅ Security notifications initialized');
      } catch (error) {
        console.error('❌ Failed to setup security notifications:', error);
        setIsConnected(false);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      securitySignalRService.offAllSecurityEvents();
    };
  }, [user?.id, handleSecurityNotification, handleNewDeviceLogin, handleSessionRevoked, handleSuspiciousActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        securitySignalRService.disconnect();
      }
    };
  }, [isConnected]);

  // Render recent notifications (optional UI component)
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 max-w-sm space-y-2', className)}>
      {notifications.slice(0, 3).map((notification) => {
        const config = getSeverityConfig(notification.severity);
        const TypeIcon = getTypeIcon(notification.type);

        return (
          <Card 
            key={notification.id}
            className={cn(
              'animate-in slide-in-from-right shadow-lg',
              config.bgColor,
              config.borderColor
            )}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-full bg-white', config.iconColor)}>
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setNotifications(prev => 
                          prev.filter(n => n.id !== notification.id)
                        );
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={config.badgeVariant} className="text-xs">
                      {notification.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.timestamp), 'HH:mm', { locale: ro })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
