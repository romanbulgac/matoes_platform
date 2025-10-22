export enum GroupStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived',
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  gradeLevel: string;
  maxMembers: number;
  currentMembers: number;
  members: GroupMember[];
  schedule?: GroupSchedule[];
  status: GroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl?: string;
  joinedAt: string;
}

export interface GroupSchedule {
  id: string;
  groupId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  subject: string;
  gradeLevel: string;
  maxMembers: number;
  memberIds?: string[];
}

export interface GroupFilters {
  teacherId?: string;
  subject?: string;
  gradeLevel?: string;
  status?: GroupStatus;
}

