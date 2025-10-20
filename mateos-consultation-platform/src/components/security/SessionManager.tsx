import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { SessionService } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, LogOut } from 'lucide-react';
import { FC, useState } from 'react';
import { SessionCard } from './SessionCard';

interface SessionManagerProps {
  className?: string;
}

/**
 * Component for managing active sessions
 * Shows active and historical sessions with revoke capabilities
 */
export const SessionManager: FC<SessionManagerProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch active sessions
  const { 
    data: activeSessions, 
    isLoading: isLoadingActive,
    isError: isErrorActive 
  } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => SessionService.getActiveSessions(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch session history
  const { 
    data: sessionHistory, 
    isLoading: isLoadingHistory,
    isError: isErrorHistory 
  } = useQuery({
    queryKey: ['session-history'],
    queryFn: () => SessionService.getSessionHistory(1, 10),
    enabled: activeTab === 'history',
  });

  // Revoke all other sessions mutation
  const revokeAllMutation = useMutation({
    mutationFn: () => SessionService.revokeAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security-stats'] });
      toast({
        title: 'Succes',
        description: 'Toate sesiunile au fost revocate cu succes',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Eroare',
        description: 'Nu s-au putut revoca sesiunile',
      });
    }
  });

  const handleRevokeAll = () => {
    revokeAllMutation.mutate();
  };

  const renderActiveSessions = () => {
    if (isLoadingActive) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (isErrorActive) {
      return (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Nu s-au putut încărca sesiunile active
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!activeSessions || activeSessions.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Nu există sesiuni active
            </p>
          </CardContent>
        </Card>
      );
    }

    // Find current session (if API provides this info)
    const currentSession = activeSessions.find(s => s.isCurrentSession);
    const otherSessions = activeSessions.filter(s => !s.isCurrentSession);

    return (
      <div className="space-y-4">
        {/* Action Bar */}
        {otherSessions.length > 0 && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={revokeAllMutation.isPending}
                >
                  {revokeAllMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se revocă...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Revocă toate celelalte sesiuni
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revocă toate sesiunile</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ești sigur că vrei să revoci toate celelalte sesiuni active? 
                    Toate dispozitivele conectate vor trebui să se autentifice din nou.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleRevokeAll}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Revocă toate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Current Session */}
        {currentSession && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">
              Sesiunea Curentă
            </h3>
            <SessionCard 
              key={currentSession.id}
              session={currentSession} 
              isCurrentSession={true}
            />
          </div>
        )}

        {/* Other Sessions */}
        {otherSessions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">
              Alte Sesiuni Active ({otherSessions.length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {otherSessions.map(session => (
                <SessionCard 
                  key={session.id} 
                  session={session}
                  onRevoke={() => {
                    toast({
                      title: 'Sesiune revocată',
                      description: 'Sesiunea a fost revocată cu succes',
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSessionHistory = () => {
    if (isLoadingHistory) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (isErrorHistory) {
      return (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Nu s-a putut încărca istoricul sesiunilor
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!sessionHistory?.sessions || sessionHistory.sessions.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Nu există istoric de sesiuni
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        {sessionHistory.sessions.map(session => (
          <SessionCard 
            key={session.id} 
            session={session}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Managementul Sesiunilor</CardTitle>
        <CardDescription>
          Gestionează sesiunile active și vezi istoricul conexiunilor tale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Sesiuni Active
              {activeSessions && activeSessions.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeSessions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Istoric</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {renderActiveSessions()}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {renderSessionHistory()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
