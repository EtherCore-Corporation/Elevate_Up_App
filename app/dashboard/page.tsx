'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BarChart } from '@/components/charts/BarChart'
import { PieChart } from '@/components/charts/PieChart'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const supabase = createClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [projectsCount, tasksCount] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('tasks').select('*', { count: 'exact' }),
      ])

      return {
        totalProjects: projectsCount.count || 0,
        totalTasks: tasksCount.count || 0,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-sm font-medium">Total Projects</CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm font-medium">Project Completion</CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm font-medium">Total Tasks</CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm font-medium">Task Completion</CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Task Progress</CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Project Distribution</CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 