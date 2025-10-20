// Admin Service - pentru gestionarea tuturor funcțiilor administrative
import type { PagedResult, PaginationDto } from './api';
import { apiClient } from './api';

export type { PagedResult, PaginationDto } from './api';

// ==================== TYPES ====================

// User Management Types
export interface UserDto {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'Student' | 'Teacher' | 'Parent' | 'Administrator' | 'Admin';
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: 'Student' | 'Teacher' | 'Parent' | 'Administrator' | 'Admin';
  phoneNumber?: string;
}

export interface UpdateUserDto {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

// Group Management Types
export interface GroupDto {
  id: string;
  name: string;
  studentClass: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  createdAt: string;
}

export interface CreateGroupDto {
  name?: string;
  studentClass: string;
  teacherId?: string;
}

// Teacher Application Types
export interface TeacherApplicationDto {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface TeacherApplicationActionDto {
  applicationId: string;
  action: 'approve' | 'reject';
  notes?: string;
}

// Statistics Types
export interface AdminStatistics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalGroups: number;
  totalConsultations: number;
  activeSubscriptions: number;
  revenue: number;
  pendingApplications: number;
  pendingRegistrations: number;
}

// Backend StudentRegistrationViewDto - matches backend structure
export interface StudentRegistrationDto {
  id: string;
  parentName: string;
  childName: string;
  childClass: string;
  mathLevel: string;
  parentPhone: string;
  parentEmail: string;
  status: 0 | 1 | 2 | 3 | 4; // New=0, Contacted=1, ConsultationScheduled=2, Enrolled=3, Cancelled=4
  priority: 1 | 2 | 3; // High=1, Medium=2, Low=3
  source: string;
  createdTime: string;
  contactedAt?: string;
  contactedByName?: string;
  notes?: string;
  ipAddress?: string;
}

// Contact Request Types
export interface ContactRequestDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'New' | 'InProgress' | 'Completed';  // Backend использует Completed вместо Resolved/Closed
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface SubscriptionDto {
  id: string;
  parentId: string;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface SubscriptionStatsDto {
  totalActive: number;
  totalExpired: number;
  totalRevenue: number;
}

// ==================== SERVICE ====================

class AdminService {
  private api = apiClient;

  // ==================== USER MANAGEMENT ====================
  
  async getAllUsers(pagination?: PaginationDto): Promise<PagedResult<UserDto>> {
    if (pagination) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      if (pagination.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) queryParams.append('sortOrder', pagination.sortOrder);
      return this.api.get<PagedResult<UserDto>>(`/Users/paged?${queryParams.toString()}`);
    }
    const users = await this.api.get<UserDto[]>('/Users');
    return {
      items: users,
      totalCount: users.length,
      page: 1,
      pageSize: users.length,
      totalPages: 1
    };
  }

  async getUserById(userId: string): Promise<UserDto> {
    return this.api.get<UserDto>(`/Users/${userId}`);
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserDto> {
    return this.api.put<UserDto>(`/Users/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.api.delete(`/Users/${userId}`);
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<UserDto> {
    return this.api.patch<UserDto>(`/Users/${userId}/status`, { isActive });
  }

  // Filter users by role
  async getUsersByRole(role: string, pagination?: PaginationDto): Promise<PagedResult<UserDto>> {
    const queryParams = new URLSearchParams();
    if (pagination?.page) queryParams.append('page', pagination.page.toString());
    if (pagination?.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
    queryParams.append('role', role);
    return this.api.get<PagedResult<UserDto>>(`/Users/paged?${queryParams.toString()}`);
  }

  // ==================== GROUP MANAGEMENT ====================
  
  async getAllGroups(): Promise<GroupDto[]> {
    return this.api.get<GroupDto[]>('/Groups');
  }

  async getGroupById(groupId: string): Promise<GroupDto> {
    return this.api.get<GroupDto>(`/Groups/${groupId}`);
  }

  async createGroup(data: CreateGroupDto): Promise<GroupDto> {
    return this.api.post<GroupDto>('/Groups', data);
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.api.delete(`/Groups/${groupId}`);
  }

  async addStudentToGroup(groupId: string, studentId: string): Promise<void> {
    await this.api.post(`/Groups/${groupId}/students/${studentId}`, {});
  }

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
    await this.api.delete(`/Groups/${groupId}/students/${studentId}`);
  }

  async generateGroupName(studentClass: string): Promise<string> {
    const response = await this.api.get<{ groupName: string }>(
      `/Groups/generate-name/${studentClass}`
    );
    return response.groupName;
  }

  async getGroupsByClass(studentClass: string): Promise<GroupDto[]> {
    return this.api.get<GroupDto[]>(`/Groups/class/${studentClass}`);
  }

  // ==================== TEACHER APPLICATIONS ====================
  
  async getAllTeacherApplications(pagination?: PaginationDto): Promise<PagedResult<TeacherApplicationDto>> {
    if (pagination) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      if (pagination.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
      return this.api.get<PagedResult<TeacherApplicationDto>>(
        `/teacher-applications/paged?${queryParams.toString()}`
      );
    }
    const applications = await this.api.get<TeacherApplicationDto[]>('/teacher-applications/all');
    return {
      items: applications,
      totalCount: applications.length,
      page: 1,
      pageSize: applications.length,
      totalPages: 1
    };
  }

  async getTeacherApplication(applicationId: string): Promise<TeacherApplicationDto> {
    return this.api.get<TeacherApplicationDto>(`/teacher-applications/${applicationId}`);
  }

  // Backend expects plain string body, not { notes: string }
  async approveTeacherApplication(applicationId: string, notes?: string): Promise<void> {
    await this.api.post(`/teacher-applications/${applicationId}/approve`, notes || null);
  }

  async rejectTeacherApplication(applicationId: string, notes?: string): Promise<void> {
    if (!notes) {
      throw new Error('Notes are required for rejecting teacher applications');
    }
    await this.api.post(`/teacher-applications/${applicationId}/reject`, notes);
  }

  async getPendingTeacherApplications(): Promise<TeacherApplicationDto[]> {
    return this.api.get<TeacherApplicationDto[]>('/teacher-applications/pending');
  }

  // ==================== STUDENT REGISTRATIONS ====================
  
  async getAllStudentRegistrations(pagination?: PaginationDto): Promise<PagedResult<StudentRegistrationDto>> {
    if (pagination) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      if (pagination.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
      return this.api.get<PagedResult<StudentRegistrationDto>>(
        `/student-registration/paged?${queryParams.toString()}`
      );
    }
    const registrations = await this.api.get<StudentRegistrationDto[]>('/student-registration/all');
    return {
      items: registrations,
      totalCount: registrations.length,
      page: 1,
      pageSize: registrations.length,
      totalPages: 1
    };
  }

  // Backend uses /StudentRegistration with capital S and admin prefix
  async getStudentRegistration(registrationId: string): Promise<StudentRegistrationDto> {
    return this.api.get<StudentRegistrationDto>(`/StudentRegistration/admin/${registrationId}`);
  }

  // Backend uses status-based workflow via PUT /admin/{id}/status
  // Contacted (1) = approved, Cancelled (4) = rejected
  async approveStudentRegistration(registrationId: string, notes?: string): Promise<void> {
    await this.api.put(`/StudentRegistration/admin/${registrationId}/status`, { 
      status: 1, // Contacted
      notes 
    });
  }

  async rejectStudentRegistration(registrationId: string, notes?: string): Promise<void> {
    await this.api.put(`/StudentRegistration/admin/${registrationId}/status`, { 
      status: 4, // Cancelled
      notes 
    });
  }

  // Backend uses /admin/all with status filter, not separate /pending endpoint
  async getPendingStudentRegistrations(): Promise<StudentRegistrationDto[]> {
    const result = await this.api.get<PagedResult<StudentRegistrationDto>>(
      '/StudentRegistration/admin/all?status=0' // New status
    );
    return result.items || [];
  }

  // ==================== CONTACT REQUESTS ====================
  
  async getAllContactRequests(pagination?: PaginationDto): Promise<PagedResult<ContactRequestDto>> {
    if (pagination) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      if (pagination.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
      return this.api.get<PagedResult<ContactRequestDto>>(
        `/contact/paged?${queryParams.toString()}`
      );
    }
    const requests = await this.api.get<ContactRequestDto[]>('/contact/all');
    return {
      items: requests,
      totalCount: requests.length,
      page: 1,
      pageSize: requests.length,
      totalPages: 1
    };
  }

  async getContactRequest(requestId: string): Promise<ContactRequestDto> {
    return this.api.get<ContactRequestDto>(`/contact/${requestId}`);
  }

  async updateContactRequestStatus(
    requestId: string, 
    status: 'New' | 'InProgress' | 'Completed',
    _adminNotes?: string
  ): Promise<void> {
    // Backend использует PUT, не PATCH и принимает только status
    await this.api.put(`/contact/${requestId}/status`, status);
  }

  async respondToContactRequest(requestId: string, response: string): Promise<void> {
    await this.api.post(`/contact/${requestId}/respond`, { 
      responseNotes: response,
      status: 'Completed',  // Backend enum: Completed вместо Resolved
      sendEmailResponse: true
    });
  }

  // ==================== STATISTICS ====================
  
  async getAdminStatistics(): Promise<AdminStatistics> {
    // Această metodă combină datele din multiple endpoint-uri
    const [users, groups, pendingApps, pendingRegs] = await Promise.all([
      this.getAllUsers(),
      this.getAllGroups(),
      this.getPendingTeacherApplications(),
      this.getPendingStudentRegistrations()
    ]);

    const students = users.items.filter(u => u.role === 'Student').length;
    const teachers = users.items.filter(u => u.role === 'Teacher').length;
    const parents = users.items.filter(u => u.role === 'Parent').length;

    return {
      totalUsers: users.totalCount,
      totalStudents: students,
      totalTeachers: teachers,
      totalParents: parents,
      totalGroups: groups.length,
      totalConsultations: 0, // TODO: add endpoint
      activeSubscriptions: 0, // TODO: add endpoint
      revenue: 0, // TODO: add endpoint
      pendingApplications: pendingApps.length,
      pendingRegistrations: pendingRegs.length
    };
  }

  async getTeacherRating(teacherId: string, strategy: string = 'simple'): Promise<number> {
    return this.api.get<number>(`/Statistics/teacher-rating/${teacherId}?strategy=${strategy}`);
  }

  async getCompletedConsultationsCount(): Promise<number> {
    return this.api.get<number>('/Statistics/completed-consultations');
  }

  async getTeacherPopularity(): Promise<Record<string, number>> {
    return this.api.get<Record<string, number>>('/Statistics/teacher-popularity');
  }

  // ==================== SUBSCRIPTIONS ====================
  
  async getAllSubscriptions(pagination?: PaginationDto): Promise<PagedResult<SubscriptionDto>> {
    if (pagination) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      if (pagination.pageSize) queryParams.append('pageSize', pagination.pageSize.toString());
      return this.api.get<PagedResult<SubscriptionDto>>(`/admin-subscriptions/all?${queryParams.toString()}`);
    }
    const subscriptions = await this.api.get<SubscriptionDto[]>('/admin-subscriptions/all');
    return {
      items: subscriptions,
      totalCount: subscriptions.length,
      page: 1,
      pageSize: subscriptions.length,
      totalPages: 1
    };
  }

  async getSubscriptionStats(): Promise<SubscriptionStatsDto> {
    return this.api.get<SubscriptionStatsDto>('/admin-subscriptions/stats');
  }
}

export const adminService = new AdminService();
