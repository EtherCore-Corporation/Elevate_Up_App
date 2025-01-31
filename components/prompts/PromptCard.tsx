'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    content: string
    tags: string[]
    category: {
      name: string
      icon: string
    } | null
  }
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800 backdrop-blur-sm hover:shadow-xl transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-medium flex justify-between items-start gap-2">
          <span className="flex-1 truncate">{prompt.title}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 line-clamp-3 mb-4">{prompt.content}</p>
        <div className="flex flex-wrap items-center gap-2">
          {prompt.category && (
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
              {prompt.category.name}
            </Badge>
          )}
          {prompt.tags?.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="border-gray-700 text-gray-400"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 