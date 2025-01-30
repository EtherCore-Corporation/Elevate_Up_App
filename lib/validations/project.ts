import * as z from 'zod'

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['todo', 'in_progress', 'completed']),
})

export type ProjectFormValues = z.infer<typeof projectSchema> 