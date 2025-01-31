'use client'

import { Label } from '@/components/ui/label'
import { projectThemes } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface ThemeCardProps {
  theme: typeof projectThemes[number]
  selected: boolean
  onSelect: () => void
}

export function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  const ThemeIcon = theme.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all',
        theme.colors.border,
        selected ? 'border-white ring-2 ring-white/20' : '',
        'hover:bg-gray-800/50'
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          'p-2 rounded-full bg-gradient-to-br',
          theme.colors.gradient
        )}>
          <ThemeIcon className={cn('h-5 w-5', theme.colors.text)} />
        </div>
        <div>
          <p className="font-medium text-white">{theme.name}</p>
          <p className="text-xs text-gray-400">{theme.description}</p>
        </div>
      </div>
    </button>
  )
} 