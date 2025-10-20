import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationService } from '@/services/consultationService';
import { GroupService } from '@/services/groupService';
import { MaterialService } from '@/services/materialService';
import { SubscriptionService } from '@/services/subscriptionService';
import { ConsultationDto, Group, MaterialDto, SubscriptionStatusDto } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Book, Calendar, Clock, User, Users, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // React Query pentru datele studentului
  const { data: upcomingConsultations, isLoading: consultationsLoading } = useQuery({
    queryKey: ['student-consultations', user?.id],
    queryFn: () => ConsultationService.getStudentConsultations(user!.id, 'upcoming'),
    enabled: !!user?.id,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['student-groups', user?.id],
    queryFn: () => GroupService.getStudentGroups(user!.id),
    enabled: !!user?.id,
  });

  const { data: recentMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ['recent-materials', user?.id],
    queryFn: () => MaterialService.getRecent(user!.id, 5),
    enabled: !!user?.id,
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription-status', user?.id],
    queryFn: () => SubscriptionService.getStatus(user!.id),
    enabled: !!user?.id,
  });

  const isLoading = consultationsLoading || groupsLoading || materialsLoading || subscriptionLoading;

  // Calculează statistici din datele reale
  const consultationsThisMonth = upcomingConsultations?.length || 0;
  const activeTeachers = new Set([
    ...(upcomingConsultations?.map(c => c.teacherId) || []),
    ...(groups?.map(g => g.teacherId).filter(Boolean) || [])
  ]).size;

  const handleJoinConsultation = async (consultationId: string) => {
    try {
      const { meetingLink } = await ConsultationService.joinConsultation(consultationId);
      window.open(meetingLink, '_blank');
    } catch (error) {
      console.error('Error joining consultation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panoul Elevului</h1>
          <p className="text-muted-foreground">
            Bun venit, {user?.firstname} {user?.lastname}
          </p>
        </div>
      </div>

        {/* Statistici rapide */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultații programate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultationsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                {consultationsThisMonth > 0 ? 'Consultații viitoare' : 'Nu sunt consultații programate'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupuri</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {groups && groups.length > 0 ? 'Grupuri active' : 'Nu ești în niciun grup'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profesori</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTeachers}</div>
              <p className="text-xs text-muted-foreground">
                Profesori activi
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Consultații următoare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultații următoare
          </CardTitle>
          <CardDescription>
            Consultațiile tale programate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingConsultations && upcomingConsultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu aveți consultații programate</p>
              <p className="text-sm">Programați o consultație pentru a începe!</p>
              <Button className="mt-4">Programează consultație</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <Card key={consultation.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{consultation.title}</h3>
                        <p className="text-muted-foreground">{consultation.teacherName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {parseScheduledDate(consultation.scheduledAt).toLocaleDateString('ro-RO')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {parseScheduledDate(consultation.scheduledAt).toLocaleTimeString('ro-RO', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/consultations`)}
                        >
                          Vizualizează
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleJoinConsultation(consultation.id)}
                        >
                          Alătură-te
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acțiuni rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Acțiuni rapide</CardTitle>
          <CardDescription>Acțiuni frecvente pentru elevi</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() => navigate('/consultations')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Consultații
          </Button>
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() => navigate('/materials')}
          >
            <Book className="mr-2 h-4 w-4" />
            Materiale
          </Button>
          {groups && groups.length > 0 && (
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate(`/my-groups/${groups[0].id}`)}
            >
              <Users className="mr-2 h-4 w-4" />
              Grupa mea
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Grupurile mele */}
      {groups && groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Grupurile mele
            </CardTitle>
            <CardDescription>
              Grupurile în care participi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.memberCount}/{group.maxCapacity} membri
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/my-groups/${group.id}`)}
                  >
                    Vezi detalii
                  </Button>
                </div>
              ))}
              {groups.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  Și încă {groups.length - 3} grupuri...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
