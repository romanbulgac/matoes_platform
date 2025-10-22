import { api } from './apiClient';
import { Subscription, SubscriptionPlan, CheckoutData, UsageStats } from '@/types';

export const subscriptionService = {
  // Get available plans
  getAvailablePlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>('/subscriptions/plans');
    return response.data;
  },

  // Get plan details
  getPlanDetails: async (planId: string): Promise<SubscriptionPlan> => {
    const response = await api.get<SubscriptionPlan>(`/subscriptions/plans/${planId}`);
    return response.data;
  },

  // Get subscription status
  getSubscriptionStatus: async (): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  // Create checkout session
  createCheckout: async (data: CheckoutData): Promise<{ checkoutUrl: string }> => {
    const response = await api.post<{ checkoutUrl: string }>('/subscriptions/checkout', data);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string, reason?: string): Promise<void> => {
    await api.post(`/subscriptions/${subscriptionId}/cancel`, { reason });
  },

  // Pause subscription
  pauseSubscription: async (subscriptionId: string): Promise<void> => {
    await api.post(`/subscriptions/${subscriptionId}/pause`);
  },

  // Resume subscription
  resumeSubscription: async (subscriptionId: string): Promise<void> => {
    await api.post(`/subscriptions/${subscriptionId}/resume`);
  },

  // Get usage stats
  getUsageStats: async (subscriptionId: string): Promise<UsageStats> => {
    const response = await api.get<UsageStats>(`/subscriptions/${subscriptionId}/usage`);
    return response.data;
  },

  // Get billing portal URL
  getBillingPortalUrl: async (): Promise<{ portalUrl: string }> => {
    const response = await api.get<{ portalUrl: string }>('/subscriptions/billing-portal');
    return response.data;
  },

  // Sync with provider
  syncWithProvider: async (): Promise<void> => {
    await api.post('/subscriptions/sync');
  },
};

