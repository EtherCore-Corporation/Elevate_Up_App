'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from '@/services/supabase/client'
import { Loader2 } from 'lucide-react'

interface CanvasSection {
  id: string
  title: string
  key: keyof typeof defaultCanvas
  gridArea: string
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
  { id: '1', title: 'Key Partners', key: 'key_partners', gridArea: 'kp' },
  { id: '2', title: 'Key Activities', key: 'key_activities', gridArea: 'ka' },
  { id: '3', title: 'Key Resources', key: 'key_resources', gridArea: 'kr' },
  { id: '4', title: 'Value Propositions', key: 'value_propositions', gridArea: 'vp' },
  { id: '5', title: 'Customer Relationships', key: 'customer_relationships', gridArea: 'cr' },
  { id: '6', title: 'Channels', key: 'channels', gridArea: 'ch' },
  { id: '7', title: 'Customer Segments', key: 'customer_segments', gridArea: 'cs' },
  { id: '8', title: 'Cost Structure', key: 'cost_structure', gridArea: 'c' },
  { id: '9', title: 'Revenue Streams', key: 'revenue_streams', gridArea: 'r' },
]

interface Props {
  projectId: string
}

export function BusinessModelCanvas({ projectId }: Props) {
  const supabase = createClient()
  const [canvas, setCanvas] = useState(defaultCanvas)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCanvas = async () => {
      const { data, error } = await supabase
        .from('business_model_canvas')
        .select('*')
        .eq('project_id', projectId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching canvas:', error)
        return
      }

      if (data) {
        setCanvas(data)
      } else {
        // Create new canvas if none exists
        const { error: insertError } = await supabase
          .from('business_model_canvas')
          .insert([{ project_id: projectId, ...defaultCanvas }])

        if (insertError) {
          console.error('Error creating canvas:', insertError)
        }
      }
      setLoading(false)
    }

    fetchCanvas()

    // Set up real-time subscription
    const channel = supabase
      .channel(`canvas-${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'business_model_canvas',
        filter: `project_id=eq.${projectId}`,
      }, (payload) => {
        if (payload.new) {
          setCanvas(payload.new as typeof defaultCanvas)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase])

  const updateSection = async (key: keyof typeof defaultCanvas, value: string) => {
    setSaving(true)
    const { error } = await supabase
      .from('business_model_canvas')
      .update({ [key]: value })
      .eq('project_id', projectId)

    if (error) {
      console.error('Error updating canvas:', error)
    }
    setSaving(false)
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
        {sections.map((section) => (
          <Card key={section.id} className="bg-[#1F2937] border-0">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={canvas[section.key]}
                onChange={(e) => {
                  setCanvas(prev => ({ ...prev, [section.key]: e.target.value }))
                  updateSection(section.key, e.target.value)
                }}
                placeholder={`Enter ${section.title.toLowerCase()}...`}
                className="min-h-[150px] bg-[#111827] border-0 resize-none text-gray-300 placeholder:text-gray-600"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {saving && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md">
          Saving...
        </div>
      )}
    </div>
  )
} 