'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Loader2Icon } from 'lucide-react'
import { PageBackground } from '@/components/ui/PageBackground'
import { PromptCard } from '@/components/prompts/PromptCard'
import { PromptCategories } from '@/components/prompts/PromptCategories'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  icon: string | null
  category: {
    id: string
    name: string
    icon: string
    description: string
  } | null
}

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const supabase = createClient()

  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['prompts', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select(`
          id,
          title,
          content,
          tags,
          icon,
          category:category_id (
            id,
            name,
            icon,
            description
          )
        `)
        .eq('is_public', true)

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query
      if (error) throw error
      return data.map(prompt => ({
        ...prompt,
        category: prompt.category ? prompt.category[0] : null
      })) as Prompt[]
    },
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      <PageBackground />
      
      <div className="relative z-10 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Prompt Library</h1>
            <p className="text-muted-foreground">
              Browse our collection of AI prompts to enhance your workflow
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <PromptCategories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="col-span-3">
              {prompts && prompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prompts.map((prompt) => (
                    <PromptCard 
                      key={prompt.id} 
                      prompt={prompt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  No prompts found in this category
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 