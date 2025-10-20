import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, CheckCircle, Clock, ExternalLink, GraduationCap, Users, Video } from 'lucide-react';
import { FC, useMemo } from 'react';

interface TeacherConsultationGroupedViewProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCreateClick?: () => void;
  onFinish?: (id: string) => void;
  onNavigateToActive?: (id: string) => void;
  className?: string;
}

export const TeacherConsultationGroupedView: FC<TeacherConsultationGroupedViewProps> = ({
  consultations,
  onEdit,
  onStart,
  onCancel,
  onCreateClick,
  onFinish,
  onNavigateToActive,
  className
}) => {
  // Находим активную лекцию (Status: 'InProgress')
  const activeLecture = useMemo(() => {
    return consultations.find(consultation => 
      consultation.status === 'InProgress'
    );
  }, [consultations]);

  // Группируем консультации по дням (исключая активную лекцию)
  const consultationsByDay = useMemo(() => {
    const groups: { [key: string]: ConsultationDto[] } = {};
    
    consultations
      .filter(consultation => consultation.id !== activeLecture?.id) // Исключаем активную лекцию
      .forEach(consultation => {
        // Получаем дату без времени для группировки
        const date = parseScheduledDate(consultation.scheduledAt);
        const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (!groups[dayKey]) {
          groups[dayKey] = [];
        }
        groups[dayKey].push(consultation);
      });

    // Сортируем дни по убыванию (новые/будущие сверху, прошлые снизу)
    const sortedDays = Object.keys(groups).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDays.map(day => ({
      date: day,
      consultations: groups[day]
    }));
  }, [consultations, activeLecture]);

  // Генерируем кнопки быстрого перехода к дням
  const quickDayLinks = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const quickDays = [
      {
        key: today.toISOString().split('T')[0],
        label: 'Astăzi',
        date: today,
        variant: 'default' as const
      },
      {
        key: tomorrow.toISOString().split('T')[0],
        label: 'Mâine',
        date: tomorrow,
        variant: 'outline' as const
      },
      {
        key: dayAfterTomorrow.toISOString().split('T')[0],
        label: 'Poimâine',
        date: dayAfterTomorrow,
        variant: 'outline' as const
      }
    ];

    // Фильтруем только те дни, для которых есть консультации
    return quickDays.filter(day => 
      consultationsByDay.some(group => group.date === day.key)
    );
  }, [consultationsByDay]);

  // Функция прокрутки к определенному дню
  const scrollToDay = (dayKey: string) => {
    const element = document.getElementById(`day-${dayKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Если нет консультаций, показываем empty state для учителя
  if (consultations.length === 0) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-12 text-center">
          <div className="text-blue-400 mb-6">
            <GraduationCap className="w-16 h-16 mx-auto" />
          </div>
          <Typography.H3 className="text-gray-900 mb-2">
            Nu aveți consultații programate
          </Typography.H3>
          <Typography.P className="text-muted-foreground mb-6">
            Consultațiile dvs. vor apărea aici. Începeți prin a crea prima consultație.
          </Typography.P>
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Creează Prima Consultație
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Блок активной лекции */}
      {activeLecture && (
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-25 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Typography.H3 className="mb-0 text-green-800">
                  Lecție Curentă
                </Typography.H3>
              </div>
              <Typography.Small className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                În desfășurare
              </Typography.Small>
            </div>
            
            {/* Карточка консультации без кнопок действий */}
            <TeacherConsultationCard
              consultation={activeLecture}
              onStart={onStart}
              onCancel={onCancel}
              showActions={false}
            />
            
            {/* Кнопки управления активной консультацией */}
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex items-center justify-between">
                <Typography.Small className="text-green-700 font-medium">
                  Acțiuni pentru consultația curentă:
                </Typography.Small>
                
                <div className="flex items-center gap-3">
                  {/* Кнопка перехода к консультации */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToActive?.(activeLecture.id)}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Intră în Consultație
                  </Button>
                  
                  {/* Кнопка завершения консультации */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onFinish?.(activeLecture.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizează Consultația
                  </Button>
                </div>
              </div>
              
              {/* Дополнительная информация */}
              <div className="mt-3 text-sm text-green-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {activeLecture.currentParticipants} / {activeLecture.maxParticipants} participanți
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {activeLecture.consultationType}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Заголовок секции для учителя */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <Typography.H2 className="mb-0">
            {activeLecture ? 'Alte Consultații' : 'Consultațiile Mele'}
          </Typography.H2>
          <Typography.Muted className="text-sm">
            {consultations.length} {consultations.length === 1 ? 'consultație programată' : 'consultații programate'}
          </Typography.Muted>
        </div>

        {/* Кнопки быстрого перехода к дням */}
        {quickDayLinks.length > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Typography.Small className="text-gray-600 mr-2">Sari la:</Typography.Small>
            {quickDayLinks.map((dayLink) => (
              <Button
                key={dayLink.key}
                variant={dayLink.variant}
                size="sm"
                onClick={() => scrollToDay(dayLink.key)}
                className="text-xs"
              >
                {dayLink.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Групповые консультации по дням */}
      {consultationsByDay.map(({ date, consultations: dayConsultations }) => {
        // Сортируем консультации по времени (по возрастанию)
        const sortedConsultations = [...dayConsultations].sort((a, b) => 
          getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt)
        );

        // Форматируем дату для отображения
        const formatDisplayDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('ro-RO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        };

        return (
          <div key={date} id={`day-${date}`} className="mb-8 scroll-mt-4">
            {/* Заголовок дня */}
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <Typography.H3 className="mb-0 text-blue-900">
                {formatDisplayDate(date)}
              </Typography.H3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
              <Typography.Small className="text-muted-foreground font-medium">
                {sortedConsultations.length} {sortedConsultations.length === 1 ? 'consultație' : 'consultații'}
              </Typography.Small>
            </div>

            {/* Список консультаций на этот день - используем TeacherConsultationCard */}
            <div className="space-y-4">
              {sortedConsultations.map((consultation) => (
                <TeacherConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onStart={onStart}
                  onCancel={onCancel}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};