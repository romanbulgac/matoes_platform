import { FC } from 'react';
import { Check, Crown, Gem, Sparkles, Zap } from 'lucide-react';
import { SubscriptionPlanDto } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  plan: SubscriptionPlanDto;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelect: (planId: string) => void;
  loading?: boolean;
  className?: string;
}

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Basic': Sparkles,
  'Standard': Zap,
  'Premium': Crown,
  'Ultimate': Gem,
};

export const SubscriptionCard: FC<SubscriptionCardProps> = ({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  loading = false,
  className,
}) => {
  const Icon = planIcons[plan.Name] || Sparkles;
  const isMonthly = plan.Interval === 'Lunar';
  const isYearly = plan.Interval === 'Anual';
  
  const consultationsText = plan.UnlimitedConsultations
    ? 'Consultații nelimitate'
    : `${plan.MaxConsultationsPerMonth} consultații/lună`;

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
        isPopular && 'border-primary ring-2 ring-primary ring-offset-2',
        isCurrentPlan && 'border-green-500 ring-2 ring-green-500 ring-offset-2',
        className
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          Cel mai popular
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
          Planul curent
        </div>
      )}

      <CardHeader className="text-center pb-8 pt-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold">{plan.Name}</CardTitle>
        
        <CardDescription className="mt-2 text-sm">
          {plan.Description}
        </CardDescription>

        {/* Price */}
        <div className="mt-6">
          <div className="flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-gray-900">
              {plan.Price}
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              {plan.Currency}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {isMonthly && 'pe lună'}
            {isYearly && 'pe an'}
            {!isMonthly && !isYearly && `per ${plan.Interval}`}
          </p>
          
          {/* Trial Badge */}
          {plan.TrialPeriodDays > 0 && (
            <Badge variant="secondary" className="mt-3">
              {plan.TrialPeriodDays} zile trial gratuit
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        {/* Consultations */}
        <div className="mb-6 rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-primary">{consultationsText}</p>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.Features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Button
          onClick={() => onSelect(plan.Id)}
          disabled={loading || isCurrentPlan}
          className={cn(
            'w-full',
            isPopular && 'bg-primary hover:bg-primary/90',
            isCurrentPlan && 'bg-green-500 hover:bg-green-600'
          )}
        >
          {loading && 'Se încarcă...'}
          {!loading && isCurrentPlan && 'Plan activ'}
          {!loading && !isCurrentPlan && 'Selectează'}
        </Button>
      </CardFooter>
    </Card>
  );
};
