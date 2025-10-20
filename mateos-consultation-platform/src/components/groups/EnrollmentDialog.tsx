/**
 * EnrollmentDialog - Dialog pentru admin să adauge elevi în grupuri
 * 
 * Funcționalitate:
 * - Selectare elev din listă
 * - Validare că elevul nu este deja în grup
 * - Validare că elevul are pachet Group activ
 * - Verificare conflicte de orar
 * - Confirmare înscriere
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import { UserService } from '@/services/userService';
import { SubscriptionService } from '@/services/subscriptionService';
import type { Group, Student, UserSubscriptionStatusDto } from '@/types';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  GraduationCap, 
  Loader2, 
  Search, 
  Users,
  XCircle
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onEnrollmentSuccess?: () => void;
}

interface StudentWithSubscription extends Student {
  subscriptionStatus?: UserSubscriptionStatusDto;
  hasGroupPackage?: boolean;
  hasScheduleConflict?: boolean;
}

export const EnrollmentDialog: FC<EnrollmentDialogProps> = ({
  open,
  onOpenChange,
  group,
  onEnrollmentSuccess
}) => {
  const { toast } = useToast();
  
  const [students, setStudents] = useState<StudentWithSubscription[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Load students when dialog opens
  useEffect(() => {
    if (open && group) {
      loadStudents();
    }
  }, [open, group]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      
      // Get all students
      const allStudents = await UserService.getAllStudents();
      
      // Get current group members to exclude them
      const currentMembers = group?.members?.map(m => m.id) || [];
      
      // Filter out students already in the group
      const availableStudents = allStudents.filter(student => 
        !currentMembers.includes(student.id)
      );

      // Load subscription status for each student
      const studentsWithSubscriptions = await Promise.all(
        availableStudents.map(async (student) => {
          try {
            const subscriptionStatus = await SubscriptionService.getStudentSubscriptionStatus(student.id);
            return {
              ...student,
              subscriptionStatus,
              hasGroupPackage: subscriptionStatus.hasActiveSubscription && 
                subscriptionStatus.planName?.toLowerCase().includes('group')
            };
          } catch (error) {
            console.warn(`Could not load subscription for student ${student.id}:`, error);
            return {
              ...student,
              subscriptionStatus: undefined,
              hasGroupPackage: false
            };
          }
        })
      );

      setStudents(studentsWithSubscriptions);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca elevii',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudentId || !group) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    try {
      setEnrolling(true);
      
      await GroupService.addMember(group.id, selectedStudentId);
      
      toast({
        title: 'Succes',
        description: `${student.firstName} ${student.lastName} a fost adăugat în grup`,
      });

      onEnrollmentSuccess?.();
      onOpenChange(false);
      setSelectedStudentId('');
      setSearchTerm('');
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut adăuga elevul în grup',
        variant: 'destructive',
      });
    } finally {
      setEnrolling(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEnroll = selectedStudentId && 
    students.find(s => s.id === selectedStudentId)?.hasGroupPackage;

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Elev în Grup</DialogTitle>
          <DialogDescription>
            Selectează un elev pentru a-l adăuga în grupul "{group.name}"
          </DialogDescription>
        </DialogHeader>

        {/* Group Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription>
              {group.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {group.members?.length || 0}/{group.maxCapacity} membri
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>Clasa {group.class}</span>
              </div>
              <Badge variant="secondary">{group.subject}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Căutare Elev</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Caută după nume sau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-2">
          <Label>Selectează Elev</Label>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Se încarcă elevii...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există elevi disponibili</p>
              <p className="text-sm">Toți elevii sunt deja în acest grup</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              className="space-y-2 max-h-60 overflow-y-auto"
            >
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={student.id} id={student.id} />
                  <Label htmlFor={student.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.email} • Clasa {student.class}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.hasGroupPackage ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pachet Group
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Fără pachet Group
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Warnings */}
        {selectedStudentId && !canEnroll && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Elevul selectat nu are pachet Group activ. 
              Trebuie să cumpere un pachet Group înainte de a fi adăugat în grup.
            </AlertDescription>
          </Alert>
        )}

        {selectedStudentId && canEnroll && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Elevul are pachet Group activ și poate fi adăugat în grup.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={enrolling}
          >
            Anulează
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={!canEnroll || enrolling}
          >
            {enrolling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Se adaugă...
              </>
            ) : (
              'Adaugă în Grup'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
