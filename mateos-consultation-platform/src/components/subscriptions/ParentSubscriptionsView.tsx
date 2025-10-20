/**
 * ParentSubscriptionsView - Отображение всех подписок родителя
 * 
 * NEW: Parent-Student subscription model
 * Показывает все подписки (одна на каждого ребёнка) с отдельной статистикой
 * 
 * @author Mateos Platform
 * @date October 2025
 */

import { useEffect, useState } from 'react';
import { SubscriptionService } from '@/services/subscriptionService';
import type { ParentSubscriptionDto } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Calendar, DollarSign, BookOpen, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const ParentSubscriptionsView: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ParentSubscriptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getParentSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setError('Не удалось загрузить подписки');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      'Active': { variant: 'default', label: 'Активна' },
      'Trialing': { variant: 'secondary', label: 'Пробный период' },
      'PastDue': { variant: 'destructive', label: 'Просрочена' },
      'Cancelled': { variant: 'outline', label: 'Отменена' },
      'Incomplete': { variant: 'outline', label: 'Не завершена' },
    };

    const config = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Загрузка подписок...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          У вас пока нет активных подписок. Оформите подписку для ваших детей!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Мои подписки</h2>
        <p className="text-muted-foreground">
          Управление подписками для ваших детей
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {subscriptions.map((subscription) => {
          const usagePercent = subscription.unlimitedConsultations
            ? 0
            : (subscription.consultationsUsed / subscription.maxConsultationsPerMonth) * 100;

          return (
            <Card key={subscription.subscriptionId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {subscription.studentName}
                    </CardTitle>
                    <CardDescription>{subscription.studentEmail}</CardDescription>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Plan Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">План:</span>
                    <span className="text-sm">{subscription.planName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm font-medium">
                      <DollarSign className="mr-1 h-4 w-4" />
                      Стоимость:
                    </span>
                    <span className="text-sm font-semibold">
                      {subscription.price} {subscription.currency}/месяц
                    </span>
                  </div>

                  {subscription.currentPeriodEnd && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm font-medium">
                        <Calendar className="mr-1 h-4 w-4" />
                        Действует до:
                      </span>
                      <span className="text-sm">
                        {format(new Date(subscription.currentPeriodEnd), 'dd MMMM yyyy', {
                          locale: ru,
                        })}
                      </span>
                    </div>
                  )}

                  {subscription.cancelAtPeriodEnd && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Подписка будет отменена в конце периода
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Consultation Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm font-medium">
                      <BookOpen className="mr-1 h-4 w-4" />
                      Консультации:
                    </span>
                    <span className="text-sm">
                      {subscription.unlimitedConsultations ? (
                        <Badge variant="secondary">Безлимит</Badge>
                      ) : (
                        `${subscription.consultationsUsed} / ${subscription.maxConsultationsPerMonth}`
                      )}
                    </span>
                  </div>

                  {!subscription.unlimitedConsultations && (
                    <>
                      <Progress value={usagePercent} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Использовано: {subscription.consultationsUsed}</span>
                        <span>Осталось: {subscription.consultationsRemaining}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
