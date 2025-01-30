'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/services/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
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
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

interface CreateProjectProps {
  open: boolean
  onClose: () => void
  project?: ProjectFormValues | null
}

export function CreateProject({ open, onClose, project }: CreateProjectProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'todo',
      ...project
    }
  })

  React.useEffect(() => {
    if (project) {
      reset(project)
    }
  }, [project, reset])

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (project?.id) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', project.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert([{
            ...data,
            user_id: user.id,
          }])

        if (error) throw error

        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      reset()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      console.error('Error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Project Name</label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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
            <Select onValueChange={(value: "todo" | "in_progress" | "completed") => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 