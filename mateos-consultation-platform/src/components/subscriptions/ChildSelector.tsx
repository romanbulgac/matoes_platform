/**
 * ChildSelector - Компонент выбора ребёнка для оформления подписки
 * 
 * NEW: Parent-Student subscription model
 * Родитель выбирает для какого ребёнка оформляет подписку
 * 
 * @author Mateos Platform
 * @date October 2025
 */

import { useEffect, useState } from 'react';
import { SubscriptionService } from '@/services/subscriptionService';
import type { ParentChildDto } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChildSelectorProps {
  selectedChildId: string | null;
  onSelectChild: (childId: string) => void;
  className?: string;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  selectedChildId,
  onSelectChild,
  className
}) => {
  const [children, setChildren] = useState<ParentChildDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await SubscriptionService.getParentChildren();
        setChildren(data);
        
        // Автоматически выбрать первого ребёнка без подписки
        const firstChildWithoutSubscription = data.find(c => !c.hasActiveSubscription);
        if (firstChildWithoutSubscription && !selectedChildId) {
          onSelectChild(firstChildWithoutSubscription.id);
        }
      } catch (err) {
        console.error('Error loading children:', err);
        setError('Не удалось загрузить список детей');
      } finally {
        setLoading(false);
      }
    };
    
    loadChildren();
  }, [onSelectChild, selectedChildId]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Загрузка списка детей...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (children.length === 0) {
    return (
      <Alert className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          У вас пока нет добавленных детей. Добавьте детей в разделе "Мои дети", чтобы оформить для них подписку.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Выберите ребёнка</CardTitle>
        <CardDescription>
          Для кого оформляется подписка?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedChildId || ''} onValueChange={onSelectChild}>
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                  selectedChildId === child.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={child.id} id={child.id} />
                <Label
                  htmlFor={child.id}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {child.name} {child.surname}
                    </span>
                    {child.hasActiveSubscription && (
                      <span className="flex items-center text-xs text-green-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Есть подписка
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {child.email}
                  </div>
                  {child.hasActiveSubscription && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        У этого ребёнка уже есть активная подписка. Новая подписка заменит текущую.
                      </AlertDescription>
                    </Alert>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
