'use client'

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'Todo', value: 4, color: '#3b82f6' },
  { name: 'In Progress', value: 3, color: '#22c55e' },
  { name: 'Done', value: 2, color: '#eab308' },
]

export function PieChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
} 