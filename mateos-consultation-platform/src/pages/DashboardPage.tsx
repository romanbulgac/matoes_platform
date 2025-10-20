import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing, SimpleBarChart } from '@/components/ui/chart';
import { NoConsultationsEmpty } from '@/components/ui/empty-state';
import { StatsCardSkeleton } from '@/components/ui/skeleton';
import { MetricCard, StatsCard } from '@/components/ui/stats-card';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { ConsultationService } from '@/services/consultationService';
import { NotificationService } from '@/services/notificationService';
import { SubscriptionService } from '@/services/subscriptionService';
import { UserSubscriptionStatusDto } from '@/types';
import { ConsultationDto, ConsultationStatus, NotificationDto } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import {
    ArrowRight,
    Award,
    Bell,
    BookOpenCheck,
    CalendarDays,
    Clock,
    Target,
    TrendingUp,
    UsersRound
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const handleError = useErrorHandler();
  const [consultations, setConsultations] = useState<ConsultationDto[]>([]);
  const [subscription, setSubscription] = useState<UserSubscriptionStatusDto | null>(null);
  const [_notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDashboardData = useCallback(async () => {
    // Проверяем, что пользователь аутентифицирован
    if (!user) {
      console.warn('⚠️ User is not available:', { user });
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setHasError(false);
      
      console.log('🚀 Loading dashboard data for user:', user.email);
      
      // Загружаем предстоящие консультации (для дашборда)
      const consultationsData = await ConsultationService.getUpcoming();
      console.log('📋 Upcoming consultations data from API:', consultationsData);
      setConsultations(Array.isArray(consultationsData) ? consultationsData.slice(0, 5) : []); // Показываем только последние 5

      // Загружаем активную подписку
      const activeSubscription = await SubscriptionService.getSubscriptionStatus();
      setSubscription(activeSubscription);

      // Загружаем уведомления
      const notificationsData = await NotificationService.getUserNotifications();
      console.log('🔔 Notifications data from API:', notificationsData);
      setNotifications(Array.isArray(notificationsData) ? notificationsData.slice(0, 5) : []); // Показываем только последние 5
      
    } catch (error: unknown) {
      console.error('Ошибка загрузки данных дашборда:', error);
      setHasError(true);
      
      // Не вызываем handleError.handleError если это проблема с сетью/CORS
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('CORS'))) {
        console.warn('⚠️ Проблема с сетью или CORS, не перезагружаем страницу');
      } else {
        handleError.handleError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Dashboard effect triggered:', { isAuthenticated, useremail: user.email });
      loadDashboardData();
    } else {
      console.log('⏸️ Dashboard effect skipped:', { isAuthenticated, hasUser: !!user });
    }
  }, [isAuthenticated, user, loadDashboardData]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Статистика на основе реальных данных
  const stats = [
    {
      title: 'Total Consultații',
      value: consultations.length,
      description: 'Consultații totale',
      icon: BookOpenCheck,
      trend: {
        value: 12,
        label: 'față de luna trecută',
        isPositive: true
      }
    },
    {
      title: 'Programate',
      value: consultations.filter(c => c.status === ConsultationStatus.Scheduled).length,
      description: 'Consultații programate',
      icon: CalendarDays,
      trend: {
        value: 8,
        label: 'în această săptămână',
        isPositive: true
      }
    },
    {
      title: 'Profesori Activi',
      value: new Set(consultations.map(c => c.teacherId)).size,
      description: 'Profesori disponibili',
      icon: UsersRound,
      trend: {
        value: 5,
        label: 'noi profesori',
        isPositive: true
      }
    },
    {
      title: 'Finalizate',
      value: consultations.filter(c => c.status === ConsultationStatus.Completed).length,
      description: 'Consultații finalizate',
      icon: Award,
      trend: {
        value: 15,
        label: 'succes rate',
        isPositive: true
      }
    }
  ];

  // Mock data pentru grafice
  const consultationsChartData = [
    { name: 'Lun', value: 12 },
    { name: 'Mar', value: 19 },
    { name: 'Mie', value: 8 },
    { name: 'Joi', value: 25 },
    { name: 'Vin', value: 18 },
    { name: 'Sâm', value: 22 },
    { name: 'Dum', value: 15 },
  ];

  const _performanceData = [
    { name: 'Ian', value: 85 },
    { name: 'Feb', value: 92 },
    { name: 'Mar', value: 78 },
    { name: 'Apr', value: 95 },
    { name: 'Mai', value: 89 },
  ];

  const statusColors = {
    [ConsultationStatus.Scheduled]: 'bg-blue-100 text-blue-800',
    [ConsultationStatus.InProgress]: 'bg-green-100 text-green-800',
    [ConsultationStatus.Completed]: 'bg-gray-100 text-gray-800',
    [ConsultationStatus.Cancelled]: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    [ConsultationStatus.Scheduled]: 'Planificată',
    [ConsultationStatus.InProgress]: 'În desfășurare',
    [ConsultationStatus.Completed]: 'Finalizată',
    [ConsultationStatus.Cancelled]: 'Anulată',
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Обработка ошибок с возможностью повтора
  if (hasError) {
    const handleRetry = () => {
      setHasError(false);
      loadDashboardData();
    };

    return (
      <div className="w-full">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">Eroare la încărcarea datelor</h2>
              <p className="mb-4">Nu s-au putut încărca datele dashboard-ului. Posibil să fie o problemă cu conexiunea la server.</p>
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Încercați din nou
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bună ziua, {user?.firstname}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Iată un rezumat al activității tale
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificări
              </Button>
              <Link to="/consultations">
                <Button>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Vezi toate
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
                {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard 
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Welcome Alert for new users */}
        {consultations.length === 0 && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <BookOpenCheck className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <span className="font-semibold">Bun venit pe platforma Mateos!</span> 
              {' '}Începe prin a-ți rezerva prima consultație. Profesorii noștri experți sunt gata să te ajute să îți îmbunătățești performanțele.
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription expiry alert */}
        {subscription && subscription.currentPeriodEnd && subscription.cancelAtPeriodEnd && (
          (() => {
            const expiryDate = new Date(subscription.currentPeriodEnd);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            
            if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
              return (
                <Alert variant="destructive" className="mb-8">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-semibold">Abonamentul tău se anulează în {daysUntilExpiry} zile!</span> 
                    {' '}Reactivează abonamentul pentru a continua să beneficiezi de toate consultațiile.
                  </AlertDescription>
                </Alert>
              );
            }
            return null;
          })()
        )}

        {/* Charts and Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Activitate Săptămână
                </CardTitle>
                <CardDescription>
                  Consultațiile tale din această săptămână
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={consultationsChartData.map((item, index) => ({
                    ...item,
                    color: index === 3 ? '#3b82f6' : '#e2e8f0'
                  }))}
                  showValues
                />
              </CardContent>
            </Card>
          </div>

          {/* Performance Ring */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Performanță
                </CardTitle>
                <CardDescription>
                  Scorul tău acest trimestru
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ProgressRing 
                  progress={89} 
                  size={120}
                  color="#10b981"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">89%</div>
                    <div className="text-sm text-gray-600">Succes</div>
                  </div>
                </ProgressRing>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Consultations and Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Consultations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-600" />
                      Consultații Recente
                    </CardTitle>
                    <CardDescription>
                      Ultimele tale consultații
                    </CardDescription>
                  </div>
                  <Link to="/consultations">
                    <Button variant="ghost" size="sm">
                      Vezi toate
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.slice(0, 4).map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {consultation.teacherName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{consultation.title}</h4>
                            <p className="text-sm text-gray-500">
                              {consultation.teacherName} • {parseScheduledDate(consultation.scheduledAt).toLocaleDateString('ro-RO')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            className={statusColors[consultation.status]}
                          >
                            {statusLabels[consultation.status]}
                          </Badge>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{consultation.price} Lei</p>
                            <p className="text-sm text-gray-500">{consultation.duration} min</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoConsultationsEmpty 
                    onCreateClick={() => window.location.href = '/consultations'}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subscription and Metrics */}
          <div className="space-y-6">
            {/* Active Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Abonament Activ</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription && subscription.hasActiveSubscription ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900">{subscription.planName || 'Plan Premium'}</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {subscription.status || 'Activ'}
                      </p>
                      {subscription.currentPeriodEnd && (
                        <p className="text-xs text-blue-600 mt-2">
                          Valabil până: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ro-RO')}
                        </p>
                      )}
                    </div>
                    <Link to="/subscriptions">
                      <Button variant="outline" className="w-full">
                        Gestionează abonamentul
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Nu ai un abonament activ</p>
                    <Link to="/pricing">
                      <Button>Alege un plan</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <div className="space-y-3">
              <MetricCard
                title="Punctaj Mediu"
                value="4.8"
                subtitle="din 5 stele"
                color="yellow"
                size="sm"
              />
              <MetricCard
                title="Timp Mediu"
                value="45min"
                subtitle="per consultație"
                color="green"
                size="sm"
              />
              <MetricCard
                title="Această Lună"
                value={consultations.filter(c => {
                  const consultationDate = parseScheduledDate(c.scheduledAt);
                  const now = new Date();
                  return consultationDate.getMonth() === now.getMonth() && 
                         consultationDate.getFullYear() === now.getFullYear();
                }).length}
                subtitle="consultații"
                color="purple"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
