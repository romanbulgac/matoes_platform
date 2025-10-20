import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Consultation } from '@/types';
import {
    Calendar,
    CalendarCheck,
    CalendarClock,
    CalendarX,
    Clock,
    Filter,
    SortAsc,
    SortDesc,
    Users,
    Video,
} from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface GroupConsultationsListProps {
  consultations: Consultation[];
  groupName?: string;
  className?: string;
}

type SortOption = 'date-asc' | 'date-desc' | 'status' | 'duration';
type FilterStatus = 'all' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

/**
 * GroupConsultationsList - Comprehensive display pentru consultații grup
 * 
 * Features:
 * - Filtering by status
 * - Sorting by date/status/duration
 * - Status badges with icons
 * - Empty states
 * - Responsive grid layout
 */
export const GroupConsultationsList: FC<GroupConsultationsListProps> = ({
  consultations,
  groupName,
  className,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // ============= Filtering Logic =============
  const filteredConsultations = useMemo(() => {
    if (filterStatus === 'all') return consultations;
    return consultations.filter(c => c.status === filterStatus);
  }, [consultations, filterStatus]);

  // ============= Sorting Logic =============
  const sortedConsultations = useMemo(() => {
    const sorted = [...filteredConsultations];

    switch (sortOption) {
      case 'date-asc':
        return sorted.sort((a, b) => 
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
      case 'date-desc':
        return sorted.sort((a, b) => 
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
        );
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case 'duration':
        return sorted.sort((a, b) => b.duration - a.duration);
      default:
        return sorted;
    }
  }, [filteredConsultations, sortOption]);

  // ============= Helper Functions =============
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      Scheduled: {
        label: 'Programată',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CalendarClock,
      },
      InProgress: {
        label: 'În desfășurare',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: Video,
      },
      Completed: {
        label: 'Finalizată',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: CalendarCheck,
      },
      Cancelled: {
        label: 'Anulată',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: CalendarX,
      },
    };

    return configs[status as keyof typeof configs] || configs.Scheduled;
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return consultations.length;
    return consultations.filter(c => c.status === status).length;
  };

  // ============= Empty State =============
  if (consultations.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-blue-50 p-4 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nicio consultație încă
          </h3>
          <p className="text-sm text-gray-600 max-w-sm mb-6">
            {groupName 
              ? `Grupul "${groupName}" nu are consultații programate momentan.`
              : 'Nu există consultații programate pentru acest grup.'}
          </p>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Programează consultație
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ============= No Results After Filtering =============
  if (sortedConsultations.length === 0) {
    return (
      <div className={className}>
        {/* Filters & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate ({getStatusCount('all')})</SelectItem>
                <SelectItem value="Scheduled">Programate ({getStatusCount('Scheduled')})</SelectItem>
                <SelectItem value="InProgress">În desfășurare ({getStatusCount('InProgress')})</SelectItem>
                <SelectItem value="Completed">Finalizate ({getStatusCount('Completed')})</SelectItem>
                <SelectItem value="Cancelled">Anulate ({getStatusCount('Cancelled')})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {sortOption === 'date-desc' ? (
              <SortDesc className="w-4 h-4 text-gray-500" />
            ) : (
              <SortAsc className="w-4 h-4 text-gray-500" />
            )}
            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Data (cele mai recente)</SelectItem>
                <SelectItem value="date-asc">Data (cele mai vechi)</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="duration">Durată</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Empty filtered results */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-50 p-4 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Niciun rezultat
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mb-4">
              Nu există consultații cu filtrul selectat.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Resetează filtrele
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============= Main Render =============
  return (
    <div className={className}>
      {/* Filters & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate ({getStatusCount('all')})</SelectItem>
              <SelectItem value="Scheduled">Programate ({getStatusCount('Scheduled')})</SelectItem>
              <SelectItem value="InProgress">În desfășurare ({getStatusCount('InProgress')})</SelectItem>
              <SelectItem value="Completed">Finalizate ({getStatusCount('Completed')})</SelectItem>
              <SelectItem value="Cancelled">Anulate ({getStatusCount('Cancelled')})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {sortOption === 'date-desc' ? (
            <SortDesc className="w-4 h-4 text-gray-500" />
          ) : (
            <SortAsc className="w-4 h-4 text-gray-500" />
          )}
          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Data (cele mai recente)</SelectItem>
              <SelectItem value="date-asc">Data (cele mai vechi)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="duration">Durată</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Consultations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedConsultations.map((consultation) => {
          const statusConfig = getStatusConfig(consultation.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card 
              key={consultation.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <CardContent className="p-5">
                {/* Header: Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", statusConfig.color)}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                  
                  {consultation.type === 1 && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Grup
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {consultation.title || consultation.topic || 'Consultație'}
                </h4>

                {/* Date & Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{formatDate(consultation.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatTime(consultation.scheduledAt)}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>{consultation.duration} min</span>
                  </div>
                </div>

                {/* Description */}
                {consultation.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {consultation.description}
                  </p>
                )}

                {/* Footer: Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  {consultation.status === 'Scheduled' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        Modifică
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        <Video className="w-3 h-3 mr-1" />
                        Join
                      </Button>
                    </>
                  )}
                  {consultation.status === 'Completed' && (
                    <Button variant="outline" size="sm" className="w-full">
                      Vezi detalii
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Se afișează {sortedConsultations.length} din {consultations.length} consultații
      </div>
    </div>
  );
};
