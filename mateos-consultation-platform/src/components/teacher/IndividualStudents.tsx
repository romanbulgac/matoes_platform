import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConsultationService } from '@/services/consultationService';
import type { Student } from '@/types';
import type { ConsultationDto } from '@/types/api';
import { ConsultationStatus } from '@/types/api';
import { getScheduledTimestamp, parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, Clock, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * IndividualStudents - Componenta pentru afișarea elevilor cu consultații individuale
 * 
 * Funcționalități:
 * - Afișează elevii care au consultații individuale cu profesorul
 * - Grupează consultațiile pe elev
 * - Arată consultațiile viitoare pentru fiecare elev
 * - Click pe card navighează la detalii elev sau consultație
 * - Empty state când nu există elevi cu consultații individuale
 */
export const IndividualStudents: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<ConsultationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndividualConsultations = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // Get all consultations and filter for individual type
        const allConsultations = await ConsultationService.getAll();
        // Filter for individual consultations (those without groupId)
        const individualConsultations = allConsultations.filter(
          c => !c.groupId && c.teacherId === user.id && c.individualStudentId
        );
        setConsultations(individualConsultations);
      } catch (error) {
        console.error('Error loading individual consultations:', error);
        toast({
          title: 'Eroare',
          description: 'Nu s-au putut încărca consultațiile individuale',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadIndividualConsultations();
  }, [user?.id, toast]);

  const handleCreateConsultation = () => {
    // TODO: Navigate to consultation creation page
    toast({
      title: 'În dezvoltare',
      description: 'Funcționalitatea de creare consultație va fi disponibilă în curând'
    });
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group consultations by student
  const studentConsultationsMap = new Map<string, {
    student: Student;
    consultations: ConsultationDto[];
  }>();

  consultations.forEach(consultation => {
    // individualStudentId can be array or string - ensure it's array
    const studentIds = !consultation.individualStudentId 
      ? []
      : Array.isArray(consultation.individualStudentId)
        ? consultation.individualStudentId
        : [consultation.individualStudentId];
    
    studentIds.forEach(studentId => {
      const existing = studentConsultationsMap.get(studentId);
      
      if (existing) {
        existing.consultations.push(consultation);
      } else {
        // Find student info from participants (UserDto uses PascalCase)
        const studentParticipant = consultation.participants.find(p => p.id === studentId);
        
        // Create student object from participant data or use defaults
        const student: Student = {
          id: studentId,
          firstname: studentParticipant?.name || 'Student',
          lastname: studentParticipant?.surname || '',
          email: studentParticipant?.email || '',
        };
        
        studentConsultationsMap.set(studentId, {
          student,
          consultations: [consultation]
        });
      }
    });
  });

  const studentsList = Array.from(studentConsultationsMap.values());

  // Empty state
  if (studentsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <User className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nu există elevi cu consultații individuale</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Creează consultații individuale pentru a lucra personal cu elevii tăi.
          Consultațiile individuale oferă atenție personalizată.
        </p>
        <Button onClick={handleCreateConsultation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Creează consultație individuală
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Elevi Individuali</h2>
          <p className="text-muted-foreground">
            {studentsList.length} {studentsList.length === 1 ? 'elev activ' : 'elevi activi'}
          </p>
        </div>
        <Button onClick={handleCreateConsultation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Consultație nouă
        </Button>
      </div>

      {/* Students List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {studentsList.map(({ student, consultations: studentConsultations }) => {
          // Filter upcoming consultations
          const upcomingConsultations = studentConsultations.filter(c =>
            parseScheduledDate(c.scheduledAt) > new Date() && c.status === ConsultationStatus.Scheduled
          );

          // Get next consultation
          const nextConsultation = upcomingConsultations.sort(
            (a, b) => getScheduledTimestamp(a.scheduledAt) - getScheduledTimestamp(b.scheduledAt)
          )[0];

          // Calculate initials
          const initials = `${student.firstname[0]}${student.lastname[0]}`.toUpperCase();

          return (
            <Card
              key={student.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm"
              onClick={() => handleStudentClick(student.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {student.firstname} {student.lastname}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {student.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Class Badge */}
                  {student.class && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Clasa {student.class}
                      </Badge>
                      {student.subjectLevel && (
                        <Badge variant="secondary">
                          {student.subjectLevel}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Consultations Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-semibold">{upcomingConsultations.length}</span>{' '}
                        viitoare
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold">{studentConsultations.length}</span>{' '}
                        total
                      </span>
                    </div>
                  </div>

                  {/* Next Consultation */}
                  {nextConsultation && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Următoarea consultație:</p>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {parseScheduledDate(nextConsultation.scheduledAt).toLocaleDateString('ro-RO', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {parseScheduledDate(nextConsultation.scheduledAt).toLocaleTimeString('ro-RO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}{' '}
                            • {nextConsultation.duration} min
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No upcoming consultations */}
                  {upcomingConsultations.length === 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground italic">
                        Nu există consultații programate
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
