import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SessionService } from '@/services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogIn, 
  LogOut, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { SecurityActivityDto } from '@/types/security';

interface SecurityActivityLogProps {
  className?: string;
  pageSize?: number;
}

/**
 * Component for displaying security activity logs
 * Shows login attempts, device changes, session management, etc.
 */
export const SecurityActivityLog: FC<SecurityActivityLogProps> = ({ 
  className,
  pageSize = 10 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['security-activity', currentPage, pageSize],
    queryFn: () => SessionService.getSecurityActivity(currentPage, pageSize),
    refetchInterval: 60000, // Refresh every minute
  });

  // Activity type to icon mapping
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login':
      case 'login_success':
        return LogIn;
      case 'logout':
      case 'session_revoked':
        return LogOut;
      case 'password_change':
      case 'settings_change':
        return Settings;
      case 'suspicious_activity':
      case 'login_failed':
        return AlertTriangle;
      case 'device_trusted':
      case 'two_factor_enabled':
        return CheckCircle;
      default:
        return Info;
    }
  };

  // Activity type to color mapping
  const getActivityColor = (type: string, success?: boolean): { 
    icon: string; 
    bg: string; 
    badge: 'default' | 'destructive' | 'secondary' | 'outline' 
  } => {
    const typeLower = type.toLowerCase();
    
    if (success === false || typeLower.includes('failed') || typeLower.includes('suspicious')) {
      return {
        icon: 'text-red-600',
        bg: 'bg-red-50',
        badge: 'destructive'
      };
    }

    if (typeLower.includes('login') || typeLower.includes('trusted')) {
      return {
        icon: 'text-green-600',
        bg: 'bg-green-50',
        badge: 'default'
      };
    }

    if (typeLower.includes('logout') || typeLower.includes('revoked')) {
      return {
        icon: 'text-orange-600',
        bg: 'bg-orange-50',
        badge: 'secondary'
      };
    }

    return {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      badge: 'outline'
    };
  };

  // Format activity description in Romanian
  const getActivityDescription = (activity: SecurityActivityDto): string => {
    const { type, description } = activity;
    const typeLower = type.toLowerCase();

    if (typeLower.includes('login')) {
      return description || 'Autentificare';
    }
    if (typeLower.includes('logout')) {
      return 'Deconectare';
    }
    if (typeLower.includes('session_revoked')) {
      return 'Sesiune revocată';
    }
    if (typeLower.includes('password_change')) {
      return 'Parolă modificată';
    }
    if (typeLower.includes('device_trusted')) {
      return 'Dispozitiv marcat ca de încredere';
    }
    if (typeLower.includes('two_factor')) {
      return 'Autentificare cu doi factori activată';
    }
    if (typeLower.includes('suspicious')) {
      return 'Activitate suspectă detectată';
    }

    return description || type;
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, HH:mm:ss', { locale: ro });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Jurnal de Activitate Securitate
          </CardTitle>
          <CardDescription>
            Urmărește toate activitățile legate de securitatea contului tău
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Jurnal de Activitate Securitate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nu s-a putut încărca jurnalul de activitate
          </p>
        </CardContent>
      </Card>
    );
  }

  const { activities, total } = data;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Jurnal de Activitate Securitate
        </CardTitle>
        <CardDescription>
          Urmărește toate activitățile legate de securitatea contului tău
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Nu există activități înregistrate
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colors = getActivityColor(activity.type);
              
              return (
                <div 
                  key={`${activity.timestamp}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-full', colors.bg)}>
                    <Icon className={cn('h-4 w-4', colors.icon)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium">
                        {getActivityDescription(activity)}
                      </p>
                      <Badge variant={colors.badge} className="text-xs whitespace-nowrap">
                        {activity.type}
                      </Badge>
                    </div>
                    
                    {activity.ipAddress && (
                      <p className="text-xs text-muted-foreground mb-1">
                        IP: <span className="font-mono">{activity.ipAddress}</span>
                      </p>
                    )}
                    
                    {activity.location && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Locație: {activity.location}
                      </p>
                    )}
                    
                    {activity.deviceName && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Dispozitiv: {activity.deviceName}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Pagina {currentPage} din {totalPages} ({total} activități)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Următor
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
