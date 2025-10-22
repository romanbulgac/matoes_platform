import { User, UserRole, UserProfile } from '@/types';

// User entity business logic
export class UserEntity {
  constructor(private user: User) {}

  get id(): string {
    return this.user.id;
  }

  get email(): string {
    return this.user.email;
  }

  get fullName(): string {
    return `${this.user.firstname} ${this.user.lastname}`;
  }

  get initials(): string {
    return `${this.user.firstname[0]}${this.user.lastname[0]}`.toUpperCase();
  }

  get role(): UserRole {
    return this.user.role;
  }

  get profile(): UserProfile {
    return this.user.profile;
  }

  isStudent(): boolean {
    return this.user.role === 'Student' || this.user.role === 'student';
  }

  isTeacher(): boolean {
    return this.user.role === 'Teacher' || this.user.role === 'teacher';
  }

  isAdmin(): boolean {
    return this.user.role === 'Administrator' || this.user.role === 'admin';
  }

  isParent(): boolean {
    return this.user.role === 'Parent';
  }

  getRoleLabel(): string {
    switch (this.user.role) {
      case 'Student':
      case 'student':
        return 'Student';
      case 'Teacher':
      case 'teacher':
        return 'Profesor';
      case 'Administrator':
      case 'admin':
        return 'Administrator';
      case 'Parent':
        return 'Părinte';
      default:
        return 'Utilizator';
    }
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getRolePermissions();
    return permissions.includes(permission);
  }

  private getRolePermissions(): string[] {
    switch (this.user.role) {
      case 'Administrator':
      case 'admin':
        return ['read', 'write', 'delete', 'manage_users', 'manage_consultations'];
      case 'Teacher':
      case 'teacher':
        return ['read', 'write', 'create_consultations', 'manage_own_consultations'];
      case 'Student':
      case 'student':
        return ['read', 'book_consultations', 'rate_consultations'];
      case 'Parent':
        return ['read', 'view_child_consultations'];
      default:
        return ['read'];
    }
  }

  canCreateConsultation(): boolean {
    return this.hasPermission('create_consultations');
  }

  canBookConsultation(): boolean {
    return this.hasPermission('book_consultations');
  }

  canManageUsers(): boolean {
    return this.hasPermission('manage_users');
  }

  getAvatarUrl(): string {
    return this.user.profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullName)}&background=3b82f6&color=ffffff`;
  }

  isOnline(): boolean {
    // Business logic for determining if user is online
    // This could be based on lastLoginAt, websocket connection, etc.
    if (!this.user.lastLoginAt) return false;
    
    const lastLogin = new Date(this.user.lastLoginAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastLogin.getTime()) / (1000 * 60);
    
    return diffInMinutes < 30; // Consider online if active in last 30 minutes
  }

  getTimezone(): string {
    return this.user.profile.timezone || 'Europe/Bucharest';
  }

  getPreferredLanguage(): string {
    return this.user.profile.preferences.language || 'ro';
  }

  getThemePreference(): 'light' | 'dark' | 'system' {
    return this.user.profile.preferences.theme || 'system';
  }

  // Static factory methods
  static fromApiResponse(userData: any): UserEntity {
    return new UserEntity(userData);
  }

  static createEmpty(): UserEntity {
    return new UserEntity({
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      role: 'student',
      profile: {
        firstname: '',
        lastname: '',
        timezone: 'Europe/Bucharest',
        preferences: {
          theme: 'system',
          language: 'ro',
          notifications: {
            email: true,
            push: true,
            sms: false,
            consultationReminders: true,
            paymentReminders: true,
          }
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

// Helper hook for using UserEntity
export const useUserEntity = (user: User | null): UserEntity | null => {
  if (!user) return null;
  return new UserEntity(user);
};
