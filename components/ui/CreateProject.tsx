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
import React, { useState } from 'react'
import { projectThemes } from "@/lib/themes"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
      <DialogContent className="sm:max-w-[500px] bg-[#1F2937] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              className="bg-[#111827] border-gray-800"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              className="bg-[#111827] border-gray-800"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          {/* Theme Selection */}
          <div className="space-y-4">
            <Label>Select Theme</Label>
            <input type="hidden" {...register('theme')} />
            <RadioGroup
              value={selectedTheme}
              onValueChange={(value) => {
                setValue('theme', value, { shouldValidate: true })
              }}
              className="grid grid-cols-2 gap-4"
            >
              {projectThemes.map((theme) => {
                const ThemeIcon = theme.icon
                return (
                  <div key={theme.id} className="relative">
                    <RadioGroupItem
                      value={theme.id}
                      id={theme.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={theme.id}
                      className={`
                        flex items-center gap-2 p-4 rounded-lg border-2 
                        cursor-pointer transition-all
                        ${theme.colors.border}
                        ${selectedTheme === theme.id ? 'border-white ring-2 ring-white/20' : ''}
                        hover:bg-gray-800/50
                      `}
                    >
                      <div className={`
                        p-2 rounded-full
                        bg-gradient-to-br ${theme.colors.gradient}
                      `}>
                        <ThemeIcon className={`h-5 w-5 ${theme.colors.text}`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{theme.name}</p>
                        <p className="text-xs text-gray-400">{theme.description}</p>
                      </div>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
            {errors.theme && (
              <p className="text-sm text-red-500">{errors.theme.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              onValueChange={(value: "todo" | "in_progress" | "completed") => setValue('status', value)}
              defaultValue="todo"
            >
              <SelectTrigger className="bg-[#111827] border-gray-800">
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : project?.id ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 