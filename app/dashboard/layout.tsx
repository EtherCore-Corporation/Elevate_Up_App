'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { PageBackground } from '@/components/ui/PageBackground'
import { SearchCommand } from '@/components/dashboard/SearchCommand'
import { UserNav } from '@/components/dashboard/UserNav'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0B14]">
      <div className="flex">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="fixed top-4 left-4 z-50 md:hidden bg-[#1F2937] hover:bg-[#374151] p-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        {/* Sidebar - hidden on mobile by default */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-40 md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navigation */}
          <header className="border-b border-gray-800 bg-[#0D0B14]/50 backdrop-blur-sm">
            <div className="flex h-16 items-center px-4 md:px-6 gap-4">
              <div className="w-16 md:w-0" /> {/* Spacer for mobile menu button */}
              <SearchCommand />
              <div className="ml-auto flex items-center gap-2">
                <UserNav />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="relative">
            <PageBackground />
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
} 