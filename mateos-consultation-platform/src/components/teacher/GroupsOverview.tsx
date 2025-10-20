import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Group } from '@/types';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Calendar, GraduationCap, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * GroupsOverview - Prezentare generală a grupurilor profesorului
 * 
 * Funcționalități:
 * - Afișează toate grupurile profesorului în format card grid
 * - Arată numărul de membri și capacitatea maximă
 * - Arată numărul de consultații viitoare
 * - Click pe card navighează la detalii grup
 * - Empty state când nu există grupuri
 */
export const GroupsOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const teacherGroups = await GroupService.getTeacherGroups(user.id);
        console.log('📚 Loaded groups:', teacherGroups);
        console.log('🔍 First group ID:', teacherGroups[0]?.id);
        setGroups(teacherGroups);
      } catch (error) {
        console.error('Error loading groups:', error);
        toast({
          title: 'Eroare',
          description: 'Nu s-au putut încărca grupurile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [user?.id, toast]);

  const handleCreateGroup = () => {
    // TODO: Navigate to group creation page or open dialog
    toast({
      title: 'În dezvoltare',
      description: 'Funcționalitatea de creare grup va fi disponibilă în curând'
    });
  };

  const handleGroupClick = (groupId: string) => {
    console.log('🎯 Navigating to group:', groupId);
    navigate(`/groups/${groupId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Empty state
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nu există grupuri</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Creează primul grup pentru a organiza consultațiile cu elevii tăi. 
          Poți adăuga între 3 și 6 elevi într-un grup.
        </p>
        <Button onClick={handleCreateGroup} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Creează prim grup
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grupurile mele</h2>
          <p className="text-muted-foreground">
            {groups.length} {groups.length === 1 ? 'grup activ' : 'grupuri active'}
          </p>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          // Calculate members count
          const membersCount = group.members?.length || 0;
          const maxCapacity = group.maxCapacity || 6;
          const isFull = membersCount >= maxCapacity;
          
          // Calculate upcoming consultations count
          const upcomingConsultations = group.consultations?.filter(c => 
            parseScheduledDate(c.scheduledAt) > new Date() && 
            c.status === 'Scheduled'
          ).length || 0;

          return (
            <Card
              key={group.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm"
              onClick={() => handleGroupClick(group.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {/* Group Type Badge */}
                      <Badge variant={maxCapacity === 3 ? 'default' : 'secondary'} className="text-xs">
                        {maxCapacity === 3 ? 'Mic (3)' : 'Mare (6)'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Class Badge */}
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Clasa <span className="font-semibold">{group.class}</span>
                    </span>
                    {isFull && (
                      <Badge variant="outline" className="ml-auto text-xs bg-red-50 text-red-700 border-red-200">
                        Complet
                      </Badge>
                    )}
                  </div>

                  {/* Members Count with Visual Indicator */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-semibold">{membersCount}</span> / {maxCapacity} elevi
                    </span>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: maxCapacity }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < membersCount 
                                ? isFull 
                                  ? 'bg-red-500' 
                                  : 'bg-green-500'
                                : 'bg-muted-foreground/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Consultations */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-semibold">{upcomingConsultations}</span>{' '}
                      {upcomingConsultations === 1 
                        ? 'consultație viitoare' 
                        : 'consultații viitoare'}
                    </span>
                  </div>

                  {/* Creation Date */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Creat {new Date(group.createdAt).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
