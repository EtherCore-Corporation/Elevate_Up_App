'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Diamond, Gem, Flower2, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push('/dashboard')
      router.refresh()
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0D0B14] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0B14] flex items-center justify-center p-4">
      {/* Floating Gems */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Diamond className="absolute top-20 left-[15%] text-blue-500/20 h-12 w-12 animate-float" />
        <Gem className="absolute top-40 right-[20%] text-emerald-500/20 h-16 w-16 animate-float-delayed" />
        <Flower2 className="absolute bottom-32 left-[25%] text-purple-500/20 h-14 w-14 animate-float" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to access your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1F2937]/80 backdrop-blur-xl rounded-lg p-6 shadow-xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111827] border-gray-800 text-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#111827] border-gray-800 text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-purple-400 hover:text-purple-300">
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  )
} 