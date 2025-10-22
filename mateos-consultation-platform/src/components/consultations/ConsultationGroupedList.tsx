import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NoConsultationsEmpty, NoSearchResultsEmpty } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, Clock } from 'lucide-react';
import { FC, useMemo } from 'react';
import { ConsultationDayGroup } from './ConsultationDayGroup';

interface ConsultationGroupedListProps {
  consultations: ConsultationDto[];
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const ConsultationGroupedList: FC<ConsultationGroupedListProps> = ({
  consultations,
  onJoin,
  onLeave,
  onEdit,
  onStart,
  onCancel,
  onCreateClick,
  onClearFilters,
  hasActiveFilters = false,
  className
}) => {
  // Группируем консультации по дням
  const consultationsByDay = useMemo(() => {
    const groups: { [key: string]: ConsultationDto[] } = {};
    
    consultations.forEach(consultation => {
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
  }, [consultations]);

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

  // Если нет консультаций, показываем empty state
  if (consultations.length === 0) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-8">
          {hasActiveFilters ? (
            <NoSearchResultsEmpty onClearSearch={onClearFilters} />
          ) : (
            <NoConsultationsEmpty onCreateClick={onCreateClick} />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Заголовок секции */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-600" />
        <Typography.H2 className="mb-0">
          Consultații Programate
        </Typography.H2>
        <Typography.Muted className="text-sm">
          {consultations.length} {consultations.length === 1 ? 'consultație' : 'consultații'} disponibile
        </Typography.Muted>
      </div>

      {/* Кнопки быстрого перехода */}
      {quickDayLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Sari la:</span>
          </div>
          {quickDayLinks.map(day => (
            <Button
              key={day.key}
              variant={day.variant}
              size="sm"
              onClick={() => scrollToDay(day.key)}
              className="h-7 px-2 text-xs"
            >
              {day.label}
            </Button>
          ))}
        </div>
      )}

      {/* Групповые консультации по дням */}
      {consultationsByDay.map(({ date, consultations: dayConsultations }) => (
        <ConsultationDayGroup
          key={date}
          date={date}
          consultations={dayConsultations}
          onJoin={onJoin}
          onLeave={onLeave}
          onEdit={onEdit}
          onStart={onStart}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};