'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'

interface Profile {
  full_name: string | null
  email: string
  avatar_url: string | null
}

export function UserNav() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .single()
        
        setProfile(data)
      }
    }
    getProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
            <AvatarFallback>
              {profile.full_name?.charAt(0) || profile.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 