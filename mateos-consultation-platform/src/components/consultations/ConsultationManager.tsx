import { cn } from '@/lib/utils';
import { ConsultationDto } from '@/types/api';
import { ConsultationViewMode } from '@/types/consultation-view';
import { FC, useState } from 'react';
import { ArchiveView } from './ArchiveView';
import { ConsultationViewSelector } from './ConsultationViewSelector';
import { GoogleStyleCalendarView } from './GoogleStyleCalendarView';
import { InboxView } from './InboxView';

interface ConsultationManagerProps {
  consultations: ConsultationDto[];
  onEdit?: (id: string) => void;
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  defaultView?: ConsultationViewMode;
  className?: string;
}

export const ConsultationManager: FC<ConsultationManagerProps> = ({
  consultations,
  onEdit,
  onStart,
  onCancel,
  defaultView = 'inbox',
  className
}) => {
  const [currentView, setCurrentView] = useState<ConsultationViewMode>(defaultView);

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return (
          <InboxView
            consultations={consultations}
            onEdit={onEdit}
            onStart={onStart}
            onCancel={onCancel}
          />
        );
      case 'calendar':
        return (
          <GoogleStyleCalendarView
            consultations={consultations}
            onEdit={onEdit}
          />
        );
      case 'archive':
        return (
          <ArchiveView
            consultations={consultations}
            onEdit={onEdit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ConsultationViewSelector
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="animate-in fade-in-50 duration-200">
        {renderView()}
      </div>
    </div>
  );
};
