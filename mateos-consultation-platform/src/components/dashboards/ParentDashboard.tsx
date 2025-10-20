import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionWidget } from '@/components/subscriptions';
import { InviteChildDialog } from '@/components/parent/InviteChildDialog';
import { Plus, Users } from 'lucide-react';
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panoul Părinților</h1>
          <p className="text-muted-foreground">
            Bun venit, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Grid Layout with Subscription Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Widget - Now using the new component */}
        <SubscriptionWidget className="md:col-span-2 lg:col-span-1" />
        
        {/* Quick Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Elevi înregistrați
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Copii asociați</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Consultații Lunare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
            <p className="text-sm text-muted-foreground mt-1">În funcție de plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista elevilor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Elevii mei ({students.length})
            </CardTitle>
            <CardDescription>
              Gestionarea conturilor copiilor
            </CardDescription>
          </div>
          <InviteChildDialog onInviteCreated={() => {
            // Reîncarcă lista de elevi după crearea invitației
            console.log('Invitație creată, reîncărcare date...');
          }}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adaugă elev
            </Button>
          </InviteChildDialog>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu aveți încă elevi asociați</p>
              <p className="text-sm">Apăsați "Adaugă elev" pentru a crea un cont</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <Card key={student.id} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.isActive ? 'Activ' : 'Inactiv'}
                      </span>
                      <Button variant="outline" size="sm">
                        Gestionează
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};