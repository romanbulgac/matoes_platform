import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlanInfoDto } from '@/types';
import { ArrowLeft, CheckCircle, Crown, Gem, ShieldCheck, Zap, Sparkles, Star, Users, TrendingUp, Target, Award } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Înapoi la pagina principală
          </Link>

          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Planuri Premium
          </Badge>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Alege Planul <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Perfect pentru Tine
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Investește în educația ta cu acces la cei mai buni profesori și materiale premium de studiu
          </p>

          {/* Premium Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span><strong>500+</strong> studenți activi</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <span><strong>4.9/5</strong> rating mediu</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span><strong>95%</strong> rată de succes</span>
            </div>
          </div>

          {/* Premium Billing Cycle Tabs */}
          <div className="flex items-center justify-center">
            <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')} className="w-auto">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-white shadow-lg">
                <TabsTrigger value="monthly" className="text-sm font-semibold">
                  Lunar
                </TabsTrigger>
                <TabsTrigger value="yearly" className="text-sm font-semibold relative">
                  Anual
                  <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-0.5">
                    -16%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Premium Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {filteredPlans.map((plan, index) => {
            const isPopular = index === 1;
            const gradients = [
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600'
            ];
            
            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:-translate-y-2 ${
                  isPopular
                    ? 'border-2 border-purple-500 shadow-2xl scale-105'
                    : 'border-2 border-gray-200 hover:border-blue-300 shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-bold shadow-lg">
                      <Crown className="w-4 h-4 mr-1" />
                      CEL MAI POPULAR
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradients[index]} shadow-lg flex items-center justify-center`}>
                    {index === 0 && <Target className="w-8 h-8 text-white" />}
                    {index === 1 && <Crown className="w-8 h-8 text-white" />}
                    {index === 2 && <Award className="w-8 h-8 text-white" />}
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-xl text-gray-600 ml-2">
                        {plan.currency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      /{billingCycle === 'monthly' ? 'lună' : 'an'}
                    </p>
                    {billingCycle === 'yearly' && (
                      <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Economisești 16%
                      </Badge>
                    )}
                  </div>

                  <div className={`bg-gradient-to-r ${gradients[index]} rounded-xl p-4 shadow-lg`}>
                    <div className="text-2xl font-bold text-white">
                      {formatConsultations(plan.maxConsultationsPerMonth)}
                    </div>
                    <div className="text-sm text-white/90">
                      consultații matematice
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className={`w-full h-12 text-base font-semibold shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {user ? 'Selectează Planul' : 'Înregistrează-te Acum'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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

        {/* Premium FAQ Section with Accordion */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
              Întrebări Frecvente
            </CardTitle>
            <CardDescription className="text-lg">
              Tot ce trebuie să știi despre planurile noastre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Pot să îmi schimb planul oricând?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Da, poți face upgrade sau downgrade la planul tău oricând. Modificările vor fi aplicate la următorul ciclu de facturare. 
                  Diferența de preț va fi calculată proporțional și ajustată în factura următoare.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Ce se întâmplă dacă nu folosesc toate consultațiile?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Consultațiile nefolosite din luna curentă nu se transferă în luna următoare, dar poți reprograma sesiunile în cadrul aceleiași luni. 
                  Te încurajăm să folosești toate consultațiile pentru progres maxim!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Sunt disponibile reduceri pentru studenți?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Da, oferim o reducere de 20% pentru studenții cu legitimație valabilă. De asemenea, avem oferte speciale pentru grupuri de studenți 
                  și reduceri pentru abonamente anuale. Contactează-ne pentru detalii despre toate promoțiile active.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Cum funcționează consultațiile online?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Consultațiile se desfășoară prin platforma noastră integrată cu video chat HD, tablă virtuală interactivă și partajare de ecran. 
                  Toate sesiunile sunt înregistrate și disponibile pentru vizionare ulterioară. Nu ai nevoie de software suplimentar!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Cum pot anula abonamentul?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Poți anula abonamentul oricând din pagina de setări a contului tău. Anularea va avea efect la sfârșitul perioadei curente de facturare, 
                  având acces la toate beneficiile până la expirare. Dacă nu ești mulțumit în primele 14 zile, oferim rambursare completă.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-2 border-gray-200 rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary-600">
                  Pot alege profesorul pentru consultații?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Absolut! Poți vizualiza profilurile tuturor profesorilor, inclusiv recenziile și specializările lor, și poți alege profesorul care 
                  se potrivește cel mai bine nevoilor tale. De asemenea, poți schimba profesorul oricând dorești.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Premium CTA Final */}
        <div className="relative mt-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <div className="relative text-center py-16 px-4">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Ofertă Limitată
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gata să Îți Transformi Performanța?
            </h2>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Înscrie-te astăzi și primești <strong>prima consultație gratuită</strong>! 
              Începe călătoria către succesul academic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/inregistrare">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-2xl">
                  <Zap className="w-5 h-5 mr-2" />
                  Începe Gratuit
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </Link>
              <Link to="/aplicare-profesor">
                <Button size="lg" variant="outline" className="text-white border-2 border-white hover:bg-white/10 text-lg px-10 py-6">
                  <Crown className="w-5 h-5 mr-2" />
                  Devino Profesor
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Fără contract pe termen lung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Anulare oricând</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Satisfacție garantată</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
