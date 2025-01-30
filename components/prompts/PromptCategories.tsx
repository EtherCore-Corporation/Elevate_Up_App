'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2Icon } from 'lucide-react'

interface PromptCategoriesProps {
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export function PromptCategories({ selectedCategory, onSelectCategory }: PromptCategoriesProps) {
  const supabase = createClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['prompt-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompt_categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-2">
          <Button
            variant={selectedCategory === null ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(null)}
          >
            All Prompts
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 