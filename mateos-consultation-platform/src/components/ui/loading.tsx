import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={cn('animate-spin', sizeClasses[size], className)} 
    />
  );
};

// Skeleton components для лучшего UX
export const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className={cn(
          "h-4 bg-gray-200 rounded",
          i === lines - 1 ? "w-2/3" : "w-full"
        )}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div 
      className={cn(
        'animate-pulse bg-gray-200 rounded-full',
        sizeClasses[size]
      )} 
    />
  );
};

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="animate-pulse">
    <div className="grid gap-4">
      {/* Header */}
      <div className={`grid grid-cols-${cols} gap-4 p-4 bg-gray-50 rounded-lg`}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={`grid grid-cols-${cols} gap-4 p-4 border-b`}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// HOC для loading states
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = LoadingSpinner
) => {
  return (props: P & { isLoading?: boolean }) => {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return <LoadingComponent />;
    }
    
    return <Component {...(restProps as P)} />;
  };
};
