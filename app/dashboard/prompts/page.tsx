'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Loader2Icon } from 'lucide-react'
import { PageBackground } from '@/components/ui/PageBackground'
import { PromptCard } from '@/components/prompts/PromptCard'
import { PromptCategories } from '@/components/prompts/PromptCategories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

  const { data: categories } = useQuery({
    queryKey: ['prompt-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <PageBackground />
      
      <div className="relative z-10 p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Prompt Library</h1>
        </div>

        {/* Mobile Category Dropdown */}
        <div className="block lg:hidden">
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <PromptCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Prompts grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {prompts?.map((prompt) => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 