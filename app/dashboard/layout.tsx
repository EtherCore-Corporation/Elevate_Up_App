import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0D0B14]" suppressHydrationWarning>
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 