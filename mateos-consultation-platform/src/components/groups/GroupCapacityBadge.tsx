import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, Users } from 'lucide-react';

interface GroupCapacityBadgeProps {
  currentMembers: number;
  maxCapacity: number;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'compact';
}

/**
 * GroupCapacityBadge - Indicator vizual pentru capacitatea grupului
 * 
 * Funcționalități:
 * - Arată current/max members (e.g., "3/6")
 * - Color coding based on capacity:
 *   - Verde: < 80% capacity
 *   - Portocaliu: 80-99% capacity
 *   - Roșu: 100% capacity (complet)
 * - Warning icon când aproape de capacitate maximă
 * - Două variante: default (cu text) și compact (doar numere)
 */
export const GroupCapacityBadge: React.FC<GroupCapacityBadgeProps> = ({
  currentMembers,
  maxCapacity,
  className,
  showIcon = true,
  variant = 'default'
}) => {
  // Calculate capacity percentage
  const capacityPercentage = (currentMembers / maxCapacity) * 100;
  
  // Determine badge variant based on capacity
  const isFull = currentMembers >= maxCapacity;
  const isAlmostFull = capacityPercentage >= 80 && !isFull;
  
  const badgeVariant = isFull 
    ? 'destructive' 
    : isAlmostFull 
      ? 'outline' 
      : 'secondary';
  
  const badgeColor = isFull
    ? 'bg-red-100 text-red-800 border-red-300'
    : isAlmostFull
      ? 'bg-orange-100 text-orange-800 border-orange-300'
      : 'bg-green-100 text-green-800 border-green-300';

  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        badgeColor,
        'flex items-center gap-1.5 font-medium',
        className
      )}
    >
      {showIcon && (
        <>
          {isAlmostFull || isFull ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Users className="h-3 w-3" />
          )}
        </>
      )}
      
      {variant === 'default' && (
        <span>
          {currentMembers}/{maxCapacity} {isFull ? 'Complet' : 'locuri'}
        </span>
      )}
      
      {variant === 'compact' && (
        <span>{currentMembers}/{maxCapacity}</span>
      )}
    </Badge>
  );
};
