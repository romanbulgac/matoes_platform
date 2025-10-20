import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlanInfoDto } from '@/types';
import { ArrowRight, Check, Crown, Shield, Sparkles, Zap } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PricingPageNew: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlanInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [packageType, setPackageType] = useState<'individual' | 'group' | 'all'>('all');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await SubscriptionService.getAvailablePlans();
      setPlans(data);
    } catch (err) {
      console.error('❌ Error loading plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect to checkout page with selected plan
    navigate(`/checkout?planId=${planId}`);
  };

  const filteredPlans = plans.filter(p => {
    const matchesBilling = p.interval === billingCycle;
    const matchesPackage = packageType === 'all' || 
      (packageType === 'individual' && p.name.toLowerCase().includes('individual')) ||
      (packageType === 'group' && p.name.toLowerCase().includes('group'));
    return matchesBilling && matchesPackage;
  });

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('basic')) return Sparkles;
    if (name.toLowerCase().includes('premium')) return Crown;
    return Zap;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="h-4 bg-gray-200 rounded" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 text-sm font-semibold">
            <Shield className="h-4 w-4 mr-2 inline" />
            Planuri flexibile pentru fiecare nevoie
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Alege planul perfect pentru tine
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acces la consultații de calitate cu profesori experți în matematică. 
            Fără angajamente pe termen lung, poți anula oricând.
          </p>

          {/* Package Type Toggle */}
          <div className="mt-6 inline-flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm">
            <button
              onClick={() => setPackageType('individual')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                packageType === 'individual'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Individual
            </button>
            <button
              onClick={() => setPackageType('group')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                packageType === 'group'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Mini-Grup
            </button>
            <button
              onClick={() => setPackageType('all')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                packageType === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Toate
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="mt-4 inline-flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm">
            <button
              onClick={() => setBillingCycle('Monthly')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                billingCycle === 'Monthly'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Lunar
            </button>
            <button
              onClick={() => setBillingCycle('Yearly')}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-all',
                billingCycle === 'Yearly'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Anual
              <Badge variant="secondary" className="ml-2">-20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {filteredPlans.map((plan) => {
            const Icon = getPlanIcon(plan.name);
            const isPopular = plan.isPopular;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative transition-all hover:shadow-xl',
                  isPopular && 'border-primary shadow-lg scale-105'
                )}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1">Cel mai popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      'p-3 rounded-lg',
                      isPopular ? 'bg-primary/10' : 'bg-gray-100'
                    )}>
                      <Icon className={cn(
                        'h-6 w-6',
                        isPopular ? 'text-primary' : 'text-gray-600'
                      )} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-xl text-gray-600">{plan.currency}</span>
                      <span className="text-gray-500">
                        / {plan.interval === 'Monthly' ? 'lună' : 'an'}
                      </span>
                    </div>
                    {plan.trialPeriodDays > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        🎉 {plan.trialPeriodDays} zile gratuit la prima achiziție
                      </p>
                    )}
                  </div>

                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {/* Consultations */}
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {plan.unlimitedConsultations
                          ? 'Consultații nelimitate'
                          : `${plan.maxConsultationsPerMonth} consultații/lună`}
                      </span>
                    </li>

                    {/* Features */}
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={cn(
                      'w-full',
                      isPopular && 'bg-primary hover:bg-primary/90'
                    )}
                    size="lg"
                  >
                    Alege planul
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Compară toate caracteristicile
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">Caracteristică</th>
                      {filteredPlans.map(plan => (
                        <th key={plan.id} className="text-center py-4 px-4 font-semibold">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-semibold">Preț total</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          <div className="font-bold text-lg">{plan.price} {plan.currency}</div>
                          <div className="text-sm text-gray-500">
                            / {plan.interval === 'Monthly' ? 'lună' : 'an'}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-semibold">Preț per lecție</td>
                      {filteredPlans.map(plan => {
                        const pricePerLesson = plan.unlimitedConsultations 
                          ? 'N/A' 
                          : `${Math.round(parseFloat(plan.price) / plan.maxConsultationsPerMonth)} ${plan.currency}`;
                        return (
                          <td key={plan.id} className="text-center py-4 px-4">
                            <div className="font-semibold text-green-600">{pricePerLesson}</div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Consultații/lună</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.unlimitedConsultations ? '∞' : plan.maxConsultationsPerMonth}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Durată lecție</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          60 min
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Tip consultație</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.name.toLowerCase().includes('group') ? 'Mini-Grup' : 'Individual'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Perioadă de probă</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.trialPeriodDays > 0 ? `${plan.trialPeriodDays} zile` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Suport prioritar</td>
                      {filteredPlans.map(plan => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.features.some(f => f.toLowerCase().includes('prioritar'))
                            ? <Check className="h-5 w-5 text-green-600 mx-auto" />
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Întrebări frecvente
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pot anula oricând?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Da, poți anula abonamentul oricând din setări. Vei avea acces până la sfârșitul 
                  perioadei de facturare curente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ce metode de plată acceptați?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acceptăm toate cardurile majore (Visa, Mastercard, American Express) prin Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pot schimba planul ulterior?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Desigur! Poți face upgrade sau downgrade oricând. Diferența de cost va fi 
                  calculată proporțional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
