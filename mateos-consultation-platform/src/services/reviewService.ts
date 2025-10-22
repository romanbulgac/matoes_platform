// Сервис для работы с отзывами и оценками
import { ReviewDto, CreateReviewDto } from '../types/api';
import { apiClient, PagedResult, PaginationDto } from './api';

export class ReviewService {
  /**
   * Создать отзыв/оценку для консультации
   */
  static async create(data: CreateReviewDto): Promise<ReviewDto> {
    return apiClient.post<ReviewDto>('/reviews', data);
  }

  /**
   * Получить отзыв по ID
   */
  static async getById(id: string): Promise<ReviewDto> {
    return apiClient.get<ReviewDto>(`/reviews/${id}`);
  }

  /**
   * Получить отзывы для консультации
   */
  static async getForConsultation(consultationId: string): Promise<ReviewDto[]> {
    return apiClient.get<ReviewDto[]>(`/reviews/consultation/${consultationId}`);
  }

  /**
   * Получить отзывы для консультации (с пагинацией)
   */
  static async getForConsultationPaged(
    consultationId: string,
    pagination: PaginationDto
  ): Promise<PagedResult<ReviewDto>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize.toString());
    
    return apiClient.get<PagedResult<ReviewDto>>(
      `/reviews/consultation/${consultationId}/paged?${params.toString()}`
    );
  }

  /**
   * Получить отзывы студента
   */
  static async getByStudent(studentId: string): Promise<ReviewDto[]> {
    return apiClient.get<ReviewDto[]>(`/reviews/student/${studentId}`);
  }

  /**
   * Получить отзывы студента (с пагинацией)
   */
  static async getByStudentPaged(
    studentId: string,
    pagination: PaginationDto
  ): Promise<PagedResult<ReviewDto>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize.toString());
    
    return apiClient.get<PagedResult<ReviewDto>>(
      `/reviews/student/${studentId}/paged?${params.toString()}`
    );
  }

  /**
   * Обновить отзыв
   */
  static async update(id: string, data: ReviewDto): Promise<void> {
    return apiClient.put<void>(`/reviews/${id}`, data);
  }

  /**
   * Удалить отзыв
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`/reviews/${id}`);
  }
}


