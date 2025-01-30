import * as z from "zod"

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema> 