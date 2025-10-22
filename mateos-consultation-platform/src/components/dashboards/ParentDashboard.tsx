import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionWidget } from '@/components/subscriptions';
import { InviteChildDialog } from '@/components/parent/InviteChildDialog';
import { Plus, Users, Calendar, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParentData = async () => {
      try {
        setLoading(true);

        // TODO: Să încărcăm lista de elevi prin API
        // const studentsData = await StudentsService.getMyStudents();
        // setStudents(studentsData);

        // Pentru moment, nu afișăm elevi mock
        setStudents([]);
      } catch (error) {
        console.error('Error loading parent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParentData();
  }, []);

  if (loading) {
    return <div className="p-6">Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Premium Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Panoul Părinților
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Bun venit înapoi, {user?.firstname} {user?.lastname}! 👋
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-primary-600 to-purple-600 text-white border-0 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-1" />
            Premium
          </Badge>
        </div>

        {/* Grid Layout with Subscription Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Widget - Now using the new component */}
          <SubscriptionWidget className="md:col-span-2 lg:col-span-1" />
          
          {/* Quick Stats Cards */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg">Copii Înregistrați</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {students.length}
                </p>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Copii asociați contului tău</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-lg">Consultații</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  --
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">Disponibile lunar</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista elevilor */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <span>Copiii Mei ({students.length})</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Gestionarea conturilor și progresului copiilor tăi
              </CardDescription>
            </div>
            <InviteChildDialog onInviteCreated={() => {
              // Reîncarcă lista de elevi după crearea invitației
              console.log('Invitație creată, reîncărcare date...');
            }}>
              <Button className="flex items-center gap-2 h-11 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4" />
                Adaugă Copil
              </Button>
            </InviteChildDialog>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl w-fit mx-auto mb-6">
                  <Users className="h-16 w-16 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Niciun copil adăugat încă
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Adaugă primul copil pentru a începe călătoria educațională împreună
                </p>
                <InviteChildDialog onInviteCreated={() => {
                  console.log('Invitație creată, reîncărcare date...');
                }}>
                  <Button className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 h-12 px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă Primul Copil
                  </Button>
                </InviteChildDialog>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <Card key={student.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl text-white font-bold text-lg">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <Badge variant={student.isActive ? 'default' : 'secondary'} className={student.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                          {student.isActive ? 'Activ' : 'Inactiv'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription className="text-sm">{student.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Button variant="outline" size="sm" className="w-full border-2 hover:border-primary-500 hover:bg-primary-50">
                        Vizualizează Progres
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};