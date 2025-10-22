import { GroupCapacityIndicator, GroupConsultationsList, GroupMembersList } from '@/components/groups';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Group } from '@/types';
import { ConsultationStatus } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import {
    ArrowLeft,
    Calendar,
    GraduationCap,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * GroupDetailsPage - Pagina detaliată pentru un grup
 * 
 * Funcționalități:
 * - Afișează informații complete despre grup
 * - Gestionare membri (adăugare, ștergere)
 * - Lista consultațiilor grupului
 * - Indicator capacitate cu warning-uri
 * - Editare setări grup
 * - Ștergere grup
 * - Breadcrumb navigation
 */
export const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupStatistics, setGroupStatistics] = useState<{
    averageAttendance?: number;
    averageRating?: number;
  }>({});

  // Calculate group-level statistics from members
  useEffect(() => {
    const calculateGroupStats = async () => {
      if (!groupId || !group) return;

      try {
        // Get members with statistics
        const membersWithStats = await GroupService.getMembersWithStatistics(groupId);
        
        // Filter members who have statistics
        const membersWithData = membersWithStats.filter(m => 
          m.attendancePercentage !== undefined || m.averageRating !== undefined
        );

        if (membersWithData.length === 0) {
          setGroupStatistics({});
          return;
        }

        // Calculate averages
        const attendanceValues = membersWithData
          .filter(m => m.attendancePercentage !== undefined)
          .map(m => m.attendancePercentage!);
        
        const ratingValues = membersWithData
          .filter(m => m.averageRating !== undefined)
          .map(m => m.averageRating!);

        setGroupStatistics({
          averageAttendance: attendanceValues.length > 0
            ? attendanceValues.reduce((a, b) => a + b, 0) / attendanceValues.length
            : undefined,
          averageRating: ratingValues.length > 0
            ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
            : undefined
        });
      } catch (error) {
        console.error('❌ Error calculating group statistics:', error);
        setGroupStatistics({});
      }
    };

    calculateGroupStats();
  }, [groupId, group]);

  useEffect(() => {
    const loadGroupDetails = async () => {
      console.log('🔍 GroupDetailsPage - groupId from URL params:', groupId);
      
      if (!groupId) {
        console.warn('⚠️ No groupId found in URL params');
        navigate('/dashboard');
        return;
      }

      try {
        setLoading(true);
        console.log('📡 Fetching group details for:', groupId);
        const groupData = await GroupService.getById(groupId);
        console.log('✅ Group data received:', groupData);
        setGroup(groupData);
      } catch (error) {
        console.error('❌ Error loading group details:', error);
        toast({
          title: 'Eroare',
          description: 'Nu s-au putut încărca detaliile grupului',
          variant: 'destructive'
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadGroupDetails();
  }, [groupId, navigate, toast]);

  const handleBack = () => {
    navigate('/students');
  };

  const handleEditGroup = () => {
    // TODO: Open edit dialog
    toast({
      title: 'În dezvoltare',
      description: 'Funcționalitatea de editare va fi disponibilă în curând'
    });
  };

  const handleDeleteGroup = () => {
    // TODO: Open delete confirmation dialog
    toast({
      title: 'În dezvoltare',
      description: 'Funcționalitatea de ștergere va fi disponibilă în curând'
    });
  };

  const handleMemberAdded = async () => {
    // Reload group data after adding member
    if (!groupId) return;
    
    try {
      const groupData = await GroupService.getById(groupId);
      setGroup(groupData);
    } catch (error) {
      console.error('Error reloading group data:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">Grupul nu a fost găsit</p>
            <Button onClick={handleBack} className="mt-4">
              Înapoi la Studenți
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const membersCount = group.members?.length || 0;
  const upcomingConsultations = group.consultations?.filter(c => 
    parseScheduledDate(c.scheduledAt) > new Date() && 
    // @ts-ignore - TypeScript не может правильно вывести тип
    c.status === ConsultationStatus.Scheduled
  ).length || 0;

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={handleBack} className="hover:text-foreground transition-colors">
          Studenți
        </button>
        <span>/</span>
        <button onClick={handleBack} className="hover:text-foreground transition-colors">
          Grupe
        </button>
        <span>/</span>
        <span className="text-foreground font-medium">{group.name}</span>
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {group.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {group.description || 'Fără descriere'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Class Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clasa
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group.class}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Nivel educațional
            </p>
          </CardContent>
        </Card>

        {/* Members Count */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membri
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {membersCount} / {group.maxCapacity}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mini-grup de {group.maxCapacity} persoane
            </p>
          </CardContent>
        </Card>

        {/* Consultations */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultații
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingConsultations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Viitoare programate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Indicator */}
      <GroupCapacityIndicator
        currentMembers={membersCount}
        maxCapacity={group.maxCapacity}
        groupName={group.name}
        showDetails={true}
        averageAttendance={groupStatistics.averageAttendance}
        averageRating={groupStatistics.averageRating}
      />

      <Separator />

      {/* Consultations List Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Consultații</h2>
          <p className="text-sm text-muted-foreground">
            Istoricul consultațiilor pentru acest grup
          </p>
        </div>

        <GroupConsultationsList
          consultations={group.consultations || []}
          groupName={group.name}
        />
      </div>

      {/* Members List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Membrii grupului</h2>
            <p className="text-sm text-muted-foreground">
              {membersCount} {membersCount === 1 ? 'membru înscris' : 'membri înscriși'}
            </p>
          </div>
        </div>

        <GroupMembersList
          groupId={groupId!}
          members={group.members || []}
          onMemberRemoved={handleMemberAdded}
          allowRemove={true}
          loadStatistics={true}
        />
      </div>

      <Separator />

      

      {/* Metadata */}
      <Card className="border-0 shadow-sm bg-muted/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Creat la</p>
              <p className="font-medium">
                {new Date(group.createdAt).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            {group.updatedAt && (
              <div>
                <p className="text-muted-foreground">Ultima actualizare</p>
                <p className="font-medium">
                  {new Date(group.updatedAt).toLocaleDateString('ro-RO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
