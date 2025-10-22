import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
  children?: ReactNode
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  children
}: StatsCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </h3>
          {Icon && (
            <div className="h-8 w-8 text-muted-foreground">
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  trend.isPositive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  size = 'md',
  className
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600'
  }

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 transition-all hover:shadow-lg",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className={cn("font-bold", textSizeClasses[size])}>{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("h-8 w-8", iconColorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
