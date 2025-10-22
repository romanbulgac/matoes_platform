import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  UsersRound,
  Sparkles,
  Zap,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'compact'>('overview');
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isAlertsExpanded, setIsAlertsExpanded] = useState(true);
  const [isSystemExpanded, setIsSystemExpanded] = useState(false);

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
    <div className="flex h-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-80px)]">
        <ResizablePanel defaultSize={75}>
          <ScrollArea className="h-full p-6">
            <div className="space-y-8">
              {/* Premium Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                      <Sparkles className="h-8 w-8 text-primary-600" />
                      Panoul Administratorului
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Bine ai venit, {user?.firstname} {user?.lastname}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 shadow-sm">
                    <Zap className="h-3 w-3" />
                    Premium Admin
                  </Badge>
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'overview' | 'detailed' | 'compact')} className="shadow-sm">
                    <ToggleGroupItem value="overview" aria-label="Overview view">
                      <BarChart3 className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="detailed" aria-label="Detailed view">
                      <Activity className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="compact" aria-label="Compact view">
                      <Eye className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Quick Stats */}
              <Collapsible
                open={isStatsExpanded}
                onOpenChange={setIsStatsExpanded}
                className="space-y-4"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full cursor-pointer p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary-600" />
                      Statistici Rapide
                    </h2>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isStatsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="sr-only">Toggle stats</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">Se încarcă statisticile...</div>
                    ) : stats && (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Link to="/admin/users">
                          <Card className="transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-xl hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-700">
                                Utilizatori
                              </CardTitle>
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {stats.totalStudents} elevi • {stats.totalTeachers} profesori
                              </p>
                            </CardContent>
                          </Card>
                        </Link>

                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                              Consultații
                            </CardTitle>
                            <div className="p-2 bg-green-100 rounded-full">
                              <BookOpen className="h-4 w-4 text-green-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.totalConsultations}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Total consultații
                            </p>
                          </CardContent>
                        </Card>

                        <Link to="/admin/groups">
                          <Card className="transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-xl hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-700">
                                Grupe
                              </CardTitle>
                              <div className="p-2 bg-purple-100 rounded-full">
                                <UsersRound className="h-4 w-4 text-purple-600" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold text-gray-900">{stats.totalGroups}</div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Grupe active
                              </p>
                            </CardContent>
                          </Card>
                        </Link>

                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                              Cereri în așteptare
                            </CardTitle>
                            <div className="p-2 bg-orange-100 rounded-full">
                              <BarChart3 className="h-4 w-4 text-orange-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.pendingApplications + stats.pendingRegistrations}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Profesori: {stats.pendingApplications} • Elevi: {stats.pendingRegistrations}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                              Venit lunar
                            </CardTitle>
                            <div className="p-2 bg-green-100 rounded-full">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.monthlyRevenue || '0'} RON</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              <TrendingUp className="h-3 w-3 inline mr-1" />
                              +12% față de luna trecută
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                              Lecții astăzi
                            </CardTitle>
                            <div className="p-2 bg-blue-100 rounded-full">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.todayConsultations || '0'}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Consultații programate
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Management Section */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary-600" />
                    Management Panel
                  </CardTitle>
                  <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link to="/admin/users">
                      <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <UserCog className="h-5 w-5 text-blue-600" />
                            </div>
                            Utilizatori
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Gestionează toți utilizatorii platformei
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>

                        <Link to="/admin/groups">
                          <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <UsersRound className="h-5 w-5 text-purple-600" />
                            </div>
                            Grupe
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Administrează grupele de elevi
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>

                    <Link to="/admin/teacher-applications">
                      <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <GraduationCap className="h-5 w-5 text-orange-600" />
                            </div>
                            Cereri profesori
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {stats && stats.pendingApplications > 0 && (
                              <Badge variant="destructive" className="mb-2">
                                {stats.pendingApplications} noi
                              </Badge>
                            )}
                            Aprobă cereri de la profesori
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>

                    <Link to="/admin/student-registrations">
                      <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            Înregistrări elevi
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {stats && stats.pendingRegistrations > 0 && (
                              <Badge variant="destructive" className="mb-2">
                                {stats.pendingRegistrations} noi
                              </Badge>
                            )}
                            Aprobă înregistrări de elevi
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>

                    <Link to="/admin/contacts">
                      <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            Mesaje contact
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Răspunde la mesajele utilizatorilor
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>

                    <Link to="/admin/settings">
                      <Card className="transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Settings className="h-5 w-5 text-gray-600" />
                            </div>
                            Setări sistem
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Configurează setările platformei
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Section */}
              <Collapsible
                open={isAlertsExpanded}
                onOpenChange={setIsAlertsExpanded}
                className="space-y-4"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full cursor-pointer p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Alerte și Notificări
                    </h2>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isAlertsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="sr-only">Toggle alerts</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 space-y-4">
                    {stats && (
                      <>
                        {stats.pendingApplications > 0 && (
                          <Alert className="border-orange-200 bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                              <strong>{stats.pendingApplications} aplicații de profesori</strong> în așteptarea aprobării. 
                              <Link to="/admin/teacher-applications" className="ml-2 text-orange-600 hover:underline font-medium">
                                Vezi aplicațiile →
                              </Link>
                            </AlertDescription>
                          </Alert>
                        )}

                        {stats.pendingRegistrations > 0 && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <strong>{stats.pendingRegistrations} înregistrări de elevi</strong> în așteptarea aprobării.
                              <Link to="/admin/student-registrations" className="ml-2 text-blue-600 hover:underline font-medium">
                                Vezi înregistrările →
                              </Link>
                            </AlertDescription>
                          </Alert>
                        )}

                        {stats.underfilledGroups && stats.underfilledGroups > 0 && (
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              <strong>{stats.underfilledGroups} grupuri</strong> cu mai puțin de 3 membri. 
                              <Link to="/admin/groups-management" className="ml-2 text-yellow-600 hover:underline font-medium">
                                Gestionează grupurile →
                              </Link>
                            </AlertDescription>
                          </Alert>
                        )}

                        {stats.inactiveTeachers && stats.inactiveTeachers > 0 && (
                          <Alert className="border-purple-200 bg-purple-50">
                            <AlertCircle className="h-4 w-4 text-purple-600" />
                            <AlertDescription className="text-purple-800">
                              <strong>{stats.inactiveTeachers} profesori</strong> fără lecții în ultimele 2 săptămâni.
                              <Link to="/admin/users" className="ml-2 text-purple-600 hover:underline font-medium">
                                Vezi utilizatorii →
                              </Link>
                            </AlertDescription>
                          </Alert>
                        )}

                        {stats.expiredConsents && stats.expiredConsents > 0 && (
                          <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              <strong>{stats.expiredConsents} consents expirate</strong> (GDPR). 
                              <span className="ml-2 text-red-600 font-semibold">Acțiune necesară!</span>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* System Info */}
              <Collapsible
                open={isSystemExpanded}
                onOpenChange={setIsSystemExpanded}
                className="space-y-4"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full cursor-pointer p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-gray-600" />
                      Informații de Sistem
                    </h2>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isSystemExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="sr-only">Toggle system info</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Status Sistem</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Monitorizare în timp real a sistemului
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="flex flex-col p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-sm text-green-700 font-medium">Status server</span>
                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Online
                            </span>
                          </div>
                          <div className="flex flex-col p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-sm text-green-700 font-medium">Baza de date</span>
                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Conectată
                            </span>
                          </div>
                          <div className="flex flex-col p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-sm text-blue-700 font-medium">Ultimul backup</span>
                            <span className="text-sm font-semibold text-blue-600">acum 2 ore</span>
                          </div>
                          <div className="flex flex-col p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-sm text-purple-700 font-medium">Versiune</span>
                            <span className="text-sm font-semibold text-purple-600">v1.0.0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20}>
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MoreHorizontal className="h-5 w-5 text-primary-600" />
                Acțiuni Rapide
              </h2>
              <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-muted-foreground text-sm">
                  Aici vor veni acțiuni rapide și widget-uri personalizabile pentru administratori.
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-muted-foreground text-sm">
                  Un alt widget util pentru management.
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};