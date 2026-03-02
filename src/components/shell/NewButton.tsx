"use client"

import * as React from "react"
import { PlusIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

interface NewButtonProps {
  onClick?: () => void
  className?: string
}

/**
 * DuBois "New" button — sidebar-specific.
 * Brand-tinted background (not the generic primary blue).
 * Uses Databricks brand red at varying opacity for default/hover/press states.
 */
export function NewButton({ onClick, className }: NewButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base: 32px height, 8px radius, full width, brand-tinted bg + border
        "flex h-8 w-full items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors",
        "border-[rgba(255,54,33,0.12)] bg-[rgba(255,54,33,0.08)] text-foreground",
        "hover:bg-[rgba(255,54,33,0.16)] hover:border-[rgba(255,54,33,0.20)]",
        "active:bg-[rgba(255,54,33,0.24)] active:border-[rgba(255,54,33,0.28)]",
        className
      )}
    >
      <PlusIcon size={16} className="shrink-0 text-[#FF3621]" />
      <span>New</span>
    </button>
  )
}
