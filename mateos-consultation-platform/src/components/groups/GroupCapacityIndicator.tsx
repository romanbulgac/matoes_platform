import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, BarChart3, Star, TrendingUp, Users } from 'lucide-react';
import { GroupCapacityBadge } from './GroupCapacityBadge';

interface GroupCapacityIndicatorProps {
  currentMembers: number;
  maxCapacity: number;
  groupName?: string;
  showDetails?: boolean;
  className?: string;
  averageAttendance?: number; // Procent mediu de prezență (0-100)
  averageRating?: number; // Nota medie a grupului (0-5)
}

/**
 * GroupCapacityIndicator - Indicator vizual complet pentru capacitatea grupului
 * 
 * Funcționalități:
 * - Progress bar cu color coding
 * - Percentage display
 * - Badge cu status
 * - Detalii despre mini-group (3 sau 6 persoane)
 * - Warning messages când se apropie de capacitate
 * - Poate fi folosit ca standalone sau în Card
 */
export const GroupCapacityIndicator: React.FC<GroupCapacityIndicatorProps> = ({
  currentMembers,
  maxCapacity,
  groupName,
  showDetails = true,
  className,
  averageAttendance,
  averageRating
}) => {
  const capacityPercentage = (currentMembers / maxCapacity) * 100;
  const spotsLeft = maxCapacity - currentMembers;
  const isFull = currentMembers >= maxCapacity;
  const isAlmostFull = capacityPercentage >= 80 && !isFull;

  // Progress bar color based on capacity
  const progressColor = isFull
    ? 'bg-red-500'
    : isAlmostFull
      ? 'bg-orange-500'
      : 'bg-green-500';

  if (!showDetails) {
    // Compact version - just progress bar and badge
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Capacitate</span>
          <GroupCapacityBadge
            currentMembers={currentMembers}
            maxCapacity={maxCapacity}
            variant="compact"
          />
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={cn('h-full transition-all', progressColor)}
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Full version - with Card
  return (
    <Card className={cn('border-0 shadow-sm', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Capacitate Grup</CardTitle>
          </div>
          <GroupCapacityBadge
            currentMembers={currentMembers}
            maxCapacity={maxCapacity}
            variant="default"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">

          {/* Attendance Percentage */}
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <BarChart3 className={cn(
              "h-4 w-4 mb-1",
              averageAttendance === undefined ? "text-muted-foreground" :
              averageAttendance >= 80 ? "text-green-600" :
              averageAttendance >= 60 ? "text-yellow-600" :
              "text-red-600"
            )} />
            <span className="text-lg font-bold">
              {averageAttendance !== undefined ? `${averageAttendance.toFixed(0)}%` : '-'}
            </span>
            <span className="text-xs text-muted-foreground">Prezență</span>
          </div>

          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <Star className={cn(
              "h-4 w-4 mb-1",
              averageRating === undefined ? "text-muted-foreground" :
              averageRating >= 4 ? "text-yellow-500 fill-yellow-500" :
              "text-muted-foreground"
            )} />
            <span className="text-lg font-bold">
              {averageRating !== undefined ? averageRating.toFixed(1) : '-'}
            </span>
            <span className="text-xs text-muted-foreground">Rating</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
