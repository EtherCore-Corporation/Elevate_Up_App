'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createClient } from '@/services/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { PencilIcon, TrashIcon, MoreVerticalIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type UrgencyLevel = 'high' | 'medium' | 'low' | 'none';

interface Task {
  id: string
  title: string
  description: string
  status: string
  due_date?: string
  project_id: string
  project: {
    id: string
    name: string
  }
  urgency?: UrgencyLevel
}

interface KanbanBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
}

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
]

// Add urgency color mapping
const urgencyColors: Record<UrgencyLevel, string> = {
  high: "bg-red-500/10 border-red-500/20 hover:border-red-500/30",
  medium: "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/30",
  low: "bg-green-500/10 border-green-500/20 hover:border-green-500/30",
  none: "bg-gray-500/10 border-gray-500/20 hover:border-gray-500/30"
}

// Add urgency badge colors
const urgencyBadgeColors = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
  none: "bg-gray-500/20 text-gray-400"
}

export function KanbanBoard({ tasks, onEdit, onDelete }: KanbanBoardProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
      
      toast({
        title: "Success",
        description: "Task status updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-sm text-muted-foreground">
              {getTasksByStatus(column.id).length}
            </span>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {getTasksByStatus(column.id).map((task) => (
              <Card key={task.id} className={`
                ${urgencyColors[task.urgency || 'none']}
                border backdrop-blur-sm
                hover:shadow-lg transition-all
              `}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-gray-700 rounded">
                        <MoreVerticalIcon className="h-4 w-4 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {columns.map(col => (
                          <DropdownMenuItem
                            key={col.id}
                            onClick={() => updateStatus(task.id, col.id)}
                            disabled={task.status === col.id}
                          >
                            Move to {col.title}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => onDelete(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={urgencyBadgeColors[task.urgency || 'none']}>
                      {task.urgency ? task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1) : 'No urgency'}
                    </Badge>
                    {task.due_date && (
                      <Badge variant="outline" className="border-gray-700">
                        Due {format(new Date(task.due_date), 'MMM d')}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 