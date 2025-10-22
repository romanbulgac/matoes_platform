// Teacher Application Types - Backend sends camelCase

export interface TeacherApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  qualifications?: string;
  education?: string;
  experience: string;
  specializations: string[];
  preferredAgeGroups?: string[];
  availability?: string;
  motivation?: string;
  teachingMethodology?: string;
  availableHours?: string;
  agreedToBackgroundCheck: boolean;
  agreedToTerms?: boolean;
  agreedToDataProcessing?: boolean;
}

export interface TeacherApplicationResponseDto {
  applicationId: string;
  trackingCode: string;
  message: string;
  submittedAt: string;
}

export interface TeacherApplicationStatusDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  trackingCode: string;
}

export interface TeacherApplicationViewDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  qualifications?: string;
  education?: string;
  experience: string;
  specializations: string[];
  preferredAgeGroups?: string[];
  availability?: string;
  motivation?: string;
  teachingMethodology?: string;
  availableHours?: string;
  agreedToBackgroundCheck: boolean;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  reviewerNotes?: string;
  rejectionReason?: string;
  trackingCode: string;
}

export interface TeacherApplicationApprovalDto {
  applicationId: string;
  adminNotes?: string;
  sendWelcomeEmail: boolean;
}

export interface TeacherApplicationRejectionDto {
  applicationId: string;
  rejectionReason: string;
  adminNotes?: string;
}