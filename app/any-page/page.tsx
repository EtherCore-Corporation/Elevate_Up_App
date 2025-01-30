import { PageBackground } from '@/components/ui/PageBackground'

export default function AnyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0B14]">
      <PageBackground />
      
      {/* Your page content */}
      <div className="relative z-10">
        {/* Content goes here */}
      </div>
    </div>
  )
} 