import { useState, useEffect, useCallback } from 'react';
import { useAppStore, UserEntity, ConsultationEntity, PaymentEntity } from '@/shared';
import { ConsultationService } from '@/services/consultationService';
import { PaymentService } from '@/services/paymentService';
import { Consultation, Payment } from '@/types';

interface DashboardStats {
  totalConsultations: number;
  upcomingConsultations: number;
  completedConsultations: number;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentConsultations: ConsultationEntity[];
  upcomingConsultations: ConsultationEntity[];
  recentPayments: PaymentEntity[];
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const { user } = useAppStore();
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalConsultations: 0,
      upcomingConsultations: 0,
      completedConsultations: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      pendingPayments: 0,
    },
    recentConsultations: [],
    upcomingConsultations: [],
    recentPayments: [],
    loading: true,
    error: null,
  });

  const userEntity = user ? UserEntity.fromApiResponse(user) : null;

  const loadDashboardData = useCallback(async () => {
    if (!userEntity) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Load consultations - using mock data for now since exact API structure is not clear
      const consultationsData: Consultation[] = []; // This would come from ConsultationService
      const consultations = consultationsData.map((c: Consultation) => ConsultationEntity.fromApiResponse(c));

      // Load payments - using mock data for now
      const paymentsData: Payment[] = []; // This would come from PaymentService
      const payments = paymentsData.map((p: Payment) => PaymentEntity.fromApiResponse(p));

      // Calculate stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const stats: DashboardStats = {
        totalConsultations: consultations.length,
        upcomingConsultations: consultations.filter((c: ConsultationEntity) => c.isUpcoming()).length,
        completedConsultations: consultations.filter((c: ConsultationEntity) => c.isCompleted()).length,
        totalEarnings: payments.filter((p: PaymentEntity) => p.isSucceeded()).reduce((sum: number, p: PaymentEntity) => sum + p.amount, 0),
        monthlyEarnings: payments
          .filter((p: PaymentEntity) => {
            const paymentDate = p.createdAt;
            return p.isSucceeded() && 
                   paymentDate.getMonth() === currentMonth && 
                   paymentDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, p: PaymentEntity) => sum + p.amount, 0),
        pendingPayments: payments.filter((p: PaymentEntity) => p.isPending() || p.isProcessing()).length,
      };

      // Get recent and upcoming consultations
      const recentConsultations = consultations
        .filter((c: ConsultationEntity) => c.isCompleted())
        .sort((a: ConsultationEntity, b: ConsultationEntity) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
        .slice(0, 5);

      const upcomingConsultations = consultations
        .filter((c: ConsultationEntity) => c.isUpcoming())
        .sort((a: ConsultationEntity, b: ConsultationEntity) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
        .slice(0, 5);

      // Get recent payments
      const recentPayments = payments
        .sort((a: PaymentEntity, b: PaymentEntity) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      setData({
        stats,
        recentConsultations,
        upcomingConsultations,
        recentPayments,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la încărcarea datelor dashboard',
      }));
    }
  }, [userEntity]);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Dashboard actions
  const quickActions = {
    scheduleConsultation: useCallback(() => {
      // Navigate to schedule consultation page
      // This would be implemented based on routing
    }, []),

    viewAllConsultations: useCallback(() => {
      // Navigate to consultations page
      // This would be implemented based on routing
    }, []),

    viewPayments: useCallback(() => {
      // Navigate to payments page
      // This would be implemented based on routing
    }, []),

    updateProfile: useCallback(() => {
      // Navigate to profile page
      // This would be implemented based on routing
    }, []),
  };

  // Chart data for analytics
  const getConsultationsChartData = useCallback(() => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthConsultations = data.recentConsultations.filter((c: ConsultationEntity) => {
        const consultationDate = c.scheduledAt;
        return consultationDate.getMonth() === date.getMonth() &&
               consultationDate.getFullYear() === date.getFullYear();
      }).length;

      last6Months.push({
        month: date.toLocaleDateString('ro-RO', { month: 'short' }),
        consultations: monthConsultations,
      });
    }

    return last6Months;
  }, [data.recentConsultations]);

  const getEarningsChartData = useCallback(() => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEarnings = data.recentPayments
        .filter((p: PaymentEntity) => {
          const paymentDate = p.createdAt;
          return p.isSucceeded() &&
                 paymentDate.getMonth() === date.getMonth() &&
                 paymentDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum: number, p: PaymentEntity) => sum + p.amount, 0);

      last6Months.push({
        month: date.toLocaleDateString('ro-RO', { month: 'short' }),
        earnings: monthEarnings,
      });
    }

    return last6Months;
  }, [data.recentPayments]);

  return {
    // Data
    ...data,
    userEntity,

    // Actions
    refreshData,
    quickActions,

    // Chart data
    consultationsChartData: getConsultationsChartData(),
    earningsChartData: getEarningsChartData(),

    // Helper methods
    hasUpcomingConsultations: data.upcomingConsultations.length > 0,
    hasPendingPayments: data.stats.pendingPayments > 0,
    isTeacher: userEntity?.isTeacher() || false,
    isStudent: userEntity?.isStudent() || false,
  };
};
