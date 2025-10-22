import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface PremiumSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function PremiumSpinner({ 
  size = 'md', 
  variant = 'default', 
  className 
}: PremiumSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-primary',
    secondary: 'text-secondary'
  };

  return (
    <Spinner 
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
    />
  );
}
