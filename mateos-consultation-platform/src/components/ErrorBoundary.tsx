import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Отправка в monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
    
    this.setState({ error, errorInfo });
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Integration with Sentry, LogRocket, etc.
    console.error('Error logged to service:', { error, errorInfo });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-md w-full p-6">
            <Alert variant="destructive" className="bg-white shadow-lg">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-xl font-semibold">
                Что-то пошло не так
              </AlertTitle>
              <AlertDescription className="mt-2 mb-4">
                Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
              </AlertDescription>
              <div className="mt-4">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Попробовать снова
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Детали ошибки (только для разработки)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
