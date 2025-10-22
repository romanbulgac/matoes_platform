import { Card, CardContent } from '@/components/ui/card';
import { ConsultationCardSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface ConsultationLoadingSkeletonProps {
  className?: string;
}

export const ConsultationLoadingSkeleton: FC<ConsultationLoadingSkeletonProps> = ({
  className
}) => {
  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Header skeleton */}
      <Typography.Section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded-lg w-80 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
          <div className="h-11 bg-gray-200 rounded-lg w-48 animate-pulse" />
        </div>
      </Typography.Section>
      
      {/* Filters skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Content skeleton */}
      <div className="space-y-8">
        {/* Day groups skeleton */}
        {[1, 2, 3].map((dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            {/* Day header skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
              <div className="flex-1 h-px bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
            
            {/* Consultation cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((cardIndex) => (
                <ConsultationCardSkeleton key={`${dayIndex}-${cardIndex}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};