"use client"

import * as React from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DbIcon } from "@/components/ui/db-icon"
import {
  SidebarCollapseIcon,
  SidebarExpandIcon,
  SparkleIcon,
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

      {/* Center: search */}
      <div className="flex flex-1 justify-center px-4">
        <div className="relative flex w-full max-w-[480px] items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="h-8 rounded bg-background border-border pl-9 pr-14 text-xs placeholder:text-muted-foreground"
            placeholder="Search data, notebooks, recents, and more..."
          />
          <kbd className="pointer-events-none absolute right-3 flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <span>⌘</span>
            <span>P</span>
          </kbd>
        </div>
      </div>

      {/* Right: workspace selector + icon buttons + avatar */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="sm" className="gap-1 px-2">
          <span className="text-xs">{workspace}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="AI Assistant"
          onClick={onAiClick}
          className={aiActive ? "bg-secondary" : ""}
        >
          <DbIcon icon={SparkleIcon} color="ai" size={16} />
        </Button>

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
