import { FC, useEffect, useState } from 'react';
import { FamilyService } from '@/services/familyService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Users, UserMinus, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';

interface ChildrenListProps {
  onUpdate?: () => void;
}

export const ChildrenList: FC<ChildrenListProps> = ({ onUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadChildren();
    }
  }, [user]);

  const loadChildren = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await FamilyService.getChildren(user.id);
      setChildren(data);
    } catch (error) {
      console.error('Error loading children:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca datele copiilor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkChild = async (studentId: string) => {
    if (!user?.id) return;

    try {
      setUnlinkingId(studentId);
      await FamilyService.unlinkChild(user.id, studentId);
      
      toast({
        title: 'Copil deconectat',
        description: 'Copilul a fost deconectat cu succes din contul dumneavoastră',
      });

      await loadChildren();
      onUpdate?.();
    } catch (error) {
      console.error('Error unlinking child:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut deconecta copilul',
        variant: 'destructive',
      });
    } finally {
      setUnlinkingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Se încarcă...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Copiii Mei ({children.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nu aveți copii înregistrați încă
            </p>
            <p className="text-sm text-muted-foreground">
              Folosiți butonul "Invită Copil" pentru a genera un link de invitație
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {child.firstname[0]}{child.lastname[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">
                      {child.firstname} {child.lastname}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {child.class && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Clasa {child.class}
                        </Badge>
                      )}
                      {child.subjectLevel && (
                        <Badge variant="secondary" className="text-xs">
                          {child.subjectLevel}
                        </Badge>
                      )}
                    </div>
                    {child.email && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {child.email}
                      </p>
                    )}
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={unlinkingId === child.id}
                    >
                      <UserMinus className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmați Deconectarea</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sunteți sigur că doriți să deconectați copilul{' '}
                        <strong>{child.firstname} {child.lastname}</strong> din contul dumneavoastră?
                        <br /><br />
                        <strong>Atenție:</strong> Această acțiune poate afecta abonamentele și consultațiile active.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUnlinkChild(child.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {unlinkingId === child.id ? 'Se deconectează...' : 'Deconectează'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
