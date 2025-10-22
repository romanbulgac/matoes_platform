import { useState, useEffect } from 'react';
import { Consultation, ConsultationFilters } from '@/types';
import { consultationService } from '@/services';

export const useConsultations = (filters?: ConsultationFilters) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await consultationService.getAll(filters);
      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consultations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [JSON.stringify(filters)]);

  return {
    consultations,
    isLoading,
    error,
    refetch: fetchConsultations,
  };
};

