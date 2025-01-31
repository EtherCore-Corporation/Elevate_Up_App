'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/services/supabase/client'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'

interface SearchResults {
  projects: Array<{ id: string; name: string }>;
  tasks: Array<{ id: string; title: string }>;
}

export function SearchCommand() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const router = useRouter()
  const supabase = createClient()

  const { data: searchResults } = useQuery<SearchResults>({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { projects: [], tasks: [] }

      const [projectResults, taskResults] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name')
          .ilike('name', `%${debouncedSearch}%`)
          .limit(5),
        supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${debouncedSearch}%`)
          .limit(5)
      ])

      return {
        projects: projectResults.data || [],
        tasks: taskResults.data || []
      }
    },
    enabled: debouncedSearch.length > 0
  })

  return (
    <div className="relative w-full max-w-[500px]">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects and tasks..."
          className="pl-8 bg-[#1F2937] border-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchResults && (searchResults.projects.length > 0 || searchResults.tasks.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-[#1F2937] rounded-md shadow-lg border border-gray-800 overflow-hidden">
          {searchResults.projects.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-400 px-2 py-1">Projects</div>
              {searchResults.projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-800/50 rounded"
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
          {searchResults.tasks.length > 0 && (
            <div className="p-2 border-t border-gray-800">
              <div className="text-xs text-gray-400 px-2 py-1">Tasks</div>
              {searchResults.tasks.map((task) => (
                <button
                  key={task.id}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-800/50 rounded"
                  onClick={() => router.push(`/dashboard/tasks?task=${task.id}`)}
                >
                  {task.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 