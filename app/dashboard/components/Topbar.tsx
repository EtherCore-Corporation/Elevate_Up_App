'use client'

import { createClient } from '@/services/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Search, Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Topbar() {
  const router = useRouter()
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Don't render anything until we've mounted and checked auth status
  if (!mounted || loading) {
    return (
      <div className="sticky top-0 z-30 w-full bg-[#111827]/50 backdrop-blur-sm border-b border-gray-800">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Left side - Search */}
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-900/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if no user
  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="sticky top-0 z-30 w-full bg-[#111827]/50 backdrop-blur-sm border-b border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left side - Search */}
        <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-900/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback className="bg-gray-700">
              {user?.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-purple-900/20"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
} 