import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { Archive, Search } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface ArchiveViewProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'title' | 'status';

export const ArchiveView: FC<ArchiveViewProps> = ({
  consultations,
  onEdit,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Филтруем только завершенные и отмененные консультации
  const archivedConsultations = useMemo(() => {
    let filtered = consultations.filter(c => 
      c.status === ConsultationStatus.Completed || 
      c.status === ConsultationStatus.Cancelled
    );

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.topic.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    // Сортировка
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return getScheduledTimestamp(b.scheduledAt) - getScheduledTimestamp(a.scheduledAt);
        case 'date-asc':
          return getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status - b.status;
        default:
          return 0;
      }
    });
  }, [consultations, searchQuery, sortBy]);

  // Группируем по месяцам
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, ConsultationDto[]> = {};
    
    archivedConsultations.forEach(consultation => {
      const date = parseScheduledDate(consultation.scheduledAt);
      const monthLabel = date.toLocaleDateString('ro-RO', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!groups[monthLabel]) {
        groups[monthLabel] = [];
      }
      groups[monthLabel].push(consultation);
    });

    return groups;
  }, [archivedConsultations]);

  if (consultations.filter(c => c.status === ConsultationStatus.Completed || c.status === ConsultationStatus.Cancelled).length === 0) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-6 sm:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-gray-100">
              <Archive className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          </div>
          <Typography.H3 className="mb-2 text-lg sm:text-2xl">Arhivă goală</Typography.H3>
          <Typography.Muted className="text-sm sm:text-base">
            Nu aveți consultații finalizate încă
          </Typography.Muted>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Панель поиска и фильтров */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută în arhivă..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[200px] text-sm sm:text-base">
                <SelectValue placeholder="Sortare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Cele mai recente</SelectItem>
                <SelectItem value="date-asc">Cele mai vechi</SelectItem>
                <SelectItem value="title">Titlu (A-Z)</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Результаты */}
      {archivedConsultations.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <Typography.Muted className="text-sm sm:text-base">
              Nu s-au găsit consultații pentru criteriile selectate
            </Typography.Muted>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedByMonth).map(([month, monthConsultations]) => (
            <div key={month} className="space-y-2 sm:space-y-3">
              <Typography.H4 className="text-muted-foreground capitalize text-base sm:text-lg">
                {month}
              </Typography.H4>
              <div className="space-y-3 sm:space-y-4">
                {monthConsultations.map((consultation) => (
                  <TeacherConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onEdit={onEdit}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статистика */}
      {archivedConsultations.length > 0 && (
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="p-3 sm:p-4">
            <Typography.Small className="text-muted-foreground text-xs sm:text-sm">
              Total: {archivedConsultations.length} consultații arhivate
            </Typography.Small>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
