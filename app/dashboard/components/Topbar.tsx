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
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 border-b border-gray-800 bg-[#111827] text-white">
        <div className="animate-pulse bg-gray-700 h-8 w-[300px] rounded" />
        <div className="flex items-center gap-4">
          <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full" />
          <div className="animate-pulse bg-gray-700 h-8 w-24 rounded" />
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
    <div className="sticky top-0 z-30 flex items-center justify-between p-4 border-b border-gray-800 bg-[#111827] text-white">
      {/* Left side - Search */}
      <div className="flex items-center gap-x-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-[300px] rounded-md bg-[#1F1937] pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-x-4">
        <Button
          size="icon"
          variant="ghost"
          className="relative text-gray-400 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[10px] font-medium flex items-center justify-center">
            3
          </span>
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
  )
} 