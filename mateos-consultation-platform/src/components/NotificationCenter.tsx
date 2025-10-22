import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAlert } from '@/hooks/use-alert';
import { useFadeIn, usePulseAnimation, useStaggerAnimation } from '@/hooks/useGsap';
import { NotificationService } from '@/services/notificationService';
import { NotificationDto } from '@/types/api';
import { AlertCircle, AlertTriangle, Bell, BellRing, Check, CheckCheck, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`relative p-4 mb-3 border rounded-lg transition-all duration-200 hover:shadow-md ${getTypeClass(notification.type)} ${
      !notification.isRead ? 'shadow-sm ring-1 ring-primary-200' : 'opacity-75'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getTypeIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
              <p className="text-sm mb-2 leading-relaxed">{notification.message}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString('ru-RU')}
                </span>
                {!notification.isRead && (
                  <Badge variant="secondary" className="text-xs">
                    Новое
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex space-x-1 ml-4">
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-8 w-8 p-0 hover:bg-white/50"
                  title="Отметить как прочитанное"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(notification.id)}
                className="h-8 w-8 p-0 hover:bg-white/50 hover:text-red-600"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Alert hook для отображения ошибок
  const { showError } = useAlert();
  
  // Анимации
  const contentRef = useFadeIn<HTMLDivElement>([isOpen], { y: 10, duration: 0.3 });
  const notificationsRef = useStaggerAnimation<HTMLDivElement>([notifications], { stagger: 0.05 });

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Eroare la încărcarea notificărilor:', error);
      showError(
        'Nu am putut încărca notificările. Vă rugăm să încercați din nou.',
        'Eroare de încărcare'
      );
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    // Abonare la notificări noi
    const handleNewNotification = (notification: NotificationDto) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    NotificationService.onNotificationReceived(handleNewNotification);

    // Încărcarea numărului de notificări necitite
    NotificationService.getUnreadCount()
      .then(setUnreadCount)
      .catch(console.error);

    return () => {
      NotificationService.offNotificationReceived(handleNewNotification);
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Eroare la marcarea ca citită:', error);
      showError(
        'Nu am putut marca notificarea ca citită.',
        'Eroare de actualizare'
      );
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Eroare la ștergerea notificării:', error);
      showError(
        'Nu am putut șterge notificarea.',
        'Eroare de ștergere'
      );
    }
  };

    const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Eroare la marcarea tuturor ca citite:', error);
      showError(
        'Nu am putut marca toate notificările ca citite.',
        'Eroare de actualizare'
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]" ref={contentRef}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <span>Уведомления</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Отметить все</span>
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Загружаем уведомления...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Нет уведомлений</p>
              <p className="text-sm text-gray-400 mt-1">Все уведомления будут отображаться здесь</p>
            </div>
          ) : (
            <div ref={notificationsRef}>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componenta iconului de notificări pentru Header
interface NotificationBellProps {
  onClick: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Анимация pulse для новых уведомлений
  const bellRef = usePulseAnimation<HTMLButtonElement>(unreadCount > 0, { scale: 1.1 });

  useEffect(() => {
    // Abonare la notificări noi
    const handleNewNotification = () => {
      setUnreadCount(prev => prev + 1);
    };

    NotificationService.onNotificationReceived(handleNewNotification);

    // Încărcarea numărului de notificări necitite
    NotificationService.getUnreadCount()
      .then(setUnreadCount)
      .catch(console.error);

    return () => {
      NotificationService.offNotificationReceived(handleNewNotification);
    };
  }, []);

  return (
    <Button
      ref={bellRef}
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative hover:bg-gray-100 transition-colors duration-200"
      aria-label="Уведомления"
    >
      {unreadCount > 0 ? (
        <BellRing className="w-5 h-5 text-orange-500 animate-pulse" />
      ) : (
        <Bell className="w-5 h-5 text-gray-600" />
      )}
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px] leading-none rounded-full animate-pulse"
          aria-label={`${unreadCount} непрочитанных уведомлений`}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
