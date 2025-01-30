'use client'

import { PieChart, Pie, Cell } from 'recharts'

interface DoughnutChartProps {
  completed: number
  total: number
  size?: number
  lightTheme?: boolean
}

export function DoughnutChart({ 
  completed, 
  total, 
  size = 80,
  lightTheme = false 
}: DoughnutChartProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = total - completed

  const data = [
    { value: completed },
    { value: remaining }
  ]

  const colors = [
    lightTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    lightTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
  ]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          innerRadius={25}
          outerRadius={35}
          paddingAngle={0}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-medium ${lightTheme ? 'text-gray-800' : 'text-white'}`}>
          {percentage}%
        </span>
      </div>
    </div>
  )
} 