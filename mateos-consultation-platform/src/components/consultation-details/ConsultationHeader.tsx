import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, Clock, Users2, Video } from 'lucide-react';
import { FC } from 'react';

interface ConsultationHeaderProps {
  consultation: ConsultationDto;
}

export const ConsultationHeader: FC<ConsultationHeaderProps> = ({ consultation }) => {
  const getStatusBadge = () => {
    switch (consultation.status) {
      case ConsultationStatus.Scheduled:
        return <Badge className="bg-emerald-100 text-emerald-700">Planificată</Badge>;
      case ConsultationStatus.InProgress:
        return <Badge className="bg-blue-100 text-blue-700">În desfășurare</Badge>;
      case ConsultationStatus.Completed:
        return <Badge className="bg-slate-100 text-slate-600">Finalizată</Badge>;
      case ConsultationStatus.Cancelled:
        return <Badge className="bg-rose-100 text-rose-700">Anulată</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return parseScheduledDate(dateString).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return parseScheduledDate(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEndTime = (dateString: string, duration: number) => {
    const start = parseScheduledDate(dateString);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-emerald-50 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Typography.H2 className="text-2xl sm:text-3xl">{consultation.title}</Typography.H2>
              {getStatusBadge()}
            </div>
            <Typography.P className="text-slate-600">{consultation.description}</Typography.P>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Data */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Typography.Small className="text-slate-500">Data</Typography.Small>
              <Typography.P className="font-medium">{formatDate(consultation.scheduledAt)}</Typography.P>
            </div>
          </div>

          {/* Ora */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <Typography.Small className="text-slate-500">Interval</Typography.Small>
              <Typography.P className="font-medium">
                {formatTime(consultation.scheduledAt)} - {formatEndTime(consultation.scheduledAt, consultation.duration)}
              </Typography.P>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-50">
              {consultation.consultationType === 'Group' ? (
                <Users2 className="w-5 h-5 text-purple-600" />
              ) : (
                <Video className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div>
              <Typography.Small className="text-slate-500">Tip</Typography.Small>
              <Typography.P className="font-medium">
                {consultation.consultationType === 'Group' ? 'Grup' : 'Individual'}
              </Typography.P>
            </div>
          </div>

          {/* Preț */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-50">
              <span className="text-xl font-bold text-amber-600">Lei</span>
            </div>
            <div>
              <Typography.Small className="text-slate-500">Preț</Typography.Small>
              <Typography.P className="font-medium">{consultation.price} Lei</Typography.P>
            </div>
          </div>
        </div>

        {/* Group Name */}
        {consultation.groupName && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <Typography.Small className="text-slate-500">Grup</Typography.Small>
            <Typography.P className="font-medium">{consultation.groupName}</Typography.P>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
