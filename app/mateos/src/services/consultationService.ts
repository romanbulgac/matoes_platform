import { api } from './apiClient';
import { Consultation, CreateConsultationData, ConsultationFilters, ConsultationReport } from '@/types';

export const consultationService = {
  // Get all consultations
  getAll: async (filters?: ConsultationFilters): Promise<Consultation[]> => {
    const response = await api.get<Consultation[]>('/consultations', { params: filters });
    return response.data;
  },

  // Get upcoming consultations
  getUpcoming: async (): Promise<Consultation[]> => {
    const response = await api.get<Consultation[]>('/consultations/upcoming');
    return response.data;
  },

  // Get consultation by ID
  getById: async (id: string): Promise<Consultation> => {
    const response = await api.get<Consultation>(`/consultations/${id}`);
    return response.data;
  },

  // Create consultation
  create: async (data: CreateConsultationData): Promise<Consultation> => {
    const response = await api.post<Consultation>('/consultations', data);
    return response.data;
  },

  // Update consultation
  update: async (id: string, data: Partial<CreateConsultationData>): Promise<Consultation> => {
    const response = await api.put<Consultation>(`/consultations/${id}`, data);
    return response.data;
  },

  // Delete consultation
  delete: async (id: string): Promise<void> => {
    await api.delete(`/consultations/${id}`);
  },

  // Get consultations by student
  getByStudentId: async (studentId: string): Promise<Consultation[]> => {
    const response = await api.get<Consultation[]>(`/consultations/student/${studentId}`);
    return response.data;
  },

  // Get consultations by teacher
  getByTeacherId: async (teacherId: string): Promise<Consultation[]> => {
    const response = await api.get<Consultation[]>(`/consultations/teacher/${teacherId}`);
    return response.data;
  },

  // Get consultations by group
  getByGroupId: async (groupId: string): Promise<Consultation[]> => {
    const response = await api.get<Consultation[]>(`/consultations/group/${groupId}`);
    return response.data;
  },

  // Mark attendance
  markAttendance: async (id: string, attended: boolean): Promise<void> => {
    await api.post(`/consultations/${id}/attendance`, { attended });
  },

  // Submit report
  submitReport: async (id: string, report: Omit<ConsultationReport, 'id' | 'consultationId' | 'createdAt'>): Promise<ConsultationReport> => {
    const response = await api.post<ConsultationReport>(`/consultations/${id}/report`, report);
    return response.data;
  },
};

