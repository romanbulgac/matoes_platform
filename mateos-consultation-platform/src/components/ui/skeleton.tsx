import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/**
 * ConsultationCardSkeleton - Skeleton pentru card-uri de consultații
 */
function ConsultationCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

/**
 * StatsCardSkeleton - Skeleton pentru card-uri de statistici
 */
function StatsCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export { Skeleton, ConsultationCardSkeleton, StatsCardSkeleton }
