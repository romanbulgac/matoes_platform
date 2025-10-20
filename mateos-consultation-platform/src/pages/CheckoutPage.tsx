/**
 * CheckoutPage - Страница оформления подписки
 * 
 * Обработка:
 * - Получение выбранного плана из URL параметров
 * - Отображение Order Summary
 * - Создание Stripe Checkout Session
 * - Перенаправление на Stripe Hosted Checkout
 * 
 * Flow:
 * 1. User выбирает план на PricingPage
 * 2. Redirect на /checkout?planId=xxx
 * 3. CheckoutPage показывает summary + loading
 * 4. Создает checkout session через subscriptionService
 * 5. Redirect на Stripe Checkout URL
 * 6. После оплаты Stripe redirects на /subscription-success или /subscription-cancel
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionService } from '@/services/subscriptionService';
import type { SubscriptionPlanInfoDto } from '@/types';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Shield, XCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChildSelector } from '@/components/subscriptions/ChildSelector';
import { useAuth } from '@/contexts/AuthContext';

export const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const planId = searchParams.get('planId');

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanInfoDto | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Child selection for Parent role
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childSelectionRequired, setChildSelectionRequired] = useState(false);

  // Загрузка информации о плане
  useEffect(() => {
    if (!planId) {
      setError('Plan ID не вказано в URL');
      setIsLoadingPlan(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        setIsLoadingPlan(true);
        setError(null);

        const plans = await SubscriptionService.getAvailablePlans();
        const plan = plans.find(p => p.id === planId);

        if (!plan) {
          setError(`Plan з ID "${planId}" не знайдено`);
          return;
        }

        setSelectedPlan(plan);
        
        // NEW: Check if child selection is needed (Parent role)
        if (user?.role === 'Parent') {
          setChildSelectionRequired(true);
        }
      } catch (err) {
        console.error('❌ Error fetching plan:', err);
        setError('Не вдалося завантажити інформацію про план');
      } finally {
        setIsLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [planId, user]);

  // NEW: Manual checkout creation with studentId
  const handleProceedToCheckout = async () => {
    if (!selectedPlan) return;
    
    // Validate child selection for Parent role
    if (childSelectionRequired && !selectedChildId) {
      setError('Будь ласка, оберіть дитину для оформлення підписки');
      return;
    }

    try {
      setIsCreatingCheckout(true);
      setError(null);

      console.log('🔵 Creating checkout session for plan:', selectedPlan.id);
      if (selectedChildId) {
        console.log('👶 For child:', selectedChildId);
      }

      // Визначаємо success/cancel URLs
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/checkout?planId=${selectedPlan.id}&canceled=true`;

      const result = await SubscriptionService.createCheckoutSession({
        planId: selectedPlan.id,
        studentId: selectedChildId!, // Required field in new model
        successUrl,
        cancelUrl,
      });

      if (!result.success) {
        setError(result.errorMessage || 'Не вдалося створити checkout session');
        setIsCreatingCheckout(false);
        return;
      }

      console.log('✅ Checkout session created:', result.sessionId);
      console.log('🔗 Redirecting to:', result.checkoutUrl);

      // Перенаправляємо на Stripe Checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      console.error('❌ Error creating checkout:', err);
      setError('Помилка при створенні checkout session');
      setIsCreatingCheckout(false);
    }
  };

  // Обработка отмены
  const handleCancel = () => {
    navigate('/pricing');
  };

  // Повторная попытка
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <CardTitle>Завантаження...</CardTitle>
              </div>
              <CardDescription>Готуємо дані для оформлення підписки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Помилка</CardTitle>
              </div>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад до тарифів
                </Button>
                <Button onClick={handleRetry}>
                  Спробувати знову
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // NEW: Show child selection + plan summary (NOT auto-create checkout)
  if (!selectedPlan) {
    return null;
  }

  // Checkout processing state
  if (isCreatingCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <CardTitle>Створення checkout session...</CardTitle>
              </div>
              <CardDescription>
                Підготовка безпечної сторінки оплати. Зачекайте, будь ласка...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                  {/* Plan Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedPlan.description}
                        </p>
                      </div>
                      <Badge variant={selectedPlan.isPopular ? 'default' : 'outline'}>
                        {selectedPlan.isPopular ? 'Популярний' : selectedPlan.interval}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-muted-foreground">Вартість:</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold">
                            {selectedPlan.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
                            {selectedPlan.currency}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            / {selectedPlan.interval === 'Monthly' ? 'місяць' : 'рік'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Що входить у план:
                    </h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trial info */}
                  {selectedPlan.trialPeriodDays > 0 && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm">
                        <strong>🎉 Пробний період:</strong> {selectedPlan.trialPeriodDays} днів безкоштовно
                      </p>
                    </div>
                  )}

                  {/* Security notice */}
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Безпечна оплата через Stripe. Ваші дані захищені.</span>
                  </div>
                </div>

              {/* Processing animation */}
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <CreditCard className="h-12 w-12 text-primary/30" />
                  </div>
                  <CreditCard className="h-12 w-12 text-primary relative z-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // NEW: Show plan summary + child selector + proceed button
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Оформлення підписки</CardTitle>
            <CardDescription>
              Перевірте деталі та підтвердіть перехід до оплати
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Summary */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPlan.formattedDescription || selectedPlan.description}
                    </p>
                  </div>
                  <Badge variant={selectedPlan.isPopular ? 'default' : 'outline'}>
                    {selectedPlan.isPopular ? 'Популярний' : selectedPlan.interval}
                  </Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Вартість:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">
                        {selectedPlan.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {selectedPlan.currency}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        / {selectedPlan.interval === 'Monthly' ? 'місяць' : 'рік'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Що входить у план:
                </h4>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trial info */}
              {selectedPlan.trialPeriodDays > 0 && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>🎉 Пробний період:</strong> {selectedPlan.trialPeriodDays} днів безкоштовно
                  </p>
                </div>
              )}
            </div>

            {/* NEW: Child Selector for Parent role */}
            {childSelectionRequired && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Оберіть дитину для підписки:
                </h4>
                <ChildSelector
                  selectedChildId={selectedChildId}
                  onSelectChild={setSelectedChildId}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Security notice */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Безпечна оплата через Stripe. Ваші дані захищені.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <Button 
                onClick={handleProceedToCheckout} 
                className="flex-1"
                disabled={childSelectionRequired && !selectedChildId}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Перейти до оплати
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
