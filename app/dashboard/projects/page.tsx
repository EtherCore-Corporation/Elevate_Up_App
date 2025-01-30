'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '../../../components/ui/ProjectCard'
import { CreateProject } from '../../../components/ui/CreateProject'
import { PlusIcon, Loader2Icon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import type { ProjectFormValues } from '@/lib/validations/project'

export default function ProjectsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectFormValues | null>(null)
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: ProjectFormValues) => {
    setEditingProject(project)
    setShowCreateModal(true)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button 
          onClick={() => {
            setEditingProject(null)
            setShowCreateModal(true)
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <CreateProject 
        open={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false)
          setEditingProject(null)
        }}
        project={editingProject}
      />
    </div>
  )
} 