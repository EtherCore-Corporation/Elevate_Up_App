'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/services/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth'
import { MailIcon, LockIcon, UserIcon, Loader2Icon } from 'lucide-react'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { 
            full_name: data.fullName,
          },
        },
      })

      if (signUpError) throw signUpError
      setEmailSent(true)

    } catch (error: any) {
      console.error('Error:', error.message)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Check your email</h1>
            <p className="text-muted-foreground text-center">
              We've sent you a confirmation link to complete your signup
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MailIcon className="h-12 w-12 text-blue-500" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errors.fullName && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.fullName.message}
              </div>
            )}
            {errors.email && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.email.message}
              </div>
            )}
            {errors.password && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.password.message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="fullName">Full Name</label>
              <Input
                id="fullName"
                {...register('fullName')}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 