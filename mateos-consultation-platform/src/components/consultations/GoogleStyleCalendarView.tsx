import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns';
import { ro } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface GoogleStyleCalendarViewProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  className?: string;
}

type CalendarViewMode = 'week' | 'month';

export const GoogleStyleCalendarView: FC<GoogleStyleCalendarViewProps> = ({
  consultations,
  onEdit,
  className
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');

  // Навигация
  const goToPrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Получить дни для отображения
  const getDaysToDisplay = useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
      const days = [];
      let day = start;
      
      while (day <= end) {
        days.push(day);
        day = addDays(day, 1);
      }
      
      return days;
    }
  }, [currentDate, viewMode]);

  // Консультации по дням
  const consultationsByDay = useMemo(() => {
    console.log('📅 GoogleStyleCalendarView: Recalculating consultations by day', {
      totalConsultations: consultations.length,
      consultations: consultations.map(c => ({
        id: c.id,
        title: c.title,
        scheduledAt: c.scheduledAt,
        updatedAt: c.updatedAt
      }))
    });
    
    const map = new Map<string, ConsultationDto[]>();
    
    consultations.forEach(consultation => {
      if (!consultation.scheduledAt) return; // Пропускаем консультации без даты
      
      const consultationDate = parseScheduledDate(consultation.scheduledAt);
      
      // Проверяем, что дата валидна
      if (isNaN(consultationDate.getTime())) {
        console.warn('Invalid date for consultation:', consultation.id, consultation.scheduledAt);
        return;
      }
      
      const dateKey = format(consultationDate, 'yyyy-MM-dd');
      
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(consultation);
    });
    
    // Сортируем консультации по времени
    map.forEach((consultations) => {
      consultations.sort((a, b) => {
        const timestampA = getScheduledTimestamp(a.scheduledAt);
        const timestampB = getScheduledTimestamp(b.scheduledAt);
        
        // Проверяем, что оба timestamp валидны
        if (isNaN(timestampA) || isNaN(timestampB)) {
          return 0; // Если один из timestamp невалиден, не меняем порядок
        }
        
        return timestampA - timestampB;
      });
    });
    
    console.log('📅 GoogleStyleCalendarView: Consultations grouped by day', 
      Array.from(map.entries()).map(([date, cons]) => ({
        date,
        count: cons.length,
        times: cons.map(c => {
          if (!c.scheduledAt) return 'N/A';
          const date = parseScheduledDate(c.scheduledAt);
          return isNaN(date.getTime()) ? 'N/A' : format(date, 'HH:mm');
        })
      }))
    );
    
    return map;
  }, [consultations]);

  // Получить консультации для дня
  const getConsultationsForDay = (day: Date): ConsultationDto[] => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return consultationsByDay.get(dateKey) || [];
  };

  // Получить цвет статуса
  const getStatusColor = (status: ConsultationStatus): string => {
    switch (status) {
      case ConsultationStatus.Scheduled:
        return 'bg-blue-50 border-blue-500 text-blue-900';
      case ConsultationStatus.InProgress:
        return 'bg-emerald-50 border-emerald-500 text-emerald-900';
      case ConsultationStatus.Completed:
        return 'bg-slate-50 border-slate-400 text-slate-700';
      case ConsultationStatus.Cancelled:
        return 'bg-rose-50 border-rose-500 text-rose-900';
      default:
        return 'bg-slate-50 border-slate-400 text-slate-700';
    }
  };

  // Форматирование заголовка
  const getHeaderTitle = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      
      if (isSameMonth(start, end)) {
        return format(currentDate, 'MMMM yyyy', { locale: ro });
      } else {
        return `${format(start, 'MMM', { locale: ro })} - ${format(end, 'MMM yyyy', { locale: ro })}`;
      }
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: ro });
    }
  };

  // Рендер недельного вида
  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 border-b bg-gradient-to-b from-slate-50 to-white">
          {getDaysToDisplay.map((day) => {
            const isToday = isSameDay(day, new Date());
            const dayConsultations = getConsultationsForDay(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  isToday && "bg-indigo-50 border-indigo-200"
                )}
              >
                <div className={cn(
                  "text-xs font-medium text-slate-600 uppercase tracking-wide",
                  isToday && "text-indigo-700 font-semibold"
                )}>
                  {format(day, 'EEE', { locale: ro })}
                </div>
                <div className={cn(
                  "text-2xl font-semibold mt-1",
                  isToday ? "text-indigo-600" : "text-slate-800"
                )}>
                  {format(day, 'd')}
                </div>
                {dayConsultations.length > 0 && (
                  <div className={cn(
                    "text-xs mt-1 font-medium",
                    isToday ? "text-indigo-600" : "text-slate-500"
                  )}>
                    {dayConsultations.length} {dayConsultations.length === 1 ? 'consultație' : 'consultații'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Сетка консультаций */}
        <div className="flex-1 grid grid-cols-7 overflow-auto bg-white">
          {getDaysToDisplay.map((day) => {
            const dayConsultations = getConsultationsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-r last:border-r-0 p-2 min-h-[400px]",
                  isToday && "bg-indigo-50/40"
                )}
              >
                <div className="space-y-2">
                  {dayConsultations.map((consultation) => {
                    if (!consultation.scheduledAt) return null;
                    
                    const scheduledDate = parseScheduledDate(consultation.scheduledAt);
                    
                    // Проверяем, что дата валидна
                    if (isNaN(scheduledDate.getTime())) {
                      console.warn('Invalid date for consultation in calendar:', consultation.id, consultation.scheduledAt);
                      return null;
                    }
                    
                    const startTime = format(scheduledDate, 'HH:mm');
                    const endTime = format(
                      new Date(scheduledDate.getTime() + consultation.duration * 60000),
                      'HH:mm'
                    );
                    
                    return (
                      <Card
                        key={consultation.id}
                        className={cn(
                          "p-2.5 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-[3px] hover:scale-[1.02]",
                          getStatusColor(consultation.status)
                        )}
                        onClick={() => onEdit?.(consultation.id)}
                      >
                        <div className="text-xs font-semibold truncate">
                          {startTime} - {endTime}
                        </div>
                        <div className="text-sm font-medium truncate mt-1">
                          {consultation.title}
                        </div>
                        {consultation.teacherName && (
                          <div className="text-xs opacity-75 truncate mt-1">
                            {consultation.teacherName}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Рендер месячного вида
  const renderMonthView = () => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    getDaysToDisplay.forEach((day, index) => {
      currentWeek.push(day);
      
      if ((index + 1) % 7 === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return (
      <div className="flex flex-col h-full">
        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 border-b bg-gradient-to-b from-slate-50 to-white">
          {['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'].map((day) => (
            <div
              key={day}
              className="p-2 text-center border-r last:border-r-0 text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Сетка недель */}
        <div className="flex-1 flex flex-col">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 flex-1 border-b last:border-b-0">
              {week.map((day) => {
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayConsultations = getConsultationsForDay(day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "border-r last:border-r-0 p-1.5 min-h-[100px]",
                      !isCurrentMonth && "bg-slate-50/50",
                      isToday && "bg-indigo-50 border-indigo-200"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1.5",
                      isToday && "text-indigo-600 font-bold",
                      !isCurrentMonth ? "text-slate-400" : "text-slate-700"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayConsultations.slice(0, 3).map((consultation) => {
                        if (!consultation.scheduledAt) return null;
                        
                        const scheduledDate = parseScheduledDate(consultation.scheduledAt);
                        
                        // Проверяем, что дата валидна
                        if (isNaN(scheduledDate.getTime())) {
                          console.warn('Invalid date for consultation in month view:', consultation.id, consultation.scheduledAt);
                          return null;
                        }
                        
                        const startTime = format(scheduledDate, 'HH:mm');
                        const endTime = format(
                          new Date(scheduledDate.getTime() + consultation.duration * 60000),
                          'HH:mm'
                        );
                        
                        return (
                          <div
                            key={consultation.id}
                            className={cn(
                              "text-xs p-1.5 rounded cursor-pointer hover:shadow-md transition-all duration-200 truncate border-l-[3px]",
                              getStatusColor(consultation.status)
                            )}
                            onClick={() => onEdit?.(consultation.id)}
                            title={`${startTime} - ${endTime} | ${consultation.title}`}
                          >
                            <span className="font-semibold">{startTime} - {endTime}</span> {consultation.title}
                          </div>
                        );
                      })}
                      
                      {dayConsultations.length > 3 && (
                        <div className="text-xs text-slate-600 font-medium pl-1.5">
                          +{dayConsultations.length - 3} mai multe
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-3 sm:p-6">
        {/* Header cu навигацією */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Astăzi
            </Button>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <h2 className="text-lg sm:text-xl font-semibold capitalize">
              {getHeaderTitle()}
            </h2>
          </div>

          {/* Переключатель видов */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as CalendarViewMode)}>
            <TabsList>
              <TabsTrigger value="week" className="text-xs sm:text-sm">
                Săptămână
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs sm:text-sm">
                Lună
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Легенда статусов */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-50 border-2 border-blue-500" />
            <span className="text-slate-700 font-medium">Programată</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-50 border-2 border-emerald-500" />
            <span className="text-slate-700 font-medium">În desfășurare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-50 border-2 border-slate-400" />
            <span className="text-slate-700 font-medium">Finalizată</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-50 border-2 border-rose-500" />
            <span className="text-slate-700 font-medium">Anulată</span>
          </div>
        </div>

        {/* Calendar View */}
        <div className="border rounded-lg overflow-hidden min-h-[500px]">
          {viewMode === 'week' ? renderWeekView() : renderMonthView()}
        </div>
      </CardContent>
    </Card>
  );
};
