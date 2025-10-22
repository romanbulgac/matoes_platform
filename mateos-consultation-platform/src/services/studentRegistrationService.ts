// Сервис регистрации студентов
import { apiClient } from './api';
import {
  StudentRegistrationDto,
  StudentRegistrationStatusDto,
} from '../types/api';

export class StudentRegistrationService {
  // Подать заявку на регистрацию студента
  static async submitRegistration(data: StudentRegistrationDto): Promise<{ trackingCode: string }> {
    return apiClient.post<{ trackingCode: string }>('/studentregistration/submit', data);
  }

  // Отследить статус заявки
  static async trackRegistration(trackingCode: string): Promise<StudentRegistrationStatusDto> {
    return apiClient.get<StudentRegistrationStatusDto>(`/studentregistration/track/${trackingCode}`);
  }

  // Получить все заявки (только для администраторов)
  static async getAllRegistrations(): Promise<StudentRegistrationStatusDto[]> {
    return apiClient.get<StudentRegistrationStatusDto[]>('/studentregistration/admin/all');
  }

  // Обновить статус заявки (только для администраторов)
  static async updateStatus(
    id: string, 
    status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected',
    rejectionReason?: string
  ): Promise<void> {
    return apiClient.put(`/studentregistration/admin/${id}/status`, {
      status,
      rejectionReason,
    });
  }

  // Одобрить заявку (только для администраторов)
  static async approveRegistration(id: string): Promise<void> {
    return this.updateStatus(id, 'Approved');
  }

  // Отклонить заявку (только для администраторов)
  static async rejectRegistration(id: string, reason: string): Promise<void> {
    return this.updateStatus(id, 'Rejected', reason);
  }
}
