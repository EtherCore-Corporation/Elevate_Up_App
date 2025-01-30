'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/services/supabase/client'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as z from 'zod'
import React from 'react'
import { Loader2Icon } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['todo', 'in_progress', 'done']),
  project_id: z.string().min(1, 'Project is required'),
  due_date: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface CreateTaskProps {
  open: boolean
  onClose: () => void
  task?: Task | null
}

export function CreateTask({ open, onClose, task }: CreateTaskProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name')

      if (error) throw error
      return data
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      ...task
    }
  })

  React.useEffect(() => {
    if (task) {
      reset(task)
    }
  }, [task, reset])

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (task?.id) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update(data)
          .eq('id', task.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...data,
            user_id: user.id,
          }])

        if (error) throw error

        toast({
          title: "Success",
          description: "Task created successfully",
        })
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      reset()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Update Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project">Project</label>
            <Select onValueChange={(value) => setValue('project_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_id && (
              <p className="text-sm text-red-500">{errors.project_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title">Title</label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea id="description" {...register('description')} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status">Status</label>
            <Select onValueChange={(value: "todo" | "in_progress" | "done") => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="urgency">Urgency</label>
            <Select onValueChange={(value: "low" | "medium" | "high") => setValue('urgency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="due_date">Due Date</label>
            <Input type="date" id="due_date" {...register('due_date')} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 