import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationService } from '@/services/consultationService';
import { GroupService } from '@/services/groupService';
import { parseScheduledDate } from '@/utils/dateUtils';
import { Book, Calendar, Clock, User, Users, Sparkles, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
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

  const isLoading = consultationsLoading || groupsLoading;

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="container mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        {/* Premium Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Panoul Elevului
              </h1>
              <p className="text-muted-foreground">
                Bun venit, {user?.firstname} {user?.lastname}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        </div>

        {/* Statistici rapide */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Consultații programate</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {consultationsThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                {consultationsThisMonth > 0 ? 'Consultații viitoare' : 'Nu sunt consultații programate'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Grupuri</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {groups?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {groups && groups.length > 0 ? 'Grupuri active' : 'Nu ești în niciun grup'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Profesori</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                <User className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {activeTeachers}
              </div>
              <p className="text-xs text-muted-foreground">
                Profesori activi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Consultații următoare */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-primary-600" />
              Consultații următoare
            </CardTitle>
            <CardDescription>
              Consultațiile tale programate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingConsultations && upcomingConsultations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
                <p className="font-medium text-gray-900">Nu aveți consultații programate</p>
                <p className="text-sm mt-1">Programați o consultație pentru a începe!</p>
                <Button className="mt-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl">
                  Programează consultație
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingConsultations?.map((consultation) => (
                  <Card key={consultation.id} className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{consultation.title}</h3>
                          <p className="text-muted-foreground">{consultation.teacherName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {consultation.scheduledAt ? parseScheduledDate(consultation.scheduledAt).toLocaleDateString('ro-RO') : 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {consultation.scheduledAt ? parseScheduledDate(consultation.scheduledAt).toLocaleTimeString('ro-RO', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-200 hover:bg-gray-50"
                            onClick={() => navigate(`/consultations`)}
                          >
                            Vizualizează
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              Acțiuni rapide
            </CardTitle>
            <CardDescription>Acțiuni frecvente pentru elevi</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200" 
              variant="outline"
              onClick={() => navigate('/consultations')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Consultații
            </Button>
            <Button 
              className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200" 
              variant="outline"
              onClick={() => navigate('/materials')}
            >
              <Book className="mr-2 h-4 w-4" />
              Materiale
            </Button>
            {groups && groups.length > 0 && (
              <Button 
                className="w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200" 
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
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-primary-600" />
                Grupurile mele
              </CardTitle>
              <CardDescription>
                Grupurile în care participi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groups.slice(0, 3).map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.memberCount}/{group.maxCapacity} membri
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50"
                      onClick={() => navigate(`/my-groups/${group.id}`)}
                    >
                      Vezi detalii
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {groups.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    Și încă {groups.length - 3} grupuri...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
