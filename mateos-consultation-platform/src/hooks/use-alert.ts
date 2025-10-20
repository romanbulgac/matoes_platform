import { useToast } from './use-toast';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Унифицированный hook для показа уведомлений через Toast систему shadcn/ui
 * Совместимый с предыдущим API для минимальных изменений в коде
 */
export function useAlert() {
  const { toast } = useToast();

  const showSuccess = (message: string, title?: string, duration?: number) => {
    toast({
      title: title || 'Succes',
      description: message,
      duration: duration || 5000,
      variant: 'default',
      className: 'border-green-500 bg-green-50 text-green-900',
    });
    return Date.now().toString(); // Возвращаем ID для совместимости
  };

  const showError = (message: string, title?: string, duration?: number) => {
    toast({
      title: title || 'Eroare',
      description: message,
      duration: duration || 5000,
      variant: 'destructive',
    });
    return Date.now().toString();
  };

  const showWarning = (message: string, title?: string, duration?: number) => {
    toast({
      title: title || 'Atenție',
      description: message,
      duration: duration || 5000,
      className: 'border-yellow-500 bg-yellow-50 text-yellow-900',
    });
    return Date.now().toString();
  };

  const showInfo = (message: string, title?: string, duration?: number) => {
    toast({
      title: title || 'Informație',
      description: message,
      duration: duration || 5000,
      className: 'border-blue-500 bg-blue-50 text-blue-900',
    });
    return Date.now().toString();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Aliases для совместимости
    toast,
  };
}