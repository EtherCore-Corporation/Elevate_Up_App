'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { profileSchema, type ProfileFormValues } from '@/lib/validations/profile'
import { Loader2Icon, UserIcon, KeyIcon } from 'lucide-react'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { useToast } from '@/components/ui/use-toast'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      if (data.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.newPassword,
        })
        if (passwordError) throw passwordError
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information and password
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <AvatarUpload />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  className="pl-8"
                  {...register('fullName')}
                />
                <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New Password (optional)"
                  className="pl-8"
                  {...register('newPassword')}
                />
                <KeyIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 