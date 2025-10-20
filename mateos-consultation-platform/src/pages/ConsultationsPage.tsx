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
import { Typography } from '@/components/ui/typography-bundle';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { ConsultationService } from '@/services/consultationService';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { Archive, Calendar, Inbox } from 'lucide-react';
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

  return (
    <Typography.Section className="w-full space-y-6">

      {/* Error Alert Компонент */}
      <ConsultationErrorAlert
        error={error}
        onRetry={loadConsultations}
      />

      {/* Tabs Navigation */}
      <Tabs 
        defaultValue={defaultTab} 
        className="w-full"
        onValueChange={(value) => setSearchParams({ view: value })}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="archive" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Arhivă</span>
          </TabsTrigger>
        </TabsList>

        {/* Inbox View - Lista activă */}
        <TabsContent value="inbox" className="mt-6">
          <InboxView
            consultations={activeConsultations}
            onEdit={handleEditConsultation}
            onStart={handleStartConsultation}
            onCancel={handleCancelConsultation}
          />
        </TabsContent>

        {/* Calendar View - Google Style */}
        <TabsContent value="calendar" className="mt-6">
          <GoogleStyleCalendarView
            key={`calendar-${consultations.length}-${consultations.map(c => c.updatedAt).join(',')}`}
            consultations={consultations}
            onEdit={handleEditConsultation}
          />
        </TabsContent>

        {/* Archive View - Completate și Anulate */}
        <TabsContent value="archive" className="mt-6">
          <ArchiveView 
            consultations={archivedConsultations}
            onEdit={handleEditConsultation}
          />
        </TabsContent>
      </Tabs>

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
    </Typography.Section>
  );
}
