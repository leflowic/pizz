"use client"

import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast backdrop-blur-3xl bg-white/10 border-2 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl px-6 py-4 text-white font-display liquid-glass-toast",
          success: 
            "liquid-glass-success bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-400/30 shadow-[0_8px_32px_0_rgba(34,197,94,0.2)]",
          error:
            "liquid-glass-error bg-gradient-to-br from-red-500/20 to-rose-500/10 border-red-400/30 shadow-[0_8px_32px_0_rgba(239,68,68,0.2)]",
          info:
            "liquid-glass-info bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-400/30 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]",
          warning:
            "liquid-glass-warning bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-400/30 shadow-[0_8px_32px_0_rgba(245,158,11,0.2)]",
          title: "text-white font-display font-semibold text-base",
          description: "text-white/80 font-sans text-sm mt-1",
          actionButton:
            "bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-3 py-1.5 font-medium text-sm transition-all duration-200 backdrop-blur-xl",
          cancelButton:
            "bg-white/10 hover:bg-white/20 text-white/70 border border-white/20 rounded-xl px-3 py-1.5 font-medium text-sm transition-all duration-200 backdrop-blur-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
