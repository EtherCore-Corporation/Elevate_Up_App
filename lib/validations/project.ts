import * as z from 'zod'

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().default(''),
  status: z.enum(['todo', 'in_progress', 'completed']),
  theme: z.string().default('amethyst'),
})

export type ProjectFormValues = z.infer<typeof projectSchema> 