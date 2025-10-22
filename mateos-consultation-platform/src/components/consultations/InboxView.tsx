import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { Clock, Inbox } from 'lucide-react';
import { FC, useMemo } from 'react';

interface InboxViewProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
}

export const InboxView: FC<InboxViewProps> = ({
  consultations,
  onEdit,
  onStart,
  onCancel,
  className
}) => {
  // Функция для форматирования даты
  const formatDateLabel = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const consultationDate = new Date(date);
    consultationDate.setHours(0, 0, 0, 0);
    
    if (consultationDate.getTime() === today.getTime()) {
      return 'Astăzi';
    } else if (consultationDate.getTime() === tomorrow.getTime()) {
      return 'Mâine';
    } else {
      return consultationDate.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  // Группируем консультации по дням и статусу
  const groupedConsultations = useMemo(() => {
    const now = new Date();
    
    // Сначала фильтруем активные консультации
    const activeConsultations = consultations.filter(c => 
      c.status !== ConsultationStatus.Cancelled &&
      c.status !== ConsultationStatus.Completed
    );

    // Разделяем на InProgress и остальные
    const inProgress = activeConsultations.filter(c => 
      c.status === ConsultationStatus.InProgress
    );

    const upcoming = activeConsultations
      .filter(c => {
        const consultationDate = parseScheduledDate(c.scheduledAt);
        return consultationDate > now && c.status === ConsultationStatus.Scheduled;
      })
      .sort((a, b) => {
        return getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt);
      });

    // Группируем предстоящие по дням
    const groupedByDay: { [key: string]: ConsultationDto[] } = {};
    
    upcoming.forEach(consultation => {
      const date = parseScheduledDate(consultation.scheduledAt);
      const dateKey = formatDateLabel(date);
      
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = [];
      }
      groupedByDay[dateKey].push(consultation);
    });

    return { inProgress, groupedByDay };
  }, [consultations]);

  const { inProgress, groupedByDay } = groupedConsultations;
  const hasAnyConsultations = inProgress.length > 0 || Object.keys(groupedByDay).length > 0;

  if (!hasAnyConsultations) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-6 sm:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-gray-100">
              <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          </div>
          <Typography.H3 className="mb-2 text-lg sm:text-2xl">Inbox gol</Typography.H3>
          <Typography.Muted className="text-sm sm:text-base">
            Nu aveți consultații viitoare programate
          </Typography.Muted>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Consultații în desfășurare - cel mai sus */}
      {inProgress.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <Typography.H4 className="text-base sm:text-lg text-blue-700">
              În desfășurare
            </Typography.H4>
            <Badge className="bg-blue-600 text-xs sm:text-sm">
              Live
            </Badge>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {inProgress.map((consultation) => (
              <div key={consultation.id} className="ring-2 ring-blue-500/30 rounded-lg animate-pulse-slow">
                <TeacherConsultationCard
                  consultation={consultation}
                  onEdit={onEdit}
                  onStart={onStart}
                  onCancel={onCancel}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consultații viitoare grupate pe zile */}
      {Object.entries(groupedByDay).map(([dateLabel, dayConsultations]) => (
        <div key={dateLabel} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <Typography.H4 className="text-base sm:text-lg">
              {dateLabel}
            </Typography.H4>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {dayConsultations.length} {dayConsultations.length === 1 ? 'consultație' : 'consultații'}
            </Badge>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {dayConsultations.map((consultation) => (
              <TeacherConsultationCard
                key={consultation.id}
                consultation={consultation}
                onEdit={onEdit}
                onStart={onStart}
                onCancel={onCancel}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
