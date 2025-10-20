import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { FC } from 'react';

interface ConsultationErrorAlertProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ConsultationErrorAlert: FC<ConsultationErrorAlertProps> = ({
  error,
  onRetry,
  className
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={cn("mb-6", className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <Typography.P className="mb-0 text-destructive">
            {error}
          </Typography.P>
        </div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCcw className="w-3 h-3 mr-2" />
            Încearcă din nou
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};