import { apiClient } from './api';
import type { Subscription, SubscriptionUsage, Consultation } from '@/types';
import { ConsultationType } from '@/types';
import { ConsultationStatus } from '@/types/api';

/**
 * SubscriptionUsageService - Service pentru gestionarea utilizării abonamentelor
 * Backend endpoints: /Subscriptions, /Consultations
 */
export class SubscriptionUsageService {
  /**
   * Obține abonamentul activ al utilizatorului
   */
  static async getActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptions = await apiClient.get<Subscription[]>(`/Subscriptions/user/${userId}`);
      
      // Găsim abonamentul activ
      const activeSubscription = subscriptions.find(
        (sub) => sub.isActive && new Date(sub.currentPeriodEnd) > new Date()
      );
      
      return activeSubscription || null;
    } catch (error) {
      console.error('Error fetching active subscription:', error);
      return null;
    }
  }

  /**
   * Calculează utilizarea curentă a abonamentului
   */
  static async getCurrentUsage(userId: string): Promise<SubscriptionUsage | null> {
    const subscription = await this.getActiveSubscription(userId);
    
    if (!subscription) {
      return null;
    }

    // Obținem consultațiile din perioada curentă
    const consultations = await apiClient.get<Consultation[]>(
      `/Consultations?userId=${userId}&startDate=${subscription.currentPeriodStart}&endDate=${subscription.currentPeriodEnd}`
    );

    // Numărăm doar consultațiile completate de tip Subscription
    const usedConsultations = consultations.filter(
      (c) => 
        c.consultationType === ConsultationType.Subscription &&
        // @ts-ignore - TypeScript не может правильно вывести тип
        c.status === ConsultationStatus.Completed
    ).length;

    const maxConsultations = subscription.subscriptionPlan?.maxConsultationsPerMonth || 0;
    const unlimitedConsultations = subscription.subscriptionPlan?.unlimitedConsultations || false;
    
    const remainingConsultations = unlimitedConsultations 
      ? null 
      : Math.max(0, maxConsultations - usedConsultations);

    const canBookMore = unlimitedConsultations || (remainingConsultations !== null && remainingConsultations > 0);

    return {
      subscriptionId: subscription.id,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      usedConsultations,
      maxConsultations,
      unlimitedConsultations,
      remainingConsultations,
      canBookMore,
    };
  }

  /**
   * Verifică dacă utilizatorul poate rezerva o consultație prin abonament
   */
  static async canBookViaSubscription(userId: string): Promise<boolean> {
    const usage = await this.getCurrentUsage(userId);
    return usage?.canBookMore || false;
  }

  /**
   * Obține istoricul abonamentelor utilizatorului
   */
  static async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    return await apiClient.get<Subscription[]>(`/Subscriptions/user/${userId}`);
  }

  /**
   * Anulează abonamentul la sfârșitul perioadei curente
   */
  static async cancelSubscription(subscriptionId: string, reason?: string): Promise<Subscription> {
    return await apiClient.post<Subscription>(`/Subscriptions/${subscriptionId}/cancel`, {
      reason,
    });
  }

  /**
   * Reactivează un abonament anulat
   */
  static async reactivateSubscription(subscriptionId: string): Promise<Subscription> {
    return await apiClient.post<Subscription>(`/Subscriptions/${subscriptionId}/reactivate`, {});
  }
}
