import * as z from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['todo', 'in_progress', 'done']),
  project_id: z.string().min(1, 'Project is required'),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema> 