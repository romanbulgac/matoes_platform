// Сервис для работы с учителями и их расписаниями
import { apiClient } from './api';
import { 
  UserDto, 
  TeacherAvailabilityDto, 
  FindAvailableSlotsRequestDto,
  AvailableSlotDto 
} from '../types/api';

export interface TeacherWithStats extends UserDto {
  Subject?: string;
  YearsOfExperience?: number;
  Department?: string;
  AverageRating?: number;
  TotalReviews?: number;
  Bio?: string;
  Specializations?: string[];
  HourlyRate?: number;
}

export interface TeacherFilters {
  search?: string;
  subject?: string;
  minRating?: number;
  maxPrice?: number;
  availability?: string; // 'today', 'tomorrow', 'week'
}

export interface TeacherScheduleDto {
  teacherId: string;
  teacherName: string;
  availabilities: TeacherAvailabilityDto[];
  upcomingSlots: AvailableSlotDto[];
  slotsByDay: Record<number, AvailableSlotDto[]>;
}

export class TeacherService {
  /**
   * Получить список всех учителей
   */
  static async getTeachers(filters?: TeacherFilters): Promise<TeacherWithStats[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.subject) {
      params.append('subject', filters.subject);
    }
    if (filters?.minRating) {
      params.append('minRating', filters.minRating.toString());
    }
    
    const queryString = params.toString();
    const url = `/users/teachers${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<TeacherWithStats[]>(url);
  }

  /**
   * Получить информацию о конкретном учителе
   */
  static async getTeacherById(teacherId: string): Promise<TeacherWithStats> {
    return apiClient.get<TeacherWithStats>(`/users/${teacherId}`);
  }

  /**
   * Получить расписание учителя
   */
  static async getTeacherSchedule(
    teacherId: string,
    startDate: string,
    endDate: string
  ): Promise<TeacherScheduleDto> {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    
    return apiClient.get<TeacherScheduleDto>(
      `/teacheravailability/teacher/${teacherId}/schedule?${params.toString()}`
    );
  }

  /**
   * Получить доступные слоты учителя
   */
  static async getTeacherAvailableSlots(
    teacherId: string,
    startDate: string,
    endDate: string
  ): Promise<AvailableSlotDto[]> {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    
    return apiClient.get<AvailableSlotDto[]>(
      `/teacheravailability/teacher/${teacherId}/available-slots?${params.toString()}`
    );
  }

  /**
   * Найти доступные слоты по критериям
   */
  static async findAvailableSlots(
    request: FindAvailableSlotsRequestDto
  ): Promise<AvailableSlotDto[]> {
    return apiClient.post<AvailableSlotDto[]>(
      '/teacheravailability/find-slots',
      request
    );
  }

  /**
   * Проверить, можно ли забронировать слот
   */
  static async canBookSlot(
    teacherId: string,
    dateTime: string,
    durationMinutes: number = 60
  ): Promise<boolean> {
    const params = new URLSearchParams({
      dateTime,
      durationMinutes: durationMinutes.toString()
    });
    
    return apiClient.get<boolean>(
      `/teacheravailability/teacher/${teacherId}/can-book?${params.toString()}`
    );
  }
}
