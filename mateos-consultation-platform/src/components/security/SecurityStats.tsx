import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SessionService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Smartphone, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityStatsProps {
  className?: string;
}

/**
 * Component for displaying security statistics
 * Shows active sessions, trusted devices, recent activity count
 */
export const SecurityStats: FC<SecurityStatsProps> = ({ className }) => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['security-stats'],
    queryFn: () => SessionService.getSecurityStatistics(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Se încarcă...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Nu s-au putut încărca statisticile de securitate
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Sesiuni Active',
      value: stats.activeSessions,
      icon: Activity,
      description: 'Dispozitive conectate',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Dispozitive de Încredere',
      value: stats.trustedDevices,
      icon: Smartphone,
      description: 'Autorizate permanent',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Încercări de Autentificare',
      value: stats.recentLoginAttempts,
      icon: Shield,
      description: 'Ultimele 24 ore',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Activități Suspecte',
      value: stats.suspiciousActivities || 0,
      icon: AlertTriangle,
      description: 'Necesită atenție',
      color: stats.suspiciousActivities > 0 ? 'text-red-600' : 'text-gray-600',
      bgColor: stats.suspiciousActivities > 0 ? 'bg-red-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn('p-2 rounded-full', stat.bgColor)}>
                <Icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
