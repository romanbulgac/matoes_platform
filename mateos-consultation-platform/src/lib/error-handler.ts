/**
 * Error Handler Library - Centralizare pentru gestionarea erorilor
 */

export interface APIErrorDetails {
  message: string;
  statusCode?: number;
  type?: string;
  details?: any;
}

export interface ErrorHandlerConfig {
  showToast?: boolean;
  duration?: number;
  silent?: boolean;
}

interface AlertSystem {
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
}

/**
 * Extrage detaliile erorii dintr-un error object
 */
function extractErrorDetails(error: unknown): APIErrorDetails {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: error.name,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return {
      message: err.message || err.error || 'A apărut o eroare necunoscută',
      statusCode: err.statusCode || err.status,
      type: err.type || err.name,
      details: err.details || err.data,
    };
  }

  return {
    message: String(error) || 'A apărut o eroare necunoscută',
  };
}

/**
 * Handler generic pentru erori API
 */
export function handleAPIError(
  error: unknown,
  alert: AlertSystem,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const { showToast = true, duration = 5000 } = config;
  const errorDetails = extractErrorDetails(error);

  if (showToast) {
    alert.showError(errorDetails.message, 'Eroare');
  }

  console.error('API Error:', errorDetails);
  return errorDetails;
}

/**
 * Handler specific pentru erori de autentificare
 */
export function handleAuthError(
  error: unknown,
  alert: AlertSystem,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const { showToast = true, duration = 7000 } = config;
  const errorDetails = extractErrorDetails(error);

  // Mesaje custom pentru erori comune de autentificare
  const authMessages: Record<number, string> = {
    401: 'Sesiunea ta a expirat. Te rugăm să te autentifici din nou.',
    403: 'Nu ai permisiunea de a accesa această resursă.',
    422: 'Date invalide. Verifică informațiile introduse.',
  };

  const message = errorDetails.statusCode && authMessages[errorDetails.statusCode]
    ? authMessages[errorDetails.statusCode]
    : errorDetails.message;

  if (showToast) {
    alert.showError(message, 'Eroare Autentificare');
  }

  console.error('Auth Error:', errorDetails);
  return { ...errorDetails, message };
}

/**
 * Handler pentru erori de rețea
 */
export function handleNetworkError(
  error: unknown,
  alert: AlertSystem,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const { showToast = true } = config;
  const errorDetails = extractErrorDetails(error);

  const message = 'Problemă de conexiune. Verifică conexiunea la internet și încearcă din nou.';

  if (showToast) {
    alert.showWarning(message, 'Problemă Conexiune');
  }

  console.error('Network Error:', errorDetails);
  return { ...errorDetails, message };
}

/**
 * Handler pentru erori de validare
 */
export function handleValidationError(
  error: unknown,
  alert: AlertSystem,
  config: ErrorHandlerConfig = {}
): APIErrorDetails {
  const { showToast = true, duration = 5000 } = config;
  const errorDetails = extractErrorDetails(error);

  if (showToast) {
    alert.showWarning(
      errorDetails.message || 'Date invalide. Verifică câmpurile și încearcă din nou.',
      'Validare'
    );
  }

  console.warn('Validation Error:', errorDetails);
  return errorDetails;
}

/**
 * Handler pentru erori silențioase (fără toast, doar logging)
 */
export function handleSilentError(
  error: unknown,
  _alert?: AlertSystem,
  _config?: ErrorHandlerConfig
): APIErrorDetails {
  const errorDetails = extractErrorDetails(error);
  console.error('Silent Error:', errorDetails);
  return errorDetails;
}

