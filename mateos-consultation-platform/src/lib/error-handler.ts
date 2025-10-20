/**
 * Утилиты для обработки API ошибок с интеграцией Toast системы
 * 
 * Этот модуль предоставляет универсальные функции для автоматического
 * отображения toast уведомлений при ошибках API запросов.
 */

// Совместимый интерфейс для alert/toast
export interface AlertHandler {
  showError: (message: string, title?: string, duration?: number) => void | string;
  showSuccess: (message: string, title?: string, duration?: number) => void | string;
  showWarning: (message: string, title?: string, duration?: number) => void | string;
  showInfo: (message: string, title?: string, duration?: number) => void | string;
}

// Типы ошибок для более точной обработки
export interface APIErrorDetails {
  message: string;
  status?: number;
  code?: string;
  field?: string; // Для ошибок валидации
}

// Интерфейс для расширенной ошибки
interface ExtendedError extends Error {
  status?: number;
  code?: string;
  field?: string;
}

// Интерфейс для объектов ошибок
interface ErrorObject {
  message?: string;
  status?: number;
  code?: string;
  field?: string;
}

// Конфигурация обработчика ошибок
export interface ErrorHandlerConfig {
  showToast?: boolean;           // Показывать ли toast уведомление
  showConsoleError?: boolean;    // Логировать ли в консоль
  translateMessage?: boolean;    // Переводить ли сообщение
  duration?: number;             // Длительность показа toast
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

// Дефолтная конфигурация
const DEFAULT_CONFIG: Required<ErrorHandlerConfig> = {
  showToast: true,
  showConsoleError: true,
  translateMessage: true,
  duration: 5000,
  position: 'top-center'
};

/**
 * Переводит техническое сообщение об ошибке на понятный пользователю язык
 */
function translateErrorMessage(error: APIErrorDetails): string {
  const { message, status, code } = error;

  // Маппинг часто встречающихся ошибок
  const errorMessages: Record<string, string> = {
    'NETWORK_ERROR': 'Проблемы с интернет соединением. Пожалуйста, проверьте подключение к сети.',
    'UNAUTHORIZED': 'Сессия истекла. Пожалуйста, войдите в систему снова.',
    'FORBIDDEN': 'У вас нет прав доступа к этому ресурсу.',
    'NOT_FOUND': 'Запрашиваемый ресурс не найден.',
    'VALIDATION_ERROR': 'Ошибка валидации данных. Проверьте правильность введенной информации.',
    'INTERNAL_SERVER_ERROR': 'Внутренняя ошибка сервера. Попробуйте позже.',
    'BAD_REQUEST': 'Некорректный запрос. Проверьте введенные данные.',
    'CONFLICT': 'Конфликт данных. Возможно, такая запись уже существует.',
    'PAYMENT_REQUIRED': 'Необходима оплата для доступа к этому функционалу.',
    'TOO_MANY_REQUESTS': 'Слишком много запросов. Попробуйте позже.',
    'SERVICE_UNAVAILABLE': 'Сервис временно недоступен. Попробуйте позже.'
  };

  // Поиск по коду ошибки
  if (code && errorMessages[code]) {
    return errorMessages[code];
  }

  // Поиск по HTTP статусу
  const statusMessages: Record<number, string> = {
    400: errorMessages['BAD_REQUEST'],
    401: errorMessages['UNAUTHORIZED'],
    403: errorMessages['FORBIDDEN'],
    404: errorMessages['NOT_FOUND'],
    409: errorMessages['CONFLICT'],
    402: errorMessages['PAYMENT_REQUIRED'],
    422: errorMessages['VALIDATION_ERROR'],
    429: errorMessages['TOO_MANY_REQUESTS'],
    500: errorMessages['INTERNAL_SERVER_ERROR'],
    502: 'Сервер временно недоступен. Попробуйте позже.',
    503: errorMessages['SERVICE_UNAVAILABLE'],
    504: 'Превышено время ожидания ответа сервера.'
  };

  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  // Если не найдено соответствие, возвращаем оригинальное сообщение или дефолтное
  return message || 'Произошла неизвестная ошибка. Попробуйте повторить действие.';
}

/**
 * Форматирует детали ошибки для отображения пользователю
 */
function formatErrorDetails(error: APIErrorDetails, showTechnicalDetails: boolean = false): string {
  const userMessage = translateErrorMessage(error);
  
  if (!showTechnicalDetails) {
    return userMessage;
  }

  const technicalInfo: string[] = [];
  
  if (error.status) {
    technicalInfo.push(`Код: ${error.status}`);
  }
  
  if (error.code && error.code !== error.status?.toString()) {
    technicalInfo.push(`Тип: ${error.code}`);
  }

  return technicalInfo.length > 0 
    ? `${userMessage}\n\n${technicalInfo.join(', ')}`
    : userMessage;
}

/**
 * Основная функция обработки API ошибок
 */
export function handleAPIError(
  error: unknown,
  alertHandler?: AlertHandler,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Нормализуем ошибку к стандартному формату
  let errorDetails: APIErrorDetails;
  
  if (error instanceof Error) {
    // Если это APIError из baseService.ts
    if ('status' in error && 'code' in error) {
      const extendedError = error as ExtendedError;
      errorDetails = {
        message: error.message,
        status: extendedError.status,
        code: extendedError.code
      };
    } else {
      // Обычная JavaScript ошибка
      errorDetails = {
        message: error.message,
        code: 'JAVASCRIPT_ERROR'
      };
    }
  } else if (typeof error === 'object' && error !== null) {
    // Объект с деталями ошибки
    const errorObj = error as ErrorObject;
    errorDetails = {
      message: errorObj.message || 'Unknown error',
      status: errorObj.status,
      code: errorObj.code,
      field: errorObj.field
    };
  } else if (typeof error === 'string') {
    // Строковое сообщение об ошибке
    errorDetails = {
      message: error,
      code: 'STRING_ERROR'
    };
  } else {
    // Неизвестный тип ошибки
    errorDetails = {
      message: 'Произошла неожиданная ошибка',
      code: 'UNKNOWN_ERROR'
    };
  }

  // Логируем в консоль если необходимо
  if (finalConfig.showConsoleError) {
    console.error('API Error:', errorDetails);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
  }

  // Показываем toast уведомление если необходимо и доступен handler
  if (finalConfig.showToast && alertHandler) {
    const displayMessage = finalConfig.translateMessage 
      ? formatErrorDetails(errorDetails, false)
      : errorDetails.message;

    const title = getErrorTitle(errorDetails);

    alertHandler.showError(displayMessage, title, finalConfig.duration);
  }

  return errorDetails;
}

/**
 * Получает заголовок для ошибки в зависимости от типа
 */
function getErrorTitle(error: APIErrorDetails): string {
  const { status, code } = error;

  if (code === 'NETWORK_ERROR') return 'Ошибка сети';
  if (code === 'VALIDATION_ERROR') return 'Ошибка валидации';
  if (status === 401) return 'Ошибка авторизации';
  if (status === 403) return 'Нет доступа';
  if (status === 404) return 'Не найдено';
  if (status === 500) return 'Ошибка сервера';
  
  return 'Ошибка';
}

/**
 * Специализированная функция для обработки ошибок аутентификации
 */
export function handleAuthError(
  error: unknown,
  alertHandler?: AlertHandler,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    duration: 0, // Ошибки аутентификации должны оставаться до закрытия пользователем
    ...config
  };
  
  return handleAPIError(error, alertHandler, finalConfig);
}

/**
 * Специализированная функция для обработки ошибок валидации
 */
export function handleValidationError(
  error: unknown,
  alertHandler?: AlertHandler,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    duration: 7000, // Ошибки валидации показываем дольше
    ...config
  };
  
  return handleAPIError(error, alertHandler, finalConfig);
}

/**
 * Специализированная функция для обработки сетевых ошибок
 */
export function handleNetworkError(
  error: unknown,
  alertHandler?: AlertHandler,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    duration: 0, // Сетевые ошибки критичны, показываем до закрытия
    ...config
  };
  
  return handleAPIError(error, alertHandler, finalConfig);
}

/**
 * Специализированная функция для тихой обработки ошибок (без toast)
 */
export function handleSilentError(
  error: unknown,
  logToConsole: boolean = true
): APIErrorDetails {
  return handleAPIError(error, undefined, {
    showToast: false,
    showConsoleError: logToConsole
  });
}

/**
 * Хук для удобного использования обработчика ошибок в React компонентах
 * Этот импорт должен использоваться в компонентах
 */
export const createErrorHandler = (alertHandler: AlertHandler) => ({
  handleError: (error: unknown, config?: ErrorHandlerConfig) => 
    handleAPIError(error, alertHandler, config),
  handleAuthError: (error: unknown, config?: ErrorHandlerConfig) => 
    handleAuthError(error, alertHandler, config),
  handleValidationError: (error: unknown, config?: ErrorHandlerConfig) => 
    handleValidationError(error, alertHandler, config),
  handleNetworkError: (error: unknown, config?: ErrorHandlerConfig) => 
    handleNetworkError(error, alertHandler, config),
  handleSilentError: (error: unknown, logToConsole?: boolean) => 
    handleSilentError(error, logToConsole)
});