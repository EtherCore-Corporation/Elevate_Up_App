'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sidebarItems } from './Sidebar'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <div className="fixed inset-0 z-40 bg-[#111827] p-6 pt-16">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
        </div>
      )}
    </div>
  )
} 