'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, AreaChart, Area } from 'recharts'

interface TaskStatsProps {
  tasks: any[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  // Status Overview Data
  const statusData = [
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#22C55E' }
  ]

  // Priority Levels Data
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.urgency === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: tasks.filter(t => t.urgency === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: tasks.filter(t => t.urgency === 'low').length, color: '#22C55E' }
  ]

  // Completion Timeline Data (example data - you'll need to calculate this based on your needs)
  const timelineData = [
    { name: 'Mon', tasks: 1 },
    { name: 'Tue', tasks: 0.5 },
    { name: 'Wed', tasks: 0.8 },
    { name: 'Thu', tasks: 1.2 },
    { name: 'Fri', tasks: 2 },
    { name: 'Sat', tasks: 1.5 },
    { name: 'Sun', tasks: 0.8 }
  ]

  return (
    <>
      {/* Task Status Overview */}
      <Card className="p-4 bg-[#1F2937] border-gray-800 col-span-1 md:col-span-1">
        <h3 className="font-semibold mb-4">Task Status Overview</h3>
        <div className="flex justify-center">
          <PieChart width={200} height={200}>
            <Pie
              data={statusData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </Card>

      {/* Task Priority Levels */}
      <Card className="p-4 bg-[#1F2937] border-gray-800 col-span-1 md:col-span-1">
        <h3 className="font-semibold mb-4">Task Priority Levels</h3>
        <BarChart width={300} height={200} data={priorityData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#3B82F6">
            {priorityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </Card>

      {/* Task Completion Timeline */}
      <Card className="p-4 bg-[#1F2937] border-gray-800 col-span-1 md:col-span-1">
        <h3 className="font-semibold mb-4">Task Completion Timeline</h3>
        <AreaChart width={300} height={200} data={timelineData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.3}
          />
        </AreaChart>
      </Card>
    </>
  )
} 