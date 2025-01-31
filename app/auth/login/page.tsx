'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/services/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth'
import { Diamond, Gem, Flower2, MailIcon, LockIcon, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const supabase = createClient()

  const onSubmit = async (data: LoginFormValues) => {
    // Check if account is locked
    if (lockoutUntil && new Date() < lockoutUntil) {
      const timeLeft = Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 1000 / 60)
      toast({
        title: "Account temporarily locked",
        description: `Please try again in ${timeLeft} minutes`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setAttempts(prev => prev + 1)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Reset attempts on successful login
      setAttempts(0)
      setLockoutUntil(null)
      reset()
      router.push('/dashboard')

    } catch (error: any) {
      console.error('Error:', error)
      
      // Implement progressive lockout
      if (attempts >= 3) {
        const lockoutTime = new Date()
        lockoutTime.setMinutes(lockoutTime.getMinutes() + Math.pow(2, attempts - 3))
        setLockoutUntil(lockoutTime)
        
        toast({
          title: "Too many failed attempts",
          description: "Account temporarily locked. Please try again later.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#17175d_1px,transparent_1px),linear-gradient(to_bottom,#17175d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
      </div>

      {/* Glowing Orbs */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] rounded-full bg-purple-600/5 blur-3xl animate-pulse" />
        <div className="absolute h-[35rem] w-[35rem] rounded-full bg-blue-600/10 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Moving Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-[400px] bg-[#1F2937]/80 backdrop-blur-xl border-white/10">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-[2px]">
                <div className="w-full h-full bg-[#1F2937] rounded-xl flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="ElevateUp Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-gray-400">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="pl-8 bg-[#111827] border-gray-800 text-white"
                    {...register('email')}
                  />
                  <MailIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-8 bg-[#111827] border-gray-800 text-white"
                    {...register('password')}
                  />
                  <LockIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 