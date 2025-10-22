// Сервис платежей
import { apiClient, PagedResult } from './api';
import {
  PaymentDto,
  CreatePaymentDto,
  PaymentResultDto,
} from '../types/api';

export class PaymentService {
  // Создать платеж
  static async createPayment(data: CreatePaymentDto): Promise<PaymentResultDto> {
    return apiClient.post<PaymentResultDto>('/payments/create', data);
  }

  // Получить платеж по ID
  static async getById(id: string): Promise<PaymentDto> {
    return apiClient.get<PaymentDto>(`/payments/${id}`);
  }

  // Подтвердить платеж (webhook)
  static async confirmPayment(id: string): Promise<void> {
    return apiClient.post(`/payments/${id}/confirm`);
  }

  // Получить историю платежей пользователя
  static async getUserPaymentHistory(page: number = 1, pageSize: number = 10): Promise<PagedResult<PaymentDto>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    return apiClient.get<PagedResult<PaymentDto>>(`/payments/user/history?${params.toString()}`);
  }

  // Возврат средств (только для администраторов)
  static async refund(id: string, reason?: string): Promise<void> {
    return apiClient.post(`/payments/${id}/refund`, { reason });
  }

  // Получить статус платежа
  static async getPaymentStatus(id: string): Promise<string> {
    const payment = await this.getById(id);
    return payment.status;
  }
}
