import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Group, Student } from '@/types';
import { AlertCircle, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { GroupCapacityBadge } from './GroupCapacityBadge';

interface AddMemberDialogProps {
  group: Group;
  onMemberAdded?: (student: Student) => void;
  trigger?: React.ReactNode;
}

/**
 * AddMemberDialog - Dialog pentru adăugarea de membri în grup
 * 
 * Funcționalități:
 * - Verifică capacitatea grupului înainte de a permite adăugare
 * - Căutare student după email sau ID
 * - Previne adăugarea când grupa este completă
 * - Arată mini-group capacity (3 sau 6)
 * - Mesaje de warning când se apropie de capacitate maximă
 * - Validare și error handling
 */
export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  group,
  onMemberAdded,
  trigger
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');

  const currentMembers = group.members?.length || 0;
  const maxCapacity = group.maxCapacity;
  const isFull = currentMembers >= maxCapacity;
  const spotsLeft = maxCapacity - currentMembers;
  const isAlmostFull = spotsLeft <= 1 && !isFull;

  const handleAddMember = async () => {
    if (!studentEmail.trim()) {
      toast({
        title: 'Email necesar',
        description: 'Te rog introdu email-ul studentului',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // TODO: First search for student by email to get studentId
      // For now, assuming studentEmail is actually studentId
      const studentId = studentEmail.trim();
      
      await GroupService.addMember(group.id, studentId);
      
      toast({
        title: 'Student adăugat',
        description: `Studentul a fost adăugat cu succes în grupul "${group.name}"`
      });

      // Call callback if provided
      if (onMemberAdded) {
        // In real implementation, fetch the added student details
        onMemberAdded({
          id: studentId,
          firstname: 'Student',
          lastname: 'Nou',
          email: studentEmail
        });
      }

      setStudentEmail('');
      setOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut adăuga studentul în grup',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            disabled={isFull}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Adaugă membru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adaugă membru în grup</DialogTitle>
          <DialogDescription>
            Adaugă un student în grupul "{group.name}" (Clasa {group.class})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Capacity Badge */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Capacitate actuală:</span>
            <GroupCapacityBadge
              currentMembers={currentMembers}
              maxCapacity={maxCapacity}
              variant="default"
            />
          </div>

          {/* Warning for almost full */}
          {isAlmostFull && (
            <Alert variant="default" className="border-orange-300 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Atenție!</strong> Grupul este aproape complet. 
                Mai {spotsLeft === 1 ? 'este' : 'sunt'} doar {spotsLeft} {spotsLeft === 1 ? 'loc disponibil' : 'locuri disponibile'}.
              </AlertDescription>
            </Alert>
          )}

          {/* Full capacity warning */}
          {isFull && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Grupul este complet!</strong> Capacitatea maximă de {maxCapacity} membri a fost atinsă.
                {maxCapacity === 3 && ' Acest mini-grup de 3 persoane este plin.'}
                {maxCapacity === 6 && ' Acest mini-grup de 6 persoane este plin.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Mini-group info */}
          {!isFull && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Acest este un <strong>mini-grup de {maxCapacity} persoane</strong>. 
                Format optim pentru consultații personalizate.
                {maxCapacity === 3 && ' Ideal pentru atenție individuală maximă.'}
                {maxCapacity === 6 && ' Perfect pentru interacțiune în grup mic.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Student Email Input */}
          {!isFull && (
            <div className="space-y-2">
              <Label htmlFor="student-email">Email student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  disabled={loading}
                  className="pl-9"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleAddMember();
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Introdu email-ul studentului pe care dorești să-l adaugi în acest grup.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Anulează
          </Button>
          {!isFull && (
            <Button 
              onClick={handleAddMember}
              disabled={loading || !studentEmail.trim()}
            >
              {loading ? 'Adăugare...' : 'Adaugă student'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
