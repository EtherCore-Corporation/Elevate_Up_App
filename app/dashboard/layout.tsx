'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { PageBackground } from '@/components/ui/PageBackground'
import { SearchCommand } from '@/components/dashboard/SearchCommand'
import { UserNav } from '@/components/dashboard/UserNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0D0B14]">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navigation */}
          <header className="border-b border-gray-800 bg-[#0D0B14]/50 backdrop-blur-sm">
            <div className="flex h-16 items-center px-4 gap-4">
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
      </div>
    </div>
  )
} 