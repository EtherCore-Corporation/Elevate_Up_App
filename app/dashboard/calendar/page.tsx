'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, ListTodo, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskStats } from '@/components/dashboard/TaskStats'

interface Task {
  id: string
  title: string
  description: string
  status: string
  due_date: string
  urgency: 'low' | 'medium' | 'high'
  project: {
    name: string
  }
}

function StatCard({ title, value, icon: Icon, className }: { 
  title: string
  value: string | number
  icon: any
  className?: string
}) {
  return (
    <Card className="p-4 bg-[#1F2937] border-0">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${className}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  )
}

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const supabase = createClient()

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start from Monday
  const endDate = addDays(startDate, 6)

  const { data: tasks } = useQuery({
    queryKey: ['tasks', format(startDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:project_id (
            name
          )
        `)
        .gte('due_date', format(startDate, 'yyyy-MM-dd'))
        .lte('due_date', format(endDate, 'yyyy-MM-dd'))
        .order('due_date')

      if (error) throw error
      return data as Task[]
    },
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const getTasksForDay = (date: Date) => {
    return tasks?.filter(task => 
      task.due_date && isSameDay(new Date(task.due_date), date)
    ) || []
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard 
          title="Total Tasks" 
          value={tasks?.length || 0}
          icon={ListTodo}
          className="bg-blue-500/10 text-blue-500"
        />
        <StatCard 
          title="Next Due Task" 
          value={tasks?.[0]?.title || 'No tasks due'}
          icon={Clock}
          className="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard 
          title="Completed" 
          value={tasks?.filter(t => t.status === 'done').length || 0}
          icon={CheckCircle}
          className="bg-green-500/10 text-green-500"
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled tasks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(date => addDays(date, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(date => addDays(date, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(startDate, 'MMMM d')} - {format(endDate, 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      <Card className="p-6 bg-[#1F2937] border-0">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date) => (
            <div key={date.toISOString()} className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                <div className="text-2xl">{format(date, 'd')}</div>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {getTasksForDay(date).map((task) => (
                  <Card 
                    key={task.id} 
                    className="p-2 bg-[#374151] border-0 cursor-pointer hover:bg-gray-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm text-white">{task.title}</h4>
                        <p className="text-xs text-gray-400">{task.project.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                        <Badge variant="outline" className={getUrgencyColor(task.urgency)}>
                          {task.urgency}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <TaskStats tasks={tasks || []} />
    </div>
  )
} 