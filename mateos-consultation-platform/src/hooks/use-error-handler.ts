/**
 * React хук для обработки API ошибок с интеграцией Toast системы
 */

import {
    handleAPIError,
    handleAuthError,
    handleNetworkError,
    handleSilentError,
    handleValidationError,
    type APIErrorDetails,
    type ErrorHandlerConfig
} from '@/lib/error-handler';
import { useCallback } from 'react';
import { useAlert } from './use-alert';

/**
 * Хук для удобной обработки различных типов ошибок в React компонентах
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const errorHandler = useErrorHandler();
 * 
 *   const handleSubmit = async () => {
 *     try {
 *       await api.submitForm(formData);
 *     } catch (error) {
 *       errorHandler.handleValidationError(error);
 *     }
 *   };
 * 
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useErrorHandler() {
  const alert = useAlert();

  const handleError = useCallback(
    (error: unknown, config?: ErrorHandlerConfig): APIErrorDetails => {
      return handleAPIError(error, alert, config);
    },
    [alert]
  );

  const handleAuth = useCallback(
    (error: unknown, config?: ErrorHandlerConfig): APIErrorDetails => {
      return handleAuthError(error, alert, config);
    },
    [alert]
  );

  const handleValidation = useCallback(
    (error: unknown, config?: ErrorHandlerConfig): APIErrorDetails => {
      return handleValidationError(error, alert, config);
    },
    [alert]
  );

  const handleNetwork = useCallback(
    (error: unknown, config?: ErrorHandlerConfig): APIErrorDetails => {
      return handleNetworkError(error, alert, config);
    },
    [alert]
  );

  const handleSilent = useCallback(
    (error: unknown, logToConsole?: boolean): APIErrorDetails => {
      // handleSilentError nu folosește logToConsole
      if (logToConsole) {
        console.log('Silent error:', error);
      }
      return handleSilentError(error);
    },
    []
  );

  // Специализированные методы для частых случаев
  const showErrorToast = useCallback(
    (message: string, title?: string, duration?: number) => {
      alert?.showError(message, title, duration);
    },
    [alert]
  );

  const showWarningToast = useCallback(
    (message: string, title?: string, duration?: number) => {
      alert?.showWarning(message, title, duration);
    },
    [alert]
  );

  const showSuccessToast = useCallback(
    (message: string, title?: string, duration?: number) => {
      alert?.showSuccess(message, title, duration);
    },
    [alert]
  );

  const showInfoToast = useCallback(
    (message: string, title?: string, duration?: number) => {
      alert?.showInfo(message, title, duration);
    },
    [alert]
  );

  return {
    // Основные методы обработки ошибок
    handleError,
    handleAuthError: handleAuth,
    handleValidationError: handleValidation,
    handleNetworkError: handleNetwork,
    handleSilentError: handleSilent,
    
    // Прямые методы для показа уведомлений
    showError: showErrorToast,
    showWarning: showWarningToast,
    showSuccess: showSuccessToast,
    showInfo: showInfoToast,
    
    // Доступ к alert для сложных случаев
    alert
  };
}

/**
 * Типизированный результат хука useErrorHandler
 */
export type ErrorHandlerHook = ReturnType<typeof useErrorHandler>;