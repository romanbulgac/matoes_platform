import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionStatusDto } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Calendar, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface SubscriptionWidgetProps {
  className?: string;
}

export const SubscriptionWidget: FC<SubscriptionWidgetProps> = ({ className }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SubscriptionStatusDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await SubscriptionService.getStatus();
      setStatus(data as any);
    } catch (err) {
      console.error('❌ Error loading subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
      </Card>
    );
  }

  // No subscription
  if (!status || !status.HasActiveSubscription) {
    return (
      <Card className={cn('border-primary/20 hover:border-primary/40 transition-colors', className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Abonament Premium</CardTitle>
          </div>
          <CardDescription>
            Accesați consultații nelimitate și beneficii exclusive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/subscriptions')} 
            className="w-full"
          >
            Vezi planuri
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active subscription
  const isInTrial = status.IsInTrial;
  const willCancel = status.CancelAtPeriodEnd;

  return (
    <Card className={cn('border-green-200 bg-green-50/50', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">{status.PlanName}</CardTitle>
          </div>
          <Badge 
            variant={isInTrial ? 'secondary' : 'default'}
            className={cn(
              isInTrial && 'bg-blue-100 text-blue-700',
              !isInTrial && 'bg-green-100 text-green-700'
            )}
          >
            {isInTrial ? 'Trial' : 'Activ'}
          </Badge>
        </div>
        <CardDescription>
          {status.Status}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Consultations Available */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Consultații disponibile</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {status.UnlimitedConsultations ? '∞' : status.MaxConsultationsPerMonth}
          </span>
        </div>

        {/* Next billing date */}
        {status.CurrentPeriodEnd && !willCancel && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>
              Reînnoire: {format(new Date(status.CurrentPeriodEnd), 'dd MMM yyyy', { locale: ro })}
            </span>
          </div>
        )}

        {/* Cancel warning */}
        {willCancel && status.CurrentPeriodEnd && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            Se încheie pe {format(new Date(status.CurrentPeriodEnd), 'dd MMM yyyy', { locale: ro })}
          </div>
        )}

        {/* Action button */}
        <Button 
          onClick={() => navigate('/subscriptions')} 
          variant="outline"
          size="sm"
          className="w-full"
        >
          Gestionează subscripția
          <ArrowRight className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
