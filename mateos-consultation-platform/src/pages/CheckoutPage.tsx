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
import { Separator } from '@/components/ui/separator';
import { SubscriptionService } from '@/services/subscriptionService';
import type { SubscriptionPlanInfoDto } from '@/types';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Shield, XCircle, Sparkles, Lock } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full">
                  <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Se încarcă...</CardTitle>
              <CardDescription className="text-lg">Pregătim datele pentru checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-primary-100 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                <Separator className="my-6" />
                <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl" />
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-900">Eroare</CardTitle>
              <CardDescription className="text-lg text-red-700">{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleCancel} className="h-12 px-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Înapoi la prețuri
                </Button>
                <Button onClick={handleRetry} className="h-12 px-6 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700">
                  Încearcă din nou
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full">
                <CreditCard className="h-10 w-10 text-primary-600" />
              </div>
            </div>
            <Badge className="mb-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Checkout Securizat
            </Badge>
            <CardTitle className="text-3xl font-bold text-gray-900">Finalizare Abonament</CardTitle>
            <CardDescription className="text-lg">
              Verifică detaliile și confirmă plata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Summary */}
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border-2 border-primary-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {selectedPlan.formattedDescription || selectedPlan.description}
                    </p>
                  </div>
                  <Badge className={selectedPlan.isPopular ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0' : 'border-primary-300 bg-white/50'}>
                    {selectedPlan.isPopular ? '⭐ Popular' : selectedPlan.interval}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-gray-700">Preț:</span>
                    <div className="text-right">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {selectedPlan.price.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-600 ml-2">
                        {selectedPlan.currency}
                      </span>
                      <span className="text-sm text-gray-500 ml-1 block mt-1">
                        per {selectedPlan.interval === 'Monthly' ? 'lună' : 'an'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  Ce include:
                </h4>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="p-1 bg-green-100 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trial info */}
              {selectedPlan.trialPeriodDays > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Perioadă de probă gratuită</p>
                      <p className="text-sm text-green-700">{selectedPlan.trialPeriodDays} zile - complet gratuit!</p>
                    </div>
                  </div>
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
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Security notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Plată 100% Securizată</p>
                  <p className="text-xs text-blue-700">Procesare prin Stripe. Datele tale sunt protejate cu criptare SSL.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Separator />
            <div className="flex gap-4 pt-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1 h-12 border-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi
              </Button>
              <Button 
                onClick={handleProceedToCheckout} 
                className="flex-1 h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={childSelectionRequired && !selectedChildId}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Confirmă și Plătește
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
