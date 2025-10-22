import { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlanDto, SubscriptionStatusDto } from '@/types/api';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionStatusCard } from '@/components/subscriptions/SubscriptionStatusCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, History, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const SubscriptionsPage: FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [status, setStatus] = useState<SubscriptionStatusDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем планы и статус независимо (статус может не быть доступен для Teacher)
      const plansData = await SubscriptionService.getPlans();
      const statusData = await SubscriptionService.getStatus();
      
      console.log('📊 Loaded data:', { 
        plansCount: plansData?.length, 
        hasStatus: !!statusData,
        plans: plansData,
        status: statusData
      });
      
      setPlans(plansData as any || []);
      setStatus(statusData as any);
    } catch (err) {
      console.error('❌ Error loading subscription data:', err);
      setError('Nu s-au putut încărca datele subscripției');
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca datele subscripției',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPlan = async (planId: string) => {
    setProcessing(true);
    try {
      // Creează Stripe Checkout Session
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/subscriptions/success`,
          cancelUrl: `${window.location.origin}/subscriptions`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect către Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('❌ Error creating checkout:', err);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut inițializa procesul de plată',
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    setProcessing(true);
    try {
      // Deschide Stripe Billing Portal
      const response = await fetch('/api/subscriptions/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to open billing portal');
      }

      const data = await response.json();
      
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err) {
      console.error('❌ Error opening billing portal:', err);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut deschide portalul de facturare',
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  const handleUpgrade = () => {
    // Scroll to plans section
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPlans = plans.filter(plan => {
    if (billingCycle === 'monthly') {
      return plan.Interval === 'Lunar';
    } else {
      return plan.Interval === 'Anual';
    }
  });
  
  console.log('📊 Filtered plans:', { billingCycle, totalPlans: plans.length, filteredCount: filteredPlans.length, filteredPlans });

  // Determine popular plan
  const popularPlanIndex = filteredPlans.length > 0 ? Math.floor(filteredPlans.length / 2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la Dashboard
          </Button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Subscripții
          </h1>
          <p className="text-gray-600 text-lg">
            Gestionați subscripția și alegeți planul potrivit pentru dvs.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-2">
              Reîncarcă
            </Button>
          </div>
        )}
        
        {/* No Plans Warning */}
        {!loading && !error && plans.length === 0 && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center">
              Nu există planuri de subscripție disponibile momentan.
            </p>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="overview">
              <Settings className="h-4 w-4 mr-2" />
              Prezentare
            </TabsTrigger>
            <TabsTrigger value="plans">
              <CreditCard className="h-4 w-4 mr-2" />
              Planuri
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Istoric
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <SubscriptionStatusCard
              status={status}
              onManageSubscription={handleManageSubscription}
              onUpgrade={handleUpgrade}
              loading={processing}
            />
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-8" id="plans-section">
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={cn(
                    'px-6 py-2 rounded-md text-sm font-medium transition-all',
                    billingCycle === 'monthly'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  Lunar
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={cn(
                    'px-6 py-2 rounded-md text-sm font-medium transition-all',
                    billingCycle === 'yearly'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  Anual
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Economie 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            {filteredPlans.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Nu există planuri disponibile pentru {billingCycle === 'monthly' ? 'lunar' : 'anual'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan, index) => (
                  <SubscriptionCard
                    key={plan.Id}
                    plan={plan}
                    isCurrentPlan={status?.SubscriptionId === plan.Id}
                    isPopular={index === popularPlanIndex}
                    onSelect={handleSelectPlan}
                    loading={processing}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Istoric plăți
              </h3>
              <p className="text-gray-600 mb-4">
                Aici veți vedea istoricul plăților pentru subscripție
              </p>
              <Button onClick={handleManageSubscription} variant="outline">
                Vezi facturi în Stripe
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
