/**
 * SubscriptionService - Сервис для управления подписками
 * 
 * Backend: SubscriptionsController.cs
 * 
 * Доступно только для роли Parent (родители управляют подписками для детей)
 * Поддерживает любого провайдера платежей (Stripe, PayPal) через dependency injection
 * 
 * @author Mateos Platform
 * @version 2.0 - Refactored for SubscriptionsController
 * @date October 2025
 */

import type {
    BillingPortalResultDto,
    CancelSubscriptionRequestDto,
    CreateSubscriptionCheckoutDto,
    ParentChildDto,
    ParentSubscriptionDto,
    SubscriptionCheckoutResultDto,
    SubscriptionOperationResultDto,
    SubscriptionPlanInfoDto,
    SubscriptionUsageStatsDto,
    SyncResultDto,
    UpdateUserSubscriptionDto,
    UserSubscriptionStatusDto,
} from '@/types';
import { apiClient } from './api';

export class SubscriptionService {
  private static readonly BASE_PATH = '/Subscriptions';

  // ========================================
  // SUBSCRIPTION PLANS (Public Access)
  // ========================================

  /**
   * Получить доступные планы подписок
   * 
   * Backend: GET /Subscriptions/plans
   * Authorization: AllowAnonymous (публичный endpoint)
   * 
   * @returns Список всех доступных планов
   * 
   * @example
   * const plans = await SubscriptionService.getAvailablePlans();
   * plans.forEach(plan => {
   *   console.log(`${plan.name}: ${plan.price} RON/месяц`);
   * });
   */
  static async getAvailablePlans(): Promise<SubscriptionPlanInfoDto[]> {
    console.log('🔵 Fetching available subscription plans');
    
    try {
      const plans = await apiClient.get<SubscriptionPlanInfoDto[]>(
        `${this.BASE_PATH}/plans`
      );
      
      console.log(`✅ Found ${plans.length} subscription plans`);
      return plans;
    } catch (error) {
      console.error('❌ Error getting subscription plans:', error);
      throw error;
    }
  }

  /**
   * Alias pentru getAvailablePlans pentru compatibilitate
   */
  static async getPlans(): Promise<SubscriptionPlanInfoDto[]> {
    return this.getAvailablePlans();
  }

  /**
   * Alias pentru getSubscriptionStatus pentru compatibilitate
   */
  static async getStatus(): Promise<UserSubscriptionStatusDto> {
    return this.getSubscriptionStatus();
  }

  // ========================================
  // CHECKOUT & PURCHASE (Parent Only)
  // ========================================

  /**
   * Создать checkout сессию для покупки подписки
   * 
   * Backend: POST /Subscriptions/create-checkout
   * Authorization: Parent, Administrator, Admin
   * 
   * Работает с любым провайдером (Stripe, PayPal, etc.)
   * Только родители могут создавать подписки для детей
   * 
   * @param data - Данные для checkout (planId, successUrl, cancelUrl)
   * @returns Результат с URL для перенаправления на checkout
   * 
   * @example
   * const result = await SubscriptionService.createCheckoutSession({
   *   planId: 'plan_abc123',
   *   successUrl: 'https://example.com/success',
   *   cancelUrl: 'https://example.com/cancel'
   * });
   * 
   * // Redirect to checkout
   * window.location.href = result.checkoutUrl;
   */
  static async createCheckoutSession(
    data: CreateSubscriptionCheckoutDto
  ): Promise<SubscriptionCheckoutResultDto> {
    console.log('🔵 Creating checkout session for plan:', data.planId);
    
    try {
      const result = await apiClient.post<SubscriptionCheckoutResultDto>(
        `${this.BASE_PATH}/create-checkout`,
        data
      );
      
      console.log('✅ Checkout session created:', result.checkoutUrl);
      return result;
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      throw error;
    }
  }

  // ========================================
  // SUBSCRIPTION STATUS & MANAGEMENT
  // ========================================

  /**
   * Получить статус подписки пользователя
   * 
   * Backend: GET /Subscriptions/status
   * Authorization: Authenticated
   * 
   * Возвращает:
   * - Активная подписка или null
   * - Детали плана
   * - Статистика использования
   * - Дата следующего платежа
   * 
   * @returns Статус подписки пользователя
   * 
   * @example
   * const status = await SubscriptionService.getSubscriptionStatus();
   * if (status.hasActiveSubscription) {
   *   console.log('Plan:', status.planName);
   *   console.log('Expires:', status.currentPeriodEnd);
   * }
   */
  static async getSubscriptionStatus(): Promise<UserSubscriptionStatusDto> {
    console.log('🔵 Fetching subscription status');
    
    try {
      const status = await apiClient.get<UserSubscriptionStatusDto>(
        `${this.BASE_PATH}/status`
      );
      
      console.log('✅ Subscription status:', status.hasActiveSubscription ? 'Active' : 'None');
      return status;
    } catch (error) {
      console.error('❌ Error getting subscription status:', error);
      throw error;
    }
  }

  /**
   * Отменить подписку
   * 
   * Backend: POST /Subscriptions/cancel
   * Authorization: Parent, Administrator, Admin
   * 
   * Только родители могут отменять подписки.
   * Подписка остаётся активной до конца оплаченного периода.
   * 
   * @param reason - Причина отмены (опционально)
   * @returns Результат операции
   * 
   * @example
   * await SubscriptionService.cancelSubscription('No longer needed');
   */
  static async cancelSubscription(
    reason?: string
  ): Promise<SubscriptionOperationResultDto> {
    console.log('🔵 Cancelling subscription');
    
    try {
      const request: CancelSubscriptionRequestDto = {
        reason: reason || 'User request'
      };
      
      const result = await apiClient.post<SubscriptionOperationResultDto>(
        `${this.BASE_PATH}/cancel`,
        request
      );
      
      console.log('✅ Subscription cancelled');
      return result;
    } catch (error) {
      console.error('❌ Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Обновить подписку (сменить план)
   * 
   * Backend: PUT /Subscriptions/update
   * Authorization: Parent, Administrator, Admin
   * 
   * Только родители могут обновлять подписки.
   * 
   * @param data - Данные для обновления (новый planId)
   * @returns Результат операции
   * 
   * @example
   * await SubscriptionService.updateSubscription({
   *   newPlanId: 'plan_premium'
   * });
   */
  static async updateSubscription(
    data: UpdateUserSubscriptionDto
  ): Promise<SubscriptionOperationResultDto> {
    console.log('🔵 Updating subscription to plan:', data.newPlanId);
    
    try {
      const result = await apiClient.put<SubscriptionOperationResultDto>(
        `${this.BASE_PATH}/update`,
        data
      );
      
      console.log('✅ Subscription updated');
      return result;
    } catch (error) {
      console.error('❌ Error updating subscription:', error);
      throw error;
    }
  }

  // ========================================
  // BILLING PORTAL
  // ========================================

  /**
   * Создать сессию billing portal для управления подпиской
   * 
   * Backend: POST /Subscriptions/billing-portal
   * Authorization: Parent, Administrator, Admin
   * 
   * Позволяет родителям управлять подпиской:
   * - Обновить платёжный метод
   * - Просмотреть историю платежей
   * - Скачать счета
   * 
   * @returns URL для перенаправления в billing portal
   * 
   * @example
   * const result = await SubscriptionService.createBillingPortalSession();
   * window.location.href = result.portalUrl;
   */
  static async createBillingPortalSession(): Promise<BillingPortalResultDto> {
    console.log('🔵 Creating billing portal session');
    
    try {
      const result = await apiClient.post<BillingPortalResultDto>(
        `${this.BASE_PATH}/billing-portal`,
        {}
      );
      
      console.log('✅ Billing portal session created');
      return result;
    } catch (error) {
      console.error('❌ Error creating billing portal session:', error);
      throw error;
    }
  }

  // ========================================
  // USAGE & PREMIUM ACCESS
  // ========================================

  /**
   * Получить статистику использования подписки
   * 
   * Backend: GET /Subscriptions/usage
   * Authorization: Authenticated
   * 
   * Возвращает:
   * - Использованные консультации
   * - Оставшиеся консультации
   * - Период действия
   * - Лимиты плана
   * 
   * @returns Статистика использования
   * 
   * @example
   * const usage = await SubscriptionService.getUsageStats();
   * console.log(`Использовано: ${usage.consultationsUsed} / ${usage.consultationsLimit}`);
   */
  static async getUsageStats(): Promise<SubscriptionUsageStatsDto> {
    console.log('🔵 Fetching subscription usage stats');
    
    try {
      const usage = await apiClient.get<SubscriptionUsageStatsDto>(
        `${this.BASE_PATH}/usage`
      );
      
      console.log('✅ Usage stats:', usage);
      return usage;
    } catch (error) {
      console.error('❌ Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Проверить доступ к premium функциям
   * 
   * Backend: GET /Subscriptions/can-access-premium
   * Authorization: Authenticated
   * 
   * @returns true если пользователь может использовать premium функции
   * 
   * @example
   * const canAccess = await SubscriptionService.canAccessPremium();
   * if (canAccess) {
   *   // Show premium features
   * }
   */
  static async canAccessPremium(): Promise<boolean> {
    console.log('🔵 Checking premium access');
    
    try {
      const result = await apiClient.get<{ canAccessPremium: boolean }>(
        `${this.BASE_PATH}/can-access-premium`
      );
      
      console.log('✅ Premium access:', result.canAccessPremium);
      return result.canAccessPremium;
    } catch (error) {
      console.error('❌ Error checking premium access:', error);
      return false;
    }
  }

  // ========================================
  // STRIPE SYNC (Manual Synchronization)
  // ========================================

  /**
   * Синхронизировать данные подписки с провайдером (Stripe)
   * 
   * Backend: POST /Subscriptions/sync
   * Authorization: Authenticated
   * 
   * Используется для ручной синхронизации, если webhook не сработал
   * 
   * @returns Результат синхронизации
   * 
   * @example
   * const result = await SubscriptionService.syncWithProvider();
   * if (result.success) {
   *   console.log('Синхронизация завершена');
   * }
   */
  static async syncWithProvider(): Promise<SyncResultDto> {
    console.log('🔵 Syncing subscription with payment provider');
    
    try {
      const result = await apiClient.post<SyncResultDto>(
        `${this.BASE_PATH}/sync`,
        {}
      );
      
      console.log('✅ Sync completed');
      return result;
    } catch (error) {
      console.error('❌ Error syncing with provider:', error);
      throw error;
    }
  }

  // ========================================
  // PARENT-STUDENT SUBSCRIPTION MODEL (NEW)
  // ========================================

  /**
   * Получить список детей родителя для выбора при оформлении подписки
   * 
   * Backend: GET /Subscriptions/parent/has-children
   * Authorization: Parent
   * 
   * NEW: Parent-Student model
   * Возвращает список детей с информацией о наличии активной подписки
   * 
   * @returns Список детей с их подписками
   * 
   * @example
   * const children = await SubscriptionService.getParentChildren();
   * children.forEach(child => {
   *   console.log(`${child.name}: ${child.hasActiveSubscription ? 'Есть подписка' : 'Нет подписки'}`);
   * });
   */
  static async getParentChildren(): Promise<ParentChildDto[]> {
    console.log('🔵 Fetching parent children list');
    
    try {
      const children = await apiClient.get<ParentChildDto[]>(
        `${this.BASE_PATH}/parent/has-children`
      );
      
      console.log(`✅ Found ${children.length} children`);
      return children;
    } catch (error) {
      console.error('❌ Error getting parent children:', error);
      throw error;
    }
  }

  /**
   * Получить все подписки родителя (одна на каждого ребёнка)
   * 
   * Backend: GET /Subscriptions/parent/subscriptions
   * Authorization: Parent
   * 
   * NEW: Parent-Student model
   * Родитель может иметь несколько подписок - по одной на каждого ребёнка
   * Каждая подписка показывает отдельную статистику использования
   * 
   * @returns Список всех подписок с детальной информацией по каждому ребёнку
   * 
   * @example
   * const subscriptions = await SubscriptionService.getParentSubscriptions();
   * subscriptions.forEach(sub => {
   *   console.log(`${sub.studentName}: ${sub.consultationsUsed}/${sub.maxConsultationsPerMonth} занятий`);
   * });
   */
  static async getParentSubscriptions(): Promise<ParentSubscriptionDto[]> {
    console.log('🔵 Fetching all parent subscriptions');
    
    try {
      const subscriptions = await apiClient.get<ParentSubscriptionDto[]>(
        `${this.BASE_PATH}/parent/subscriptions`
      );
      
      console.log(`✅ Found ${subscriptions.length} subscriptions`);
      return subscriptions;
    } catch (error) {
      console.error('❌ Error getting parent subscriptions:', error);
      throw error;
    }
  }

  /**
   * Получить статус подписки конкретного студента
   * 
   * Backend: GET /Subscriptions/student/{studentId}/status
   * Authorization: Parent (только если студент является ребёнком этого родителя)
   * 
   * NEW: Parent-Student model
   * Проверяет право доступа - родитель может видеть только подписки своих детей
   * 
   * @param studentId - ID студента
   * @returns Статус подписки студента
   * 
   * @example
   * const status = await SubscriptionService.getStudentSubscriptionStatus('student-guid');
   * if (status.hasActiveSubscription) {
   *   console.log(`План: ${status.planName}`);
   * }
   */
  static async getStudentSubscriptionStatus(studentId: string): Promise<UserSubscriptionStatusDto> {
    console.log('🔵 Fetching subscription status for student:', studentId);
    
    try {
      const status = await apiClient.get<UserSubscriptionStatusDto>(
        `${this.BASE_PATH}/student/${studentId}/status`
      );
      
      console.log('✅ Student subscription status:', status.hasActiveSubscription ? 'Active' : 'None');
      return status;
    } catch (error) {
      console.error('❌ Error getting student subscription status:', error);
      throw error;
    }
  }
}
