import { ConsultationCard } from '@/components/ConsultationCard';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { CalendarDays } from 'lucide-react';
import { FC } from 'react';

interface ConsultationDayGroupProps {
  date: string;
  consultations: ConsultationDto[];
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
}

export const ConsultationDayGroup: FC<ConsultationDayGroupProps> = ({
  date,
  consultations,
  onJoin,
  onLeave,
  onEdit,
  onStart,
  onCancel,
  className
}) => {
  // Сортируем консультации по времени (по возрастанию)
  const sortedConsultations = [...consultations].sort((a, b) => 
    getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt)
  );

  // Форматируем дату для отображения
  const formatDisplayDate = (dateString: string) => {
    const date = parseScheduledDate(dateString);
    return date.toLocaleDateString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div id={`day-${date}`} className={cn("mb-8 scroll-mt-20", className)}>
      {/* Заголовок дня */}
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-5 h-5 text-blue-600" />
        <Typography.H3 className="mb-0 text-blue-900">
          {formatDisplayDate(date)}
        </Typography.H3>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
        <Typography.Small className="text-muted-foreground font-medium">
          {sortedConsultations.length} {sortedConsultations.length === 1 ? 'consultație' : 'consultații'}
        </Typography.Small>
      </div>

      {/* Список консультаций на этот день */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedConsultations.map((consultation) => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            onJoin={onJoin}
            onLeave={onLeave}
            onEdit={onEdit}
            onStart={onStart}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
};