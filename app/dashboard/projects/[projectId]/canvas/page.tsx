import { BusinessModelCanvas } from '@/components/canvas/BusinessModelCanvas'
import { createClient } from '@/services/supabase/server'
import { redirect } from 'next/navigation'

interface Props {
  params: {
    projectId: string
  }
}

export default async function CanvasPage({ params }: Props) {
  const supabase = createClient()

  // Check if user has access to this project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single()

  if (!project) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Business Model Canvas - {project.name}
        </h1>
      </div>
      <BusinessModelCanvas projectId={params.projectId} />
    </div>
  )
} 