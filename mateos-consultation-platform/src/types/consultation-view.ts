// Типы для различных видов отображения консультаций

export type ConsultationViewMode = 'inbox' | 'calendar' | 'archive';

export interface ConsultationViewConfig {
  mode: ConsultationViewMode;
  title: string;
  description: string;
  icon: string;
}

export const CONSULTATION_VIEW_CONFIGS: Record<ConsultationViewMode, ConsultationViewConfig> = {
  inbox: {
    mode: 'inbox',
    title: 'Inbox',
    description: 'Consultații viitoare',
    icon: 'inbox'
  },
  calendar: {
    mode: 'calendar',
    title: 'Calendar',
    description: 'Vizualizare calendară',
    icon: 'calendar'
  },
  archive: {
    mode: 'archive',
    title: 'Arhivă',
    description: 'Consultații finalizate',
    icon: 'archive'
  }
};
