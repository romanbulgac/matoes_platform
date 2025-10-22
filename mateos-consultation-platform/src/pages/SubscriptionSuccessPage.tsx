import { FC, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionService } from '@/services/subscriptionService';

export const SubscriptionSuccessPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const syncSubscription = async () => {
      if (!sessionId) {
        setError('Session ID lipsește');
        setSyncing(false);
        return;
      }

      try {
        // Așteaptă câteva secunde pentru ca webhook-ul să proceseze
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Sincronizează subscripția
        await SubscriptionService.getStatus();
        
        setSyncing(false);
      } catch (err) {
        console.error('❌ Sync error:', err);
        setError('Eroare la sincronizare, dar subscripția dvs. este activă');
        setSyncing(false);
      }
    };

    syncSubscription();
  }, [sessionId]);

  if (syncing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle>Procesăm plata...</CardTitle>
            <CardDescription>
              Vă rugăm să așteptați câteva momente
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
            <CardTitle>Atenție</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Subscripția dvs. ar trebui să fie activă în câteva minute.
              Verificați email-ul pentru confirmare.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/subscriptions')}
                variant="outline"
                className="flex-1"
              >
                Vezi subscripția
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Plată reușită!</CardTitle>
          <CardDescription>
            Subscripția dvs. a fost activată cu succes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            <p className="font-semibold mb-2">Ce urmează?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Veți primi un email de confirmare</li>
              <li>Puteți începe să programați consultații</li>
              <li>Accesați toate beneficiile planului dvs.</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/subscriptions')}
              variant="outline"
              className="flex-1"
            >
              Vezi subscripția
            </Button>
            <Button
              onClick={() => navigate('/consultations')}
              className="flex-1"
            >
              Programează consultație
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
