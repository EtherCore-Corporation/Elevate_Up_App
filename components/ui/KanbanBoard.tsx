'use client'

import { Card } from '@/components/ui/card'
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
              <Card key={task.id} className="p-4 bg-[#1F2937] border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <span className="text-xs text-gray-400">
                        {task.project?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {task.description}
                    </p>
                    {task.due_date && (
                      <p className={`text-xs mt-2 ${
                        new Date(task.due_date) < new Date() 
                          ? 'text-red-500' 
                          : 'text-gray-500'
                      }`}>
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                    </button>
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
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 