// Сервис для безопасной работы с файлами через FilesController
import { apiClient } from './api';

export interface FileUploadResult {
  isSuccess: boolean;
  fileId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  filePath: string;
  errorMessage?: string;
}

export interface FileInfo {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  uploadedBy: string;
  uploaderName: string;
  materialId?: string;
  consultationId?: string;
}

export interface StorageUsage {
  usedBytes: number;
  maxBytes: number;
  usedPercentage: number;
  remainingBytes: number;
}

export class FileService {
  private static readonly BASE_PATH = '/Files';

  /**
   * Загрузка файла (общий метод)
   */
  static async uploadFile(
    file: File,
    options?: {
      materialId?: string;
      consultationId?: string;
    }
  ): Promise<FileUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.materialId) {
      formData.append('materialId', options.materialId);
    }
    if (options?.consultationId) {
      formData.append('consultationId', options.consultationId);
    }

    const response = await fetch(`${apiClient.baseUrl}${this.BASE_PATH}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `Upload failed with status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Загрузка файла к материалу (только для учителей)
   */
  static async uploadMaterialFile(materialId: string, file: File): Promise<FileUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('materialId', materialId); // materialId в FormData!

    const response = await fetch(`${apiClient.baseUrl}${this.BASE_PATH}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'Upload failed' };
      }
      throw new Error(error.message || `Upload failed with status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Загрузка файла к консультации
   */
  static async uploadConsultationFile(consultationId: string, file: File): Promise<FileUploadResult> {
    // Правильный URL - consultationId идёт в FormData, а не в URL
    const uploadUrl = `${apiClient.baseUrl}/Files/upload`;
    const token = localStorage.getItem('authToken');
    
    console.log('🚀 FileService.uploadConsultationFile called:', {
      consultationId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadUrl,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN'
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('consultationId', consultationId); // consultationId в FormData!
    
    console.log('📦 FormData created with consultationId, starting fetch...');

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || 'Upload failed' };
        }
        console.error('❌ Upload failed:', error);
        throw new Error(error.message || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }

  /**
   * Скачивание файла (защищённое)
   */
  static async downloadFile(fileId: string): Promise<{ blob: Blob; filename: string }> {
    const response = await fetch(`${apiClient.baseUrl}${this.BASE_PATH}/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    // Извлекаем имя файла из Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'download';
    
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    return { blob, filename };
  }

  /**
   * Просмотр файла в браузере (inline)
   */
  static getViewUrl(fileId: string): string {
    const token = localStorage.getItem('authToken');
    return `${apiClient.baseUrl}${this.BASE_PATH}/${fileId}/view?token=${token}`;
  }

  /**
   * Получение информации о файле
   */
  static async getFileInfo(fileId: string): Promise<FileInfo> {
    return await apiClient.get<FileInfo>(`${this.BASE_PATH}/${fileId}/info`);
  }

  /**
   * Удаление файла
   */
  static async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${fileId}`);
  }

  /**
   * Получение превью файла
   */
  static getPreviewUrl(fileId: string): string {
    const token = localStorage.getItem('authToken');
    return `${apiClient.baseUrl}${this.BASE_PATH}/${fileId}/preview?token=${token}`;
  }

  /**
   * Получение файлов материала
   */
  static async getMaterialFiles(materialId: string): Promise<FileInfo[]> {
    return await apiClient.get<FileInfo[]>(`${this.BASE_PATH}/material/${materialId}`);
  }

  /**
   * Получение файлов консультации
   */
  static async getConsultationFiles(consultationId: string): Promise<FileInfo[]> {
    return await apiClient.get<FileInfo[]>(`${this.BASE_PATH}/consultation/${consultationId}`);
  }

  /**
   * Получение статистики использования хранилища
   */
  static async getStorageUsage(): Promise<StorageUsage> {
    return await apiClient.get<StorageUsage>(`${this.BASE_PATH}/storage-usage`);
  }

  /**
   * Получение списка файлов пользователя
   */
  static async getMyFiles(page: number = 1, pageSize: number = 20): Promise<FileInfo[]> {
    return await apiClient.get<FileInfo[]>(`${this.BASE_PATH}/my-files?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Вспомогательная функция для скачивания файла с автоматическим сохранением
   */
  static async downloadAndSave(fileId: string): Promise<void> {
    const { blob, filename } = await this.downloadFile(fileId);
    
    // Создаём временную ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Очищаем
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Валидация файла перед загрузкой (клиентская)
   */
  static validateFile(file: File, options?: {
    maxSize?: number; // в байтах
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 10 * 1024 * 1024; // 10MB по умолчанию
    const allowedTypes = options?.allowedTypes || [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }
}

