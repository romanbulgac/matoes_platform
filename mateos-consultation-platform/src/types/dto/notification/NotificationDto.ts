/**
 * DTO pentru notificări
 */
export interface NotificationDto {
  id: string;
  /** Titlul notificării */
  title: string;
  /** Mesajul notificării */
  message: string;
  /** Dacă notificarea a fost citită */
  isRead: boolean;
  /** Data trimiterii */
  sentAt: string;
  /** ID-ul utilizatorului */
  userId: string;
  /** Numele utilizatorului */
  userName?: string;
  /** Tipul notificării */
  type: string;
  /** ID-ul consultației (opțional) */
  consultationId?: string;
  /** Link-ul opțional */
  link?: string;
  /** Data creării */
  createdAt: string;
}