import { MaterialDto } from '../material/MaterialDto';

/**
 * Tipurile consultațiilor
 */
export enum ConsultationType {
  Individual = 0,
  Group = 1,
  Subscription = 2
}

/**
 * Statusurile consultațiilor
 */
export enum ConsultationStatus {
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

/**
 * DTO pentru consultații
 */
export interface ConsultationDto {
  id: string;
  /** Titlul consultației */
  title: string;
  /** Subiectul consultației */
  topic: string;
  /** Descrierea detaliată */
  description: string;
  /** Data și ora programată */
  scheduledAt: string;
  /** Starea consultației */
  status: ConsultationStatus;
  /** Link-ul pentru consultația online */
  link: string;
  /** Prețul consultației în RON */
  price: number;
  /** ID-ul profesorului */
  teacherId: string;
  /** Numele profesorului */
  teacherName: string;
  /** ID-ul studentului (opțional) */
  studentId?: string[];
  /** Tipul consultației */
  consultationType: ConsultationType;
  /** ID-ul grupului (pentru consultații de grup) */
  groupId?: string;
  /** Numele grupului */
  groupName?: string;
  /** ID-ul studentului individual */
  individualStudentId?: string;
  /** Materialele asociate */
  materials: MaterialDto[];
  /** Data creării */
  createdAt: string;
  /** Data ultimei actualizări */
  updatedAt?: string;
  /** Durata în minute */
  duration: number;
}