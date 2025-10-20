/**
 * ConsentService - Service pentru gestionarea consimțămințelor GDPR
 * 
 * Backend endpoints: /Consent, /DataProcessing, /RightToBeForgotten
 * NOTE: All DTOs are auto-transformed to camelCase by apiClient
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import type {
  ConsentDto,
  ConsentHistoryDto,
  DataProcessingInfoDto,
  DataPurposeDto,
  DeletionRequestDto,
  DeletionStatusDto
} from '@/types';
import { apiClient } from './api';

export class ConsentService {
  private static readonly CONSENT_PATH = '/Consent';
  private static readonly DATA_PROCESSING_PATH = '/DataProcessing';
  private static readonly RIGHT_TO_BE_FORGOTTEN_PATH = '/RightToBeForgotten';

  // ========================================
  // USER CONSENTS
  // ========================================

  /**
   * Obține consimțămintele unui utilizator
   */
  static async getUserConsents(userId: string): Promise<ConsentDto[]> {
    return await apiClient.get<ConsentDto[]>(`${this.CONSENT_PATH}/user/${userId}`);
  }

  /**
   * Acordă un consimțământ
   */
  static async grantConsent(consentType: string, userId?: string): Promise<void> {
    await apiClient.post<void>(`${this.CONSENT_PATH}/grant`, {
      consentType,
      userId
    });
  }

  /**
   * Retrage un consimțământ
   */
  static async withdrawConsent(consentType: string, reason?: string, userId?: string): Promise<void> {
    await apiClient.post<void>(`${this.CONSENT_PATH}/withdraw`, {
      consentType,
      reason,
      userId
    });
  }

  /**
   * Obține istoricul consimțămințelor unui utilizator
   */
  static async getConsentHistory(userId: string): Promise<ConsentHistoryDto[]> {
    return await apiClient.get<ConsentHistoryDto[]>(`${this.CONSENT_PATH}/history/${userId}`);
  }

  // ========================================
  // PARENT MANAGING CHILD CONSENTS
  // ========================================

  /**
   * Obține consimțămintele unui copil (pentru părinți)
   */
  static async getChildConsents(childId: string): Promise<ConsentDto[]> {
    return await apiClient.get<ConsentDto[]>(`${this.CONSENT_PATH}/child/${childId}`);
  }

  /**
   * Gestionează consimțământul unui copil (pentru părinți)
   */
  static async manageChildConsent(
    childId: string, 
    consentType: string, 
    granted: boolean, 
    reason?: string
  ): Promise<void> {
    await apiClient.post<void>(`${this.CONSENT_PATH}/child/${childId}/manage`, {
      consentType,
      granted,
      reason
    });
  }

  // ========================================
  // DATA PROCESSING INFO
  // ========================================

  /**
   * Obține informații despre procesarea datelor
   */
  static async getDataProcessingInfo(): Promise<DataProcessingInfoDto> {
    return await apiClient.get<DataProcessingInfoDto>(`${this.DATA_PROCESSING_PATH}/info`);
  }

  /**
   * Obține scopurile de procesare a datelor
   */
  static async getPurposes(): Promise<DataPurposeDto[]> {
    return await apiClient.get<DataPurposeDto[]>(`${this.DATA_PROCESSING_PATH}/purposes`);
  }

  // ========================================
  // RIGHT TO BE FORGOTTEN
  // ========================================

  /**
   * Solicită ștergerea datelor (Right to be Forgotten)
   */
  static async requestDataDeletion(reason: string): Promise<DeletionRequestDto> {
    return await apiClient.post<DeletionRequestDto>(`${this.RIGHT_TO_BE_FORGOTTEN_PATH}/request`, {
      reason
    });
  }

  /**
   * Obține statusul unei cereri de ștergere
   */
  static async getDeletionStatus(requestId: string): Promise<DeletionStatusDto> {
    return await apiClient.get<DeletionStatusDto>(`${this.RIGHT_TO_BE_FORGOTTEN_PATH}/status/${requestId}`);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Verifică dacă un utilizator are un consimțământ activ
   */
  static async hasConsent(userId: string, consentType: string): Promise<boolean> {
    try {
      const consents = await this.getUserConsents(userId);
      const consent = consents.find(c => c.consentType === consentType);
      return consent?.isGranted || false;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }

  /**
   * Obține toate consimțămintele active ale unui utilizator
   */
  static async getActiveConsents(userId: string): Promise<ConsentDto[]> {
    const consents = await this.getUserConsents(userId);
    return consents.filter(c => c.isGranted);
  }

  /**
   * Obține toate consimțămintele retrase ale unui utilizator
   */
  static async getWithdrawnConsents(userId: string): Promise<ConsentDto[]> {
    const consents = await this.getUserConsents(userId);
    return consents.filter(c => !c.isGranted);
  }
}
