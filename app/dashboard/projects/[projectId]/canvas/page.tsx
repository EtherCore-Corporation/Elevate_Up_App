'use client'

import { BusinessModelCanvas } from '@/components/canvas/BusinessModelCanvas'
import { createClient } from '@/services/supabase/client'
import { useRouter } from 'next/navigation'
import { PageBackground } from '@/components/ui/PageBackground'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    projectId: string
  }
}

export default function CanvasPage({ params }: Props) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadProject() {
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.projectId)
        .single()

      if (!project) {
        router.push('/dashboard/projects')
        return
      }

      setProject(project)
      setLoading(false)
    }

    loadProject()
  }, [params.projectId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      <PageBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Business Model Canvas - {project.name}
            </h1>
          </div>
          <BusinessModelCanvas projectId={params.projectId} />
        </div>
      </div>
    </div>
  )
} 