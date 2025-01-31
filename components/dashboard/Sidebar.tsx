'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Projects',
    icon: FolderKanban,
    href: '/dashboard/projects',
  },
  {
    label: 'Tasks',
    icon: CheckSquare,
    href: '/dashboard/tasks',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/dashboard/calendar',
  },
  {
    label: 'Prompts',
    icon: MessageSquare,
    href: '/dashboard/prompts',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-screen bg-[#0D0B14] border-r border-gray-800 w-64">
      <div className="px-3 py-2 flex flex-col h-full">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-xl font-bold">Elevate Up</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-800/50 rounded-lg transition",
                pathname === route.href ? "bg-gray-800/50" : "transparent",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-auto px-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm hover:bg-gray-800/50"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
} 