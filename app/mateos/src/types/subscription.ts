export enum SubscriptionStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired',
  PENDING = 'Pending',
}

export enum BillingInterval {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: BillingInterval;
  consultationsPerMonth: number;
  features: string[];
  isPopular?: boolean;
  stripePriceId?: string;
  externalPriceId?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  studentId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  consultationsUsed: number;
  consultationsRemaining: number;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutData {
  planId: string;
  studentId: string;
  paymentMethod: 'stripe' | 'paypal';
  successUrl: string;
  cancelUrl: string;
}

export interface UsageStats {
  totalConsultations: number;
  usedConsultations: number;
  remainingConsultations: number;
  percentageUsed: number;
  daysRemaining: number;
}

