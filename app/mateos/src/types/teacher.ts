export enum TeacherStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  SUSPENDED = 'Suspended',
}

export enum EducationLevel {
  ELEMENTARY = 'Elementary',
  MIDDLE_SCHOOL = 'MiddleSchool',
  HIGH_SCHOOL = 'HighSchool',
  UNIVERSITY = 'University',
}

export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  specializations: string[];
  educationLevels: EducationLevel[];
  yearsOfExperience: number;
  hourlyRate: number;
  rating: number;
  totalConsultations: number;
  totalStudents: number;
  status: TeacherStatus;
  certifications?: string[];
  education?: string;
  availability?: TeacherAvailability[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAvailability {
  id: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export interface TeacherApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specializations: string[];
  educationLevels: EducationLevel[];
  yearsOfExperience: number;
  education: string;
  certifications?: string[];
  motivation: string;
  availability: string;
  status: TeacherStatus;
  trackingCode: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherFilters {
  subject?: string;
  educationLevel?: EducationLevel;
  minRating?: number;
  maxHourlyRate?: number;
  availability?: string;
}

