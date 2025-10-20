import type {
    ActiveSessionDto,
    SecurityActivityDto,
    SecurityStatsDto,
    TrustDeviceDto
} from '@/types/security';
import { apiClient } from './api';

/**
 * Service for managing user sessions and devices
 * Extends existing API architecture with session-specific endpoints
 */
export class SessionService {
  /**
   * Get all active sessions for current user
   */
  static async getActiveSessions(): Promise<ActiveSessionDto[]> {
    // ApiClient auto-transforms PascalCase → camelCase
    interface ApiActiveSession {
      id: string;
      deviceId: string;
      userId: string;
      deviceName?: string;
      deviceType?: string;
      browser?: string;
      platform?: string;
      ipAddress?: string;
      location?: string;
      isCurrentSession: boolean;
      isNewDevice: boolean;
      isTrusted: boolean;
      lastActivity?: string;
      createdAt: string;
      expiresAt?: string;
    }

    // Response is already camelCase - no manual transform needed
    return await apiClient.get<ActiveSessionDto[]>('/session/active');
  }

  /**
   * Get session history (last 30 days)
   */
  static async getSessionHistory(
    page = 1, 
    pageSize = 20
  ): Promise<{ sessions: ActiveSessionDto[], total: number }> {
    // ApiClient auto-transforms response to camelCase
    return await apiClient.get<{ sessions: ActiveSessionDto[], total: number }>(
      `/session/history?page=${page}&pageSize=${pageSize}`
    );
  }

  /**
   * Revoke a specific session
   */
  static async revokeSession(sessionId: string, reason?: string): Promise<void> {
    const data = { sessionId, reason: reason || 'User requested' };
    return apiClient.post('/session/revoke', data);
  }

  /**
   * Revoke all other sessions except current
   */
  static async revokeAllOtherSessions(): Promise<{ revokedCount: number }> {
    return apiClient.delete('/session/others');
  }

  /**
   * Trust a device
   */
  static async trustDevice(deviceId: string): Promise<void> {
    const data: TrustDeviceDto = { deviceId, trusted: true };
    return apiClient.post('/session/devices/trust', data);
  }

  /**
   * Untrust a device
   */
  static async untrustDevice(deviceId: string): Promise<void> {
    const data: TrustDeviceDto = { deviceId, trusted: false };
    return apiClient.post('/session/devices/trust', data);
  }

  /**
   * Get security statistics
   */
  static async getSecurityStatistics(): Promise<SecurityStatsDto> {
    // Backend returns SessionStatisticsDto with PascalCase
    interface ApiSessionStatistics {
      TotalActiveSessions: number;
      TotalDevices: number;
      TrustedDevices: number;
      NewDevicesThisMonth: number;
      LastLoginTime?: string;
      LastLoginDevice?: string;
      LoginCountThisMonth: number;
      SuspiciousActivityCount: number;
    }

    const stats = await apiClient.get<ApiSessionStatistics>('/session/statistics');
    
    // Transform to camelCase and map to SecurityStatsDto interface
    return {
      totalDevices: stats.TotalDevices,
      trustedDevices: stats.TrustedDevices,
      activeSessions: stats.TotalActiveSessions,
      recentLoginAttempts: stats.LoginCountThisMonth,
      suspiciousActivities: stats.SuspiciousActivityCount,
      lastPasswordChange: undefined, // Not provided by backend yet
      twoFactorEnabled: false // Not provided by backend yet
    };
  }

  /**
   * Get security activity log
   */
  static async getSecurityActivity(
    page = 1,
    pageSize = 20
  ): Promise<{ activities: SecurityActivityDto[], total: number }> {
    // ApiClient auto-transforms PascalCase → camelCase
    interface UserSessionResponse {
      id: string;
      deviceName?: string;
      deviceType?: string;
      browser?: string;
      platform?: string;
      ipAddress?: string;
      location?: string;
      loginTime: string;
      logoutTime?: string;
      lastActivityTime?: string;
      isActive: boolean;
      isCurrentSession: boolean;
      isNewDevice: boolean;
      isTrusted: boolean;
    }

    const response = await apiClient.get<{ activities: UserSessionResponse[], total: number }>(
      `/session/activity?page=${page}&pageSize=${pageSize}`
    );
    
    // Transform UserSession data to SecurityActivity format
    const activities: SecurityActivityDto[] = response.activities.map(session => {
      // Determine activity type based on session state
      let type: SecurityActivityDto['type'] = 'login';
      let description = '';
      
      if (session.logoutTime) {
        type = 'logout';
        description = `Sesiune închisă pe ${session.deviceName || 'dispozitiv necunoscut'}`;
      } else if (!session.isActive) {
        type = 'session_revoked';
        description = `Sesiune revocată pe ${session.deviceName || 'dispozitiv necunoscut'}`;
      } else {
        type = 'login';
        description = `Autentificare pe ${session.deviceName || 'dispozitiv necunoscut'}`;
      }
      
      return {
        id: session.id,
        type,
        description,
        deviceName: session.deviceName || 'Dispozitiv necunoscut',
        ipAddress: session.ipAddress,
        location: session.location,
        timestamp: session.loginTime,
        severity: session.isNewDevice ? 'warning' : 'info'
      };
    });
    
    return {
      activities,
      total: response.total
    };
  }

  /**
   * Get device info by ID
   */
  static async getDeviceInfo(deviceId: string): Promise<ActiveSessionDto> {
    // ApiClient auto-transforms response to camelCase
    return await apiClient.get<ActiveSessionDto>(`/session/devices/${deviceId}`);
  }
}
