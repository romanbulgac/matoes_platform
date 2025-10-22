import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ConsultationViewMode } from '@/types/consultation-view';
import { Archive, Calendar, Inbox } from 'lucide-react';
import { FC } from 'react';

interface ConsultationViewSelectorProps {
  currentView: ConsultationViewMode;
  onViewChange: (view: ConsultationViewMode) => void;
  className?: string;
}

export const ConsultationViewSelector: FC<ConsultationViewSelectorProps> = ({
  currentView,
  onViewChange,
  className
}) => {
  return (
    <Tabs 
      value={currentView} 
      onValueChange={(value) => onViewChange(value as ConsultationViewMode)}
      className={cn("w-full", className)}
    >
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger 
          value="inbox" 
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Inbox className="h-4 w-4" />
          <span className="hidden sm:inline">Inbox</span>
        </TabsTrigger>
        <TabsTrigger 
          value="calendar"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </TabsTrigger>
        <TabsTrigger 
          value="archive"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Archive className="h-4 w-4" />
          <span className="hidden sm:inline">Arhivă</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
