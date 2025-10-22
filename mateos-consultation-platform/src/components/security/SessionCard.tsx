import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SessionService } from '@/services';
import type { ActiveSessionDto } from '@/types/security';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  Calendar,
  Chrome,
  LogOut,
  MapPin,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet
} from 'lucide-react';
import { FC, useState } from 'react';

interface SessionCardProps {
  session: ActiveSessionDto;
  isCurrentSession?: boolean;
  className?: string;
  onRevoke?: () => void;
}

/**
 * Component for displaying a session card with device info
 * Shows device type, location, browser info, and revoke option
 */
export const SessionCard: FC<SessionCardProps> = ({ 
  session, 
  isCurrentSession = false,
  className,
  onRevoke 
}) => {
  const [isRevoking, setIsRevoking] = useState(false);
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: () => SessionService.revokeSession(session.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security-stats'] });
      onRevoke?.();
    },
    onSettled: () => {
      setIsRevoking(false);
    }
  });

  const handleRevoke = () => {
    setIsRevoking(true);
    revokeMutation.mutate();
  };

  // Icon mapping based on device type
  const getDeviceIcon = (deviceType?: string) => {
    if (!deviceType) return Monitor;
    const type = deviceType.toLowerCase();
    if (type.includes('mobile')) return Smartphone;
    if (type.includes('tablet')) return Tablet;
    return Monitor;
  };

  // Format last activity time
  const formatLastActivity = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: ro });
    } catch {
      return dateString;
    }
  };

  const DeviceIcon = getDeviceIcon(session.deviceType);

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isCurrentSession && 'border-primary border-2',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              isCurrentSession ? 'bg-primary/10' : 'bg-muted'
            )}>
              <DeviceIcon className={cn(
                'h-5 w-5',
                isCurrentSession ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {session.deviceName || session.deviceType || 'Dispozitiv Necunoscut'}
                {isCurrentSession && (
                  <Badge variant="default" className="text-xs">
                    Sesiunea Curentă
                  </Badge>
                )}
                {session.isTrusted && (
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                )}
              </CardTitle>
            </div>
          </div>

          {!isCurrentSession && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={isRevoking}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revocă Sesiunea</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ești sigur că vrei să revoci această sesiune? 
                    Dispozitivul va trebui să se autentifice din nou.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleRevoke}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Revocă
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {/* Browser Info */}
        {session.browser && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Chrome className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {session.browser}
            </span>
          </div>
        )}

        {/* OS Info */}
        {session.platform && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Monitor className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {session.platform}
            </span>
          </div>
        )}

        {/* Location */}
        {session.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {session.location}
            </span>
          </div>
        )}

        {/* Last Activity */}
        {session.lastActivity && (
          <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs">
              Ultima activitate: {formatLastActivity(session.lastActivity)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
