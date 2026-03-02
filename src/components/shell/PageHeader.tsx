"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  /** Breadcrumb nav rendered above the title row */
  breadcrumbs?: React.ReactNode
  /** Page title text or node */
  title: React.ReactNode
  /** Optional 32×32 avatar/icon left of the title (e.g. an AI model icon) */
  avatar?: React.ReactNode
  /** Icon-sized action buttons rendered inline after the title (copy, link, etc.) */
  titleIcons?: React.ReactNode
  /** Badge/tag rendered inline after the title icons (e.g. "Preview") */
  badge?: React.ReactNode
  /** Short description line rendered below the title row */
  description?: React.ReactNode
  /** Right-aligned action buttons (overflow, secondary, primary) */
  actions?: React.ReactNode
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageHeader({
  breadcrumbs,
  title,
  avatar,
  titleIcons,
  badge,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Breadcrumbs row */}
      {breadcrumbs && <div>{breadcrumbs}</div>}

      {/* Title + buttons row */}
      <div className="flex h-8 items-center justify-between gap-4">
        {/* Left: avatar + title + inline icons + badge */}
        <div className="flex min-w-0 items-center gap-2">
          {avatar && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#137dae]">
              {avatar}
            </div>
          )}
          <h2 className="shrink-0 text-[22px] font-semibold leading-7 text-foreground whitespace-nowrap">
            {title}
          </h2>
          {titleIcons && (
            <div className="flex items-center gap-0.5">{titleIcons}</div>
          )}
          {badge && <div className="flex items-center">{badge}</div>}
        </div>

        {/* Right: action buttons */}
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Description row */}
      {description && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  )
}
