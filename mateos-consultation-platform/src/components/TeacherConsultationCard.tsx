import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConsultationDto, ConsultationStatus, ConsultationType } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import {
  Users2,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeacherConsultationCardProps {
  consultation: ConsultationDto;
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function TeacherConsultationCard({ 
  consultation,
  onEdit,
  onStart,
  onCancel,
  showActions = true
}: TeacherConsultationCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.Scheduled:
        return 'border-l-emerald-500 bg-emerald-50';
      case ConsultationStatus.InProgress:
        return 'border-l-blue-500 bg-blue-50';
      case ConsultationStatus.Completed:
        return 'border-l-slate-400 bg-slate-50';
      case ConsultationStatus.Cancelled:
        return 'border-l-rose-500 bg-rose-50';
      default:
        return 'border-l-slate-400 bg-slate-50';
    }
  };

  const getStatusTextColor = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.Scheduled:
        return 'text-emerald-700';
      case ConsultationStatus.InProgress:
        return 'text-blue-700';
      case ConsultationStatus.Completed:
        return 'text-slate-600';
      case ConsultationStatus.Cancelled:
        return 'text-rose-700';
      default:
        return 'text-slate-600';
    }
  };

  const formatTime = (dateString: string) => {
    return parseScheduledDate(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatEndTime = (dateString: string, duration: number) => {
    const start = parseScheduledDate(dateString);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getEnrolledCount = () => {
    if (!consultation.individualStudentId) return 0;
    
    const studentIds = Array.isArray(consultation.individualStudentId) 
      ? consultation.individualStudentId 
      : [consultation.individualStudentId];
    
    return studentIds.filter(id => id && id.trim()).length;
  };

  return (
    <Card 
      className={`group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md cursor-pointer bg-white ${getStatusColor(consultation.status)}`}
      onClick={() => navigate(`/consultations/${consultation.id}`)}
    >
      {/* Тонкая цветная полоса слева, которая расширяется при hover */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-300 ${
        consultation.status === ConsultationStatus.Scheduled ? 'bg-emerald-500' :
        consultation.status === ConsultationStatus.InProgress ? 'bg-blue-500' :
        consultation.status === ConsultationStatus.Completed ? 'bg-slate-400' :
        'bg-rose-500'
      }`} />
      
      <CardContent className="p-4 pl-6">
        <div className="flex items-start justify-between mb-3">
          {/* Left side - Title, Time, Group */}
          <div className="flex-1 space-y-2">
            <h3 className={`text-xl font-bold ${getStatusTextColor(consultation.status)} group-hover:text-opacity-90 transition-colors`}>
              {consultation.title}
            </h3>
            
            <div className="flex items-center gap-3 text-sm">
              <span className={`font-semibold ${getStatusTextColor(consultation.status)}`}>
                {formatTime(consultation.scheduledAt)} - {formatEndTime(consultation.scheduledAt, consultation.duration)}
              </span>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                consultation.status === ConsultationStatus.Scheduled ? 'bg-emerald-100 text-emerald-700' :
                consultation.status === ConsultationStatus.InProgress ? 'bg-blue-100 text-blue-700' :
                consultation.status === ConsultationStatus.Completed ? 'bg-slate-100 text-slate-600' :
                'bg-rose-100 text-rose-700'
              }`}>
                {consultation.duration}m
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-slate-600">
              {consultation.consultationType === ConsultationType.Group ? (
                <div className="flex items-center gap-1.5">
                  <Users2 className="w-4 h-4" />
                  <span className="font-medium">
                    {consultation.groupName || 'Grup'} • {getEnrolledCount()} student{getEnrolledCount() !== 1 ? 'i' : ''}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  <span className="font-medium">Individual</span>
                </div>
              )}
              
              {consultation.price > 0 && (
                <span className="font-semibold text-emerald-600">
                  {(consultation.price * getEnrolledCount()).toFixed(2)} Lei
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - показываются при hover, max-height для плавной анимации */}
        {showActions && (
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${consultation.status === ConsultationStatus.Scheduled ? 'max-h-0 group-hover:max-h-20' : 'max-h-0'}
          `}>
            <div className="pt-3 border-t border-slate-200/50 flex justify-end gap-2 mt-3">
              <Button 
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(consultation.id);
                }}
                className="hover:bg-slate-50"
              >
                Modifică
              </Button>
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStart?.(consultation.id);
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Începe
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(consultation.id);
                }}
              >
                Anulează
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}