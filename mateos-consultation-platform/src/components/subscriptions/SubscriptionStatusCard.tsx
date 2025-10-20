import { FC, useState } from 'react';
import { SubscriptionStatusDto } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, Info, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface SubscriptionStatusCardProps {
  status: SubscriptionStatusDto | null;
  onManageSubscription: () => void;
  onUpgrade: () => void;
  loading?: boolean;
  className?: string;
}

export const SubscriptionStatusCard: FC<SubscriptionStatusCardProps> = ({
  status,
  onManageSubscription,
  onUpgrade,
  loading = false,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!status) {
    return (
      <Card className={cn('border-orange-200 bg-orange-50', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-orange-600" />
            Fără subscripție
          </CardTitle>
          <CardDescription>
            Nu aveți o subscripție activă
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Abonați-vă pentru a avea acces la consultații premium și multe alte beneficii.
          </p>
          <Button onClick={onUpgrade} disabled={loading}>
            Alegeți un plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isActive = status.HasActiveSubscription;
  const isInTrial = status.IsInTrial;
  const willCancel = status.CancelAtPeriodEnd;
  
  const getStatusBadge = () => {
    if (isInTrial) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Trial</Badge>;
    }
    if (isActive && !willCancel) {
      return <Badge variant="default" className="bg-green-100 text-green-700">Activ</Badge>;
    }
    if (isActive && willCancel) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Se anulează</Badge>;
    }
    return <Badge variant="destructive">Expirat</Badge>;
  };

  const getStatusIcon = () => {
    if (isInTrial) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    }
    if (isActive && !willCancel) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    if (isActive && willCancel) {
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const consultationsUsed = status.MaxConsultationsPerMonth - (status.UnlimitedConsultations ? 0 : 0);
  const consultationsRemaining = status.UnlimitedConsultations ? '∞' : status.MaxConsultationsPerMonth;
  const consultationsProgress = status.UnlimitedConsultations 
    ? 0 
    : (consultationsUsed / status.MaxConsultationsPerMonth) * 100;

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-xl">
                {status.PlanName || 'Subscripție'}
              </CardTitle>
              <CardDescription>
                {status.Status}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trial Warning */}
        {isInTrial && status.TrialEnd && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Perioada de probă</AlertTitle>
            <AlertDescription>
              Trial-ul dvs. se încheie pe {format(new Date(status.TrialEnd), 'dd MMMM yyyy', { locale: ro })}
            </AlertDescription>
          </Alert>
        )}

        {/* Cancel Warning */}
        {willCancel && status.CurrentPeriodEnd && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscripție anulată</AlertTitle>
            <AlertDescription>
              Subscripția dvs. se va încheia pe {format(new Date(status.CurrentPeriodEnd), 'dd MMMM yyyy', { locale: ro })}
            </AlertDescription>
          </Alert>
        )}

        {/* Consultations Usage */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Consultații disponibile</span>
            <span className="text-2xl font-bold text-primary">
              {consultationsRemaining}
            </span>
          </div>
          
          {!status.UnlimitedConsultations && (
            <>
              <Progress value={consultationsProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                {consultationsUsed} utilizate din {status.MaxConsultationsPerMonth} disponibile
              </p>
            </>
          )}
          
          {status.UnlimitedConsultations && (
            <p className="text-xs text-gray-500">
              Consultații nelimitate
            </p>
          )}
        </div>

        {/* Subscription Details */}
        {status.CurrentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {willCancel ? 'Se încheie' : 'Se reînnoiește'} pe{' '}
              {format(new Date(status.CurrentPeriodEnd), 'dd MMMM yyyy', { locale: ro })}
            </span>
          </div>
        )}

        {/* Additional Details (Collapsible) */}
        {showDetails && status.SubscriptionId && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Subscripție:</span>
              <span className="font-mono">{status.SubscriptionId.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID Utilizator:</span>
              <span className="font-mono">{status.UserId.substring(0, 8)}...</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onManageSubscription}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Gestionează
          </Button>
          
          {isActive && !isInTrial && (
            <Button
              onClick={onUpgrade}
              disabled={loading}
              className="flex-1"
            >
              Upgrade
            </Button>
          )}
        </div>

        {/* Toggle Details */}
        {status.SubscriptionId && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-500 hover:text-gray-700 underline w-full text-center"
          >
            {showDetails ? 'Ascunde detalii' : 'Arată detalii'}
          </button>
        )}
      </CardContent>
    </Card>
  );
};
