import { cn } from "@/lib/utils"
import * as React from "react"

// Calendar component for date selection
interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
  disabled?: (date: Date) => boolean
  mode?: 'single' | 'multiple'
}

export function Calendar({
  selected,
  onSelect,
  className,
  disabled,
  mode: _mode = 'single' // Prefixed with _ to indicate intentionally unused
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const monthNames = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ]
  
  const dayNames = ["L", "M", "M", "J", "V", "S", "D"]
  
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const daysInPrevMonth = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0))
  
  const days = []
  
  // Previous month's days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, daysInPrevMonth - i),
      isCurrentMonth: false
    })
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
      isCurrentMonth: true
    })
  }
  
  // Next month's days to fill the grid
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
      isCurrentMonth: false
    })
  }
  
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  
  const isSelected = (date: Date) => {
    if (!selected) return false
    return selected.toDateString() === date.toDateString()
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  return (
    <div className={cn("p-4 bg-background border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          →
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isDisabled = disabled?.(day.date)
          const selected = isSelected(day.date)
          const today = isToday(day.date)
          
          return (
            <button
              key={index}
              onClick={() => onSelect?.(day.date)}
              disabled={isDisabled}
              className={cn(
                "p-2 text-sm rounded-md transition-colors hover:bg-muted",
                !day.isCurrentMonth && "text-muted-foreground/50",
                selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                today && !selected && "bg-muted font-semibold",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {day.date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Time slot picker for consultations
interface TimeSlot {
  time: string
  available: boolean
  id: string
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[]
  selectedTimeSlot?: string
  onSelectTimeSlot?: (timeSlot: string) => void
  className?: string
}

export function TimeSlotPicker({
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
  className
}: TimeSlotPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium">Alege ora</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.available && onSelectTimeSlot?.(slot.id)}
            disabled={!slot.available}
            className={cn(
              "p-2 text-sm rounded-md border transition-colors",
              slot.available
                ? "border-input hover:bg-muted"
                : "border-muted bg-muted text-muted-foreground cursor-not-allowed",
              selectedTimeSlot === slot.id && "bg-primary text-primary-foreground border-primary"
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}
