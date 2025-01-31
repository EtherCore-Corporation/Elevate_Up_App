'use client'

import { Card } from "@/components/ui/card"
import { Clock, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'

function InsightCard({ icon: Icon, title, value, subtitle, className }: {
  icon: any
  title: string
  value: string | number
  subtitle: string
  className?: string
}) {
  return (
    <Card className="p-4 bg-[#1F2937] border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${className}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-2xl font-bold">{value}</h3>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </Card>
  )
}

export function DashboardStats() {
  const supabase = createClient()

  const { data: stats } = useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status, due_date, project_id')

      if (error) throw error

      const now = new Date()
      const weekEnd = new Date(now)
      weekEnd.setDate(now.getDate() + 7)

      const total = tasks.length
      const completed = tasks.filter(task => task.status === 'done').length
      const inProgress = tasks.filter(task => task.status === 'in-progress').length
      const dueThisWeek = tasks.filter(task => {
        const dueDate = new Date(task.due_date)
        return dueDate >= now && dueDate <= weekEnd
      }).length

      // Get unique project IDs that have active tasks
      const activeProjects = new Set(tasks.filter(task => task.status !== 'done').map(task => task.project_id)).size

      return {
        total,
        completed,
        inProgress,
        dueThisWeek,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        activeProjects
      }
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InsightCard
        icon={Lightbulb}
        title="Total Tasks"
        value={stats?.total || 0}
        subtitle={`${stats?.completed || 0} tasks completed`}
        className="bg-purple-500/10 text-purple-500"
      />
      <InsightCard
        icon={Clock}
        title="In Progress"
        value={stats?.inProgress || 0}
        subtitle={`${stats?.dueThisWeek || 0} due this week`}
        className="bg-blue-500/10 text-blue-500"
      />
      <InsightCard
        icon={CheckCircle}
        title="Completed Tasks"
        value={`${stats?.completionRate || 0}%`}
        subtitle="Task completion rate"
        className="bg-green-500/10 text-green-500"
      />
      <InsightCard
        icon={TrendingUp}
        title="Active Projects"
        value={stats?.activeProjects || 0}
        subtitle="With ongoing tasks"
        className="bg-orange-500/10 text-orange-500"
      />
    </div>
  )
} 