import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Student } from '@/types';
import { AlertTriangle, Loader2, Mail, UserMinus } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * GroupMembersList - Lista detaliată a membrilor unui grup
 * 
 * Features:
 * - Afișează membri cu avatare și informații complete
 * - Statistici: procent prezență și note medii
 * - Opțiune de ștergere membru cu confirmare
 * - Indicatori vizuali pentru diferite tipuri de membri
 * - Empty state când grupul nu are membri
 * - Responsive design (grid → listă pe mobile)
 * 
 * @param groupId - ID-ul grupului
 * @param members - Lista membrilor (Student[]) - opțional dacă loadStatistics=true
 * @param onMemberRemoved - Callback după ștergere membru
 * @param allowRemove - Permite ștergerea membrilor (default: true)
 * @param loadStatistics - Dacă true, încarcă statistici automat din API (default: true)
 */

interface GroupMembersListProps {
  groupId: string;
  members?: Student[];
  onMemberRemoved?: () => void;
  allowRemove?: boolean;
  loadStatistics?: boolean;
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({
  groupId,
  members: providedMembers,
  onMemberRemoved,
  allowRemove = true,
  loadStatistics = true,
}) => {
  const { toast } = useToast();
  const [removingMember, setRemovingMember] = useState<Student | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [members, setMembers] = useState<Student[]>(providedMembers || []);
  const [isLoadingStats, setIsLoadingStats] = useState(loadStatistics);

  // Încarcă statistici la montare sau când se schimbă loadStatistics
  useEffect(() => {
    const fetchMembersWithStatistics = async () => {
      if (!loadStatistics) {
        // Folosește membrii furnizați
        if (providedMembers) {
          setMembers(providedMembers);
        }
        setIsLoadingStats(false);
        return;
      }

      try {
        setIsLoadingStats(true);
        const membersWithStats = await GroupService.getMembersWithStatistics(groupId);
        setMembers(membersWithStats);
      } catch (error) {
        console.error('Error loading member statistics:', error);
        toast({
          variant: "destructive",
          title: "❌ Eroare",
          description: "Nu s-au putut încărca statisticile membrilor.",
        });
        // Fallback la membri fără statistici
        if (providedMembers) {
          setMembers(providedMembers);
        }
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchMembersWithStatistics();
  }, [groupId, loadStatistics, providedMembers, toast]);


  // Handler pentru ștergerea efectivă a membrului
  const handleConfirmRemove = async () => {
    if (!removingMember) return;

    setIsRemoving(true);
    try {
      await GroupService.removeMember(groupId, removingMember.id);
      
      toast({
        title: "✅ Membru șters",
        description: `${removingMember.firstname} ${removingMember.lastname} a fost eliminat din grup.`,
      });

      // Refresh lista - reload statistics
      if (loadStatistics) {
        const updatedMembers = await GroupService.getMembersWithStatistics(groupId);
        setMembers(updatedMembers);
      }

      // Notify parent
      if (onMemberRemoved) {
        onMemberRemoved();
      }

      setRemovingMember(null);
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        variant: "destructive",
        title: "❌ Eroare",
        description: "Nu s-a putut elimina membrul din grup. Încercați din nou.",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Loading state
  if (isLoadingStats) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">Se încarcă statisticile...</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Calculăm prezența și notele medii pentru fiecare membru.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (members.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <UserMinus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Niciun membru</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Acest grup nu are încă membri. Adăugați primul elev pentru a începe consultațiile.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper pentru inițiale avatar
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(member.firstname, member.lastname)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {member.firstname} {member.lastname}
                      </h4>
                      {member.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    </div>
                    {member.class && (
                      <Badge variant="secondary" className="text-xs">
                        Clasa {member.class}
                      </Badge>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t">
                    {member.totalConsultations !== undefined && member.totalConsultations > 0 ? (
                      <>
                        {/* Attendance */}
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${
                            (member.attendancePercentage ?? 0) >= 80 ? 'bg-green-500' :
                            (member.attendancePercentage ?? 0) >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <span className="text-xs font-medium">
                            {(member.attendancePercentage ?? 0).toFixed(0)}% prezență
                          </span>
                        </div>
                        
                        {/* Average Rating */}
                        {member.averageRating !== undefined && member.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">⭐</span>
                            <span className="text-xs font-medium">
                              {member.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      // No consultations yet
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs py-0 px-2">
                          Fără consultații încă
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    
                    {member.subjectLevel && (
                      <Badge variant="outline" className="text-xs">
                        {member.subjectLevel}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Eliminare membru din grup</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3">
              <p>
                Sigur doriți să eliminați pe <strong>{removingMember?.firstname} {removingMember?.lastname}</strong> din acest grup?
              </p>
              
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-sm text-foreground">Consecințe:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>Elevul nu va mai putea participa la consultațiile programate pentru acest grup</li>
                  <li>Istoricul consultațiilor anterioare va rămâne intact</li>
                  <li>Elevul poate fi adăugat din nou oricând</li>
                </ul>
              </div>

              <p className="text-sm">
                Această acțiune poate fi anulată adăugând din nou elevul.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>
              Anulează
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Se șterge...' : 'Elimină membru'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
