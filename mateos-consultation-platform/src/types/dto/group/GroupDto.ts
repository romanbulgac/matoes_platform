import { ConsultationDto } from '../consultation';
import { StudentDto } from '../student';

/**
 * Tipul grupului - Small (3 persoane) sau Large (6 persoane)
 */
export enum GroupType {
  Small = 3,
  Large = 6
}

/**
 * Label-uri pentru afișare
 */
export const GroupTypeLabels: Record<GroupType, string> = {
  [GroupType.Small]: 'Grup Mic (3 persoane)',
  [GroupType.Large]: 'Grup Mare (6 persoane)'
};

/**
 * DTO pentru grupurile de studenți
 */
export interface GroupDto {
  id: string;
  /** Numele grupului */
  name: string;
  /** ID-ul profesorului grupului */
  teacherId?: string;
  /** Numele profesorului grupului */
  teacherName?: string;
  /** Tipul grupului (Small = 3, Large = 6) */
  groupType: GroupType;
  /** Capacitatea maximă a grupului */
  maxCapacity: number;
  /** Lista studenților din grup */
  members: StudentDto[];
  /** Lista consultațiilor grupului */
  consultations: ConsultationDto[];
  /** Data creării grupului */
  createdAt: string;
  /** Data ultimei actualizări */
  updatedAt?: string;
  /** Numărul de studenți din grup */
  memberCount: number;
  /** Locuri disponibile în grup */
  availableSlots: number;
  /** Dacă grupul este plin */
  isFull: boolean;
  /** Dacă grupul este activ */
  isActive: boolean;
}