import type { Database } from './database.types'

type TaskRow = Database['public']['Tables']['tasks']['Row']

export interface Task extends TaskRow {
  project: {
    id: string
    name: string
  }
} 