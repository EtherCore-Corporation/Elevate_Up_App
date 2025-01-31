import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { MobileNav } from './components/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0D0B14]" suppressHydrationWarning>
      <Sidebar />
      <MobileNav />
      <div className="lg:pl-64">
        <Topbar />
        <main className="px-4 py-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 