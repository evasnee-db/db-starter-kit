"use client"

import * as React from "react"
import { TopBar } from "./TopBar"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

interface AppShellProps {
  /** Currently active nav item id */
  activeItem?: string
  onNavigate?: (id: string) => void
  onAiClick?: () => void
  aiActive?: boolean
  workspace?: string
  userInitial?: string
  children: React.ReactNode
  className?: string
}

export function AppShell({
  activeItem,
  onNavigate,
  onAiClick,
  aiActive,
  workspace,
  userInitial,
  children,
  className,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className={cn("flex h-screen flex-col overflow-hidden bg-secondary", className)}>
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onAiClick={onAiClick}
        aiActive={aiActive}
        workspace={workspace}
        userInitial={userInitial}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
        <main className={cn(
          "flex-1 overflow-y-auto rounded-md bg-background border border-border mb-2 mr-2",
          !sidebarOpen && "ml-2"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
