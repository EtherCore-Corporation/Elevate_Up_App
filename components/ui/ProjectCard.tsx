'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  LayoutTemplate,
} from "lucide-react"
import { projectThemes } from "@/lib/themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DoughnutChart } from "@/components/charts/DoughnutChart"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/services/supabase/client"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    status: string
    theme?: string
  }
  onEdit: (project: any) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const theme = projectThemes.find(t => t.id === project.theme) || projectThemes[0]
  const ThemeIcon = theme.icon
  const isLightTheme = ['pearl', 'rose-quartz', 'citrine', 'amethyst'].includes(theme.id)

  const supabase = createClient()

  // Fetch tasks for this project
  const { data: taskStats } = useQuery({
    queryKey: ['project-tasks', project.id],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status')
        .eq('project_id', project.id)

      if (error) throw error

      const total = tasks.length
      const completed = tasks.filter(task => task.status === 'done').length

      return { total, completed }
    },
  })

  const cardStyle = {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || theme.colors.primary} 100%)`,
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      <div 
        className="absolute inset-0 opacity-100" 
        style={cardStyle}
      />
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <ThemeIcon className={`h-5 w-5 ${isLightTheme ? 'text-gray-800' : 'text-white'}`} />
            </div>
            <Link 
              href={`/dashboard/projects/${project.id}`}
              className={`font-semibold ${isLightTheme ? 'text-gray-800' : 'text-white'} hover:opacity-80 transition`}
            >
              {project.name}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className={`h-4 w-4 ${isLightTheme ? 'text-gray-800' : 'text-white'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-gray-900 border-gray-800"
            >
              <DropdownMenuItem
                onClick={() => onEdit(project)}
                className="text-white hover:bg-white/10"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <p className={`text-sm ${isLightTheme ? 'text-gray-800' : 'text-white'} opacity-90`}>
            {project.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-gray-400">Tasks</p>
              <p className="font-medium">
                {taskStats?.completed || 0}/{taskStats?.total || 0}
              </p>
            </div>
            <DoughnutChart 
              completed={taskStats?.completed || 0} 
              total={taskStats?.total || 0}
              lightTheme={isLightTheme}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Badge 
            variant="outline" 
            className={`
              border-white/20 backdrop-blur-sm bg-white/10
              ${isLightTheme ? 'text-gray-800' : 'text-white'}
            `}
          >
            {project.status}
          </Badge>
          <Link href={`/dashboard/projects/${project.id}/canvas`}>
            <Button 
              variant="outline" 
              size="sm"
              className={`
                backdrop-blur-sm bg-white/10 border-white/20
                ${isLightTheme ? 'text-gray-800' : 'text-white'}
                hover:bg-white/20
              `}
            >
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Canvas
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  )
} 