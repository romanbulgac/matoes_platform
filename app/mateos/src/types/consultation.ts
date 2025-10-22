export enum ConsultationType {
  INDIVIDUAL = 'Individual',
  GROUP = 'Group',
}

export enum ConsultationStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'NoShow',
}

export interface Consultation {
  id: string;
  title: string;
  description?: string;
  type: ConsultationType;
  status: ConsultationStatus;
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl?: string;
  studentId?: string;
  studentName?: string;
  groupId?: string;
  groupName?: string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number;
  meetingLink?: string;
  notes?: string;
  materials?: string[];
  homeworkAssigned?: string;
  report?: ConsultationReport;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationReport {
  id: string;
  consultationId: string;
  teacherId: string;
  studentPerformance: number;
  topicsCovered: string[];
  homeworkAssigned?: string;
  nextSessionTopics?: string[];
  teacherNotes: string;
  attendance: boolean;
  createdAt: string;
}

export interface CreateConsultationData {
  title: string;
  description?: string;
  type: ConsultationType;
  teacherId: string;
  studentId?: string;
  groupId?: string;
  subject: string;
  startTime: string;
  duration: number;
  notes?: string;
}

export interface ConsultationFilters {
  status?: ConsultationStatus;
  type?: ConsultationType;
  teacherId?: string;
  studentId?: string;
  groupId?: string;
  startDate?: string;
  endDate?: string;
}

