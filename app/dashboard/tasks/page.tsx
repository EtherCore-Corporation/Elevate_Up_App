'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from '@/components/ui/KanbanBoard'
import { CreateTask } from '@/components/ui/CreateTask'
import { PlusIcon, Loader2Icon, Clock, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { DashboardStats } from "@/components/ui/DashboardStats"
import { DashboardCharts } from "@/components/ui/DashboardCharts"
import { PageBackground } from '@/components/ui/PageBackground'

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

function PriorityTasks({ tasks }: { tasks: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Priority Tasks</h2>
      <div className="space-y-3">
        {tasks
          .filter(task => task.urgency === 'high')
          .map(task => (
            <Card key={task.id} className="p-4 bg-[#1F2937] border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{task.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.project?.name}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-red-500">
                  {task.urgency}
                </Badge>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:project_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (task: any) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleClose = () => {
    setShowCreateModal(false)
    setEditingTask(null)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      <PageBackground />
      
      <div className="relative z-10 p-8">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Tasks Dashboard</h1>
            <Button 
              onClick={() => {
                setEditingTask(null)
                setShowCreateModal(true)
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          {/* Stats section */}
          <div className="mb-6">
            <DashboardStats />
          </div>

          {/* KanbanBoard with required props */}
          <div className="mb-6">
            <KanbanBoard 
              tasks={tasks || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Charts section */}
          <DashboardCharts />

          {/* Create/Edit Task Modal */}
          <CreateTask 
            open={showCreateModal} 
            onClose={handleClose}
            task={editingTask}
          />
        </div>
      </div>
    </div>
  )
} 