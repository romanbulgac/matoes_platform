"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

// Base Chart Container
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ChartContainer({
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn("w-full h-[350px]", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Simple Bar Chart Component
interface BarChartProps {
  data: Array<{
    name: string
    value: number
    color?: string
  }>
  className?: string
  showGrid?: boolean
  showValues?: boolean
}

export function SimpleBarChart({ 
  data, 
  className, 
  showGrid = true, 
  showValues = false 
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn("w-full h-full p-4", className)}>
      <div className="relative h-full flex items-end space-x-2">
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between opacity-20">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div key={percent} className="h-px bg-border w-full" />
            ))}
          </div>
        )}
        
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              <div
                className="w-full rounded-t transition-all duration-500 ease-out hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: item.color || '#3b82f6',
                  minHeight: '4px'
                }}
              />
              {showValues && (
                <div className="absolute -top-6 text-xs font-medium text-muted-foreground">
                  {item.value}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2 text-center">
                {item.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Simple Line Chart Component
interface LineChartProps {
  data: Array<{
    name: string
    value: number
  }>
  className?: string
  color?: string
  showPoints?: boolean
}

export function SimpleLineChart({ 
  data, 
  className, 
  color = '#3b82f6',
  showPoints = true 
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  // Generate SVG path
  const pathData = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 100
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  return (
    <div className={cn("w-full h-full p-4", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#lineGradient)"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          className="transition-all duration-300"
        />
        
        {/* Points */}
        {showPoints && data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - ((item.value - minValue) / range) * 100
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              className="transition-all duration-300 hover:r-2"
            />
          )
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Progress Ring
interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  className?: string
  children?: React.ReactNode
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  className,
  children
}: ProgressRingProps) {
  const normalizedProgress = Math.max(0, Math.min(100, progress))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (normalizedProgress / 100) * circumference
  
  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
