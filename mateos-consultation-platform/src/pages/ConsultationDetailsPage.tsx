import { AttendanceManagement } from '@/components/consultation-details/AttendanceManagement';
import { ConsultationHeader } from '@/components/consultation-details/ConsultationHeader';
import { MaterialsSection } from '@/components/consultation-details/MaterialsSection';
import { RatingsSection } from '@/components/consultation-details/RatingsSection';
import { StudentsList } from '@/components/consultation-details/StudentsList';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationService } from '@/services/consultationService';
import { ConsultationDto } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ConsultationDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: consultation, isLoading, error } = useQuery<ConsultationDto>({
    queryKey: ['consultation', id],
    queryFn: () => ConsultationService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <Typography.H3 className="text-rose-600 mb-2">Eroare</Typography.H3>
          <Typography.P className="text-slate-600">
            Nu s-a putut încărca consultația. Vă rugăm încercați din nou.
          </Typography.P>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/consultations')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Înapoi la consultații</span>
        </button>

        {/* Header Section */}
        <ConsultationHeader consultation={consultation} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Students & Attendance */}
          <div className="lg:col-span-2 space-y-6">
            <StudentsList consultation={consultation} />
            <AttendanceManagement consultation={consultation} />
          </div>

          {/* Right Column - Materials & Ratings */}
          <div className="space-y-6">
            <MaterialsSection consultation={consultation} />
            <RatingsSection consultation={consultation} />
          </div>
        </div>
      </div>
    </div>
  );
};
