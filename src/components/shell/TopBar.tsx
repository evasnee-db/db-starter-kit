"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarCollapseIcon,
  SidebarExpandIcon,
  AppIcon,
} from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DatabricksLogo } from "./DatabricksLogo"

interface TopBarProps {
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  onAiClick?: () => void
  aiActive?: boolean
  workspace?: string
  userInitial?: string
  className?: string
}

export function TopBar({
  sidebarOpen = true,
  onToggleSidebar,
  onAiClick,
  aiActive = false,
  workspace = "Production",
  userInitial = "N",
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 bg-secondary px-3",
        className
      )}
    >
      {/* Left: sidebar toggle + logo */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <SidebarCollapseIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <SidebarExpandIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        <Link href="/"><DatabricksLogo height={18} /></Link>
      </div>

      <div className="flex-1" />

      {/* Right: workspace selector + icon buttons + avatar */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="sm" className="gap-1 px-2">
          <span className="text-xs">{workspace}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>

        {/* Ask Genie pill button */}
        <button
          onClick={onAiClick}
          aria-label="Ask Genie"
          className={cn(
            "group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
            aiActive
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          style={!aiActive ? {
            background: "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(90deg, #4299E0, #CA42E0, #FF5F46) border-box",
            border: "1.5px solid transparent",
          } : undefined}
        >
          {/* Diamond sparkle icon */}
          <svg
            viewBox="0 0 20 20"
            width={14}
            height={14}
            style={{ fill: "url(#askGenieGrad)" }}
          >
            <defs>
              <linearGradient id="askGenieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4299E0" />
                <stop offset="50%" stopColor="#CA42E0" />
                <stop offset="100%" stopColor="#FF5F46" />
              </linearGradient>
            </defs>
            <path d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z" />
          </svg>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #4299E0, #CA42E0, #FF5F46)" }}
          >
            Ask Genie
          </span>
        </button>

        <Button variant="ghost" size="icon-sm" aria-label="App launcher">
          <AppIcon className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* User avatar */}
        <button
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
          aria-label="User menu"
        >
          {userInitial}
        </button>
      </div>
    </header>
  )
}
