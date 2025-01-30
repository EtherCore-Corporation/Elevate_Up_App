'use client'

import { Diamond, Gem, Flower2 } from 'lucide-react'

export function PageBackground() {
  return (
    <>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#17175d_1px,transparent_1px),linear-gradient(to_bottom,#17175d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
      </div>

      {/* Glowing Orbs */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] rounded-full bg-purple-600/5 blur-3xl animate-pulse" />
        <div className="absolute h-[35rem] w-[35rem] rounded-full bg-blue-600/10 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Moving Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />

      {/* Floating Gems */}
      <div className="absolute inset-0 pointer-events-none">
        <Diamond className="absolute top-20 left-[15%] text-blue-500/20 h-12 w-12 animate-float" />
        <Gem className="absolute top-40 right-[20%] text-emerald-500/20 h-16 w-16 animate-float-delayed" />
        <Flower2 className="absolute bottom-32 left-[25%] text-purple-500/20 h-14 w-14 animate-float" />
      </div>

      {/* Glass Panel */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </>
  )
} 