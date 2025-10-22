import type { Consultation, ConsultationDto, Group, GroupDto, Student, StudentDto, Material } from '@/types';
import { apiClient } from './api';

/**
 * GroupService - Service pentru gestionarea grupurilor de elevi
 * Backend endpoints: /Groups
 * NOTE: All DTOs are auto-transformed to camelCase by apiClient
 */
export class GroupService {
  private static readonly BASE_PATH = '/Groups';

  /**
   * Convertește StudentDto (backend → camelCase via apiClient) în Student (frontend)
   */
  private static mapStudent(dto: StudentDto): Student {
    return {
      id: dto.id,
      firstname: dto.name,
      lastname: dto.surname,
      email: dto.email,
      class: dto.class,
      subjectLevel: dto.mathLevel,
      attendancePercentage: 0, // TODO: Add to StudentDto
      averageRating: 0, // TODO: Add to StudentDto
      totalConsultations: 0, // TODO: Add to StudentDto
      attendedConsultations: 0 // TODO: Add to StudentDto
    };
  }

  /**
   * Convertește ConsultationDto (backend → camelCase via apiClient) în Consultation (frontend)
   */
  private static mapConsultation(dto: ConsultationDto): Consultation {
    return {
      id: dto.id,
      title: dto.title,
      scheduledAt: dto.scheduledAt,
      status: dto.status,
      duration: dto.duration,
      teacherId: dto.teacherId,
      topic: dto.topic,
      description: dto.description,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    } as Consultation;
  }

  /**
   * Convertește GroupDto (backend → camelCase via apiClient) în Group (frontend)
   */
  private static mapGroup(dto: GroupDto): Group {
    const members = dto.members?.map(m => this.mapStudent(m)) || [];
    const memberCount = members.length;
    const availableSlots = dto.maxCapacity - memberCount;
    
    return {
      id: dto.id,
      name: dto.name,
      description: '', // GroupDto doesn't have description field
      class: '', // TODO: Add class to GroupDto
      teacherId: dto.teacherId || '',
      groupType: dto.groupType, // 3 sau 6
      maxCapacity: dto.maxCapacity,
      members,
      memberCount,
      availableSlots,
      isFull: memberCount >= dto.maxCapacity,
      consultations: dto.consultations?.map(c => this.mapConsultation(c)) || [],
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt || '',
      isDeleted: !dto.isActive,
      isActive: dto.isActive
    };
  }

  /**
   * Obține toate grupurile
   */
  static async getAll(): Promise<Group[]> {
    const dtos = await apiClient.get<GroupDto[]>(this.BASE_PATH);
    return dtos.map(dto => this.mapGroup(dto));
  }

  /**
   * Obține un grup după ID
   */
  static async getById(groupId: string): Promise<Group> {
    const dto = await apiClient.get<GroupDto>(`${this.BASE_PATH}/${groupId}`);
    return this.mapGroup(dto);
  }

  /**
   * Obține toate grupurile unui profesor
   */
  static async getTeacherGroups(teacherId: string): Promise<Group[]> {
    const dtos = await apiClient.get<GroupDto[]>(`${this.BASE_PATH}/teacher/${teacherId}`);
    return dtos.map(dto => this.mapGroup(dto));
  }

  /**
   * Creează un nou grup
   */
  static async create(data: {
    studentClass: string; // Backend așteaptă "StudentClass"
    teacherId?: string;
    groupType?: number; // 3 = Small, 6 = Large (default = 6)
  }): Promise<Group> {
    const payload = {
      StudentClass: data.studentClass,
      TeacherId: data.teacherId,
      GroupType: data.groupType || 6 // Default Large
    };
    const dto = await apiClient.post<GroupDto>(this.BASE_PATH, payload);
    return this.mapGroup(dto);
  }

  /**
   * Actualizează un grup
   */
  static async update(groupId: string, data: {
    name?: string;
    class?: string;
  }): Promise<Group> {
    const dto = await apiClient.put<GroupDto>(`${this.BASE_PATH}/${groupId}`, data);
    return this.mapGroup(dto);
  }

  /**
   * Șterge un grup
   */
  static async delete(groupId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${groupId}`);
  }

  /**
   * Adaugă un elev la grup
   */
  static async addMember(groupId: string, studentId: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/${groupId}/students/${studentId}`);
  }

  /**
   * Elimină un elev din grup
   */
  static async removeMember(groupId: string, studentId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${groupId}/students/${studentId}`);
  }

  /**
   * Obține membrii unui grup
   */
  static async getMembers(groupId: string): Promise<Student[]> {
    const dtos = await apiClient.get<StudentDto[]>(`${this.BASE_PATH}/${groupId}/members`);
    return dtos.map(dto => this.mapStudent(dto));
  }

  /**
   * Obține consultațiile unui grup
   */
  static async getConsultations(groupId: string): Promise<Consultation[]> {
    const dtos = await apiClient.get<ConsultationDto[]>(`${this.BASE_PATH}/${groupId}/consultations`);
    return dtos.map(dto => this.mapConsultation(dto));
  }

  /**
   * Obține membrii unui grup cu statistici (prezență, note medii)
   */
  static async getMembersWithStatistics(groupId: string): Promise<Student[]> {
    const dtos = await apiClient.get<StudentDto[]>(`${this.BASE_PATH}/${groupId}/members/statistics`);
    return dtos.map(dto => this.mapStudent(dto));
  }

  // ========================================
  // NEW METHODS FOR GROUP ENROLLMENT FLOW
  // ========================================

  /**
   * Obține toate grupurile (pentru admin management)
   */
  static async getAllGroups(): Promise<Group[]> {
    const dtos = await apiClient.get<GroupDto[]>(this.BASE_PATH);
    return dtos.map(dto => this.mapGroup(dto));
  }

  /**
   * Obține grupurile unui student (pentru student view)
   */
  static async getMyGroups(studentId: string): Promise<Group[]> {
    const dtos = await apiClient.get<GroupDto[]>(`${this.BASE_PATH}/student/${studentId}`);
    return dtos.map(dto => this.mapGroup(dto));
  }

  // ========================================
  // STUDENT-SPECIFIC METHODS
  // ========================================

  /**
   * Obține grupurile unui student (alias pentru getMyGroups)
   */
  static async getStudentGroups(studentId: string): Promise<Group[]> {
    return this.getMyGroups(studentId);
  }

  /**
   * Obține materialele pentru un grup specific
   */
  static async getGroupMaterials(groupId: string): Promise<Material[]> {
    return await apiClient.get<Material[]>(`${this.BASE_PATH}/${groupId}/materials`);
  }

  /**
   * Obține programul consultațiilor pentru un grup
   */
  static async getGroupSchedule(groupId: string): Promise<Consultation[]> {
    const dtos = await apiClient.get<ConsultationDto[]>(`${this.BASE_PATH}/${groupId}/schedule`);
    return dtos.map(dto => this.mapConsultation(dto));
  }

  /**
   * Obține istoricul prezenței unui student la un grup
   */
  static async getMyAttendance(groupId: string, studentId: string): Promise<Array<{
    consultationId: string;
    consultationTitle: string;
    scheduledAt: string;
    attended: boolean;
    attendanceTime?: string;
    duration?: number; // minutes
    teacherNotes?: string;
  }>> {
    return await apiClient.get(`${this.BASE_PATH}/${groupId}/attendance/${studentId}`);
  }

  /**
   * Obține progresul unui student într-un grup
   */
  static async getStudentGroupProgress(groupId: string, studentId: string): Promise<{
    groupId: string;
    studentId: string;
    totalConsultations: number;
    attendedConsultations: number;
    attendanceRate: number;
    averageRating: number;
    topicsCovered: string[];
    nextTopics: string[];
    groupAverage?: number; // Comparație cu media grupului (dacă permisă)
  }> {
    return await apiClient.get(`${this.BASE_PATH}/${groupId}/progress/${studentId}`);
  }

  /**
   * Obține membrii unui grup (pentru student view - doar prenumele)
   */
  static async getGroupMembers(groupId: string): Promise<Array<{
    id: string;
    firstName: string;
    isCurrentUser: boolean;
  }>> {
    return await apiClient.get(`${this.BASE_PATH}/${groupId}/members`);
  }

  /**
   * Obține statistici despre un grup
   */
  static async getGroupStats(groupId: string): Promise<{
    totalMembers: number;
    totalConsultations: number;
    completedConsultations: number;
    averageAttendance: number;
    nextConsultation?: {
      id: string;
      title: string;
      scheduledAt: string;
    };
  }> {
    return await apiClient.get(`${this.BASE_PATH}/${groupId}/stats`);
  }

}
