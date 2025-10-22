import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { ConsultationService } from '@/services/consultationService';
import { ConsultationDto, ConsultationStatus } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle
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
    if (!c.scheduledAt) return false;
    const consultationDate = parseScheduledDate(c.scheduledAt).toDateString();
    const today = new Date().toDateString();
    return consultationDate === today && c.status !== ConsultationStatus.Cancelled;
  });

  const upcomingConsultations = consultations.filter(c => {
    if (!c.scheduledAt) return false;
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Spinner size="lg" className="mx-auto" />
            <p className="text-muted-foreground">Se încarcă datele...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 md:p-6">
      <div className="container mx-auto space-y-4 sm:space-y-6">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Panoul Profesorului
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Bun venit, {user?.firstname} {user?.lastname}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => navigate('/consultations')}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sm:inline">Vezi toate</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Astăzi
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {todayConsultations.length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {todayConsultations.length === 1 ? 'consultație' : 'consultații'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Viitoare
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {upcomingConsultations.length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                programate
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Finalizate
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {completedConsultations.length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                consultații
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Studenți
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                {totalStudents}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {totalStudents === 1 ? 'student activ' : 'studenți activi'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Link to Consultations Page */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              Acces Rapid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border-gray-200 hover:border-blue-300"
              onClick={() => navigate('/consultations')}
            >
              <span className="flex items-center gap-2 font-medium">
                <CalendarIcon className="h-4 w-4" />
                Gestionează Consultații
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200 border-gray-200 hover:border-purple-300"
              onClick={() => navigate('/consultations?view=calendar')}
            >
              <span className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4" />
                Calendar Consultații
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 border-gray-200 hover:border-green-300"
              onClick={() => navigate('/students')}
            >
              <span className="flex items-center gap-2 font-medium">
                <Users className="h-4 w-4" />
                Studenții Mei
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};