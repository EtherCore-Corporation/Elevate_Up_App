'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings,
  Folder
} from 'lucide-react'
import { useEffect, useState } from 'react'

const sidebarItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: Folder,
  },
  {
    title: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Prompts',
    href: '/dashboard/prompts',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="fixed left-0 h-full w-64 bg-[#111827] text-white p-4 space-y-8">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-2">
        <Image
          src="/logo.png"
          alt="ElevateUp Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-amethyst">Elevate Up</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-[#9966CC] text-white"
                  : "text-gray-400 hover:bg-[#9966CC]/20 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-700" />
          <div>
            <p className="text-sm font-medium text-white">User Name</p>
            <p className="text-xs text-gray-400">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 