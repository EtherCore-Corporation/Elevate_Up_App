'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from '@/services/supabase/client'
import { 
  Loader2, 
  Users, 
  Activity, 
  Database, 
  Heart, 
  UserPlus, 
  Send, 
  UserCircle,
  DollarSign,
  Wallet
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface CanvasSection {
  id: string
  title: string
  key: keyof typeof defaultCanvas
  gridArea: string
  icon: React.ElementType
  gradient: string
}

const defaultCanvas = {
  key_partners: '',
  key_activities: '',
  key_resources: '',
  value_propositions: '',
  customer_relationships: '',
  channels: '',
  customer_segments: '',
  cost_structure: '',
  revenue_streams: '',
}

const sections: CanvasSection[] = [
  { 
    id: '1', 
    title: 'Key Partners', 
    key: 'key_partners', 
    gridArea: 'kp',
    icon: Users,
    gradient: 'from-blue-500/10 to-purple-500/10'
  },
  { 
    id: '2', 
    title: 'Key Activities', 
    key: 'key_activities', 
    gridArea: 'ka',
    icon: Activity,
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  { 
    id: '3', 
    title: 'Key Resources', 
    key: 'key_resources', 
    gridArea: 'kr',
    icon: Database,
    gradient: 'from-pink-500/10 to-rose-500/10'
  },
  { 
    id: '4', 
    title: 'Value Propositions', 
    key: 'value_propositions', 
    gridArea: 'vp',
    icon: Heart,
    gradient: 'from-rose-500/10 to-orange-500/10'
  },
  { 
    id: '5', 
    title: 'Customer Relationships', 
    key: 'customer_relationships', 
    gridArea: 'cr',
    icon: UserPlus,
    gradient: 'from-orange-500/10 to-amber-500/10'
  },
  { 
    id: '6', 
    title: 'Channels', 
    key: 'channels', 
    gridArea: 'ch',
    icon: Send,
    gradient: 'from-amber-500/10 to-yellow-500/10'
  },
  { 
    id: '7', 
    title: 'Customer Segments', 
    key: 'customer_segments', 
    gridArea: 'cs',
    icon: UserCircle,
    gradient: 'from-yellow-500/10 to-lime-500/10'
  },
  { 
    id: '8', 
    title: 'Cost Structure', 
    key: 'cost_structure', 
    gridArea: 'c',
    icon: DollarSign,
    gradient: 'from-lime-500/10 to-green-500/10'
  },
  { 
    id: '9', 
    title: 'Revenue Streams', 
    key: 'revenue_streams', 
    gridArea: 'r',
    icon: Wallet,
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
]

interface Props {
  projectId: string
}

export function BusinessModelCanvas({ projectId }: Props) {
  const supabase = createClient()
  const [canvas, setCanvas] = useState(defaultCanvas)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch canvas data
  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('business_model_canvas')
          .select('*')
          .eq('project_id', projectId)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (data) {
          setCanvas(data)
        } else {
          // Create new canvas if none exists
          const newCanvas = {
            project_id: projectId,
            user_id: user.id,
            ...defaultCanvas
          }

          const { error: insertError, data: insertedData } = await supabase
            .from('business_model_canvas')
            .insert([newCanvas])
            .select()
            .single()

          if (insertError) throw insertError
          if (insertedData) setCanvas(insertedData)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCanvas()
  }, [projectId, supabase])

  // Update section
  const updateSection = async (key: keyof typeof defaultCanvas, value: string) => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const updates = {
        [key]: value,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('business_model_canvas')
        .update(updates)
        .eq('project_id', projectId)

      if (error) throw error

      // Update local state
      setCanvas(prev => ({ ...prev, [key]: value }))
    } catch (error: any) {
      toast({
        title: "Error saving changes",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4 p-4">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card 
              key={section.id} 
              className={`bg-gradient-to-br ${section.gradient} backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-medium text-white">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={canvas[section.key] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setCanvas(prev => ({ ...prev, [section.key]: newValue }))
                    updateSection(section.key, newValue)
                  }}
                  placeholder={`Enter ${section.title.toLowerCase()}...`}
                  className="min-h-[150px] bg-[#111827] border-0 resize-none text-gray-300 placeholder:text-gray-600"
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
      {saving && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </div>
      )}
    </div>
  )
} 