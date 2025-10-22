/**
 * DTO pentru profesori
 */
export interface TeacherDto {
  id: string;
  /** Numele profesorului */
  name: string;
  /** Numele de familie */
  surname: string;
  /** Email-ul */
  email: string;
  /** Materia predată */
  subject: string;
  /** Departamentul */
  department: string;
  /** Ani de experiență */
  yearsOfExperience: number;
  /** Data angajării */
  hireDate: string;
  /** Numărul de telefon */
  phoneNumber?: string;
  /** Imaginea de profil */
  profilePicture?: string;
  /** Dacă este activ */
  isActive: boolean;
  /** Numele complet pentru afișare */
  fullName: string;
}

/**
 * DTO pentru disponibilitatea profesorilor
 */
export interface TeacherAvailabilityDto {
  id: string;
  /** ID-ul profesorului */
  teacherId: string;
  /** Ziua săptămânii (0-6, Duminică = 0) */
  dayOfWeek: number;
  /** Ora de început (format HH:mm) */
  startTime: string;
  /** Ora de sfârșit (format HH:mm) */
  endTime: string;
  /** Dacă este disponibil */
  isAvailable: boolean;
}