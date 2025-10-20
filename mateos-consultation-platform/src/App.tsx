import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleBasedDashboard } from '@/components/RoleBasedDashboard';
import { SecurityNotifications } from '@/components/security';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PageTitleProvider } from '@/contexts/PageTitleContext';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { StudentRegistrationPage } from '@/pages/auth/StudentRegistrationPage';
import { AcceptInvitationPage } from '@/pages/AcceptInvitationPage';
import { ConsultationsPage } from '@/pages/ConsultationsPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { PricingPage } from '@/pages/PricingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { HomePage } from '@/pages/public/HomePage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { SubscriptionSuccessPage } from '@/pages/SubscriptionSuccessPage';
import { TeacherApplicationPage } from '@/pages/teacher/TeacherApplicationPage';
import { TestToastPage } from '@/pages/TestToastPage';
import { ServiceManager } from '@/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Rutele principale ale aplicației
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Pagini publice */}
      <Route path="/" element={<HomePage />} />
      <Route path="/preturi" element={<PricingPage />} />
      <Route path="/aplicare-profesor" element={<TeacherApplicationPage />} />
      <Route path="/inregistrare-student" element={<StudentRegistrationPage />} />
      <Route path="/child-registration" element={<AcceptInvitationPage />} />
      
      {/* Test page - временная для разработки */}
      <Route path="/test-toast" element={<TestToastPage />} />
      
      {/* Pagini de autorizare */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/inregistrare" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />
      
      {/* Pagini protejate */}
      <Route path="/dashboard" element={
        <ProtectedRoute
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
                <p className="text-gray-600 mb-8">Pentru a accesa dashboard-ul, trebuie să vă autentificați.</p>
                <Navigate to="/login" replace />
              </div>
            </div>
          }
        >
          <PageTitleProvider>
            <Layout>
              <RoleBasedDashboard />
            </Layout>
          </PageTitleProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/consultations" element={
        <ProtectedRoute
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
                <p className="text-gray-600 mb-8">Pentru a accesa consultările, trebuie să vă autentificați.</p>
                <Navigate to="/login" replace />
              </div>
            </div>
          }
        >
          <PageTitleProvider>
            <Layout>
              <ConsultationsPage />
            </Layout>
          </PageTitleProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
                <p className="text-gray-600 mb-8">Pentru a accesa profilul, trebuie să vă autentificați.</p>
                <Navigate to="/login" replace />
              </div>
            </div>
          }
        >
          <PageTitleProvider>
            <Layout>
              <ProfilePage />
            </Layout>
          </PageTitleProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/materials" element={
        <ProtectedRoute
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
                <p className="text-gray-600 mb-8">Pentru a accesa materialele, trebuie să vă autentificați.</p>
                <Navigate to="/login" replace />
              </div>
            </div>
          }
        >
          <PageTitleProvider>
            <Layout>
              <MaterialsPage />
            </Layout>
          </PageTitleProvider>
        </ProtectedRoute>
      } />
      
      {/* Subscriptions Routes */}
      <Route path="/subscriptions" element={
        <ProtectedRoute
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesul necesită autentificare</h2>
                <p className="text-gray-600 mb-8">Pentru a accesa subscripțiile, trebuie să vă autentificați.</p>
                <Navigate to="/login" replace />
              </div>
            </div>
          }
        >
          <SubscriptionsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/subscriptions/success" element={
        <ProtectedRoute
          fallback={<Navigate to="/login" replace />}
        >
          <SubscriptionSuccessPage />
        </ProtectedRoute>
      } />
      
      {/* Pagina 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-4">Pagina nu a fost găsită</p>
            <a href="/" className="btn-primary">
              Înapoi la pagina principală
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  const bgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Инициализация сервисов при запуске приложения
    ServiceManager.initialize();

    // Очистка при размонтировании
    return () => {
      ServiceManager.cleanup();
    };
  }, []);

  // TODO: Implement background animation later
  // useEffect(() => {
  //   if (!bgRef.current) return;
  //   const tl = animateGradientBackground(bgRef.current, { duration: 25 });
  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div
              ref={bgRef}
              className="min-h-screen bg-gray-50"
              style={{
                backgroundImage:
                  'linear-gradient(120deg, rgba(3,135,148,0.08), rgba(34,197,94,0.06), rgba(17,94,89,0.08))',
                backgroundSize: '200% 200%'
              }}
            >
              <AppRoutes />
              <SecurityNotifications />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
