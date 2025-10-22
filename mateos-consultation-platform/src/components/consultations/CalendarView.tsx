import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  CalendarDays,
  Filter,
  // Grid3X3,
  List,
  Sparkles,
  Zap,
  Eye,
  BarChart3
} from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');

  // Премиум фильтрация консультаций
  const filteredConsultations = useMemo(() => {
    let filtered = consultations;
    
    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Фильтр по дате (если выбран режим календаря)
    if (viewMode === 'calendar' && selectedDate) {
      filtered = filtered.filter(c => {
        if (!c.scheduledAt) return false;
        const consultationDate = parseScheduledDate(c.scheduledAt);
        return consultationDate.toDateString() === selectedDate.toDateString();
      });
    }
    
    return filtered.sort((a, b) => {
      return getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt);
    });
  }, [consultations, selectedDate, viewMode, statusFilter]);

  // Консультации для выбранной даты (для обратной совместимости - закомментировано)
  // const selectedDateConsultations = useMemo(() => {
  //   if (!selectedDate) return [];
  //   return filteredConsultations.filter(c => {
  //     const consultationDate = parseScheduledDate(c.scheduledAt);
  //     return consultationDate.toDateString() === selectedDate.toDateString();
  //   });
  // }, [filteredConsultations, selectedDate]);

  // Премиум статистика
  const overallStats = useMemo(() => {
    const scheduled = consultations.filter(c => c.status === ConsultationStatus.Scheduled).length;
    const completed = consultations.filter(c => c.status === ConsultationStatus.Completed).length;
    const cancelled = consultations.filter(c => c.status === ConsultationStatus.Cancelled).length;
    const total = consultations.length;
    
    return { scheduled, completed, cancelled, total };
  }, [consultations]);

  // Статистика по выбранной дате (закомментировано, так как не используется)
  // const dateStats = useMemo(() => {
  //   const scheduled = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Scheduled).length;
  //   const completed = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Completed).length;
  //   const cancelled = selectedDateConsultations.filter(c => c.status === ConsultationStatus.Cancelled).length;
  //   
  //   return { scheduled, completed, cancelled, total: selectedDateConsultations.length };
  // }, [selectedDateConsultations]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Премиум заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <CalendarDays className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendar Consultații</h2>
            <p className="text-sm text-muted-foreground">Gestionează și vizualizează consultațiile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        </div>
      </div>

      {/* Премиум статистика */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Statistici Consultații</CardTitle>
              <p className="text-sm text-muted-foreground">Prezentare generală a consultațiilor</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{overallStats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Planificate</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{overallStats.completed}</div>
              <div className="text-sm text-muted-foreground">Finalizate</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{overallStats.cancelled}</div>
              <div className="text-sm text-muted-foreground">Anulate</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{overallStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Премиум контролы */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Filter className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Filtre și Vizualizare</CardTitle>
                <p className="text-sm text-muted-foreground">Personalizează vizualizarea consultațiilor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'calendar' | 'list')}>
                <ToggleGroupItem value="calendar" aria-label="Calendar view">
                  <CalendarIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Фильтр по статусу */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filtrează după status</label>
              <ToggleGroup type="single" value={statusFilter.toString()} onValueChange={(value) => {
                if (value === 'all') {
                  setStatusFilter('all');
                } else {
                  setStatusFilter(Number(value) as ConsultationStatus);
                }
              }}>
                <ToggleGroupItem value="all">Toate</ToggleGroupItem>
                <ToggleGroupItem value={ConsultationStatus.Scheduled.toString()}>Planificate</ToggleGroupItem>
                <ToggleGroupItem value={ConsultationStatus.Completed.toString()}>Finalizate</ToggleGroupItem>
                <ToggleGroupItem value={ConsultationStatus.Cancelled.toString()}>Anulate</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Выбор даты */}
            {viewMode === 'calendar' && (
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Selectează data</label>
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Премиум отображение консультаций */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {viewMode === 'calendar' ? 'Consultații pentru Data Selectată' : 'Toate Consultațiile'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {viewMode === 'calendar' 
                    ? selectedDate ? `Pentru ${selectedDate.toLocaleDateString('ro-RO', { 
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}` : 'Selectați o dată pentru a vedea consultațiile'
                    : `Afișare: ${filteredConsultations.length} consultații`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                {filteredConsultations.length} consultații
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {viewMode === 'calendar' && !selectedDate ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gray-100">
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Selectați o dată</h3>
                <p className="text-muted-foreground">
                  Alegeți o dată din calendar pentru a vedea consultațiile
                </p>
              </div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gray-100">
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Nu sunt consultații
                </h3>
                <p className="text-muted-foreground">
                  {viewMode === 'calendar' 
                    ? `Nu există consultații pentru ${selectedDate?.toLocaleDateString('ro-RO', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}`
                    : 'Nu există consultații care să corespundă filtrelor selectate'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <TeacherConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onEdit={onEdit}
                    onStart={onStart}
                    onCancel={onCancel}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
