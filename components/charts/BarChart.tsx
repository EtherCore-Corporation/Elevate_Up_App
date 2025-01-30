'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', completed: 4, total: 6 },
  { name: 'Tue', completed: 3, total: 5 },
  { name: 'Wed', completed: 2, total: 4 },
  { name: 'Thu', completed: 5, total: 7 },
  { name: 'Fri', completed: 3, total: 4 },
  { name: 'Sat', completed: 1, total: 2 },
  { name: 'Sun', completed: 2, total: 3 },
]

export function BarChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
        <Bar dataKey="total" fill="#93c5fd" name="Total" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
} 