import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type AdminStatistics } from '@/services/adminService';
import { 
  AlertCircle, 
  BarChart3, 
  BookOpen, 
  DollarSign, 
  FileText, 
  GraduationCap, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  UserCog, 
  Users, 
  UsersRound 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await adminService.getAdminStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading admin statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panoul administratorului</h1>
          <p className="text-muted-foreground">
            Bine ai venit, {user?.firstname} {user?.lastname}
          </p>
        </div>
      </div>

      {/* Статистика */}
      {loading ? (
        <div className="text-center py-8">Se încarcă statisticile...</div>
      ) : stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilizatori
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalStudents} elevi • {stats.totalTeachers} profesori
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consultații
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConsultations}</div>
              <p className="text-xs text-muted-foreground">
                Total consultații
              </p>
            </CardContent>
          </Card>

          <Link to="/admin/groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Grupe
                </CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <p className="text-xs text-muted-foreground">
                  Grupe active
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cereri în așteptare
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications + stats.pendingRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                Profesori: {stats.pendingApplications} • Elevi: {stats.pendingRegistrations}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Venit lunar
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyRevenue || '0'} RON</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% față de luna trecută
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lecții astăzi
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayConsultations || '0'}</div>
              <p className="text-xs text-muted-foreground">
                Consultații programate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Управление */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Utilizatori
              </CardTitle>
              <CardDescription>
                Gestionează toți utilizatorii platformei
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/groups">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="h-5 w-5" />
                Grupe
              </CardTitle>
              <CardDescription>
                Administrează grupele de elevi
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/teacher-applications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Cereri profesori
              </CardTitle>
              <CardDescription>
                {stats && stats.pendingApplications > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {stats.pendingApplications} noi
                  </span>
                )}
                Aprobă cereri de la profesori
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/student-registrations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Înregistrări elevi
              </CardTitle>
              <CardDescription>
                {stats && stats.pendingRegistrations > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                    {stats.pendingRegistrations} noi
                  </span>
                )}
                Aprobă înregistrări de elevi
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/contacts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mesaje contact
              </CardTitle>
              <CardDescription>
                Răspunde la mesajele utilizatorilor
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/settings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setări sistem
              </CardTitle>
              <CardDescription>
                Configurează setările platformei
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Alerts Section */}
      {stats && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Alerte și Notificări</h2>
          
          {stats.pendingApplications > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{stats.pendingApplications} aplicații de profesori</strong> în așteptarea aprobării. 
                <Link to="/admin/teacher-applications" className="ml-2 text-blue-600 hover:underline">
                  Vezi aplicațiile →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {stats.pendingRegistrations > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{stats.pendingRegistrations} înregistrări de elevi</strong> în așteptarea aprobării.
                <Link to="/admin/student-registrations" className="ml-2 text-blue-600 hover:underline">
                  Vezi înregistrările →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {stats.underfilledGroups > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{stats.underfilledGroups} grupuri</strong> cu mai puțin de 3 membri. 
                <Link to="/admin/groups-management" className="ml-2 text-blue-600 hover:underline">
                  Gestionează grupurile →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {stats.inactiveTeachers > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{stats.inactiveTeachers} profesori</strong> fără lecții în ultimele 2 săptămâni.
                <Link to="/admin/users" className="ml-2 text-blue-600 hover:underline">
                  Vezi utilizatorii →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {stats.expiredConsents > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{stats.expiredConsents} consents expirate</strong> (GDPR). 
                <span className="ml-2 text-red-600">Acțiune necesară!</span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informații de sistem</CardTitle>
          <CardDescription>
            Status sistem și notificări
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Status server</span>
              <span className="text-sm font-semibold text-green-600">●  Online</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Baza de date</span>
              <span className="text-sm font-semibold text-green-600">●  Conectată</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Ultimul backup</span>
              <span className="text-sm font-semibold">acum 2 ore</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Versiune</span>
              <span className="text-sm font-semibold">v1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};