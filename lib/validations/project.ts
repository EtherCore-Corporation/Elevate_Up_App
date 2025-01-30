import * as z from 'zod'

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  theme: z.string().default('amethyst'),
})

export type ProjectFormValues = z.infer<typeof projectSchema> 