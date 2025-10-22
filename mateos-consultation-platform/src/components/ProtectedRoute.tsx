import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
}

/**
 * Компонент для защиты маршрутов от неавторизованных пользователей
 * Не делает принудительных редиректов - только показывает fallback
 * Поддерживает проверку роли пользователя
 */
export function ProtectedRoute({ children, fallback, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Просто логируем состояние аутентификации без принудительных действий
    if (!isLoading) {
      console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Показываем fallback для неавторизованных пользователей
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
            <p className="text-gray-600 mb-8">Pentru a accesa această pagină, trebuie să vă autentificați.</p>
            <a 
              href="/login" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Autentificare
            </a>
          </div>
        </div>
      )
    );
  }

  // Verificăm dacă utilizatorul are rolul necesar
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acces refuzat</h2>
          <p className="text-gray-600 mb-8">Nu aveți permisiunea de a accesa această pagină.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Înapoi la pagina principală
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}