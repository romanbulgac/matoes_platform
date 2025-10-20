/**
 * Nivele de matematică ale studentului
 */
export enum StudentLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

/**
 * DTO simplificat pentru student (pentru utilizarea în grupuri și liste)
 */
export interface StudentDto {
  id: string;
  /** Numele studentului */
  name: string;
  /** Numele de familie al studentului */
  surname: string;
  /** Email-ul studentului */
  email: string;
  /** Clasa studentului (de exemplu, "8", "9", "10") */
  class: string;
  /** Nivelul de matematică */
  mathLevel: StudentLevel;
  /** Statusul studentului */
  status: string;
  /** ID-ul grupului (dacă studentul este în grup) */
  groupId?: string;
  /** Numele grupului */
  groupName?: string;
  /** ID-ul părintelui */
  parentId?: string;
  /** Numele complet pentru afișare */
  fullName: string;
  /** Procentul de consultații la care a participat (0-100) */
  attendancePercentage?: number;
  /** Nota medie de la profesori (0-5) */
  averageRating?: number;
  /** Numărul total de consultații */
  totalConsultations?: number;
  /** Numărul de consultații la care a participat */
  attendedConsultations?: number;
}