'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
}

const StatsCard = ({ title, value, description }: StatsCardProps) => {
  return (
    <Card className="bg-[#1F2937] border-0">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Tasks"
        value="24"
        description="12 tasks completed"
      />
      <StatsCard
        title="In Progress"
        value="8"
        description="3 due this week"
      />
      <StatsCard
        title="Completed Tasks"
        value="67%"
        description="Compared to 52% last week"
      />
      <StatsCard
        title="Active Projects"
        value="5"
        description="2 launching soon"
      />
    </div>
  )
} 