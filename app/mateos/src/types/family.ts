export enum InvitationStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  EXPIRED = 'Expired',
  REVOKED = 'Revoked',
}

export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gradeLevel: string;
  avatarUrl?: string;
  hasActiveSubscription: boolean;
  gdprConsentGranted: boolean;
  gdprConsentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildInvitation {
  id: string;
  parentId: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gradeLevel: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface CreateInvitationData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gradeLevel: string;
}

export interface AcceptInvitationData {
  token: string;
  password: string;
  confirmPassword: string;
  gdprConsent: boolean;
  termsConsent: boolean;
}

export interface ConsentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface UserConsent {
  id: string;
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
}

