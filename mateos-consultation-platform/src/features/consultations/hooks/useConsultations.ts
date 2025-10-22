import { useState, useEffect, useCallback } from 'react';
import { useAppStore, ConsultationEntity } from '@/shared';
import { ConsultationService } from '@/services/consultationService';
import { Consultation, ConsultationStatus } from '@/types';

interface UseConsultationsOptions {
  status?: ConsultationStatus;
  teacherId?: string;
  studentId?: string;
  limit?: number;
  autoLoad?: boolean;
}

export const useConsultations = (options: UseConsultationsOptions = {}) => {
  const { user } = useAppStore();
  const [consultations, setConsultations] = useState<ConsultationEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoLoad = true, ...filterOptions } = options;

  const loadConsultations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Mock data for now - would use ConsultationService.getAll with filters
      const mockConsultations: Consultation[] = [];
      
      let filteredConsultations = mockConsultations.map(c => ConsultationEntity.fromApiResponse(c));

      // Apply filters
      if (filterOptions.status) {
        filteredConsultations = filteredConsultations.filter(c => c.status === filterOptions.status);
      }

      if (filterOptions.teacherId) {
        filteredConsultations = filteredConsultations.filter(c => c.teacherId === filterOptions.teacherId);
      }

      if (filterOptions.studentId) {
        filteredConsultations = filteredConsultations.filter(c => c.studentId === filterOptions.studentId);
      }

      if (filterOptions.limit) {
        filteredConsultations = filteredConsultations.slice(0, filterOptions.limit);
      }

      setConsultations(filteredConsultations);
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea consultațiilor');
    } finally {
      setLoading(false);
    }
  }, [user, filterOptions]);

  const createConsultation = useCallback(async (consultationData: Partial<Consultation>) => {
    try {
      setLoading(true);
      setError(null);

      // Mock creation - would use ConsultationService.create
      const newConsultation = ConsultationEntity.createEmpty();
      
      setConsultations(prev => [newConsultation, ...prev]);
      
      return { success: true, consultation: newConsultation };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la crearea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConsultation = useCallback(async (id: string, updates: Partial<Consultation>) => {
    try {
      setLoading(true);
      setError(null);

      // Mock update - would use ConsultationService.update
      setConsultations(prev => 
        prev.map(c => c.id === id ? ConsultationEntity.fromApiResponse({ ...c, ...updates }) : c)
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la actualizarea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Mock cancellation - would use ConsultationService.cancel
      setConsultations(prev => 
        prev.map(c => c.id === id ? ConsultationEntity.fromApiResponse({ ...c, status: 'cancelled' as ConsultationStatus }) : c)
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la anularea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Mock confirmation - would use ConsultationService.confirm
      setConsultations(prev => 
        prev.map(c => c.id === id ? ConsultationEntity.fromApiResponse({ ...c, status: 'confirmed' as ConsultationStatus }) : c)
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la confirmarea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const startConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Mock start - would use ConsultationService.start
      setConsultations(prev => 
        prev.map(c => c.id === id ? ConsultationEntity.fromApiResponse({ ...c, status: 'in_progress' as ConsultationStatus }) : c)
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la pornirea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const completeConsultation = useCallback(async (id: string, rating?: number, feedback?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Mock completion - would use ConsultationService.complete
      setConsultations(prev => 
        prev.map(c => c.id === id ? ConsultationEntity.fromApiResponse({ 
          ...c, 
          status: 'completed' as ConsultationStatus,
          rating,
          feedback
        }) : c)
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la finalizarea consultației';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load consultations
  useEffect(() => {
    if (autoLoad) {
      loadConsultations();
    }
  }, [autoLoad, loadConsultations]);

  // Derived state
  const upcomingConsultations = consultations.filter(c => c.isUpcoming());
  const completedConsultations = consultations.filter(c => c.isCompleted());
  const pendingConsultations = consultations.filter(c => c.isPending());
  const confirmedConsultations = consultations.filter(c => c.isConfirmed());
  const inProgressConsultations = consultations.filter(c => c.isInProgress());

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    consultations,
    upcomingConsultations,
    completedConsultations,
    pendingConsultations,
    confirmedConsultations,
    inProgressConsultations,
    
    // State
    loading,
    error,
    
    // Actions
    loadConsultations,
    createConsultation,
    updateConsultation,
    cancelConsultation,
    confirmConsultation,
    startConsultation,
    completeConsultation,
    clearError,

    // Helper methods
    hasUpcoming: upcomingConsultations.length > 0,
    hasPending: pendingConsultations.length > 0,
    hasInProgress: inProgressConsultations.length > 0,
    totalCount: consultations.length,
  };
};
