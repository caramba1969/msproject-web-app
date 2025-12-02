import React from 'react'
import { useProjectStore } from '../store/ProjectStore'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'

export default function CalendarView() {
  const { currentProject } = useProjectStore()
  const tasks = currentProject?.tasks || []
  
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      isSameDay(task.startDate, day) || 
      isSameDay(task.endDate, day) ||
      (task.startDate <= day && task.endDate >= day)
    )
  }

  return (
    <div className="h-full p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{format(today, 'MMMM yyyy')}</h2>
      </div>
      
      <div className="grid grid-cols-7 gap-2 h-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayTasks = getTasksForDay(day)
          const isToday = isSameDay(day, today)
          
          return (
            <div key={day.toISOString()} className={`p-2 border border-gray-200 min-h-24 ${
              isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate">
                    {task.name}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}