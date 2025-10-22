/**
 * MyGroupsPanel - Panel pentru elevi să-și vadă grupurile
 * 
 * Funcționalitate:
 * - Lista grupurilor studentului (cards)
 * - Pentru fiecare grup: nume, profesor, schedule, membri
 * - Upcoming lessons cu countdown
 * - Link către group details
 * - Button "Părăsește Grupa" (cu confirmare)
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Group } from '@/types';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  Loader2, 
  LogOut, 
  Users,
  UsersIcon
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MyGroupsPanelProps {
  studentId: string;
}

export const MyGroupsPanel: FC<MyGroupsPanelProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingGroup, setLeavingGroup] = useState<string | null>(null);

  useEffect(() => {
    loadMyGroups();
  }, [studentId]);

  const loadMyGroups = async () => {
    try {
      setLoading(true);
      const myGroups = await GroupService.getMyGroups(studentId);
      setGroups(myGroups);
    } catch (error) {
      console.error('Error loading my groups:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca grupurile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Ești sigur că vrei să părăsești grupul "${groupName}"?`)) {
      return;
    }

    try {
      setLeavingGroup(groupId);
      await GroupService.removeMember(groupId, studentId);
      
      toast({
        title: 'Succes',
        description: 'Ai părăsit grupul cu succes',
      });

      loadMyGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut părăsi grupul',
        variant: 'destructive',
      });
    } finally {
      setLeavingGroup(null);
    }
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/student/groups/${groupId}`);
  };

  const formatNextLesson = (group: Group) => {
    if (!group.upcomingConsultations || Array.isArray(group.upcomingConsultations) ? (Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations.length : 0) : 0 === 0) {
      return 'Nu sunt lecții programate';
    }

    const nextLesson = Array.isArray(group.upcomingConsultations) ? (Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations[0] : null) : null;
    const lessonDate = new Date(nextLesson?.scheduledAt || "");
    const now = new Date();
    const diffTime = lessonDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Lecție în curs';
    } else if (diffDays === 0) {
      return `Astăzi la ${lessonDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Mâine la ${lessonDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `În ${diffDays} zile (${lessonDate.toLocaleDateString('ro-RO')})`;
    }
  };

  const getMembersDisplay = (group: Group) => {
    if (!group.members || group.members.length === 0) {
      return 'Niciun membru';
    }

    const memberNames = group.members
      .slice(0, 3) // Show only first 3 members
      .map(member => member.firstname)
      .join(', ');

    const remaining = group.members.length - 3;
    if (remaining > 0) {
      return `${memberNames} și încă ${remaining}`;
    }

    return memberNames;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Se încarcă grupurile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Grupurile Mele
          </CardTitle>
          <CardDescription>
            Grupurile în care participi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Nu participi încă la niciun grup</p>
            <p className="text-sm">Contactează administratorul pentru a fi adăugat într-un grup</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          Grupurile Mele ({groups.length})
        </CardTitle>
        <CardDescription>
          Grupurile în care participi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {group.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    Clasa {group.class}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Teacher Info */}
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Profesor: {group.teacherName || 'Nedefinit'}
                  </span>
                </div>

                {/* Members */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Membri: {getMembersDisplay(group)}
                  </span>
                </div>

                {/* Next Lesson */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatNextLesson(group)}
                  </span>
                </div>

                {/* Schedule */}
                {group.schedule && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {group.schedule}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewGroup(group.id)}
                    className="flex-1"
                  >
                    Vezi Detalii
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLeaveGroup(group.id, group.name)}
                    disabled={leavingGroup === group.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {leavingGroup === group.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
