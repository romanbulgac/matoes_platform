export enum NotificationType {
  CONSULTATION_REMINDER = 'ConsultationReminder',
  CONSULTATION_CANCELLED = 'ConsultationCancelled',
  CONSULTATION_REPORT = 'ConsultationReport',
  SUBSCRIPTION_EXPIRING = 'SubscriptionExpiring',
  SUBSCRIPTION_RENEWED = 'SubscriptionRenewed',
  INVITATION_ACCEPTED = 'InvitationAccepted',
  TEACHER_APPLICATION_STATUS = 'TeacherApplicationStatus',
  SYSTEM_ALERT = 'SystemAlert',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

