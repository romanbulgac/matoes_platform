import { api } from './apiClient';
import { Teacher, TeacherApplication, TeacherFilters, TeacherAvailability } from '@/types';

export const teacherService = {
  // Get all teachers
  getTeachers: async (filters?: TeacherFilters): Promise<Teacher[]> => {
    const response = await api.get<Teacher[]>('/teachers', { params: filters });
    return response.data;
  },

  // Get teacher by ID
  getTeacherById: async (id: string): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}`);
    return response.data;
  },

  // Get teacher profile
  getTeacherProfile: async (id: string): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}/profile`);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<Teacher>): Promise<Teacher> => {
    const response = await api.put<Teacher>('/teachers/profile', data);
    return response.data;
  },

  // Set availability
  setAvailability: async (availability: Omit<TeacherAvailability, 'id' | 'teacherId'>[]): Promise<TeacherAvailability[]> => {
    const response = await api.post<TeacherAvailability[]>('/teachers/availability', { availability });
    return response.data;
  },

  // Get availability
  getAvailability: async (teacherId: string): Promise<TeacherAvailability[]> => {
    const response = await api.get<TeacherAvailability[]>(`/teachers/${teacherId}/availability`);
    return response.data;
  },

  // Submit application
  submitApplication: async (data: Omit<TeacherApplication, 'id' | 'status' | 'trackingCode' | 'createdAt' | 'updatedAt'>): Promise<TeacherApplication> => {
    const response = await api.post<TeacherApplication>('/teachers/apply', data);
    return response.data;
  },

  // Track application
  trackApplication: async (trackingCode: string): Promise<TeacherApplication> => {
    const response = await api.get<TeacherApplication>(`/teachers/applications/track/${trackingCode}`);
    return response.data;
  },

  // Get all applications (Admin)
  getAllApplications: async (): Promise<TeacherApplication[]> => {
    const response = await api.get<TeacherApplication[]>('/teachers/applications');
    return response.data;
  },

  // Approve application (Admin)
  approveApplication: async (id: string): Promise<void> => {
    await api.post(`/teachers/applications/${id}/approve`);
  },

  // Reject application (Admin)
  rejectApplication: async (id: string, reason: string): Promise<void> => {
    await api.post(`/teachers/applications/${id}/reject`, { reason });
  },
};

