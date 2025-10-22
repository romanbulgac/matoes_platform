import {
  ArchiveView,
  ConsultationErrorAlert,
  ConsultationLoadingSkeleton,
  CreateConsultationModal,
  EditConsultationModal,
  GoogleStyleCalendarView,
  InboxView,
  type CreateConsultationFormData
} from '@/components/consultations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Typography } from '@/components/ui/typography-bundle';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { ConsultationService } from '@/services/consultationService';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { 
  Archive, 
  Calendar, 
  Inbox, 
  Plus, 
  CalendarDays, 
  Sparkles, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function ConsultationsPage() {
  const { user } = useAuth();
  const handleError = useErrorHandler();
  
  // Setăm titlul paginii
  useSetPageTitle('Consultații');
  
  console.log('🔍 ConsultationsPage rendered - User:', {
    isAuthenticated: !!user,
    role: user?.role,
    email: user?.email
  });
  
  const [consultations, setConsultations] = useState<ConsultationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Проверяем авторизацию перед запросом
      if (!user) {
        console.warn('⚠️ Attempting to load consultations without authentication');
        setConsultations([]);
        setError('Trebuie să fii autentificat pentru a vedea consultațiile.');
        return;
      }
      
      console.log('🔍 Loading consultations for user:', user.email);
      const consultationsData = await ConsultationService.getAll();
      console.log('📋 Received consultations data:', consultationsData);
      
      // Детальное логирование каждой консультации
      consultationsData.forEach((consultation, index) => {
        console.log(`📄 Consultation ${index + 1}:`, {
          id: consultation.id,
          title: consultation.title,
          status: consultation.status,
          statusType: typeof consultation.status,
          teacherId: consultation.teacherId,
          consultationType: consultation.consultationType
        });
      });
      
      setConsultations(consultationsData);
    } catch (err: unknown) {
      console.error('Eroare la încărcarea consultațiilor:', err);
      
      // Улучшенная обработка ошибок
      if (err instanceof Error) {
        if (err.message.includes('Authentication expired')) {
          // Не показываем ошибку - AuthContext сам обработает разлогинивание
          setError('');
        } else if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          setError('Problemă de rețea. Verificați conexiunea la internet.');
        } else {
          // Используем setError вместо handleError для избежания зависимости
          setError(err.message || 'A apărut o eroare neașteptată');
        }
      } else {
        setError('A apărut o eroare neașteptată');
      }
    } finally {
      setLoading(false);
    }
  }, [user]); // Добавляем зависимость от user

  useEffect(() => {
    // Загружаем консультации только если пользователь авторизован
    if (user) {
      loadConsultations();
    } else {
      console.log('⏸️ User not authenticated, skipping consultations load');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Зависимость от user

  // Обработчики для учителей
  const handleEditConsultation = async (id: string) => {
    console.log('📝 Opening edit modal for consultation:', id);
    setEditingConsultationId(id);
    setShowEditModal(true);
  };

  const handleStartConsultation = async (id: string) => {
    try {
      console.log('Starting consultation:', id);
      
      // Обновляем статус консультации на "В процессе"
      setConsultations(prev => prev.map(consultation => 
        consultation.id === id 
          ? { 
              ...consultation, 
              status: ConsultationStatus.InProgress
            }
          : consultation
      ));
      
      handleError.showSuccess('Consultația a fost pornită cu succes!');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Authentication expired')) {
        return;
      }
      handleError.handleError(error);
    }
  };

  const handleCancelConsultation = async (id: string) => {
    try {
      console.log('Cancelling consultation:', id);
      
      // Обновляем статус консультации на "Отменена"
      setConsultations(prev => prev.map(consultation => 
        consultation.id === id 
          ? { 
              ...consultation, 
              status: ConsultationStatus.Cancelled
            }
          : consultation
      ));
      
      handleError.showSuccess('Consultația a fost anulată cu succes!');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Authentication expired')) {
        return;
      }
      handleError.handleError(error);
    }
  };

  const defaultTab = searchParams.get('view') || 'inbox';

  // Обработчик создания консультации
  const handleCreateConsultation = async (formData: CreateConsultationFormData) => {
    try {
      console.log('Creating consultation:', formData);
      // TODO: Реализовать API вызов для создания консультации
      // const newConsultation = await ConsultationService.create(formData);
      
      setShowCreateModal(false);
      await loadConsultations(); // Перезагрузить список
      handleError.showSuccess('Consultația a fost creată cu succes!');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Authentication expired')) {
        return;
      }
      handleError.handleError(error);
    }
  };

  if (loading) {
    return <ConsultationLoadingSkeleton />;
  }

  // Фильтры консультаций по табам
  const activeConsultations = consultations.filter(c => 
    c.status === ConsultationStatus.Scheduled || c.status === ConsultationStatus.InProgress
  );

  const archivedConsultations = consultations.filter(c =>
    c.status === ConsultationStatus.Completed || c.status === ConsultationStatus.Cancelled
  );

  // Премиум статистика
  const consultationStats = {
    total: consultations.length,
    scheduled: consultations.filter(c => c.status === ConsultationStatus.Scheduled).length,
    inProgress: consultations.filter(c => c.status === ConsultationStatus.InProgress).length,
    completed: consultations.filter(c => c.status === ConsultationStatus.Completed).length,
    cancelled: consultations.filter(c => c.status === ConsultationStatus.Cancelled).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        {/* Премиум заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Consultații
              </h1>
              <p className="text-sm text-muted-foreground">Gestionează și monitorizează consultațiile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nouă Consultație
            </Button>
            <Badge variant="secondary" className="gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        </div>

        {/* Премиум статистика */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Statistici Consultații</CardTitle>
                <p className="text-sm text-muted-foreground">Prezentare generală a consultațiilor</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {consultationStats.total}
                </div>
                <div className="text-sm text-blue-700 font-medium">Total</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                  {consultationStats.scheduled}
                </div>
                <div className="text-sm text-yellow-700 font-medium">Planificate</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  {consultationStats.inProgress}
                </div>
                <div className="text-sm text-orange-700 font-medium">În Progres</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-green-500 rounded-full">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {consultationStats.completed}
                </div>
                <div className="text-sm text-green-700 font-medium">Finalizate</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-red-500 rounded-full">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  {consultationStats.cancelled}
                </div>
                <div className="text-sm text-red-700 font-medium">Anulate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert Компонент */}
        <ConsultationErrorAlert
          error={error}
          onRetry={loadConsultations}
        />

        {/* Премиум табы */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs 
              defaultValue={defaultTab} 
              className="w-full"
              onValueChange={(value) => setSearchParams({ view: value })}
            >
              <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-none border-b">
              <TabsTrigger value="inbox" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Inbox className="h-4 w-4" />
                <span>Inbox</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {activeConsultations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="archive" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Archive className="h-4 w-4" />
                <span>Arhivă</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {archivedConsultations.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Inbox View - Lista activă */}
            <TabsContent value="inbox" className="p-6">
              <ScrollArea className="h-[600px]">
                <InboxView
                  consultations={activeConsultations}
                  onEdit={handleEditConsultation}
                  onStart={handleStartConsultation}
                  onCancel={handleCancelConsultation}
                />
              </ScrollArea>
            </TabsContent>

            {/* Calendar View - Google Style */}
            <TabsContent value="calendar" className="p-6">
              <ScrollArea className="h-[600px]">
                <GoogleStyleCalendarView
                  key={`calendar-${consultations.length}-${consultations.map(c => c.updatedAt).join(',')}`}
                  consultations={consultations}
                  onEdit={handleEditConsultation}
                />
              </ScrollArea>
            </TabsContent>

            {/* Archive View - Completate și Anulate */}
            <TabsContent value="archive" className="p-6">
              <ScrollArea className="h-[600px]">
                <ArchiveView 
                  consultations={archivedConsultations}
                  onEdit={handleEditConsultation}
                />
              </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Consultation Modal */}
        <CreateConsultationModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={handleCreateConsultation}
        />

        {/* Edit Consultation Modal */}
        <EditConsultationModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          consultationId={editingConsultationId}
          onSuccess={() => {
            loadConsultations();
            handleError.showSuccess('Consultația a fost actualizată cu succes!');
          }}
        />
      </div>
    </div>
  );
}
