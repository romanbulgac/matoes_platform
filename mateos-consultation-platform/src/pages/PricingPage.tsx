import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlanInfoDto } from '@/types';
import { ArrowLeft, CheckCircle, Crown, Gem, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlanInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const plansData = await SubscriptionService.getAvailablePlans();
      setPlans(plansData);
    } catch (err) {
      console.error('Ошибка загрузки планов:', err);
      setError('Не удалось загрузить планы подписок');
      // В случае ошибки оставляем пустой массив
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      // Если пользователь не авторизован, отправляем на регистрацию
      window.location.href = '/inregistrare';
      return;
    }

    // NEW: Redirect to CheckoutPage for child selection (Parent role) or direct checkout
    // CheckoutPage will handle studentId requirement
    window.location.href = `/checkout?planId=${planId}`;
  };

  const filteredPlans = plans.filter((plan: SubscriptionPlanInfoDto) =>
    billingCycle === 'monthly' ?
      plan.currency === 'RON' && plan.interval === 'Monthly' :
      plan.currency === 'RON' && plan.interval === 'Yearly'
  );

  const formatConsultations = (count: number) => {
    if (count <= 0) return 'Nelimitate';
    return `${count} pe lună`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadPlans} className="btn-primary">
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la pagina principală
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planuri de <span className="text-primary-600">Abonament</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Alege planul perfect pentru nevoile tale de învățare matematică. 
            Toate planurile includ acces la profesori calificați și materiale de studiu.
          </p>

          {/* Perioada de facturare */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lunar
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Anual
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  -16%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Planuri de preț */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {filteredPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                index === 1 // Средний план делаем популярным
                  ? 'border-primary-200 ring-2 ring-primary-500 scale-105'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {/* Badge popular */}
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Cel mai popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-600 ml-1">
                        {plan.currency}/{billingCycle === 'monthly' ? 'lună' : 'an'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-primary-600 font-medium mt-1">
                        Economisești 16%
                      </div>
                    )}
                  </div>

                  <div className="bg-primary-50 rounded-lg p-3 mb-6">
                    <div className="text-lg font-semibold text-primary-900">
                      {formatConsultations(plan.maxConsultationsPerMonth)}
                    </div>
                    <div className="text-sm text-primary-700">
                      consultații matematice
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {user ? 'Selectează planul' : 'Înregistrează-te'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Caracteristici suplimentare */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            De ce să alegi Mateos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rezultate Rapide
              </h3>
              <p className="text-gray-600">
                Progres vizibil în primele 2-3 sesiuni cu metodele noastre dovedite de predare.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Profesori Verificați
              </h3>
              <p className="text-gray-600">
                Toți profesorii noștri sunt verificați, cu experiență în predare și rezultate dovedite.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Satisfacție Garantată
              </h3>
              <p className="text-gray-600">
                Dacă nu ești mulțumit în primele 14 zile, îți returnăm banii integral.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Întrebări Frecvente
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pot să îmi schimb planul oricând?
              </h3>
              <p className="text-gray-600 mb-6">
                Da, poți face upgrade sau downgrade la planul tău oricând. Modificările vor fi aplicate la următorul ciclu de facturare.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ce se întâmplă dacă nu folosesc toate consultațiile?
              </h3>
              <p className="text-gray-600">
                Consultațiile nefolosite din luna curentă nu se transferă în luna următoare, dar poți reprograma sesiunile în cadrul aceleiași luni.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sunt disponibile reduceri pentru studenți?
              </h3>
              <p className="text-gray-600 mb-6">
                Da, oferim o reducere de 20% pentru studenții cu legitimație valabilă. Contactează-ne pentru detalii.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cum funcționează consultațiile online?
              </h3>
              <p className="text-gray-600">
                Consultațiile se desfășoară prin platforma noastră integrată cu video chat, tablă virtuală și partajare de ecran.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gata să începi?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Înscrie-te astăzi și primești prima consultație gratuită!
          </p>
          <div className="space-x-4">
            <Link to="/inregistrare" className="btn-primary text-lg px-8 py-3">
              Începe acum
            </Link>
            <Link to="/aplicare-profesor" className="btn-outline text-lg px-8 py-3">
              Devino profesor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
