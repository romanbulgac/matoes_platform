import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationService } from '@/services/consultationService';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        setLoading(true);

        // Încărcăm doar statistici (ultimele consultații pentru dashboard)
        const allConsultations = await ConsultationService.getAll();
        setConsultations(allConsultations);
      } catch (error) {
        console.error('Error loading teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTeacherData();
    }
  }, [user]);

  // Статистика
  const todayConsultations = consultations.filter(c => {
    const consultationDate = parseScheduledDate(c.scheduledAt).toDateString();
    const today = new Date().toDateString();
    return consultationDate === today && c.status !== ConsultationStatus.Cancelled;
  });

  const upcomingConsultations = consultations.filter(c => {
    const consultationDate = parseScheduledDate(c.scheduledAt);
    const today = new Date();
    return consultationDate > today && c.status === ConsultationStatus.Scheduled;
  });

  const completedConsultations = consultations.filter(c => 
    c.status === ConsultationStatus.Completed
  );

  // Подсчет общего количества студентов
  const totalStudents = new Set(
    consultations.flatMap(c => {
      if (!c.individualStudentId) return [];
      return Array.isArray(c.individualStudentId) 
        ? c.individualStudentId 
        : [c.individualStudentId];
    })
  ).size;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Panoul Profesorului</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Bun venit, {user?.firstname} {user?.lastname}
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={() => navigate('/consultations')}
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="sm:inline">Vezi toate consultațiile</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Astăzi
            </CardTitle>
            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{todayConsultations.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {todayConsultations.length === 1 ? 'consultație' : 'consultații'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Viitoare
            </CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{upcomingConsultations.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              programate
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Finalizate
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{completedConsultations.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              consultații
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Studenți
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {totalStudents === 1 ? 'student activ' : 'studenți activi'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Link to Consultations Page */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Acces Rapid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate('/consultations')}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Gestionează Consultații
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate('/consultations?view=calendar')}
          >
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Calendar Consultații
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate('/students')}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Studenții Mei
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};