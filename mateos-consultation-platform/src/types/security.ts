/**
 * Security and Session Management Types
 * Defines interfaces for device tracking, session management, and security features
 * 
 * @module types/security
 */

// ==================== DEVICE TRACKING ====================

export interface DeviceInfoDto {
  deviceId: string;
  deviceName: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  platform: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  timeZone: string;
  language: string;
}

// ==================== SESSION MANAGEMENT ====================

export interface SessionDto {
  id: string;
  deviceName?: string;              // Optional, poate fi undefined
  deviceType?: string;              // Optional, poate fi undefined
  browser?: string;                 // Optional, poate fi undefined
  platform?: string;                // Optional, poate fi undefined
  ipAddress?: string;
  location?: string;
  isCurrentSession: boolean;
  isNewDevice: boolean;
  isTrusted: boolean;
  lastActivity?: string;            // Optional, može не повертатися з API
  createdAt: string;
  expiresAt?: string;
}

export interface ActiveSessionDto extends SessionDto {
  deviceId: string;
  userId: string;
}

// ==================== EXTENDED LOGIN/REGISTER RESPONSES ====================

// Import UserDto from api types
import type { UserDto } from './api';

export interface LoginResponseExtended {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: UserDto;
  session: SessionDto;
  expiresIn: number;
}

export interface RegisterResponseExtended extends LoginResponseExtended {
  emailVerificationRequired: boolean;
}

// ==================== SESSION ACTIONS ====================

export interface RevokeSessionDto {
  sessionId: string;
  reason: string;
}

export interface RevokeSessionResponseDto {
  success: boolean;
  message: string;
  revokedSessionId: string;
}

export interface RevokeAllOtherSessionsResponseDto {
  success: boolean;
  message: string;
  revokedCount: number;
}

export interface TrustDeviceDto {
  deviceId: string;
  trustDuration?: number; // in days, default 30
}

// ==================== SECURITY STATISTICS ====================

export interface SecurityStatsDto {
  totalDevices: number;
  trustedDevices: number;
  activeSessions: number;
  recentLoginAttempts: number;
  suspiciousActivities: number;
  lastPasswordChange?: string;
  twoFactorEnabled: boolean;
}

export interface SecurityActivityDto {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'device_trusted' | 'session_revoked' | 'suspicious_activity';
  description: string;
  deviceName: string;
  ipAddress?: string;
  location?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

// ==================== SECURITY NOTIFICATIONS ====================

export interface SecurityNotificationDto {
  id: string;
  type: SecurityAlertType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  deviceName?: string;
  location?: string;
  ipAddress?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

export type SecurityAlertType =
  | 'newDevice'
  | 'newLogin'
  | 'suspiciousActivity'
  | 'sessionRevoked'
  | 'passwordChanged'
  | 'deviceTrusted'
  | 'multipleFailedLogins'
  | 'unusualLocation';

export interface NewDeviceNotificationDto {
  deviceName: string;
  deviceType: string;
  browser: string;
  location?: string;
  ipAddress?: string;
  timestamp: string;
  verificationToken: string;
}

// ==================== DEVICE VERIFICATION ====================

export interface DeviceVerificationDto {
  deviceId: string;
  verificationCode: string;
}

export interface DeviceVerificationResponseDto {
  success: boolean;
  message: string;
  deviceTrusted: boolean;
}

// ==================== SECURITY SETTINGS ====================

export interface SecuritySettingsDto {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  loginAlerts: boolean;
  newDeviceAlerts: boolean;
  suspiciousActivityAlerts: boolean;
  sessionTimeout: number; // in minutes
  requirePasswordChangeEvery: number; // in days, 0 = never
}

// Partial update type for security settings
export type UpdateSecuritySettingsDto = Partial<SecuritySettingsDto>;

// ==================== REQUEST/RESPONSE TYPES ====================

export interface LoginWithDeviceInfoDto {
  email: string;
  password: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  platform: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  timeZone: string;
  language: string;
  rememberDevice?: boolean;
}

export interface RegisterWithDeviceInfoDto extends LoginWithDeviceInfoDto {
  firstname: string;
  lastname: string;
  role: string;
}

// ==================== ADDITIONAL SESSION TYPES ====================

export interface TrustDeviceDto {
  deviceId: string;
  trusted: boolean;
}

export interface SessionRevokedNotificationDto {
  sessionId: string;
  deviceName: string;
  reason?: string;
  revokedBy?: string; // 'user' | 'admin' | 'system'
  timestamp: string;
}

