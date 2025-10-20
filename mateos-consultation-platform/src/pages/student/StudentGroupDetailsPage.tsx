/**
 * StudentGroupDetailsPage - Pagină pentru elevi să vadă detaliile grupurilor
 * 
 * Funcționalitate:
 * - Group info (read-only pentru student)
 * - All upcoming lessons cu date/time
 * - Materials partajate în grup
 * - Attendance history (doar proprie)
 * - Membri grup (doar prenume pentru privacy)
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GroupService } from '@/services/groupService';
import { MaterialService } from '@/services/materialService';
// import type { Group } from '@/types';
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  FileText, 
  GraduationCap, 
  Loader2, 
  Users,
  UsersIcon,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const StudentGroupDetailsPage: FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // React Query pentru datele grupului
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group-details', groupId],
    queryFn: () => GroupService.getById(groupId!),
    enabled: !!groupId,
  });

  const { data: groupMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ['group-materials', groupId],
    queryFn: () => GroupService.getGroupMaterials(groupId!),
    enabled: !!groupId,
  });

  // const { data: groupSchedule, isLoading: scheduleLoading } = useQuery({
  //   queryKey: ['group-schedule', groupId],
  //   queryFn: () => GroupService.getGroupSchedule(groupId!),
  //   enabled: !!groupId,
  // });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['my-attendance', groupId, user?.id],
    queryFn: () => GroupService.getMyAttendance(groupId!, user!.id),
    enabled: !!groupId && !!user?.id,
  });

  const { data: groupProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['group-progress', groupId, user?.id],
    queryFn: () => GroupService.getStudentGroupProgress(groupId!, user!.id),
    enabled: !!groupId && !!user?.id,
  });

  const { data: groupMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => GroupService.getGroupMembers(groupId!),
    enabled: !!groupId,
  });

  const isLoading = groupLoading || materialsLoading || attendanceLoading || progressLoading || membersLoading;

  const handleDownloadMaterial = async (materialId: string, materialTitle: string) => {
    try {
      const blob = await MaterialService.downloadMaterial(materialId);
      
      // Creează link pentru download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = materialTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut descărca materialul',
        variant: 'destructive',
      });
    }
  };

  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return {
  //     date: date.toLocaleDateString('ro-RO', {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     }),
  //     time: date.toLocaleTimeString('ro-RO', {
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     })
  //   };
  // };

  // const getMembersDisplay = (group: Group) => {
  //   if (!group.members || group.members.length === 0) {
  //     return [];
  //   }

  //   return group.members.map(member => ({
  //     name: member.firstname,
  //     isCurrentUser: false // You can add logic to identify current user
  //   }));
  // };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Grupul nu a fost găsit</p>
              <Button onClick={() => navigate('/student/dashboard')} className="mt-4">
                Înapoi la Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/student/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
      </div>

      {/* Group Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informații Grup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profesor</span>
              </div>
              <p className="text-lg">{group.teacherId || 'Nedefinit'}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Membri</span>
              </div>
              <p className="text-lg">
                {group.members?.length || 0}/{group.maxCapacity}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Clasă</span>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                Clasa {group.class}
              </Badge>
            </div>
          </div>

          {/* Schedule section removed - not available in Group type */}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lecții Programate
            </CardTitle>
            <CardDescription>
              Următoarele lecții din acest grup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Lecțiile programate vor fi afișate aici</p>
              <p className="text-sm">Profesorul va programa lecții în curând</p>
            </div>
          </CardContent>
        </Card>

        {/* Group Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Membri Grup
            </CardTitle>
            <CardDescription>
              Colegii din acest grup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            ) : groupMembers && groupMembers.length > 0 ? (
              <div className="space-y-3">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.firstName}</p>
                      <p className="text-sm text-muted-foreground">
                        Membru al grupului
                      </p>
                    </div>
                    {member.isCurrentUser && (
                      <Badge variant="outline">Tu</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nu s-au încărcat membrii grupului</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Materiale de Studiu
          </CardTitle>
          <CardDescription>
            Materialele partajate de profesor pentru acest grup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {materialsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : groupMaterials && groupMaterials.length > 0 ? (
            <div className="space-y-3">
              {groupMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{material.title}</h4>
                      {material.description && (
                        <p className="text-sm text-muted-foreground">{material.description}</p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>0 descărcări</span>
                        {/* File size removed - not available in Material type */}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadMaterial(material.id, material.title)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descarcă
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există materiale încărcate</p>
              <p className="text-sm">Profesorul va partaja materiale în curând</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Istoric Prezență
          </CardTitle>
          <CardDescription>
            Prezența ta la lecțiile din acest grup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : attendance && attendance.length > 0 ? (
            <div className="space-y-3">
              {attendance.map((record) => (
                <div key={record.consultationId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      record.attended ? 'bg-green-100 text-green-600' : 
                      record.attendanceTime ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {record.attended ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : record.attendanceTime ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{record.consultationTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.scheduledAt).toLocaleDateString('ro-RO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {record.duration && (
                        <p className="text-xs text-muted-foreground">
                          Durată: {record.duration} minute
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={
                    record.attended ? 'default' : 
                    record.attendanceTime ? 'secondary' : 
                    'destructive'
                  }>
                    {record.attended ? 'Prezent' : 
                     record.attendanceTime ? 'Întârziere' : 
                     'Absent'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există încă date de prezență</p>
              <p className="text-sm">Prezența va fi înregistrată după prima lecție</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Progress */}
      {groupProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Progresul tău în grup
            </CardTitle>
            <CardDescription>
              Performanța ta comparativ cu grupul
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{groupProgress.attendanceRate}%</div>
                <p className="text-sm text-muted-foreground">Prezență</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{groupProgress.attendedConsultations}</div>
                <p className="text-sm text-muted-foreground">Lecții participat</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{groupProgress.averageRating.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">Nota medie</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{groupProgress.topicsCovered.length}</div>
                <p className="text-sm text-muted-foreground">Topicuri acoperite</p>
              </div>
            </div>
            
            {groupProgress.topicsCovered.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Topicuri acoperite:</h4>
                <div className="flex flex-wrap gap-2">
                  {groupProgress.topicsCovered.map((topic, index) => (
                    <Badge key={index} variant="outline">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {groupProgress.nextTopics.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-3">Următoarele topicuri:</h4>
                <div className="flex flex-wrap gap-2">
                  {groupProgress.nextTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
