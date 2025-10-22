import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionUsageStatsDto } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { AlertCircle, Calendar, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UsageTrackingWidgetProps {
  className?: string;
  compact?: boolean;
}

export const UsageTrackingWidget: FC<UsageTrackingWidgetProps> = ({ 
  className, 
  compact = false 
}) => {
  const navigate = useNavigate();
  const [usage, setUsage] = useState<SubscriptionUsageStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getUsageStats();
      setUsage(data);
    } catch (err) {
      console.error('❌ Error loading usage stats:', err);
      setError('Nu s-au putut încărca statisticile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-2 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !usage) {
    return (
      <Card className={cn('border-orange-200 bg-orange-50', className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Date indisponibile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {error || 'Nu există date despre utilizare'}
          </p>
          <Button onClick={loadUsageStats} variant="outline" size="sm">
            Reîncarcă
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress percentage
  const usagePercentage = usage.consultationsLimit > 0 
    ? Math.round((usage.consultationsUsed / usage.consultationsLimit) * 100)
    : 0;

  const remaining = usage.unlimitedConsultations ? Infinity : Math.max(0, usage.consultationsRemaining);
  const isLowUsage = !usage.unlimitedConsultations && remaining <= 2 && remaining > 0;
  const isExhausted = !usage.unlimitedConsultations && remaining === 0;

  // Determine status color
  const getStatusColor = () => {
    if (isExhausted) return 'text-red-600';
    if (isLowUsage) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-600';
    if (usagePercentage >= 75) return 'bg-orange-500';
    return 'bg-green-600';
  };

  // Compact version
  if (compact) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{usage.planName || 'Plan Activ'}</span>
            </div>
            <Badge variant={isExhausted ? 'destructive' : 'default'} className="text-xs">
              {usage.unlimitedConsultations ? '∞' : `${remaining}/${usage.consultationsLimit}`}
            </Badge>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={cn('h-2', getProgressColor())}
          />
          
          {usage.currentPeriodEnd && (
            <p className="text-xs text-gray-500 mt-2">
              Reînnoire: {format(new Date(usage.currentPeriodEnd), 'dd MMM', { locale: ro })}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Utilizare Pachete</CardTitle>
              <CardDescription>{usage.planName || 'Plan activ'}</CardDescription>
            </div>
          </div>
          
          {!isExhausted ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Statistics */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consultații utilizate</p>
              <p className="text-3xl font-bold mt-1">{usage.consultationsUsed}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Rămase</p>
              <p className={cn('text-3xl font-bold mt-1', getStatusColor())}>
                {usage.unlimitedConsultations ? '∞' : remaining}
              </p>
            </div>
          </div>

          {!usage.unlimitedConsultations && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progres utilizare</span>
                <span className="font-medium">{usagePercentage}%</span>
              </div>
              <Progress 
                value={usagePercentage} 
                className={cn('h-3', getProgressColor())}
              />
            </div>
          )}

          {usage.unlimitedConsultations && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Consultații nelimitate
              </p>
            </div>
          )}
        </div>

        {/* Warnings */}
        {isExhausted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Limite epuizate</p>
                <p className="text-xs text-red-700 mt-1">
                  Ai utilizat toate consultațiile disponibile pentru această perioadă. 
                  Actualizează planul pentru acces continuu.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLowUsage && !isExhausted && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Consultații limitate</p>
                <p className="text-xs text-orange-700 mt-1">
                  Ai doar {remaining} consultații rămase. Consideră actualizarea planului.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Period Information */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Perioada curentă</span>
          </div>
          <div className="text-right">
            {usage.currentPeriodStart && usage.currentPeriodEnd && (
              <p className="text-xs text-gray-700">
                {format(new Date(usage.currentPeriodStart), 'dd MMM', { locale: ro })} - {' '}
                {format(new Date(usage.currentPeriodEnd), 'dd MMM yyyy', { locale: ro })}
              </p>
            )}
            {usage.currentPeriodEnd && (
              <p className="text-xs text-gray-500 mt-1">
                Se reînnoiește în {Math.ceil((new Date(usage.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} zile
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => navigate('/subscriptions')}
            variant="outline"
            className="flex-1"
          >
            Gestionează abonamentul
          </Button>
          
          {(isExhausted || isLowUsage) && (
            <Button 
              onClick={() => navigate('/pricing')}
              className="flex-1"
            >
              Actualizează planul
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
