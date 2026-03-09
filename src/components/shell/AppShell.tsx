"use client"

import * as React from "react"
import { X } from "lucide-react"
import { TopBar } from "./TopBar"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

interface AppShellProps {
  activeItem?: string
  onNavigate?: (id: string) => void
  onAiClick?: () => void
  aiActive?: boolean
  initialSidebarOpen?: boolean
  workspace?: string
  userInitial?: string
  children: React.ReactNode
  className?: string
}

// ─── Placeholder Genie responses ─────────────────────────────────────────────

function getGenericGenieResponse(text: string): string {
  const p = text.toLowerCase()
  if (p.includes("sql") || p.includes("query") || p.includes("table"))
    return "I can help you write SQL queries! Tell me which tables you're working with and what data you need."
  if (p.includes("dashboard") || p.includes("chart") || p.includes("visual"))
    return "To build visualizations, open a dashboard and use the Genie panel there to create charts directly on the canvas."
  if (p.includes("notebook"))
    return "I can assist with notebooks — writing code, explaining cells, debugging errors. Open a notebook to get started."
  if (p.includes("help") || p.includes("what can") || p.includes("how do"))
    return "I can help you explore data, write SQL, explain datasets, navigate the workspace, and more. Just ask!"
  if (p.includes("data") || p.includes("catalog") || p.includes("schema"))
    return "Your workspace has access to multiple catalogs and schemas. I can help you discover tables, understand lineage, or profile datasets."
  return "I'm analyzing your workspace context to give you the most relevant answer. Would you like me to search the data catalog or check your recent queries?"
}

// ─── Global Genie side panel ──────────────────────────────────────────────────

type PanelMsg = { id: string; role: "user" | "ai"; text: string }

const WELCOME_MSG: PanelMsg = {
  id: "0",
  role: "ai",
  text: "Hi! I'm Genie. I can help you explore your data, write SQL, explain datasets, or answer questions about your workspace.",
}

const SUGGESTED_PROMPTS = [
  "Show me tables in my catalog",
  "Help me write a SQL query",
  "What dashboards do I have access to?",
]

function SparkleAvatar() {
  return (
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4299E0] to-[#CA42E0]">
      <svg viewBox="0 0 20 20" width={9} height={9} fill="white">
        <path d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z" />
      </svg>
    </div>
  )
}

function GeniePanel({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = React.useState<PanelMsg[]>([WELCOME_MSG])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  const send = React.useCallback((text: string) => {
    if (!text.trim() || loading) return
    const userMsg: PanelMsg = { id: String(Date.now()), role: "user", text: text.trim() }
    setMsgs((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    setTimeout(() => {
      const aiMsg: PanelMsg = {
        id: String(Date.now() + 1),
        role: "ai",
        text: getGenericGenieResponse(userMsg.text),
      }
      setMsgs((m) => [...m, aiMsg])
      setLoading(false)
    }, 850)
  }, [loading])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const hasMsgsAfterWelcome = msgs.length > 1

  return (
    <div className="flex w-[340px] shrink-0 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <svg viewBox="0 0 20 20" width={15} height={15} style={{ fill: "url(#geniePanelGrad)", flexShrink: 0 }}>
          <defs>
            <linearGradient id="geniePanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4299E0" />
              <stop offset="50%" stopColor="#CA42E0" />
              <stop offset="100%" stopColor="#FF5F46" />
            </linearGradient>
          </defs>
          <path d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z" />
        </svg>
        <span className="flex-1 text-sm font-semibold text-foreground">Genie</span>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close Genie"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {msgs.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
            {msg.role === "ai" && <SparkleAvatar />}
            <div className={cn(
              "rounded-xl px-3 py-2 text-sm leading-relaxed",
              msg.role === "user"
                ? "ml-8 bg-primary text-primary-foreground"
                : "mr-8 bg-muted text-foreground"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Suggested prompts — only when no real conversation yet */}
        {!hasMsgsAfterWelcome && (
          <div className="mt-1 flex flex-col gap-1.5">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                <svg viewBox="0 0 12 12" width={9} height={9} className="shrink-0 text-primary/50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2 6h8M6 2l4 4-4 4"/>
                </svg>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2">
            <SparkleAvatar />
            <div className="flex items-center gap-1 rounded-xl bg-muted px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 focus-within:border-primary/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Genie anything…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-md bg-primary p-1.5 text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90"
            aria-label="Send"
          >
            <svg viewBox="0 0 10 10" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 8V2M2 5l3-3 3 3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function AppShell({
  activeItem,
  onNavigate,
  onAiClick,
  aiActive,
  initialSidebarOpen = true,
  workspace,
  userInitial,
  children,
  className,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(initialSidebarOpen)
  const [genieOpen, setGenieOpen] = React.useState(false)

  // Pages that manage their own AI panel (e.g. dashboard) pass onAiClick.
  // All other pages get the global Genie drawer.
  const handleAiClick = onAiClick ?? (() => setGenieOpen((v) => !v))
  const isAiActive = aiActive ?? genieOpen

  return (
    <div className={cn("flex h-screen flex-col overflow-hidden bg-secondary", className)}>
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onAiClick={handleAiClick}
        aiActive={isAiActive}
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

        {/* Global Genie panel — only shown when no page-level panel is active */}
        {!onAiClick && genieOpen && (
          <div className="mb-2 mr-2 overflow-hidden rounded-md border border-border">
            <GeniePanel onClose={() => setGenieOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
