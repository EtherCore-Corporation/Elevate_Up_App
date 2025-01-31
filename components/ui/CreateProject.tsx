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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project'
import { Loader2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { projectThemes } from "@/lib/themes"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ThemeCard } from "./theme-card"

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
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'todo',
      theme: 'amethyst',
      ...project
    }
  })

  const selectedTheme = watch('theme')

  React.useEffect(() => {
    if (project) {
      reset(project)
    }
  }, [project, reset])

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const projectData = {
        name: data.name,
        description: data.description || '',
        status: data.status,
        theme: data.theme,
        user_id: user.id,
      }

      if (project?.id) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)

        if (error) throw error
        toast({ title: "Success", description: "Project updated successfully" })
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData])

        if (error) throw error
        toast({ title: "Success", description: "Project created successfully" })
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
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 sm:p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {project ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
            <DialogDescription>
              {project ? 'Update your project details' : 'Add a new project to your workspace'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  className="mt-1.5"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="mt-1.5"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value: 'todo' | 'in_progress' | 'completed') => setValue('status', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Theme</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {projectThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      selected={watch('theme') === theme.id}
                      onSelect={() => setValue('theme', theme.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      {project ? 'Updating...' : 'Creating...'}
                    </>
                  ) : project ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 