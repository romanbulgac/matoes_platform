/**
 * Security Configuration
 * Centralized security settings for the application
 * 
 * @module config/security
 */

export const SECURITY_CONFIG = {
  /**
   * Device fingerprint cache timeout (24 hours)
   * After this period, a new fingerprint will be generated
   */
  deviceFingerprintTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  /**
   * Session activity ping interval (30 seconds)
   * How often to ping server to keep session alive
   */
  sessionActivityInterval: 30 * 1000, // 30 seconds

  /**
   * Token refresh threshold (5 minutes before expiry)
   * When to automatically refresh the access token
   */
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes

  /**
   * Maximum number of active sessions per user
   */
  maxActiveSessions: 5,

  /**
   * Default trust duration for devices (30 days)
   */
  defaultTrustDuration: 30 * 24 * 60 * 60 * 1000, // 30 days

  /**
   * Session timeout in minutes (default: 30 minutes of inactivity)
   */
  sessionTimeout: 30,

  /**
   * Maximum login attempts before temporary lockout
   */
  maxLoginAttempts: 5,

  /**
   * Lockout duration after max failed attempts (15 minutes)
   */
  lockoutDuration: 15 * 60 * 1000, // 15 minutes

  /**
   * Password requirements
   */
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  /**
   * Feature flags
   */
  features: {
    deviceTracking: true,
    sessionManagement: true,
    securityNotifications: true,
    twoFactorAuth: false, // Coming soon
    biometricAuth: false, // Coming soon
    geoLocationTracking: false, // Coming soon
  },
} as const;

/**
 * Security event types for logging and monitoring
 */
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  NEW_DEVICE: 'new_device',
  DEVICE_TRUSTED: 'device_trusted',
  SESSION_REVOKED: 'session_revoked',
  PASSWORD_CHANGED: 'password_changed',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  TOKEN_REFRESHED: 'token_refreshed',
  TOKEN_EXPIRED: 'token_expired',
} as const;

export type SecurityEventType = typeof SECURITY_EVENTS[keyof typeof SECURITY_EVENTS];
