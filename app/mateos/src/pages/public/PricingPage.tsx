import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import { Check, Star } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billingInterval === 'monthly' ? 99 : 990,
      consultations: 4,
      description: 'Perfect for getting started',
      features: [
        '4 consultations per month',
        'Individual sessions only',
        'Basic progress tracking',
        'Email support',
        'Access to learning materials',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: billingInterval === 'monthly' ? 199 : 1990,
      consultations: 8,
      description: 'Most popular choice',
      features: [
        '8 consultations per month',
        'Individual & group sessions',
        'Advanced progress tracking',
        'Priority email support',
        'Access to all materials',
        'Consultation recordings',
        'Monthly progress reports',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: billingInterval === 'monthly' ? 349 : 3490,
      consultations: 16,
      description: 'For serious learners',
      features: [
        '16 consultations per month',
        'Individual & group sessions',
        'Personalized learning plan',
        '24/7 priority support',
        'Access to all materials',
        'Consultation recordings',
        'Weekly progress reports',
        'Direct teacher messaging',
        'Cancel anytime',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-purple-50/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/inregistrare">
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
          Flexible Pricing
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transparent pricing with no hidden fees. Cancel or pause anytime.
        </p>

        {/* Billing Toggle */}
        <Tabs value={billingInterval} onValueChange={(v) => setBillingInterval(v as 'monthly' | 'yearly')} className="w-fit mx-auto mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge className="ml-2 bg-green-500 text-white" variant="secondary">
                Save 17%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 ${
                plan.popular
                  ? 'border-primary bg-gradient-to-b from-primary-50 to-white shadow-2xl scale-105'
                  : 'border-gray-200 bg-white/50 backdrop-blur-sm'
              } transition-all hover:shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-1">
                    <Star className="h-3 w-3 mr-1 inline" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">RON</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    per {billingInterval === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {plan.consultations} consultations
                  </Badge>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/inregistrare" className="block">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              q: 'Can I change my plan later?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
            },
            {
              q: 'What happens to unused consultations?',
              a: 'Unused consultations roll over to the next month for up to 3 months, giving you flexibility in scheduling.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'Yes, we offer a 7-day money-back guarantee for all new subscriptions.',
            },
          ].map((faq, index) => (
            <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl mb-8 opacity-90">
              Choose your plan and begin your journey to math excellence today
            </p>
            <Link to="/inregistrare">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

