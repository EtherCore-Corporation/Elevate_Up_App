'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BarChart } from '@/components/charts/BarChart'
import { PieChart } from '@/components/charts/PieChart'
import { Loader2 } from 'lucide-react'
import { PageBackground } from '@/components/ui/PageBackground'
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Sparkles, CheckCircle } from 'lucide-react'

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

  const { data: recentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      return data?.map(task => ({
        task: task.title,
        due: new Date(task.due_date).toLocaleDateString(),
        progress: task.progress || 0
      }))
    }
  })

  const { data: prompts } = useQuery({
    queryKey: ['recent-prompts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      return data?.map(prompt => prompt.content)
    }
  })

  const { data: milestones } = useQuery({
    queryKey: ['project-milestones'],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('name, status, due_date')
        .order('due_date', { ascending: true })
        .limit(3)

      return data?.map(project => ({
        name: project.name,
        status: project.status,
        date: new Date(project.due_date).toLocaleDateString()
      }))
    }
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      <PageBackground />
      
      <div className="relative z-10 p-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Prompts Section */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">AI Prompts</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {prompts?.map((prompt, i) => (
                  <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-300">{prompt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Upcoming Tasks</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks?.map((task, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{task.task}</span>
                      <span className="text-gray-500">{task.due}</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Milestones */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Project Milestones</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones?.map((milestone, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-300">{milestone.name}</p>
                        <p className="text-xs text-gray-500">{milestone.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        milestone.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 