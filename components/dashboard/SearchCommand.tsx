'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchCommand() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-full max-w-[500px]">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8 bg-[#1F2937] border-0"
        />
      </div>
    </div>
  )
} 