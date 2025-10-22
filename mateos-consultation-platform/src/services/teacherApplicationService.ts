/**
 * TeacherApplicationService - Service pentru gestionarea aplicațiilor profesorilor
 * 
 * Backend endpoints: /teacher-applications
 * NOTE: All DTOs are auto-transformed to camelCase by apiClient
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import type {
  TeacherApplicationDto,
  TeacherApplicationResponseDto,
  TeacherApplicationStatusDto,
  TeacherApplicationViewDto,
  TeacherApplicationApprovalDto,
  TeacherApplicationRejectionDto
} from '@/types';
import { apiClient } from './api';

export class TeacherApplicationService {
  private static readonly BASE_PATH = '/teacher-applications';

  /**
   * Trimite o aplicație pentru poziția de profesor
   */
  static async submitApplication(data: TeacherApplicationDto): Promise<TeacherApplicationResponseDto> {
    return await apiClient.post<TeacherApplicationResponseDto>(`${this.BASE_PATH}/submit`, data);
  }

  /**
   * Obține statusul unei aplicații după email
   */
  static async getApplicationStatus(email: string): Promise<TeacherApplicationStatusDto> {
    return await apiClient.get<TeacherApplicationStatusDto>(`${this.BASE_PATH}/by-email/${encodeURIComponent(email)}`);
  }

  /**
   * Track aplicația după email (pentru aplicanți)
   */
  static async trackByEmail(email: string): Promise<TeacherApplicationViewDto> {
    return await apiClient.get<TeacherApplicationViewDto>(`${this.BASE_PATH}/by-email/${encodeURIComponent(email)}`);
  }

  // ========================================
  // ADMIN METHODS
  // ========================================

  /**
   * Obține toate aplicațiile (admin only)
   */
  static async getAllApplications(): Promise<TeacherApplicationViewDto[]> {
    return await apiClient.get<TeacherApplicationViewDto[]>(`${this.BASE_PATH}/all`);
  }

  /**
   * Obține aplicațiile în așteptare (admin only)
   */
  static async getPendingApplications(): Promise<TeacherApplicationViewDto[]> {
    return await apiClient.get<TeacherApplicationViewDto[]>(`${this.BASE_PATH}/pending`);
  }

  /**
   * Obține aplicațiile în evaluare (admin only)
   */
  static async getUnderReviewApplications(): Promise<TeacherApplicationViewDto[]> {
    return await apiClient.get<TeacherApplicationViewDto[]>(`${this.BASE_PATH}/under-review`);
  }

  /**
   * Obține aplicațiile aprobate (admin only)
   */
  static async getApprovedApplications(): Promise<TeacherApplicationViewDto[]> {
    return await apiClient.get<TeacherApplicationViewDto[]>(`${this.BASE_PATH}/approved`);
  }

  /**
   * Obține aplicațiile respinse (admin only)
   */
  static async getRejectedApplications(): Promise<TeacherApplicationViewDto[]> {
    return await apiClient.get<TeacherApplicationViewDto[]>(`${this.BASE_PATH}/rejected`);
  }

  /**
   * Obține o aplicație specifică după ID (admin only)
   */
  static async getApplicationById(id: string): Promise<TeacherApplicationViewDto> {
    return await apiClient.get<TeacherApplicationViewDto>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Aprobă o aplicație (admin only)
   */
  static async approveApplication(id: string, data: TeacherApplicationApprovalDto): Promise<void> {
    await apiClient.post<void>(`${this.BASE_PATH}/${id}/approve`, data);
  }

  /**
   * Respinge o aplicație (admin only)
   */
  static async rejectApplication(id: string, data: TeacherApplicationRejectionDto): Promise<void> {
    await apiClient.post<void>(`${this.BASE_PATH}/${id}/reject`, data);
  }

  /**
   * Marchează o aplicație ca fiind în evaluare (admin only)
   */
  static async markAsUnderReview(id: string, notes?: string): Promise<void> {
    await apiClient.post<void>(`${this.BASE_PATH}/${id}/under-review`, { notes });
  }

  /**
   * Obține statistici despre aplicații (admin only)
   */
  static async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    thisMonth: number;
    lastMonth: number;
  }> {
    return await apiClient.get<{
      total: number;
      pending: number;
      underReview: number;
      approved: number;
      rejected: number;
      thisMonth: number;
      lastMonth: number;
    }>(`${this.BASE_PATH}/stats`);
  }

  /**
   * Exportă aplicațiile în CSV (admin only)
   */
  static async exportApplications(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${this.BASE_PATH}/export?format=${format}`) as any; // {
    return response as Blob;
  }

  /**
   * Trimite email de notificare către aplicant (admin only)
   */
  static async sendNotificationEmail(applicationId: string, type: 'approval' | 'rejection' | 'under-review'): Promise<void> {
    await apiClient.post<void>(`${this.BASE_PATH}/${applicationId}/notify`, { type });
  }
}
