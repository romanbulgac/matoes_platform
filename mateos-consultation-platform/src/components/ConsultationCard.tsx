import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationDto, ConsultationStatus, ConsultationType } from '@/types/api';
import {
  Users2,
  Video
} from 'lucide-react';

interface ConsultationCardProps {
  consultation: ConsultationDto;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function ConsultationCard({ 
  consultation, 
  onJoin, 
  onLeave, 
  onEdit, 
  onStart,
  onCancel,
  showActions = true 
}: ConsultationCardProps) {
  const { user } = useAuth();

  const canJoinConsultation = () => {
    return consultation.status === ConsultationStatus.Scheduled;
  };

  const isUserEnrolled = () => {
    if (!consultation.individualStudentId || !user?.id) return false;
    
    // Ensure individualStudentId is an array
    const studentIds = Array.isArray(consultation.individualStudentId)
      ? consultation.individualStudentId
      : [consultation.individualStudentId];
    
    return studentIds.includes(user.id);
  };

  const handleActionClick = () => {
    if (isUserEnrolled()) {
      onLeave?.(consultation.id);
    } else {
      onJoin?.(consultation.id);
    }
  };

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
    return new Date(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatEndTime = (dateString: string, duration: number) => {
    const start = new Date(dateString);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-200 border-0 border-l-4 shadow-sm cursor-pointer ${getStatusColor(consultation.status)}`}
      onClick={() => onEdit?.(consultation.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Left side - Title and Time */}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-1 ${getStatusTextColor(consultation.status)}`}>
              {consultation.title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${getStatusTextColor(consultation.status)}`}>
                {formatTime(consultation.scheduledAt)} - {formatEndTime(consultation.scheduledAt, consultation.duration)}
              </span>
            </div>
            
            {consultation.teacherName && (
              <p className="text-sm text-slate-600 mt-2">
                {consultation.teacherName}
              </p>
            )}
          </div>

          {/* Right side - Duration */}
          <div className={`text-right ${getStatusTextColor(consultation.status)}`}>
            <span className="text-lg font-semibold">
              {consultation.duration}m
            </span>
          </div>
        </div>

        {/* Additional Info (optional, shown on hover or for certain roles) */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              {consultation.consultationType === ConsultationType.Group ? (
                <div className="flex items-center gap-1">
                  <Users2 className="w-4 h-4" />
                  <span>Grup</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>Individual</span>
                </div>
              )}
              
              {consultation.price > 0 && (
                <span className="font-medium">{consultation.price} Lei</span>
              )}
            </div>

            <div className="flex space-x-2">
              {user?.role === 'Student' && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick();
                  }}
                  disabled={!canJoinConsultation() && !isUserEnrolled()}
                  size="sm"
                  className={
                    isUserEnrolled() 
                      ? 'bg-rose-600 hover:bg-rose-700' 
                      : !canJoinConsultation()
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                  }
                >
                  {isUserEnrolled() ? 'Părăsește' : 'Înscrie-te'}
                </Button>
              )}
              
              {user?.role === 'Teacher' && consultation.teacherId === user.id && (
                <>
                  {consultation.status === ConsultationStatus.Scheduled && (
                    <>
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
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel?.(consultation.id);
                        }}
                      >
                        Anulează
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}