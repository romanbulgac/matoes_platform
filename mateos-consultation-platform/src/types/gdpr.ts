// GDPR Related Types - Backend sends camelCase

export interface ConsentDto {
  id: string;
  userId: string;
  purposeId: string;
  purposeName: string;
  purposeDescription: string;
  consentType: string;
  isGranted: boolean;
  consentDate?: string;
  withdrawnDate?: string;
  expiresAt?: string;
  isRequired: boolean;
}

export interface ConsentHistoryDto {
  id: string;
  consentId: string;
  consentType: string;
  action: 'Granted' | 'Withdrawn' | 'Updated';
  performedAt: string;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

export interface DataPurposeDto {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  legalBasis: string;
  retentionPeriodDays: number;
  dataTypes: string[];
  isActive: boolean;
}

export interface DeletionRequestDto {
  reason: string;
  confirmEmail: string;
}

export interface DeletionStatusDto {
  id: string;
  userId: string;
  status: 'Pending' | 'Approved' | 'InProgress' | 'Completed' | 'Rejected';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
  adminNotes?: string;
}

export interface DataProcessingInfoDto {
  dataController: string;
  dpoEmail: string;
  processingPurposes: DataProcessingPurpose[];
  retentionPeriods: RetentionPeriod[];
  thirdParties: ThirdPartyService[];
  userRights: UserRight[];
  lastUpdated: string;
}

export interface DataProcessingPurpose {
  name: string;
  description: string;
  legalBasis: string;
  dataTypes: string[];
}

export interface RetentionPeriod {
  dataType: string;
  period: string;
  reason: string;
}

export interface ThirdPartyService {
  name: string;
  purpose: string;
  dataShared: string[];
  location: string;
}

export interface UserRight {
  right: string;
  description: string;
  howToExercise: string;
}

// DTO pentru actualizare consimțământ
export interface UpdateConsentDto {
  purposeId: string;
  isConsented: boolean;
}

// DTO pentru creare consimțământ
export interface CreateConsentDto {
  userId: string;
  purposeId: string;
  isConsented: boolean;
}