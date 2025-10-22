import type {
  AcceptChildInvitationDto,
  AuthenticationResultDto,
  ChildDetailDto,
  ChildInvitationResponseDto,
  ChildInvitationViewDto,
  CreateChildInvitationDto,
  DeactivateAccountDto,
  InvitationInfoDto,
  ManageConsentDto,
  ParentDashboardOverviewDto,
} from '@/types';
import { apiClient } from './api';

/**
 * FamilyService - Сервис для управления семейными связями Parent-Child
 * 
 * Backend: ChildInvitationController.cs, ParentDashboardController.cs
 * 
 * ВАЖНО: Только родитель может создавать и управлять аккаунтами детей.
 * Дети приглашаются через персональные ссылки, генерируемые родителями.
 * 
 * GDPR Compliance: Родитель предоставляет согласие на обработку данных ребенка.
 * 
 * @author Mateos Platform
 * @version 2.0 - Refactored for ChildInvitationController
 * @date October 2025
 */
export class FamilyService {
  private static readonly BASE_PATH = '/ChildInvitation';
  private static readonly DASHBOARD_PATH = '/ParentDashboard';

  // ========================================
  // CHILD INVITATION MANAGEMENT (Parent Only)
  // ========================================

  /**
   * Создать приглашение для ребенка
   * 
   * Backend: POST /ChildInvitation/create
   * Authorization: Parent role required
   * 
   * @param data - Данные ребенка для приглашения
   * @returns Информация о созданном приглашении с токеном и ссылкой
   * 
   * @example
   * const invitation = await FamilyService.createInvitation({
   *   childemail: 'child@example.com',
   *   childName: 'Ion',
   *   childSurname: 'Popescu',
   *   childClass: '10',
   *   expirationDays: 7
   * });
   */
  static async createInvitation(
    data: CreateChildInvitationDto
  ): Promise<ChildInvitationResponseDto> {
    console.log('🔵 Creating child invitation:', data.childemail);
    
    try {
      // Map frontend fields to backend expected fields
      const backendData = {
        childemail: data.childemail,
        childName: data.childName,
        childSurname: data.childSurname,
        childFullName: `${data.childName} ${data.childSurname}`.trim(),
        Class: data.childClass,
        MathLevel: data.mathLevel,
        expirationDays: data.expirationDays,
        personalMessage: data.personalMessage
      };
      
      console.log('🔧 Mapped data for backend:', backendData);
      
      const backendResponse = await apiClient.post<any>(
        `${this.BASE_PATH}/create`,
        backendData
      );
      
      // Map backend response to frontend expected format
      const response: ChildInvitationResponseDto = {
        invitationId: backendResponse.invitationId,
        invitationToken: backendResponse.invitationToken || '', // Backend might not return this
        invitationLink: backendResponse.invitationUrl,
        expiresAt: backendResponse.expiryDate,
        childemail: data.childemail, // Use original email from request
        status: backendResponse.status
      };
      
      console.log('✅ Invitation created:', response.invitationId);
      console.log('🔧 Mapped response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to create invitation:', error);
      throw error;
    }
  }

  /**
   * Получить все приглашения родителя
   * 
   * Backend: GET /ChildInvitation/my-invitations
   * Authorization: Parent role required
   * 
   * @returns Список всех приглашений (pending, accepted, expired, revoked)
   * 
   * @example
   * const invitations = await FamilyService.getMyInvitations();
   * const pending = invitations.filter(i => i.status === 'Pending');
   */
  static async getMyInvitations(): Promise<ChildInvitationViewDto[]> {
    console.log('🔵 Fetching parent invitations');
    
    try {
      const invitations = await apiClient.get<ChildInvitationViewDto[]>(
        `${this.BASE_PATH}/my-invitations`
      );
      
      console.log(`✅ Found ${invitations.length} invitations`);
      return invitations;
    } catch (error) {
      console.error('❌ Failed to fetch invitations:', error);
      throw error;
    }
  }

  /**
   * Переслать приглашение
   * 
   * Backend: PUT /ChildInvitation/{id}/resend
   * Authorization: Parent role required
   * 
   * @param invitationId - ID приглашения
   * @returns Обновленная информация о приглашении
   * 
   * @example
   * await FamilyService.resendInvitation('invitation-id-123');
   */
  static async resendInvitation(invitationId: string): Promise<ChildInvitationResponseDto> {
    console.log('🔵 Resending invitation:', invitationId);
    
    try {
      const response = await apiClient.put<ChildInvitationResponseDto>(
        `${this.BASE_PATH}/${invitationId}/resend`,
        {}
      );
      
      console.log('✅ Invitation resent');
      return response;
    } catch (error) {
      console.error('❌ Failed to resend invitation:', error);
      throw error;
    }
  }

  /**
   * Отозвать приглашение
   * 
   * Backend: DELETE /ChildInvitation/{id}/revoke
   * Authorization: Parent role required
   * 
   * @param invitationId - ID приглашения
   * @param reason - Причина отзыва (optional)
   * 
   * @example
   * await FamilyService.revokeInvitation('invitation-id-123', 'Email был неправильным');
   */
  static async revokeInvitation(invitationId: string, reason?: string): Promise<void> {
    console.log('🔵 Revoking invitation:', invitationId);
    
    try {
      // Backend accepts reason in query params or body - using query param approach
      const url = reason 
        ? `${this.BASE_PATH}/${invitationId}/revoke?reason=${encodeURIComponent(reason)}`
        : `${this.BASE_PATH}/${invitationId}/revoke`;
        
      await apiClient.delete(url);
      
      console.log('✅ Invitation revoked');
    } catch (error) {
      console.error('❌ Failed to revoke invitation:', error);
      throw error;
    }
  }

  // ========================================
  // PUBLIC INVITATION ENDPOINTS (No Auth Required)
  // ========================================

  /**
   * Получить информацию о приглашении по токену (PUBLIC)
   * 
   * Backend: GET /ChildInvitation/info/{token}
   * Authorization: None (public endpoint)
   * 
   * Используется на странице /accept-invite/:token для отображения
   * информации о приглашении перед регистрацией.
   * 
   * @param token - Токен приглашения из URL
   * @returns Информация о валидности и деталях приглашения
   * 
   * @example
   * const info = await FamilyService.getInvitationInfo('abc123token');
   * if (info.isValid) {
   *   // Show registration form
   * } else {
   *   // Show error: expired/revoked/already used
   * }
   */
  static async getInvitationInfo(token: string): Promise<InvitationInfoDto> {
    console.log('🔵 Getting invitation info for token:', token.substring(0, 10) + '...');
    
    try {
      const backendResponse = await apiClient.get<any>(
        `${this.BASE_PATH}/info/${token}`
      );
      
          // Map backend response to frontend expected format
          const info: InvitationInfoDto = {
            isValid: backendResponse.isValid,
            errorMessage: backendResponse.errorMessage,
            invitationId: backendResponse.invitationId || '', // Backend doesn't return this
            parentName: backendResponse.parentName,
            parentEmail: backendResponse.parentEmail || '', // Backend doesn't return this
            childEmail: backendResponse.childEmail || '', // Backend doesn't return this
            childName: backendResponse.childFullName?.split(' ')[0] || '', // Extract first name
            childSurname: backendResponse.childFullName?.split(' ').slice(1).join(' ') || '', // Extract surname
            expiresAt: backendResponse.expiryDate,
            status: backendResponse.status || 'active' // Backend doesn't return this
          };
      
      console.log('✅ Invitation info:', info.isValid ? 'Valid' : 'Invalid');
      console.log('🔧 Mapped info:', info);
      return info;
    } catch (error) {
      console.error('❌ Failed to get invitation info:', error);
      throw error;
    }
  }

  /**
   * Принять приглашение и создать аккаунт ребенка (PUBLIC)
   * 
   * Backend: POST /ChildInvitation/accept
   * Authorization: None (public endpoint)
   * 
   * Создает аккаунт Student, привязывает к Parent, автоматически логинит.
   * 
   * GDPR: Требует согласия на обработку данных (agreedToTerms, agreedToDataProcessing).
   * 
   * @param data - Данные регистрации с токеном приглашения
   * @returns AuthenticationResultDto с токенами для автоматического входа
   * 
   * @example
   * const result = await FamilyService.acceptInvitation({
   *   invitationToken: 'abc123',
   *   email: 'student@example.com',
   *   password: 'SecurePass123!',
   *   name: 'Ion',
   *   surname: 'Popescu',
   *   childClass: '10',
   *   agreedToTerms: true,
   *   agreedToDataProcessing: true
   * });
   * 
   * if (result.isSuccess) {
   *   // Store tokens and redirect to dashboard
   *   localStorage.setItem('token', result.accessToken);
   * }
   */
  static async acceptInvitation(
    data: AcceptChildInvitationDto
  ): Promise<AuthenticationResultDto> {
    console.log('🔵 Accepting invitation for email:', data.email);
    
    // Enrich data with browser info
    const enrichedData = {
      ...data,
      userAgent: navigator.userAgent
    };
    
    try {
      const backendResponse = await apiClient.post<any>(
        `${this.BASE_PATH}/accept`,
        enrichedData
      );
      
      // Map backend response to frontend expected format
      const result: AuthenticationResultDto = {
        isSuccess: backendResponse.isSuccess,
        accessToken: backendResponse.token, // Backend returns 'token', frontend expects 'accessToken'
        refreshToken: backendResponse.refreshToken || '', // Backend might not return this
        expiresIn: backendResponse.expiresIn || 86400, // Default 24 hours
        user: backendResponse.user || {
          id: '',
          email: data.email,
          name: data.name,
          surname: data.surname,
          phoneNumber: '',
          role: 'Student'
        }, // Backend might not return user details
        errorMessage: backendResponse.errorMessage
      };
      
      console.log('✅ Invitation accepted, student account created');
      console.log('🔧 Mapped result:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to accept invitation:', error);
      throw error;
    }
  }

  // ========================================
  // PARENT DASHBOARD ENDPOINTS
  // ========================================

  /**
   * Получить обзор семейной панели
   * 
   * Backend: GET /ParentDashboard/overview
   * Authorization: Parent role required
   * 
   * Возвращает:
   * - Список детей с их статусами
   * - Pending invitations
   * - Статистику приглашений
   * - Недавние приглашения (последние 5)
   * 
   * @returns Полный обзор для Parent Dashboard
   * 
   * @example
   * const overview = await FamilyService.getDashboardOverview();
   * console.log('Total children:', overview.totalChildren);
   * console.log('Pending invitations:', overview.pendingInvitations);
   */
  static async getDashboardOverview(): Promise<ParentDashboardOverviewDto> {
    console.log('🔵 Fetching parent dashboard overview');
    
    try {
      const overview = await apiClient.get<ParentDashboardOverviewDto>(
        `${this.DASHBOARD_PATH}/overview`
      );
      
      console.log('✅ Dashboard overview loaded:', {
        children: overview.totalChildren,
        pending: overview.pendingInvitations
      });
      
      return overview;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Получить детальную информацию о ребенке
   * 
   * Backend: GET /ParentDashboard/children/{childId}
   * Authorization: Parent role required
   * 
   * Проверяет, что ребенок принадлежит родителю.
   * 
   * @param childId - ID ребенка
   * @returns Детали ребенка: профиль, согласия, история приглашения
   * 
   * @example
   * const child = await FamilyService.getChildDetails('child-id-123');
   * console.log('Child name:', child.name);
   * console.log('Active consents:', child.consents.filter(c => c.isGranted));
   */
  static async getChildDetails(childId: string): Promise<ChildDetailDto> {
    console.log('🔵 Fetching child details:', childId);
    
    try {
      const details = await apiClient.get<ChildDetailDto>(
        `${this.DASHBOARD_PATH}/children/${childId}`
      );
      
      console.log('✅ Child details loaded:', details.name);
      return details;
    } catch (error) {
      console.error('❌ Failed to fetch child details:', error);
      throw error;
    }
  }

  /**
   * Управление согласием ребенка (GDPR)
   * 
   * Backend: POST /ParentDashboard/children/{childId}/consents/{consentType}
   * Authorization: Parent role required
   * 
   * Родитель может предоставлять или отзывать согласия от имени ребенка.
   * 
   * Типы согласий:
   * - DataProcessing - обработка персональных данных
   * - Marketing - маркетинговые коммуникации
   * - Analytics - аналитика и tracking
   * 
   * @param childId - ID ребенка
   * @param consentType - Тип согласия
   * @param data - Предоставить или отозвать
   * 
   * @example
   * // Grant consent
   * await FamilyService.manageChildConsent('child-123', 'DataProcessing', {
   *   isGranted: true
   * });
   * 
   * // Revoke consent
   * await FamilyService.manageChildConsent('child-123', 'Marketing', {
   *   isGranted: false,
   *   reason: 'Parent request'
   * });
   */
  static async manageChildConsent(
    childId: string,
    consentType: string,
    data: ManageConsentDto
  ): Promise<void> {
    console.log(`🔵 Managing consent for child ${childId}: ${consentType} = ${data.isGranted}`);
    
    try {
      await apiClient.post(
        `${this.DASHBOARD_PATH}/children/${childId}/consents/${consentType}`,
        data
      );
      
      console.log('✅ Consent updated');
    } catch (error) {
      console.error('❌ Failed to manage consent:', error);
      throw error;
    }
  }

  /**
   * Деактивировать аккаунт ребенка
   * 
   * Backend: POST /ParentDashboard/children/{childId}/deactivate
   * Authorization: Parent role required
   * 
   * ВНИМАНИЕ: Это серьезное действие!
   * - deleteData=true: Right to be Forgotten (удаление всех данных)
   * - deleteData=false: Деактивация без удаления (можно реактивировать)
   * 
   * @param childId - ID ребенка
   * @param data - Причина и опция удаления данных
   * 
   * @example
   * await FamilyService.deactivateChild('child-123', {
   *   reason: 'No longer needs tutoring',
   *   deleteData: false
   * });
   */
  static async deactivateChild(
    childId: string,
    data: DeactivateAccountDto
  ): Promise<void> {
    console.log('🔵 Deactivating child account:', childId);
    console.warn('⚠️ This is a critical action:', data.deleteData ? 'WITH data deletion' : 'WITHOUT data deletion');
    
    try {
      await apiClient.post(
        `${this.DASHBOARD_PATH}/children/${childId}/deactivate`,
        data
      );
      
      console.log('✅ Child account deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate child account:', error);
      throw error;
    }
  }

  // ========================================
  // DEPRECATED METHODS (Legacy, будут удалены)
  // ========================================

  /**
   * @deprecated Use createInvitation() instead
   * Backend endpoint changed from /Parents/{id}/invite-child to /ChildInvitation/create
   */
  static async generateChildInvite(_parentId: string): Promise<never> {
    console.warn('⚠️ DEPRECATED: Use FamilyService.createInvitation() instead');
    throw new Error('This method is deprecated. Use createInvitation() with CreateChildInvitationDto');
  }

  /**
   * @deprecated Use acceptInvitation() instead
   * Backend endpoint changed to /ChildInvitation/accept
   */
  static async acceptChildInvite(_data: unknown): Promise<never> {
    console.warn('⚠️ DEPRECATED: Use FamilyService.acceptInvitation() instead');
    throw new Error('This method is deprecated. Use acceptInvitation() with AcceptChildInvitationDto');
  }

  /**
   * @deprecated Use getDashboardOverview().children instead
   * Backend endpoint changed to /ParentDashboard/overview
   */
  static async getChildren(_parentId: string): Promise<never> {
    console.warn('⚠️ DEPRECATED: Use FamilyService.getDashboardOverview() instead');
    throw new Error('This method is deprecated. Use getDashboardOverview() to get children list');
  }

  /**
   * @deprecated Use manageChildConsent() or deactivateChild() instead
   */
  static async unlinkChild(_parentId: string, _studentId: string): Promise<never> {
    console.warn('⚠️ DEPRECATED: Use FamilyService.deactivateChild() instead');
    throw new Error('This method is deprecated. Use deactivateChild() for proper account management');
  }

  /**
   * @deprecated Use getInvitationInfo() instead
   */
  static async validateInviteToken(_token: string): Promise<never> {
    console.warn('⚠️ DEPRECATED: Use FamilyService.getInvitationInfo() instead');
    throw new Error('This method is deprecated. Use getInvitationInfo() for token validation');
  }
}
