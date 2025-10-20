// Сервис консультаций
import { ConsultationDto, ConsultationStatus, CreateConsultationDto, MaterialDto, UserDto } from '../types/api';
import { apiClient, PagedResult, PaginationDto } from './api';

// Конвертер из API формата (заглавные буквы) в фронтенд формат (строчные буквы)
function convertApiConsultationToDto(apiData: Record<string, unknown>): ConsultationDto {
  // Маппинг числовых статусов в строковые enum-ы
  const mapStatus = (statusNumber: number): ConsultationDto['status'] => {
    switch (statusNumber) {
      case 0: return ConsultationStatus.Scheduled;
      case 1: return ConsultationStatus.InProgress;  
      case 2: return ConsultationStatus.Completed;
      case 3: return ConsultationStatus.Cancelled;
      default: return ConsultationStatus.Scheduled;
    }
  };

  return {
    id: apiData.id as string,
    title: apiData.Title as string,
    topic: apiData.Topic as string,
    description: apiData.description as string,
    teacherId: apiData.TeacherId as string,
    teacherName: apiData.TeacherName as string,
    scheduledAt: apiData.ScheduledAt as string,
    duration: apiData.Duration as number,
    maxParticipants: apiData.MaxParticipants as number,
    currentParticipants: apiData.CurrentParticipants as number,
    isGroupSession: apiData.IsGroupSession as boolean,
    price: apiData.price as number,
    status: mapStatus(apiData.status as number),
    link: apiData.Link as string,
    consultationType: (apiData.ConsultationType as number) === 1 ? 'Group' : 'Individual',
    groupId: apiData.GroupId as string,
    groupName: apiData.GroupName as string,
    individualStudentId: apiData.IndividualStudentId as string[],
    studentId: apiData.StudentId as string[],
    participants: (apiData.Participants as UserDto[]) || [],
    materials: (apiData.Materials as MaterialDto[]) || [],
    createdAt: apiData.CreatedAt as string,
    updatedAt: apiData.UpdatedAt as string
  };
}

export class ConsultationService {
  // Создать консультацию
  static async create(data: CreateConsultationDto): Promise<ConsultationDto> {
    return apiClient.post<ConsultationDto>('/consultations', data);
  }

  // Получить все консультации
  static async getAll(): Promise<ConsultationDto[]> {
    console.log('🔍 ConsultationService.getAll() - fetching from API');
    const apiData = await apiClient.get<Record<string, unknown>[]>('/consultations');
    console.log('📥 Raw API data received:', apiData);
    
    const convertedData = apiData.map((item, index) => {
      console.log(`🔄 Converting item ${index + 1}:`, item);
      const converted = convertApiConsultationToDto(item);
      console.log(`✅ Converted item ${index + 1}:`, converted);
      return converted;
    });
    
    return convertedData;
  }

  // Получить консультации с пагинацией
  static async getPaged(pagination: PaginationDto): Promise<PagedResult<ConsultationDto>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize.toString());
    if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);

    return apiClient.get<PagedResult<ConsultationDto>>(`/consultations/paged?${params.toString()}`);
  }

  // Получить консультацию по ID
  static async getById(id: string): Promise<ConsultationDto> {
    console.log('🔍 ConsultationService.getById() - fetching consultation:', id);
    const apiData = await apiClient.get<Record<string, unknown>>(`/consultations/${id}`);
    console.log('📥 Raw API data for consultation:', apiData);
    
    const converted = convertApiConsultationToDto(apiData);
    console.log('✅ Converted consultation data:', converted);
    
    return converted;
  }

  // Обновить консультацию
  static async update(id: string, data: Partial<CreateConsultationDto>): Promise<ConsultationDto> {
    return apiClient.put<ConsultationDto>(`/consultations/${id}`, data);
  }

  // Удалить консультацию
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`/consultations/${id}`);
  }

  // Присоединиться к консультации
  static async join(id: string): Promise<void> {
    return apiClient.post(`/consultations/${id}/join`);
  }

  // Покинуть консультацию
  static async leave(id: string): Promise<void> {
    return apiClient.post(`/consultations/${id}/leave`);
  }

  // Получить предстоящие консультации для текущего пользователя (для дашборда)
  static async getUpcoming(): Promise<ConsultationDto[]> {
    try {
      console.log('🔍 Fetching upcoming consultations for dashboard');
      const result = await apiClient.get<ConsultationDto[]>('/consultations/upcoming');
      console.log('📋 Upcoming consultations API result:', result);
      
      // Если результат не массив, возвращаем пустой массив
      if (!Array.isArray(result)) {
        console.warn('⚠️ API returned non-array for upcoming consultations:', result);
        return [];
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error getting upcoming consultations:', error);
      return [];
    }
  }

  // Получить консультации преподавателя
  static async getByTeacher(teacherId: string): Promise<ConsultationDto[]> {
    try {
      // Валидация teacherId
      if (!teacherId || teacherId === 'undefined' || teacherId === 'null') {
        console.error('❌ Invalid teacherId provided to getByTeacher:', teacherId);
        return [];
      }
      
      console.log('🔍 Fetching consultations for teacher:', teacherId);
      return apiClient.get<ConsultationDto[]>(`/consultations/teacher/${teacherId}`);
    } catch (error) {
      console.error('❌ Error getting teacher consultations:', error);
      return [];
    }
  }

  // Получить консультации студента
  static async getByStudent(studentId: string): Promise<ConsultationDto[]> {
    try {
      // Валидация studentId
      if (!studentId || studentId === 'undefined' || studentId === 'null') {
        console.error('❌ Invalid studentId provided to getByStudent:', studentId);
        return [];
      }
      
      console.log('🔍 Fetching consultations for student:', studentId);
      const result = await apiClient.get<ConsultationDto[]>(`/consultations/student/${studentId}`);
      console.log('📋 Student consultations API result:', result);
      
      // Если результат не массив, возвращаем пустой массив
      if (!Array.isArray(result)) {
        console.warn('⚠️ API returned non-array for consultations:', result);
        return [];
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error getting student consultations:', error);
      return [];
    }
  }

  // ===== NEW METHODS FOR GROUPS AND ATTENDANCE =====

  /**
   * Obține consultațiile unui grup
   */
  static async getForGroup(groupId: string): Promise<ConsultationDto[]> {
    try {
      console.log('🔍 Fetching consultations for group:', groupId);
      return await apiClient.get<ConsultationDto[]>(`/consultations/group/${groupId}`);
    } catch (error) {
      console.error('❌ Error getting group consultations:', error);
      return [];
    }
  }

  /**
   * Creează o consultație de grup
   */
  static async createGroupConsultation(data: CreateConsultationDto & { groupId: string }): Promise<ConsultationDto> {
    return apiClient.post<ConsultationDto>('/consultations', {
      ...data,
      consultationType: 1, // ConsultationType.Group = 1
    });
  }

  /**
   * Actualizează prezența unui student la consultație
   */
  static async updateAttendance(
    consultationId: string,
    studentId: string,
    attended: boolean
  ): Promise<void> {
    return apiClient.put<void>(
      `/consultations/${consultationId}/attendance/${studentId}`,
      { attended }
    );
  }

  /**
   * Marchează prezența pentru mai mulți studenți simultan
   */
  static async bulkUpdateAttendance(
    consultationId: string,
    attendanceData: Array<{ studentId: string; attended: boolean }>
  ): Promise<void> {
    return apiClient.put<void>(
      `/consultations/${consultationId}/attendance/bulk`,
      { attendanceRecords: attendanceData }
    );
  }

  /**
   * Obține detalii despre prezență pentru o consultație
   */
  static async getAttendance(consultationId: string): Promise<Array<{
    studentId: string;
    attended: boolean;
    studentName?: string;
  }>> {
    return apiClient.get(`/consultations/${consultationId}/attendance`);
  }

  // ========================================
  // STUDENT-SPECIFIC METHODS
  // ========================================

  /**
   * Obține consultațiile unui student cu filtrare
   */
  static async getStudentConsultations(
    studentId: string, 
    filter: 'upcoming' | 'past' | 'all' = 'all'
  ): Promise<ConsultationDto[]> {
    const params = new URLSearchParams();
    params.append('studentId', studentId);
    params.append('filter', filter);
    
    return apiClient.get<ConsultationDto[]>(`/consultations/student?${params.toString()}`);
  }

  /**
   * Alătură-te unei consultații (obține link-ul de meeting)
   */
  static async joinConsultation(consultationId: string): Promise<{
    meetingLink: string;
    meetingId?: string;
    password?: string;
  }> {
    return apiClient.post(`/consultations/${consultationId}/join`);
  }

  /**
   * Obține consultațiile unui student grupate pe profesor
   */
  static async getStudentConsultationsByTeacher(studentId: string): Promise<Record<string, ConsultationDto[]>> {
    const consultations = await this.getStudentConsultations(studentId, 'all');
    
    return consultations.reduce((acc, consultation) => {
      const teacherId = consultation.teacherId;
      if (!acc[teacherId]) {
        acc[teacherId] = [];
      }
      acc[teacherId].push(consultation);
      return acc;
    }, {} as Record<string, ConsultationDto[]>);
  }

  /**
   * Obține consultațiile individuale ale unui student
   */
  static async getStudentIndividualConsultations(studentId: string): Promise<ConsultationDto[]> {
    const consultations = await this.getStudentConsultations(studentId, 'all');
    return consultations.filter(c => c.consultationType === 'Individual');
  }

  /**
   * Obține consultațiile de grup ale unui student
   */
  static async getStudentGroupConsultations(studentId: string): Promise<ConsultationDto[]> {
    const consultations = await this.getStudentConsultations(studentId, 'all');
    return consultations.filter(c => c.consultationType === 'Group');
  }

  /**
   * Evaluează o consultație (rating și review)
   */
  static async rateConsultation(
    consultationId: string, 
    rating: number, 
    comment?: string
  ): Promise<void> {
    await apiClient.post(`/consultations/${consultationId}/rate`, {
      rating,
      comment
    });
  }

  /**
   * Obține materialele pentru o consultație (pentru student)
   */
  static async getConsultationMaterials(consultationId: string): Promise<MaterialDto[]> {
    return apiClient.get<MaterialDto[]>(`/consultations/${consultationId}/materials`);
  }

  /**
   * Obține notele de la profesor pentru o consultație
   */
  static async getConsultationNotes(consultationId: string): Promise<{
    notes: string;
    teacherName: string;
    createdAt: string;
  }> {
    return apiClient.get(`/consultations/${consultationId}/notes`);
  }

  /**
   * Verifică dacă studentul poate alătura la o consultație
   */
  static async canJoinConsultation(consultationId: string, studentId: string): Promise<{
    canJoin: boolean;
    reason?: string;
    timeUntilStart?: number; // minutes
  }> {
    return apiClient.get(`/consultations/${consultationId}/can-join/${studentId}`);
  }
}
