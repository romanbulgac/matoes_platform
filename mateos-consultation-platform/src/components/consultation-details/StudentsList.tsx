import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationDto } from '@/types/api';
import { Mail, Phone, Users2 } from 'lucide-react';
import { FC } from 'react';

interface StudentsListProps {
  consultation: ConsultationDto;
}

export const StudentsList: FC<StudentsListProps> = ({ consultation }) => {
  // Mock data - в реальности будет из API
  const students = consultation.participants || [];

  const getEnrolledCount = () => {
    if (!consultation.individualStudentId) return 0;
    const studentIds = Array.isArray(consultation.individualStudentId)
      ? consultation.individualStudentId
      : [consultation.individualStudentId];
    return studentIds.filter(id => id && id.trim()).length;
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getFullName = (student: typeof students[0]) => {
    return `${student.name} ${student.surname}`.trim();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-primary" />
            <Typography.H3 className="text-lg">Studenți înscriși</Typography.H3>
          </div>
          <Typography.Muted className="text-sm">
            {getEnrolledCount()} / {consultation.maxParticipants}
          </Typography.Muted>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <Typography.P className="text-slate-500">
              Niciun student înscris încă
            </Typography.P>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <div
                key={student.id || index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(student.name, student.surname)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Typography.P className="font-medium">{getFullName(student)}</Typography.P>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Mail className="w-3 h-3" />
                      <span>{student.email}</span>
                    </div>
                    {student.phoneNumber && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Phone className="w-3 h-3" />
                        <span>{student.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
