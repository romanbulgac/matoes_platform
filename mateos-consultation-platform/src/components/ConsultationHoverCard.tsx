import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ConsultationHoverCardProps {
  consultation: ConsultationDto;
  children: React.ReactNode;
}

const statusColors = {
  [ConsultationStatus.Scheduled]: 'bg-blue-100 text-blue-800',
  [ConsultationStatus.InProgress]: 'bg-green-100 text-green-800',
  [ConsultationStatus.Completed]: 'bg-gray-100 text-gray-800',
  [ConsultationStatus.Cancelled]: 'bg-red-100 text-red-800',
};

const statusLabels = {
  [ConsultationStatus.Scheduled]: 'Planificată',
  [ConsultationStatus.InProgress]: 'În desfășurare',
  [ConsultationStatus.Completed]: 'Finalizată',
  [ConsultationStatus.Cancelled]: 'Anulată',
};

/**
 * ConsultationHoverCard - HoverCard premium pentru preview rapid consultații
 */
export function ConsultationHoverCard({ consultation, children }: ConsultationHoverCardProps) {
  const scheduledDate = parseScheduledDate(consultation.scheduledAt);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" side="right">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold">
                {consultation.teacherName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{consultation.title}</h4>
              <p className="text-sm text-gray-600">{consultation.teacherName}</p>
            </div>
            <Badge className={statusColors[consultation.status]}>
              {statusLabels[consultation.status]}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-primary-500" />
            <span>{scheduledDate.toLocaleDateString('ro-RO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-primary-500" />
            <span>{scheduledDate.toLocaleTimeString('ro-RO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} • {consultation.duration} minute</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-gray-500">Preț</p>
              <p className="text-lg font-bold text-gray-900">{consultation.price} Lei</p>
            </div>
            {consultation.status === ConsultationStatus.Scheduled && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Până la start</p>
                <p className="text-sm font-semibold text-primary-600">
                  {Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} zile
                </p>
              </div>
            )}
          </div>

          {consultation.description && (
            <>
              <Separator />
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Descriere</p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {consultation.description}
                </p>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

