import { FC, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api';
import { useAlert } from '@/hooks/use-alert';
import { CreditCard, Calendar, User, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChildSubscription {
  id: string;
  childName: string;
  childId: string;
  planName: string;
  status: string;
  currentPeriodEnd: string;
  price: number;
  currency: string;
  maxConsultationsPerMonth: number;
  unlimitedConsultations: boolean;
  cancelAtPeriodEnd: boolean;
}

/**
 * SubscriptionsTab - вкладка управления подписками (только для Parent)
 * Отображает подписки всех детей и историю платежей
 */
export const SubscriptionsTab: FC = () => {
  const { showError } = useAlert();
  const [subscriptions, setSubscriptions] = useState<ChildSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      // API endpoint для получения подписок детей
      const data = await apiClient.get<ChildSubscription[]>(
        '/subscriptions/my-children'
      );
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      showError('Eroare la încărcarea abonamentelor');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      Active: { variant: 'default', label: 'Activ' },
      Trialing: { variant: 'secondary', label: 'Perioadă de probă' },
      PastDue: { variant: 'destructive', label: 'Întârziere plată' },
      Canceled: { variant: 'outline', label: 'Anulat' },
      Incomplete: { variant: 'destructive', label: 'Incomplet' },
    };

    const config = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nu există abonamente active pentru copiii tăi.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/subscriptions'}>
            Achiziționează un abonament
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Abonamentele copiilor</h3>
        <p className="text-sm text-muted-foreground">
          Gestionează abonamentele tuturor copiilor tăi
        </p>
      </div>

      <div className="grid gap-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {subscription.childName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subscription.planName}
                  </CardDescription>
                </div>
                {getStatusBadge(subscription.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Preț:</span>
                  <span className="font-medium">
                    {subscription.price} {subscription.currency}/lună
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Următoarea plată:
                  </span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                      'ro-RO'
                    )}
                  </span>
                </div>

                <div className="text-sm col-span-2">
                  <span className="text-muted-foreground">Consultații:</span>
                  <span className="ml-2 font-medium">
                    {subscription.unlimitedConsultations
                      ? 'Nelimitat'
                      : `${subscription.maxConsultationsPerMonth}/lună`}
                  </span>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-orange-600">
                      Abonamentul se va anula la sfârșitul perioadei curente
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/subscriptions/${subscription.id}`)
                  }
                >
                  Detalii
                </Button>
                {!subscription.cancelAtPeriodEnd && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/subscriptions/${subscription.id}/manage`)
                    }
                  >
                    Gestionează
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
