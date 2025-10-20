import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface CalendarViewProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
}

export const CalendarView: FC<CalendarViewProps> = ({
  consultations,
  onEdit,
  onStart,
  onCancel,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Консультации для выбранной даты
  const selectedDateConsultations = useMemo(() => {
    if (!selectedDate) return [];
    
    return consultations
      .filter(c => {
        const consultationDate = parseScheduledDate(c.scheduledAt);
        return consultationDate.toDateString() === selectedDate.toDateString();
      })
      .sort((a, b) => {
        return getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt);
      });
  }, [consultations, selectedDate]);

  // Статистика по выбранной дате
  const dateStats = useMemo(() => {
    const scheduled = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Scheduled).length;
    const completed = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Completed).length;
    const cancelled = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Cancelled).length;
    
    return { scheduled, completed, cancelled, total: selectedDateConsultations.length };
  }, [selectedDateConsultations]);

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Date Picker с Popover */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Selectați data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: ro })
                  ) : (
                    <span>Alegeți o dată</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>

            {/* Статистика по дате */}
            {selectedDate && dateStats.total > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <Typography.Small className="font-medium text-xs sm:text-sm">
                  {selectedDate.toLocaleDateString('ro-RO', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Typography.Small>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {dateStats.scheduled > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dateStats.scheduled} planificate
                    </Badge>
                  )}
                  {dateStats.completed > 0 && (
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                      {dateStats.completed} finalizate
                    </Badge>
                  )}
                  {dateStats.cancelled > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {dateStats.cancelled} anulate
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Список консультаций для выбранной даты */}
      <div className="space-y-3 sm:space-y-4">
        {!selectedDate ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 sm:p-4 rounded-full bg-gray-100">
                  <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              </div>
              <Typography.H3 className="mb-2 text-lg sm:text-2xl">Selectați o dată</Typography.H3>
              <Typography.Muted className="text-sm sm:text-base">
                Alegeți o dată din calendar pentru a vedea consultațiile
              </Typography.Muted>
            </CardContent>
          </Card>
        ) : selectedDateConsultations.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 sm:p-4 rounded-full bg-gray-100">
                  <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              </div>
              <Typography.H3 className="mb-2 text-lg sm:text-2xl">
                Nu sunt consultații
              </Typography.H3>
              <Typography.Muted className="text-sm sm:text-base">
                Nu există consultații pentru {selectedDate.toLocaleDateString('ro-RO', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography.Muted>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Typography.H3 className="text-lg sm:text-2xl">
                {selectedDate.toLocaleDateString('ro-RO', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Typography.H3>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {selectedDateConsultations.length} {selectedDateConsultations.length === 1 ? 'consultație' : 'consultații'}
              </Badge>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {selectedDateConsultations.map((consultation) => (
                <TeacherConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onEdit={onEdit}
                  onStart={onStart}
                  onCancel={onCancel}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
