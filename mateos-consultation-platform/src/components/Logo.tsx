import { cn } from '@/lib/utils';
import logoUrl from '@/assets/logo.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'square' | 'rounded' | 'circle';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function Logo({ className, size = 'md', variant = 'rounded' }: LogoProps) {
  const roundedClass = {
    square: '',
    rounded: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        roundedClass[variant],
        'overflow-hidden flex-shrink-0',
        className
      )}
    >
      <img src={logoUrl} alt="Mateos" className="w-full h-full object-contain" />
    </div>
  );
}
