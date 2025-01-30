'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  LayoutTemplate, // Icon for Canvas
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    status: string
  }
  onEdit: (project: any) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="bg-[#1F2937] border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Link 
          href={`/dashboard/projects/${project.id}`}
          className="font-semibold hover:text-purple-400 transition"
        >
          {project.name}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1F2937] border-gray-800">
            <DropdownMenuItem
              onClick={() => onEdit(project)}
              className="text-gray-300 focus:text-white focus:bg-purple-900/50"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(project.id)}
              className="text-red-400 focus:text-red-400 focus:bg-red-900/50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">{project.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge 
          variant="outline" 
          className={`
            ${project.status === 'completed' && 'border-green-500 text-green-500'}
            ${project.status === 'in_progress' && 'border-blue-500 text-blue-500'}
            ${project.status === 'draft' && 'border-gray-500 text-gray-500'}
          `}
        >
          {project.status}
        </Badge>
        <Link href={`/dashboard/projects/${project.id}/canvas`}>
          <Button 
            variant="outline" 
            size="sm"
            className="text-purple-400 border-purple-400 hover:bg-purple-400/20"
          >
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Canvas
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 