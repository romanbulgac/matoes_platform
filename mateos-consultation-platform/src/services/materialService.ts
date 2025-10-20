import { apiClient } from './api';
import type { Material } from '@/types';

/**
 * MaterialService - Service pentru gestionarea materialelor educaționale
 * Backend endpoints: /Material
 */
export class MaterialService {
  private static readonly BASE_PATH = '/Material';

  /**
   * Obține toate materialele pentru o consultație
   */
  static async getForConsultation(consultationId: string): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/consultation/${consultationId}`);
  }

  /**
   * Încarcă un material nou
   */
  static async upload(data: {
    title: string;
    description?: string;
    consultationId: string;
    file: File;
  }): Promise<Material> {
    const additionalData: Record<string, string> = {
      title: data.title,
      consultationId: data.consultationId,
    };
    
    if (data.description) {
      additionalData.description = data.description;
    }

    return await apiClient.uploadFile<Material>(this.BASE_PATH, data.file, additionalData);
  }

  /**
   * Descarcă un material
   */
  static async download(materialId: string): Promise<Blob> {
    const response = await fetch(
      `${apiClient['baseURL']}${this.BASE_PATH}/${materialId}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download material: ${response.status}`);
    }

    return await response.blob();
  }

  /**
   * Șterge un material
   */
  static async delete(materialId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${materialId}`);
  }

  /**
   * Actualizează un material (doar metadata, nu fișierul)
   */
  static async update(
    materialId: string,
    data: {
      title?: string;
      description?: string;
    }
  ): Promise<Material> {
    return await apiClient.put<Material>(`${this.BASE_PATH}/${materialId}`, data);
  }

  /**
   * Obține detalii despre un material
   */
  static async getById(materialId: string): Promise<Material> {
    return await apiClient.get<Material>(`${this.BASE_PATH}/${materialId}`);
  }

  // ========================================
  // STUDENT-SPECIFIC METHODS
  // ========================================

  /**
   * Obține toate materialele disponibile pentru un student
   */
  static async getForStudent(studentId: string): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/student/${studentId}`);
  }

  /**
   * Obține materialele recente pentru un student
   */
  static async getRecent(studentId: string, limit: number = 10): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/student/${studentId}/recent?limit=${limit}`);
  }

  /**
   * Descarcă un material și înregistrează download-ul
   */
  static async downloadMaterial(materialId: string): Promise<Blob> {
    // First, record the download
    await apiClient.post(`${this.BASE_PATH}/${materialId}/download`, {});
    
    // Then download the file
    return await this.download(materialId);
  }

  /**
   * Obține materialele pentru un grup specific
   */
  static async getForGroup(groupId: string): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/group/${groupId}`);
  }

  /**
   * Obține materialele pentru un profesor specific
   */
  static async getForTeacher(teacherId: string): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/teacher/${teacherId}`);
  }

  /**
   * Caută materiale după cuvinte cheie
   */
  static async search(query: string, filters?: {
    subject?: string;
    type?: string;
    teacherId?: string;
  }): Promise<Material[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.teacherId) params.append('teacherId', filters.teacherId);
    
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/search?${params.toString()}`);
  }

  /**
   * Obține statistici despre materialele unui student
   */
  static async getStudentStats(studentId: string): Promise<{
    totalMaterials: number;
    downloadedMaterials: number;
    favoriteSubjects: string[];
    recentActivity: Array<{
      materialId: string;
      materialTitle: string;
      action: 'download' | 'view';
      timestamp: string;
    }>;
  }> {
    return await apiClient.get(`${this.BASE_PATH}/student/${studentId}/stats`);
  }
}
