export enum UserRole {
  PARENT = 'Parent',
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  gdprConsent: boolean;
  termsConsent: boolean;
}

