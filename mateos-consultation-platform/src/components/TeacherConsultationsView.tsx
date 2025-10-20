import { TeacherConsultationCard } from '@/components/TeacherConsultationCard';
import { Card, CardContent } from '@/components/ui/card';
import { ConsultationDto } from '@/types/api';
import { CalendarDays } from 'lucide-react';

interface TeacherConsultationsViewProps {
  consultations: ConsultationDto[];
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function TeacherConsultationsView({ 
  consultations, 
  onStart,
  onCancel 
}: TeacherConsultationsViewProps) {
  
  if (consultations.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <CalendarDays className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nu aveți meditații</h3>
          <p className="text-gray-600 mb-6">Meditațiile dvs. vor apărea aici</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <TeacherConsultationCard
          key={consultation.id}
          consultation={consultation}
          onStart={onStart}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}