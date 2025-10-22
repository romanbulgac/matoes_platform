import { cn } from "@/lib/utils"
import * as React from "react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      {Icon && (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Specific empty states for common use cases
import { Calendar, FileX, Search, Users } from "lucide-react"

export const NoConsultationsEmpty = ({ onCreateClick }: { onCreateClick?: () => void }) => (
  <EmptyState
    icon={Calendar}
    title="Nicio consultație"
    description="Nu ai consultații programate. Programează prima ta consultație pentru a începe."
    action={onCreateClick ? {
      label: "Programează consultație",
      onClick: onCreateClick
    } : undefined}
  />
)

export const NoSearchResultsEmpty = ({ onClearSearch }: { onClearSearch?: () => void }) => (
  <EmptyState
    icon={Search}
    title="Niciun rezultat"
    description="Nu am găsit consultații care să corespundă criteriilor de căutare."
    action={onClearSearch ? {
      label: "Șterge filtrele",
      onClick: onClearSearch
    } : undefined}
  />
)

export const NoDataEmpty = () => (
  <EmptyState
    icon={FileX}
    title="Nu există date"
    description="Momentan nu sunt disponibile date pentru afișare."
  />
)

export const NoStudentsEmpty = ({ onInviteClick }: { onInviteClick?: () => void }) => (
  <EmptyState
    icon={Users}
    title="Niciun student înscris"
    description="Nu ai studenți înscriși la consultațiile tale. Invită studenți să se alăture."
    action={onInviteClick ? {
      label: "Invită studenți",
      onClick: onInviteClick
    } : undefined}
  />
)
