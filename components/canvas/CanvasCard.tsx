import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface CanvasCardProps {
  title: string
  description: string
}

export function CanvasCard({ title, description }: CanvasCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
} 