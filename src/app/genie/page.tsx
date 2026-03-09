"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DbIcon } from "@/components/ui/db-icon"
import {
  AssistantIcon,
  SparkleIcon,
  NewChatIcon,
  CloseIcon,
  PlusIcon,
  OverflowIcon,
  ClockIcon,
  NotebookIcon,
  SendIcon,
  RobotIcon,
  WarningFillIcon,
  CheckCircleFillIcon,
  StopCircleFillIcon,
  PauseIcon,
  CalendarClockIcon,
  StarFillIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SlidersIcon,
} from "@/components/icons"
import {
  ThumbsUp, ThumbsDown, Flag, ImageIcon, AtSign, ChevronDown,
  Table2, BookOpen, Code2, FileText, Folder, GitBranch,
  LayoutGrid, Sparkles, Library, FileSearch,   Zap, Cable, Search, MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "running" | "needs-attention" | "paused" | "scheduled" | "complete"

type AgentAction = {
  id: string
  type: "notebook" | "api-call" | "query" | "message"
  label: string
  tag?: string
  content?: string
  timestamp?: string
}

type SimpleMsg = { id: string; role: "user" | "ai"; text: string; sql?: string }

type AgentChat = {
  id: string
  title: string
  agentType: string
  status: AgentStatus
  progress?: number
  time: string
  description: string
  actions: AgentAction[]
  flagged?: boolean
  resultCard?: {
    title: string
    sections: { heading: string; items: string[] }[]
    summary: string
  }
  pendingCells?: number
  messages?: SimpleMsg[]
  source?: string
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const AGENT_CHATS: AgentChat[] = [
  {
    id: "1",
    title: "EDA on ski resort properties",
    agentType: "Data Analysis Agent",
    status: "needs-attention",
    progress: 65,
    time: "9:15 AM",
    description:
      "Perform basic exploratory data analysis on the ski resort properties, including finding the relevant details about them like name, location, country, and price. Then forecast their revenue for the next six months.",
    actions: [
      { id: "a1", type: "notebook", label: "Created notebook", tag: "Ski Resort Analysis" },
      {
        id: "a2",
        type: "message",
        label: "Now I need to make API calls to examine schema and sample the data.",
        timestamp: "2:14 PM",
      },
    ],
    resultCard: {
      title: "Key Booking Statistics for Ski Resorts",
      sections: [
        {
          heading: "Overall Booking Status:",
          items: [
            "Pending: 183 bookings ($101,800 total revenue, avg $556)",
            "Confirmed: 95 bookings ($50,592 total revenue, $533 avg)",
            "Cancelled: 56 bookings ($29,204 total, $522 avg)",
            "Completed: 18 bookings ($8,102 total, $545 avg)",
          ],
        },
        {
          heading: "Top Ski Resort Destinations:",
          items: [
            "Lake Tahoe leads with 90 properties (avg price $735)",
            "Aspen has 24 properties (avg price $905)",
            "Whistler has 18 properties (avg price $373)",
            "Chamonix has 16 properties (avg price $475)",
          ],
        },
      ],
      summary: "The average booking has 1.7 guests and generates around $550 in revenue.",
    },
    pendingCells: 2,
  },
  {
    id: "2",
    title: "Security audit log review",
    agentType: "Security Monitor Agent",
    status: "needs-attention",
    progress: 88,
    time: "11:00 AM",
    description:
      "Review the last 30 days of security audit logs for anomalous access patterns, failed login attempts, and permission escalations across all workspace users.",
    actions: [
      { id: "b1", type: "query", label: "Ran query", tag: "audit_logs_30d" },
      {
        id: "b2",
        type: "message",
        label: "Found 3 accounts with unusual login patterns. Generating summary report.",
        timestamp: "10:58 AM",
      },
    ],
    resultCard: {
      title: "Security Audit Summary",
      sections: [
        {
          heading: "Flagged Accounts:",
          items: [
            "user@acme.com — 47 failed logins from 3 IPs in 24 hours",
            "admin@acme.com — permission escalation at 3:12 AM",
            "svc-account — API access from unknown region (AP-EAST-1)",
          ],
        },
      ],
      summary: "3 high-severity events require immediate review.",
    },
    pendingCells: 1,
    flagged: true,
  },
  {
    id: "3",
    title: "Process customer feedback analysis",
    agentType: "Sentiment Analysis Agent",
    status: "running",
    progress: 67,
    time: "10:30 AM",
    description:
      "Analyze 12,000 customer feedback entries from Q4 to identify sentiment trends, top pain points, and feature requests. Produce a ranked list of improvement opportunities.",
    actions: [
      { id: "c1", type: "notebook", label: "Created notebook", tag: "Feedback Analysis Q4" },
      {
        id: "c2",
        type: "message",
        label: "Vectorizing text and running sentiment classifier on 12,000 entries…",
        timestamp: "10:28 AM",
      },
    ],
  },
  {
    id: "4",
    title: "Generate marketing content variations",
    agentType: "Content Generation Agent",
    status: "running",
    progress: 82,
    time: "8:45 AM",
    flagged: true,
    description:
      "Generate 5 variations of ad copy for the upcoming Spring campaign targeting enterprise buyers. Each variation should have a different tone: formal, casual, aspirational, data-driven, and storytelling.",
    actions: [
      {
        id: "d1",
        type: "message",
        label: "Generated 4 of 5 variations. Writing the storytelling variation now.",
        timestamp: "8:43 AM",
      },
    ],
  },
  {
    id: "5",
    title: "Customer churn prediction model training",
    agentType: "ML Training Agent",
    status: "running",
    progress: 55,
    time: "9:00 AM",
    description:
      "Train a gradient boosting model to predict customer churn using the last 18 months of usage data. Optimize for recall on the churn class with AUC > 0.85.",
    actions: [
      { id: "e1", type: "notebook", label: "Created notebook", tag: "Churn Model v2" },
      {
        id: "e2",
        type: "message",
        label: "Running hyperparameter sweep — fold 3 of 5.",
        timestamp: "8:59 AM",
      },
    ],
  },
  {
    id: "6",
    title: "API endpoint response time optimization",
    agentType: "Performance Optimizer Agent",
    status: "running",
    progress: 40,
    time: "8:15 AM",
    description:
      "Identify the slowest API endpoints in the production cluster and suggest query, index, and caching improvements to reduce p99 latency below 200ms.",
    actions: [
      {
        id: "f1",
        type: "message",
        label: "Profiling endpoint traces. Found 14 endpoints exceeding threshold.",
        timestamp: "8:14 AM",
      },
    ],
  },
  {
    id: "7",
    title: "Database optimization",
    agentType: "Performance Optimizer Agent",
    status: "paused",
    progress: 30,
    time: "7:20 AM",
    description:
      "Analyze table statistics and query plans to identify missing indexes, stale statistics, and partition pruning opportunities across the analytics warehouse.",
    actions: [
      {
        id: "g1",
        type: "message",
        label: "Paused pending approval to run ANALYZE on production tables.",
        timestamp: "7:18 AM",
      },
    ],
  },
  {
    id: "8",
    title: "Email campaign analysis",
    agentType: "Analytics Agent",
    status: "scheduled",
    time: "6:30 AM",
    description:
      "Run weekly email performance analysis: open rates, CTR, unsubscribe trends, and A/B test results. Schedule to run every Monday at 6:30 AM.",
    actions: [],
  },
]

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusBadge(status: AgentStatus) {
  switch (status) {
    case "running":
      return <Badge variant="teal">running</Badge>
    case "needs-attention":
      return null
    case "paused":
      return <Badge variant="coral">paused</Badge>
    case "scheduled":
      return <Badge variant="indigo">scheduled</Badge>
    case "complete":
      return <Badge variant="secondary">complete</Badge>
  }
}

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === "needs-attention")
    return <WarningFillIcon size={14} className="shrink-0 text-muted-foreground/50" />
  if (status === "running")
    return <CheckCircleFillIcon size={14} className="shrink-0 text-[var(--success)]" />
  if (status === "paused")
    return <PauseIcon size={14} className="shrink-0 text-muted-foreground" />
  if (status === "scheduled")
    return <CalendarClockIcon size={14} className="shrink-0 text-muted-foreground" />
  return <StopCircleFillIcon size={14} className="shrink-0 text-muted-foreground" />
}

// ─── Chat list item ───────────────────────────────────────────────────────────

function ChatListItem({
  chat,
  active,
  onClick,
  onToggleFlag,
}: {
  chat: AgentChat
  active: boolean
  onClick: () => void
  onToggleFlag: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "group relative w-full rounded px-3 py-2.5 text-left transition-colors cursor-pointer",
        active ? "bg-primary/10" : "hover:bg-muted-foreground/8"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn(
          "text-sm font-semibold leading-snug truncate",
          active ? "text-primary" : "text-foreground"
        )}>
          {chat.title}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {/* Flag button — always visible if flagged, hover-only otherwise */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFlag(chat.id) }}
            className={cn(
              "rounded p-0.5 transition-colors",
              chat.flagged
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-transparent group-hover:text-muted-foreground/50 hover:!text-yellow-400"
            )}
            aria-label={chat.flagged ? "Unflag" : "Flag"}
          >
            {chat.flagged
              ? <StarFillIcon size={11} />
              : <StarIcon size={11} />}
          </button>
          <span className="text-xs text-muted-foreground">{chat.time}</span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <RobotIcon size={12} className="shrink-0 text-muted-foreground" />
        <span className="truncate text-xs text-muted-foreground">{chat.agentType}</span>
        {chat.progress !== undefined && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">{chat.progress}%</span>
          </>
        )}
        {statusBadge(chat.status) && (
          <span className="ml-auto">{statusBadge(chat.status)}</span>
        )}
      </div>
    </div>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function ActionStep({ action }: { action: AgentAction }) {
  if (action.type === "message") {
    return (
      <div className="flex gap-2.5 rounded border border-border bg-secondary p-3">
        <DbIcon icon={AssistantIcon} color="ai" size={16} className="mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-foreground">{action.label}</p>
          {action.timestamp && (
            <span className="text-xs text-muted-foreground">{action.timestamp}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <CheckCircleFillIcon size={14} className="shrink-0 text-[var(--success)]" />
      <span className="text-sm text-foreground">{action.label}</span>
      {action.tag && (
        <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-foreground border border-border">
          {action.tag}
        </span>
      )}
    </div>
  )
}

// ─── @-mention autocomplete ───────────────────────────────────────────────────

const MENTION_SOURCES = [
  { id: "flights_200K",       label: "flights_200K",       type: "table",   icon: "📋" },
  { id: "f1_lap_times",       label: "f1_lap_times",       type: "table",   icon: "📋" },
  { id: "race_results",       label: "race_results",       type: "table",   icon: "📋" },
  { id: "revenue_forecast",   label: "revenue_forecast",   type: "model",   icon: "🤖" },
  { id: "churn_model_v2",     label: "churn_model_v2",     type: "model",   icon: "🤖" },
  { id: "pipeline_summary",   label: "pipeline_summary",   type: "dashboard", icon: "📊" },
  { id: "f1_dashboard_2026",  label: "f1_dashboard_2026",  type: "dashboard", icon: "📊" },
  { id: "sales_by_region",    label: "sales_by_region",    type: "metric",  icon: "📈" },
  { id: "dbu_cost",           label: "dbu_cost",           type: "metric",  icon: "📈" },
]

function AtMentionInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask Genie…",
  className = "",
  autoFocus = false,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}) {
  const [menuOpen, setMenuOpen]     = React.useState(false)
  const [menuFilter, setMenuFilter] = React.useState("")
  const [menuIdx, setMenuIdx]       = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const items = MENTION_SOURCES.filter((s) =>
    s.label.toLowerCase().includes(menuFilter.toLowerCase())
  )

  const insertMention = (label: string) => {
    const atIdx = value.lastIndexOf("@")
    const next = value.slice(0, atIdx) + "@" + label + " "
    onChange(next)
    setMenuOpen(false)
    setMenuFilter("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)
    const atIdx = v.lastIndexOf("@")
    if (atIdx !== -1 && atIdx === v.length - (v.length - atIdx)) {
      const after = v.slice(atIdx + 1)
      if (!after.includes(" ")) {
        setMenuFilter(after)
        setMenuOpen(true)
        setMenuIdx(0)
        return
      }
    }
    setMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (menuOpen) {
      if (e.key === "ArrowDown") { e.preventDefault(); setMenuIdx((i) => Math.min(i + 1, items.length - 1)) }
      else if (e.key === "ArrowUp") { e.preventDefault(); setMenuIdx((i) => Math.max(i - 1, 0)) }
      else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        if (items[menuIdx]) insertMention(items[menuIdx].label)
      } else if (e.key === "Escape") { setMenuOpen(false) }
      return
    }
    if (e.key === "Enter") onSubmit()
  }

  return (
    <div className={cn("relative", className)}>
      {menuOpen && items.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 z-50 w-56 overflow-hidden rounded-md border border-border bg-background shadow-lg">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            Tables, models & dashboards
          </div>
          {items.map((item, i) => (
            <button
              key={item.id}
              onMouseDown={(e) => { e.preventDefault(); insertMention(item.label) }}
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1.5 text-xs transition-colors",
                i === menuIdx ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="flex-1 truncate font-medium">{item.label}</span>
              <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  )
}

// ─── Genie input box (shared) ─────────────────────────────────────────────────

const GENIE_MODES = ["Agent", "Plan", "Debug", "Ask"] as const
type GenieMode = typeof GENIE_MODES[number]

// Recent objects shown at top of @ dropdown
const AT_RECENT_ITEMS = [
  { id: "r1", label: "trips",                      meta: "samples.nyctaxi",  Icon: Table2    },
  { id: "r2", label: "electric_vehicle_popul...",   meta: "—",               Icon: Table2    },
  { id: "r3", label: "US Electric Vehicle Ana...",  meta: "Eva Snee",        Icon: BookOpen  },
  { id: "r4", label: "Diamonds are forever",        meta: "Mohit Hingorani", Icon: LayoutGrid},
  { id: "r5", label: "Account Usage Dashb...",      meta: "Eva Snee",        Icon: LayoutGrid},
  { id: "r6", label: "electric_vehicle_popul...",   meta: "Eva Snee",        Icon: LayoutGrid},
  { id: "r7", label: "Sales Summary and Fo...",     meta: "Eason Gao",       Icon: LayoutGrid},
]

// Browse categories (chevron sub-menu)
const AT_BROWSE_CATEGORIES = [
  { id: "tables",    label: "Tables",               Icon: Table2    },
  { id: "notebooks", label: "Notebooks",            Icon: BookOpen  },
  { id: "cells",     label: "Cells",                Icon: Code2     },
  { id: "queries",   label: "Queries",              Icon: FileSearch},
  { id: "files",     label: "Files",                Icon: FileText  },
  { id: "folders",   label: "Folders",              Icon: Folder    },
  { id: "pipelines", label: "Pipelines",            Icon: GitBranch },
  { id: "dashboards",label: "Dashboards",           Icon: LayoutGrid},
  { id: "models",    label: "Models & Agent Bricks", Icon: Sparkles },
  { id: "skills",    label: "Skills",               Icon: Library   },
]

// Mock file tree per category
const AT_FILE_TREES: Record<string, { icon: string; name: string; depth: number }[]> = {
  tables: [
    { icon: "folder", name: "Users",                         depth: 0 },
    { icon: "folder", name: "eva.snee@databricks.com",       depth: 1 },
    { icon: "table",  name: "trips",                         depth: 2 },
    { icon: "table",  name: "electric_vehicle_population",   depth: 2 },
    { icon: "table",  name: "sales_summary",                 depth: 2 },
  ],
  notebooks: [
    { icon: "folder", name: "Users",                         depth: 0 },
    { icon: "folder", name: "eva.snee@databricks.com",       depth: 1 },
    { icon: "file",   name: "US Electric Vehicle Analysis",  depth: 2 },
    { icon: "file",   name: "Revenue Forecast Model",        depth: 2 },
  ],
  dashboards: [
    { icon: "folder",    name: "Users",                      depth: 0 },
    { icon: "folder",    name: "eva.snee@databricks.com",    depth: 1 },
    { icon: "dashboard", name: "Account Usage Dashboard.lvdash.json", depth: 2 },
    { icon: "dashboard", name: "Sales Summary and Forecast", depth: 2 },
  ],
  files: [
    { icon: "folder", name: "Users",                         depth: 0 },
    { icon: "folder", name: "eva.snee@databricks.com",       depth: 1 },
    { icon: "file",   name: "config.yaml",                   depth: 2 },
    { icon: "file",   name: "requirements.txt",              depth: 2 },
  ],
  pipelines: [
    { icon: "folder",   name: "Pipelines",                   depth: 0 },
    { icon: "pipeline", name: "ingestion_pipeline",          depth: 1 },
    { icon: "pipeline", name: "feature_store_pipeline",      depth: 1 },
  ],
}

function FileTreeNode({ icon, name, depth }: { icon: string; name: string; depth: number }) {
  const NodeIcon = icon === "folder" ? Folder
    : icon === "table" ? Table2
    : icon === "dashboard" ? LayoutGrid
    : icon === "pipeline" ? GitBranch
    : FileText
  return (
    <div
      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-secondary cursor-pointer transition-colors"
      style={{ paddingLeft: `${8 + depth * 16}px` }}
    >
      <NodeIcon size={13} strokeWidth={1.6} className={icon === "folder" ? "text-[#f59e0b]" : "text-muted-foreground"} />
      <span className="text-[12px] text-foreground truncate max-w-[160px]">{name}</span>
    </div>
  )
}

function GenieInputBox({
  value,
  onChange,
  onSubmit,
  placeholder,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [mode, setMode] = React.useState<GenieMode>("Agent")
  const [modeOpen, setModeOpen] = React.useState(false)
  const [atOpen, setAtOpen] = React.useState(false)
  const [hoveredRecent, setHoveredRecent] = React.useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const atRef = React.useRef<HTMLDivElement>(null)

  // Close @ dropdown on outside click
  React.useEffect(() => {
    if (!atOpen) return
    const handler = (e: MouseEvent) => {
      if (atRef.current && !atRef.current.contains(e.target as Node)) {
        setAtOpen(false)
        setHoveredCategory(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [atOpen])

  const handleAtSelect = (label: string) => {
    onChange(value + `@${label} `)
    setAtOpen(false)
    setHoveredCategory(null)
  }

  const activeTree = hoveredCategory ? (AT_FILE_TREES[hoveredCategory] ?? AT_FILE_TREES["tables"]) : null

  return (
    <div className="flex flex-col gap-1">
      <div className="rounded-xl border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
        {/* Text area */}
        <AtMentionInput
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={placeholder ?? "@ for objects, / for commands, ↑↓ for history"}
          className="px-3 pt-3 pb-1 min-h-[40px]"
        />

        {/* Toolbar row */}
        <div className="flex items-center gap-1 px-2 pb-2 pt-1">
          {/* Attachment */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            title="Attach image"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ImageIcon size={14} strokeWidth={1.8} />
          </button>

          {/* @ mention button + dropdown */}
          <div ref={atRef} className="relative">
            <button
              title="Mention a table or asset"
              onClick={() => { setAtOpen(v => !v); setHoveredCategory(null) }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                atOpen
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <AtSign size={14} strokeWidth={1.8} />
            </button>

            {atOpen && (
              <div className="absolute bottom-full left-0 mb-2 z-50 flex items-end">

                {/* File tree sub-panel (appears to the left when a category is hovered) */}
                {activeTree && (
                  <div className="mr-1 w-[220px] overflow-hidden rounded-xl border border-border bg-background shadow-[0_8px_32px_rgba(0,0,0,0.14)] pb-1 pt-1">
                    <p className="px-3 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {AT_BROWSE_CATEGORIES.find(c => c.id === hoveredCategory)?.label ?? "Browse"}
                    </p>
                    {activeTree.map((node, i) => (
                      <FileTreeNode key={i} {...node} />
                    ))}
                  </div>
                )}

                {/* Main @ dropdown */}
                <div className="w-[248px] overflow-hidden rounded-xl border border-border bg-background shadow-[0_8px_32px_rgba(0,0,0,0.14)]">

                  {/* Recent objects */}
                  {AT_RECENT_ITEMS.map(({ id, label, meta, Icon }) => (
                    <button
                      key={id}
                      onMouseEnter={() => { setHoveredRecent(id); setHoveredCategory(null) }}
                      onMouseLeave={() => setHoveredRecent(null)}
                      onClick={() => handleAtSelect(label)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                        hoveredRecent === id ? "bg-[#eef2ff]" : "hover:bg-secondary"
                      )}
                    >
                      <Icon size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-[12.5px] text-foreground">{label}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground/60 max-w-[72px] truncate">{meta}</span>
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="my-1 h-px bg-border" />

                  {/* Browse categories */}
                  {AT_BROWSE_CATEGORIES.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onMouseEnter={() => { setHoveredCategory(id); setHoveredRecent(null) }}
                      onClick={() => handleAtSelect(label)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                        hoveredCategory === id ? "bg-[#eef2ff]" : "hover:bg-secondary"
                      )}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.5}
                        className={cn("shrink-0", hoveredCategory === id ? "text-primary" : "text-muted-foreground")}
                      />
                      <span className="flex-1 text-[12.5px] text-foreground">{label}</span>
                      <ChevronDown size={11} strokeWidth={2} className="-rotate-90 text-muted-foreground/40" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mode selector */}
          <div className="relative">
            <button
              onClick={() => setModeOpen(v => !v)}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-[11.5px] font-medium text-foreground hover:bg-muted-foreground/10 transition-colors"
            >
              {mode}
              <ChevronDown size={11} strokeWidth={2.2} className="text-muted-foreground" />
            </button>
            {modeOpen && (
              <div className="absolute bottom-full right-0 mb-1 z-50 flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-[var(--shadow-db-lg)] min-w-[100px]">
                {GENIE_MODES.map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setModeOpen(false) }}
                    className={cn(
                      "px-3 py-2 text-left text-[12px] hover:bg-secondary transition-colors",
                      m === mode ? "font-semibold text-primary" : "text-foreground"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Send */}
          <button
            disabled={!value.trim()}
            onClick={onSubmit}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              value.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground/30 cursor-default"
            )}
          >
            <SendIcon size={13} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] text-muted-foreground/50">
        Always review the accuracy of responses.
      </p>
    </div>
  )
}

// ─── New chat panel ───────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "Analyze customer churn patterns from last quarter",
  "Generate a summary of this week's pipeline failures",
  "Run EDA on the new dataset in the catalog",
  "Forecast revenue for the next 6 months",
]

function NewChatPanel({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (prompt: string) => void
}) {
  const [inputValue, setInputValue] = React.useState("")

  const submit = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setInputValue("")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
        <span className="flex-1 text-sm font-semibold text-foreground">New Chat</span>
        <Button variant="ghost" size="icon-xs" aria-label="Close" onClick={onClose}>
          <CloseIcon size={14} className="text-muted-foreground" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <DbIcon icon={SparkleIcon} color="ai" size={32} />
          <p className="text-sm font-semibold text-foreground">What would you like to explore?</p>
          <p className="text-xs text-muted-foreground">
            Describe a task and Genie will spin up an AI agent to handle it.
          </p>
        </div>

        {/* Suggested prompts */}
        <div className="flex w-full max-w-md flex-col gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => submit(prompt)}
              className="rounded border border-border bg-background px-4 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-secondary hover:border-primary/40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <GenieInputBox
          autoFocus
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => submit(inputValue)}
          placeholder="Describe what you want Genie to do…"
        />
      </div>
    </div>
  )
}

// ─── Placeholder answer generator ────────────────────────────────────────────

type AnswerRow = { label: string; value: string; delta?: string; positive?: boolean }
type PlaceholderAnswer = {
  summary: string
  rows?: AnswerRow[]
  bullets?: string[]
  footer?: string
  sql?: string
}

function getPlaceholderAnswer(question: string): PlaceholderAnswer {
  const q = question.toLowerCase()

  if (q.match(/sales|revenue|quota/)) return {
    summary: "Based on your CRM and pipeline data for the last 90 days, here are your top performers:",
    rows: [
      { label: "Jordan Kim",      value: "$1.24M",  delta: "+18%", positive: true  },
      { label: "Alex Rivera",     value: "$1.09M",  delta: "+12%", positive: true  },
      { label: "Morgan Ellis",    value: "$980K",   delta: "+7%",  positive: true  },
      { label: "Casey Patel",     value: "$870K",   delta: "-3%",  positive: false },
      { label: "Taylor Okonkwo",  value: "$810K",   delta: "+22%", positive: true  },
    ],
    footer: "Data sourced from Salesforce · Updated 2 hours ago",
    sql: `SELECT
  rep_name,
  SUM(amount)          AS total_revenue,
  SUM(amount) - LAG(SUM(amount)) OVER (
    PARTITION BY rep_name ORDER BY quarter
  )                    AS delta
FROM salesforce.opportunities
WHERE close_date >= DATEADD(day, -90, CURRENT_DATE)
  AND stage = 'Closed Won'
GROUP BY rep_name, quarter
ORDER BY total_revenue DESC
LIMIT 10;`,
  }

  if (q.match(/churn|retention|cancel|lost|customer/)) return {
    summary: "Churn analysis across all customer segments for the trailing 6 months:",
    rows: [
      { label: "Enterprise",  value: "2.1% churn",  delta: "-0.4%", positive: true  },
      { label: "Mid-market",  value: "5.8% churn",  delta: "+1.2%", positive: false },
      { label: "SMB",         value: "9.3% churn",  delta: "+2.7%", positive: false },
    ],
    bullets: [
      "Top churn reason: pricing concerns (38% of churned accounts)",
      "Accounts inactive >30 days have 4× higher churn probability",
      "NPS < 6 predicts churn with 71% accuracy",
    ],
    footer: "Sourced from Amplitude + Salesforce · Last updated today",
    sql: `SELECT
  segment,
  COUNTIF(churned_at IS NOT NULL)
    / COUNT(*)          AS churn_rate,
  churn_rate - LAG(churn_rate) OVER (
    PARTITION BY segment ORDER BY cohort_month
  )                     AS delta
FROM customers.subscriptions
WHERE cohort_month >= DATEADD(month, -6, CURRENT_DATE)
GROUP BY segment, cohort_month
ORDER BY segment;`,
  }

  if (q.match(/forecast|predict|next|future|project/)) return {
    summary: "Revenue forecast for the next 6 months based on current pipeline velocity:",
    rows: [
      { label: "April 2026",  value: "$4.2M",  delta: "+8%",  positive: true },
      { label: "May 2026",    value: "$4.6M",  delta: "+10%", positive: true },
      { label: "June 2026",   value: "$5.1M",  delta: "+11%", positive: true },
      { label: "Q3 2026",     value: "$16.3M", delta: "+14%", positive: true },
    ],
    footer: "Confidence interval: 82% · Model: XGBoost on 24 months of actuals",
    sql: `SELECT
  DATE_TRUNC('month', forecast_date) AS month,
  SUM(predicted_revenue)             AS forecast,
  SUM(lower_bound)                   AS p10,
  SUM(upper_bound)                   AS p90
FROM ml.revenue_forecast
WHERE forecast_date BETWEEN CURRENT_DATE
                        AND DATEADD(month, 6, CURRENT_DATE)
GROUP BY 1
ORDER BY 1;`,
  }

  if (q.match(/pipeline|deal|opportunity|close/)) return {
    summary: "Current pipeline snapshot across all stages:",
    rows: [
      { label: "Prospecting",       value: "$8.4M",  delta: "142 deals",  positive: true },
      { label: "Qualified",         value: "$5.1M",  delta: "67 deals",   positive: true },
      { label: "Proposal Sent",     value: "$3.2M",  delta: "31 deals",   positive: true },
      { label: "Negotiation",       value: "$1.8M",  delta: "14 deals",   positive: true },
      { label: "Closing this week", value: "$640K",  delta: "6 deals",    positive: true },
    ],
    footer: "Data from Salesforce · Probability-weighted total: $7.9M",
    sql: `SELECT
  stage,
  COUNT(*)             AS deal_count,
  SUM(amount)          AS pipeline_value,
  SUM(amount * probability / 100) AS weighted_value
FROM salesforce.opportunities
WHERE is_closed = FALSE
GROUP BY stage
ORDER BY FIELD(stage,
  'Prospecting','Qualified','Proposal Sent',
  'Negotiation','Closing this week');`,
  }

  if (q.match(/cluster|compute|cost|spend|usage/)) return {
    summary: "Compute spend summary for the last 30 days across all workspaces:",
    rows: [
      { label: "Production",  value: "$18,240", delta: "+6%",  positive: false },
      { label: "Staging",     value: "$4,120",  delta: "-12%", positive: true  },
      { label: "Dev / Test",  value: "$2,890",  delta: "+31%", positive: false },
      { label: "ML Training", value: "$9,670",  delta: "-4%",  positive: true  },
    ],
    bullets: [
      "3 idle clusters detected — potential savings of ~$1,200/month",
      "ML Training spend down 4% after auto-termination policy applied",
    ],
    footer: "Data from Databricks billing API · Cost in USD",
    sql: `SELECT
  workspace_name,
  SUM(dbu_consumed * dbu_price) AS total_cost_usd,
  SUM(dbu_consumed * dbu_price)
    - LAG(SUM(dbu_consumed * dbu_price)) OVER (
        PARTITION BY workspace_name ORDER BY billing_month
      )                          AS delta
FROM system.billing.usage
WHERE billing_month >= DATEADD(day, -30, CURRENT_DATE)
GROUP BY workspace_name, billing_month
ORDER BY total_cost_usd DESC;`,
  }

  // Generic fallback
  return {
    summary: "Here's a summary based on the available data across your connected sources:",
    bullets: [
      "Found 3 relevant dashboards matching your query",
      "Most recent data point is from 2 hours ago",
      "Confidence score: high — based on 14k+ rows analyzed",
      "No anomalies detected in the primary dataset",
      "Suggested next step: drill into the segmentation view for more detail",
    ],
    footer: "Sources: Unity Catalog, SQL Warehouse prod-01 · Analyzed 14,382 rows",
    sql: `SELECT *
FROM catalog.main.analytics_summary
WHERE event_date >= DATEADD(day, -7, CURRENT_DATE)
ORDER BY event_date DESC
LIMIT 500;`,
  }
}

// ─── Thinking UI ──────────────────────────────────────────────────────────────

const THINKING_STEPS = [
  "Reading your question…",
  "Identifying relevant data sources…",
  "Querying catalog and notebooks…",
  "Analyzing patterns in the data…",
  "Synthesizing findings…",
]

function ThinkingUI({ question }: { question: string }) {
  const [visibleSteps, setVisibleSteps] = React.useState(0)
  const [progress, setProgress]         = React.useState(0)
  const [done, setDone]                 = React.useState(false)
  const answer = React.useMemo(() => getPlaceholderAnswer(question), [question])

  // Answer verification
  const [rating, setRating]       = React.useState<"up" | "down" | "">("")
  const [flagged, setFlagged]     = React.useState(false)
  const [feedback, setFeedback]   = React.useState("")
  const [sqlOpen, setSqlOpen]     = React.useState(false)

  React.useEffect(() => {
    // Reveal a new step every ~900ms
    const stepInterval = setInterval(() => {
      setVisibleSteps((s) => {
        if (s >= THINKING_STEPS.length - 1) { clearInterval(stepInterval); return s }
        return s + 1
      })
    }, 900)

    // Smoothly increment progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) { clearInterval(progressInterval); return p }
        return p + 4
      })
    }, 380)

    // Mark done after all steps
    const doneTimer = setTimeout(() => setDone(true), THINKING_STEPS.length * 900 + 600)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
      {/* Question echo */}
      <div className="flex gap-2.5">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <span className="text-[10px] font-semibold text-primary">Q</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{question}</p>
      </div>

      {/* Thinking card */}
      <div className="flex flex-col gap-4 rounded-md border border-border bg-secondary/60 p-4">
        {/* Agent header */}
        <div className="flex items-center gap-2">
          <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
          <span className="text-xs font-semibold text-foreground">Genie is thinking</span>
          {!done && (
            <div className="flex items-center gap-0.5 ml-1">
              {[0,1,2].map((i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${done ? 100 : progress}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{done ? "100" : progress}% complete</span>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2">
          {THINKING_STEPS.slice(0, visibleSteps + 1).map((step, i) => {
            const isLast = i === visibleSteps && !done
            return (
              <div key={i} className="flex items-center gap-2">
                {isLast ? (
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <span className="h-2 w-2 animate-spin rounded-full border border-primary border-t-transparent" />
                  </span>
                ) : (
                  <CheckCircleFillIcon size={14} className="shrink-0 text-[var(--success)]" />
                )}
                <span className={cn(
                  "text-xs transition-colors",
                  isLast ? "text-foreground font-semibold" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

      </div>

      {/* Answer card — fades in when done */}
      {done && (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Summary */}
          <p className="text-xs text-foreground leading-relaxed">{answer.summary}</p>

          {/* Table rows */}
          {answer.rows && (
            <div className="overflow-hidden rounded border border-border">
              {answer.rows.map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs",
                    i % 2 === 0 ? "bg-background" : "bg-secondary/50",
                    i < answer.rows!.length - 1 && "border-b border-border"
                  )}
                >
                  <span className="font-semibold text-foreground">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{row.value}</span>
                    {row.delta && (
                      <span className={cn(
                        "text-[11px] font-semibold",
                        row.positive ? "text-[var(--success)]" : "text-destructive"
                      )}>
                        {row.delta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bullet points */}
          {answer.bullets && (
            <ul className="flex flex-col gap-1.5">
              {answer.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* View SQL collapsible */}
          {answer.sql && (
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setSqlOpen((o) => !o)}
                className="flex w-full items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/40 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={cn("shrink-0 transition-transform", sqlOpen && "rotate-90")}>
                  <path d="M4 2.5L8 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View SQL
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">prod-01</span>
              </button>
              {sqlOpen && (
                <pre className="border-t border-border bg-muted/30 px-3 py-2.5 text-[10.5px] leading-relaxed font-mono text-foreground/80 overflow-x-auto whitespace-pre">
                  {answer.sql}
                </pre>
              )}
            </div>
          )}

          {/* Footer / source */}
          {answer.footer && (
            <p className="text-[11px] text-muted-foreground/60 border-t border-border pt-2">
              {answer.footer}
            </p>
          )}

          {/* ── Answer verification ── */}
          <div className="flex flex-col gap-2 border-t border-border pt-3">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-muted-foreground mr-1">Was this helpful?</span>
              <button
                onClick={() => setRating((r) => r === "up" ? "" : "up")}
                title="Helpful"
                className={cn(
                  "rounded p-1.5 transition-colors",
                  rating === "up" ? "bg-green-50 text-green-600" : "text-muted-foreground hover:bg-green-50 hover:text-green-600"
                )}
              >
                <ThumbsUp size={13} />
              </button>
              <button
                onClick={() => setRating((r) => r === "down" ? "" : "down")}
                title="Not helpful"
                className={cn(
                  "rounded p-1.5 transition-colors",
                  rating === "down" ? "bg-red-50 text-red-500" : "text-muted-foreground hover:bg-red-50 hover:text-red-500"
                )}
              >
                <ThumbsDown size={13} />
              </button>
              {rating === "up" && (
                <span className="ml-1 text-xs text-green-600 font-medium">Thanks for the feedback!</span>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setFlagged((f) => !f)}
                title={flagged ? "Flagged for review" : "Flag for review"}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors",
                  flagged ? "bg-amber-50 text-amber-600" : "text-muted-foreground hover:bg-amber-50 hover:text-amber-600"
                )}
              >
                <Flag size={11} />
                {flagged ? "Flagged" : "Flag"}
              </button>
            </div>

            {/* Thumbs-down feedback chips */}
            {rating === "down" && (
              <div className="flex flex-wrap gap-1.5">
                {["Inaccurate data", "Misunderstood question", "Too vague", "Off topic"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFeedback((f) => f === opt ? "" : opt)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      feedback === opt
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-border bg-background text-muted-foreground hover:border-red-200 hover:text-red-500"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  chat,
  onClose,
  onNewChat,
}: {
  chat: AgentChat
  onClose: () => void
  onNewChat: () => void
}) {
  const [inputValue, setInputValue] = React.useState("")

  // A chat is "fresh" (just created from search) if progress is 0 and it has
  // only the initial acknowledgement message
  const isFresh = chat.progress === 0 && chat.actions.length === 1 &&
    chat.actions[0]?.label === "Got it! Starting to work on this now…"

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
        <div className="flex flex-1 flex-col min-w-0">
          <span className="truncate text-sm font-semibold text-foreground">{chat.title}</span>
          {chat.source && (
            <span className="truncate text-[10px] text-muted-foreground">from {chat.source}</span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" aria-label="More actions">
          <OverflowIcon size={14} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label="New chat" onClick={onNewChat}>
          <PlusIcon size={14} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label="Close" onClick={onClose}>
          <CloseIcon size={14} className="text-muted-foreground" />
        </Button>
      </div>

      {/* Forwarded message thread from another surface */}
      {chat.messages ? (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {chat.messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
              {msg.role === "ai" && (
                <div className="mt-0.5 shrink-0">
                  <DbIcon icon={AssistantIcon} color="ai" size={16} />
                </div>
              )}
              <div className={cn(
                "rounded-xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-8"
                  : "bg-muted text-foreground mr-8"
              )}>
                {msg.text}
                {msg.sql && (
                  <div className="mt-1.5 rounded border border-border/60 bg-background/60 px-2 py-1.5">
                    <pre className="text-[10px] font-mono text-foreground/70 whitespace-pre-wrap">{msg.sql}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Continue the conversation input */}
          <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground text-center">
            Continue this conversation by typing below
          </div>
        </div>
      ) : isFresh ? (
        <ThinkingUI question={chat.description} />
      ) : (
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* Status badge + description */}
        <div className="flex flex-col gap-2">
          {statusBadge(chat.status)}
          <p className="text-sm text-muted-foreground">{chat.description}</p>
        </div>

        {/* Progress bar */}
        {chat.progress !== undefined && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-semibold text-foreground">{chat.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary border border-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${chat.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {chat.actions.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {chat.actions.length} action{chat.actions.length !== 1 ? "s" : ""}
            </span>
            <div className="flex flex-col gap-2">
              {chat.actions.map((action) => (
                <ActionStep key={action.id} action={action} />
              ))}
            </div>
          </div>
        )}

        {/* Result card */}
        {chat.resultCard && (
          <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-4">
            <span className="text-sm font-semibold text-foreground">{chat.resultCard.title}</span>
            {chat.resultCard.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">{section.heading}</span>
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">{chat.resultCard.summary}</p>
          </div>
        )}
      </div>
      )}

      {/* Accept / Reject bar — only for non-fresh agent chats with pending cells */}
      {!chat.messages && !isFresh && chat.pendingCells !== undefined && (
        <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-2.5">
          <span className="text-xs text-muted-foreground flex-1">
            {chat.pendingCells} cell{chat.pendingCells !== 1 ? "s" : ""}
          </span>
          <Button variant="outline" size="xs">
            Reject all <kbd className="ml-1 text-muted-foreground opacity-60">ESC</kbd>
          </Button>
          <Button size="xs">
            Accept all <kbd className="ml-1 opacity-60">⌘+↵</kbd>
          </Button>
        </div>
      )}

      {/* Chat input */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <GenieInputBox
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => { if (inputValue.trim()) setInputValue("") }}
          placeholder="Ask a follow-up…"
        />
      </div>
    </div>
  )
}

// ─── Tooltip helper ───────────────────────────────────────────────────────────

function Tip({ label, side = "right", children }: { label: string; side?: "right" | "bottom"; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className={cn(
        "pointer-events-none absolute z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 delay-300",
        side === "right"
          ? "left-full top-1/2 -translate-y-1/2 ml-2.5"
          : "top-full left-1/2 -translate-x-1/2 mt-1.5"
      )}>
        <div className="rounded-md bg-foreground/90 px-2 py-1 text-[11px] leading-none text-background whitespace-nowrap shadow-sm">
          {label}
        </div>
      </div>
    </div>
  )
}

// ─── Skills sidebar panel ─────────────────────────────────────────────────────

function SkillsSidebarPanel({ onAddSkill }: { onAddSkill: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Zap size={36} className="text-muted-foreground/25" strokeWidth={1.2} />
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">No skills configured</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Skills are reusable instructions that teach your agent specialized behaviors.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted">
          Learn more
        </button>
        <button
          onClick={onAddSkill}
          className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
        >
          Add Skill
        </button>
      </div>
    </div>
  )
}

// ─── Connections sidebar panel ────────────────────────────────────────────────

const SAMPLE_CONNECTION_TYPES = [
  { id: "databricks", label: "Databricks catalog", icon: "◈", tag: "Built-in" },
  { id: "snowflake",  label: "Snowflake",          icon: "❄", tag: "Database" },
  { id: "github",     label: "GitHub",             icon: "⌥", tag: "MCP" },
  { id: "slack",      label: "Slack",              icon: "◉", tag: "API" },
  { id: "postgres",   label: "PostgreSQL",         icon: "🗄", tag: "Database" },
]

function ConnectionsSidebarPanel({ onAddConnection }: { onAddConnection: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-3">
      <div className="mb-3 flex items-center justify-between px-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Available</span>
        <button
          onClick={onAddConnection}
          className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <span className="text-sm leading-none">+</span> Add
        </button>
      </div>
      <div className="flex flex-col gap-px px-2">
        {SAMPLE_CONNECTION_TYPES.map((c) => (
          <button
            key={c.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-base">
              {c.icon}
            </span>
            <span className="flex-1">
              <span className="block text-xs font-medium text-foreground">{c.label}</span>
              <span className="block text-[10px] text-muted-foreground">{c.tag}</span>
            </span>
            <span className="text-[10px] text-muted-foreground/50">Connect →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Add Skill main-pane ──────────────────────────────────────────────────────

const SKILL_SUGGESTIONS = [
  "Summarize a Unity Catalog table and suggest quality improvements",
  "Write a Python notebook that cleans and profiles a dataset",
  "Generate a revenue forecast from a Delta table using Prophet",
  "Detect anomalies in streaming data and send a Slack alert",
]

function AddSkillPanel({ onBack }: { onBack: () => void }) {
  const [input, setInput] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [submittedText, setSubmittedText] = React.useState("")

  const submit = (text: string) => {
    const t = text.trim()
    if (!t) return
    setSubmittedText(t)
    setSubmitted(true)
    setInput("")
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <button onClick={onBack} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">New Skill</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-10">
        {!submitted ? (
          <>
            <div className="mb-8 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Zap size={22} className="text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-base font-semibold text-foreground">Describe your skill</h2>
              <p className="max-w-[400px] text-xs leading-relaxed text-muted-foreground">
                Tell Genie what this skill should do, what data or tools it needs access to, and when it should be applied.
              </p>
            </div>
            <div className="w-full max-w-[560px] space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Suggestions</p>
              {SKILL_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <Sparkles size={13} className="shrink-0 text-primary/60" />
                  {s}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full max-w-[560px] space-y-4">
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-xs text-primary-foreground">
                {submittedText}
              </div>
            </div>
            {/* Genie response */}
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Zap size={13} className="text-primary" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-background px-4 py-3 text-xs leading-relaxed text-foreground">
                <p className="font-medium mb-1">Got it! Creating your skill…</p>
                <p className="text-muted-foreground">
                  I'll set up a skill based on your description. You can refine it, add data sources, or test it once it's ready.
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-full border border-border px-3 py-1 text-[11px] text-foreground hover:bg-muted transition-colors">Refine</button>
                  <button className="rounded-full bg-primary px-3 py-1 text-[11px] text-primary-foreground hover:opacity-90 transition-opacity">Save skill</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(input) }}
            placeholder="Describe what this skill should do…"
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => submit(input)}
            disabled={!input.trim()}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
          >
            <svg viewBox="0 0 12 12" width={10} height={10} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Add Connection main-pane ─────────────────────────────────────────────────

const CONNECTION_CATALOG = [
  { id: "delta",      label: "Delta Lake",         desc: "Query Delta tables in Unity Catalog",     icon: "◈", color: "#E87040" },
  { id: "snowflake",  label: "Snowflake",           desc: "Connect to Snowflake warehouses",          icon: "❄",  color: "#29B5E8" },
  { id: "postgres",   label: "PostgreSQL",          desc: "Connect a Postgres database",             icon: "🐘", color: "#336791" },
  { id: "github",     label: "GitHub (MCP)",        desc: "Read repos, issues, PRs via MCP",         icon: "⌥", color: "#333"    },
  { id: "slack",      label: "Slack (API)",         desc: "Send messages & read channels",           icon: "◉", color: "#4A154B" },
  { id: "s3",         label: "Amazon S3",           desc: "Read files from S3 buckets",              icon: "☁", color: "#FF9900" },
  { id: "custom",     label: "Custom MCP server",   desc: "Connect any MCP-compatible server",       icon: "⚡", color: "#6C63FF" },
]

function AddConnectionPanel({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = React.useState("")
  const filtered = CONNECTION_CATALOG.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <button onClick={onBack} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Cable size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Add Connection</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
          Connect Genie to external data sources, APIs, and MCP servers so it can read and act on live data.
        </p>
        <div className="relative mb-5">
          <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search connections…"
            className="w-full rounded-lg border border-border bg-muted/40 py-2 pl-8 pr-3 text-xs outline-none focus:border-primary/40 focus:bg-background transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{c.label}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{c.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Status filter sidebar ────────────────────────────────────────────────────

type StatusFilter = "all" | AgentStatus | "flagged"

const STATUS_FILTERS: { value: StatusFilter; label: string; color?: string }[] = [
  { value: "all",              label: "All" },
  { value: "running",         label: "Running",        color: "var(--info)" },
  { value: "needs-attention", label: "Needs Review",   color: "var(--muted-foreground)" },
  { value: "complete",        label: "Done",           color: "var(--success)" },
  { value: "paused",          label: "Paused",         color: "var(--muted-foreground)" },
  { value: "scheduled",       label: "Scheduled",      color: "var(--muted-foreground)" },
  { value: "flagged",         label: "Flagged" },
]

function FilterSidebar({
  chats,
  activeFilter,
  onFilter,
}: {
  chats: AgentChat[]
  activeFilter: StatusFilter
  onFilter: (f: StatusFilter) => void
}) {
  const countFor = (f: StatusFilter) => {
    if (f === "all") return chats.length
    if (f === "flagged") return chats.filter((c) => c.flagged).length
    return chats.filter((c) => c.status === f).length
  }

  return (
    <div className="flex w-[160px] shrink-0 flex-col border-r border-border bg-muted/30 py-3 overflow-y-auto">
      <div className="px-3 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Filter
        </span>
      </div>
      {STATUS_FILTERS.map((f) => {
        const count = countFor(f.value)
        const active = activeFilter === f.value
        return (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors rounded mx-1",
              active
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground/70 hover:bg-muted-foreground/8 hover:text-foreground"
            )}
          >
            {f.value === "flagged" ? (
              <StarFillIcon size={11} className={active ? "text-yellow-500" : "text-yellow-400/70"} />
            ) : f.color ? (
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: f.color }} />
            ) : (
              <span className="h-2 w-2 shrink-0 rounded-full border border-border" />
            )}
            <span className="flex-1 text-left">{f.label}</span>
            {count > 0 && (
              <span className={cn(
                "text-[10px] tabular-nums",
                active ? "text-primary/70" : "text-muted-foreground/60"
              )}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function GeniPageInner({ incomingQuery }: { incomingQuery: string }) {
  const [activeNav, setActiveNav] = React.useState("genie")
  const [selectedId, setSelectedId] = React.useState<string>("")
  const [isNewChat, setIsNewChat] = React.useState(!incomingQuery)
  const [allChats, setAllChats] = React.useState<AgentChat[]>(AGENT_CHATS)
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [showFilters, setShowFilters] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [threadSearch, setThreadSearch] = React.useState("")
  const [sidebarView, setSidebarView] = React.useState<"chats" | "skills" | "connections">("chats")
  const [mainView, setMainView] = React.useState<"default" | "add-skill" | "add-connection">("default")

  const handleNewChatSubmit = React.useCallback((prompt: string) => {
    const newChat: AgentChat = {
      id: String(Date.now()),
      title: prompt.length > 60 ? prompt.slice(0, 57) + "…" : prompt,
      agentType: "Data Analysis Agent",
      status: "running",
      progress: 0,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      description: prompt,
      actions: [
        {
          id: "msg-1",
          type: "message",
          label: "Got it! Starting to work on this now…",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ],
    }
    setAllChats((prev) => [newChat, ...prev])
    setSelectedId(newChat.id)
    setIsNewChat(false)
  }, [])

  React.useEffect(() => {
    if (incomingQuery) {
      handleNewChatSubmit(incomingQuery)
    }
    // No query → stay in new-chat view (isNewChat initialises to true when no query)
  }, [incomingQuery, handleNewChatSubmit])

  // Pick up a thread forwarded from the dashboard side panel
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("genie:pendingThread")
      if (!raw) return
      sessionStorage.removeItem("genie:pendingThread")
      const { id, title, source, msgs } = JSON.parse(raw) as {
        id: string; title: string; source?: string; msgs: SimpleMsg[]
      }
      const thread: AgentChat = {
        id,
        title,
        agentType: "Dashboard Chat",
        status: "complete",
        progress: 100,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        description: source ? `Continued from ${source}` : title,
        actions: [],
        source,
        messages: msgs,
      }
      setAllChats((prev) => [thread, ...prev])
      setSelectedId(id)
      setIsNewChat(false)
      setSidebarOpen(true)
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFlag = React.useCallback((id: string) => {
    setAllChats((prev) => prev.map((c) => c.id === id ? { ...c, flagged: !c.flagged } : c))
  }, [])

  const filteredChats = React.useMemo(() => {
    let chats = statusFilter === "all" ? allChats
      : statusFilter === "flagged" ? allChats.filter((c) => c.flagged)
      : allChats.filter((c) => c.status === statusFilter)
    if (threadSearch.trim()) {
      const q = threadSearch.toLowerCase()
      chats = chats.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    }
    return chats
  }, [allChats, statusFilter, threadSearch])

  const flaggedChats = allChats.filter((c) => c.flagged)
  // Split filtered chats into needs-attention + rest
  const needsAttention = filteredChats.filter((c) => c.status === "needs-attention")
  const regularChats = filteredChats.filter((c) => c.status !== "needs-attention")
  const selected = allChats.find((c) => c.id === selectedId)

  const openNewChat = () => {
    setIsNewChat(true)
    setSelectedId("")
    setMainView("default")
    setSidebarView("chats")
  }

  return (
    <AppShell activeItem={activeNav} onNavigate={setActiveNav}>
      {/* Full-height split layout inside the white content card */}
      <div className="flex h-full overflow-hidden">

        {/* ── Filter sidebar ────────────────────────────────────────────── */}
        {showFilters && (
          <FilterSidebar
            chats={allChats}
            activeFilter={statusFilter}
            onFilter={(f) => { setStatusFilter(f); }}
          />
        )}

        {/* ── Left panel — agent list ───────────────────────────────────── */}
        {sidebarOpen ? (
          /* ── Expanded sidebar ──────────────────────────────────────────── */
          <div className="flex w-[280px] shrink-0 flex-col border-r border-border">

            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              {/* Collapse button — hover shows collapse arrow */}
              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <line x1="6" y1="2" x2="6" y2="14" />
                  <polyline points="9,6 7,8 9,10" />
                </svg>
              </button>
              <span className="flex-1 text-sm font-semibold text-foreground">Genie</span>
              {/* Skills */}
              <Tip label="Skills" side="bottom">
                <button
                  onClick={() => { setSidebarView((v) => v === "skills" ? "chats" : "skills"); setMainView("default") }}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                    sidebarView === "skills"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Zap size={14} />
                </button>
              </Tip>
              {/* Connections */}
              <Tip label="Connections" side="bottom">
                <button
                  onClick={() => { setSidebarView((v) => v === "connections" ? "chats" : "connections"); setMainView("default") }}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                    sidebarView === "connections"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Cable size={14} />
                </button>
              </Tip>
              {/* New chat */}
              <Tip label="New chat" side="bottom">
                <button
                  onClick={openNewChat}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <MessageSquare size={14} />
                </button>
              </Tip>
            </div>

            {/* New Chat button + search — only shown for chats view */}
            {sidebarView === "chats" && (
              <div className="flex flex-col gap-2 border-b border-border px-3 py-2.5">
                <button
                  onClick={openNewChat}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <MessageSquare size={13} />
                  New Chat
                </button>
                <div className="relative flex items-center">
                  <Search size={12} className="pointer-events-none absolute left-2 text-muted-foreground" />
                  <input
                    value={threadSearch}
                    onChange={(e) => setThreadSearch(e.target.value)}
                    placeholder="Search threads…"
                    className="w-full rounded-md border border-border bg-muted/40 py-1 pl-6 pr-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 focus:bg-background transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Sidebar body — switches based on view */}
            {sidebarView === "skills" ? (
              <SkillsSidebarPanel onAddSkill={() => { setMainView("add-skill"); setIsNewChat(false); setSelectedId("") }} />
            ) : sidebarView === "connections" ? (
              <ConnectionsSidebarPanel onAddConnection={() => { setMainView("add-connection"); setIsNewChat(false); setSelectedId("") }} />
            ) : (
              <>
                {/* Active filter chip */}
                {statusFilter !== "all" && (
                  <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5">
                    <span className="text-[11px] text-muted-foreground">Showing:</span>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {statusFilter === "flagged" && <StarFillIcon size={9} className="text-yellow-500" />}
                      {STATUS_FILTERS.find((f) => f.value === statusFilter)?.label}
                    </span>
                    <button onClick={() => setStatusFilter("all")} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">
                      Clear
                    </button>
                  </div>
                )}

                {/* Thread list */}
                <div className="flex flex-1 flex-col overflow-y-auto py-2">
                  {statusFilter === "all" && flaggedChats.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <StarFillIcon size={10} className="text-muted-foreground/50" />
                        <span className="text-[11px] text-muted-foreground">Flagged</span>
                        <span className="ml-auto text-[10px] text-muted-foreground/60">{flaggedChats.length}</span>
                      </div>
                      <div className="flex flex-col gap-px px-1">
                        {flaggedChats.map((chat) => (
                          <ChatListItem key={chat.id} chat={chat} active={!isNewChat && selectedId === chat.id}
                            onClick={() => { setSelectedId(chat.id); setIsNewChat(false); setMainView("default") }} onToggleFlag={toggleFlag} />
                        ))}
                      </div>
                    </div>
                  )}
                  {needsAttention.length > 0 && statusFilter !== "flagged" && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <WarningFillIcon size={11} className="text-muted-foreground/50" />
                        <span className="text-[11px] text-muted-foreground">Needs attention</span>
                      </div>
                      <div className="flex flex-col gap-px px-1">
                        {needsAttention.map((chat) => (
                          <ChatListItem key={chat.id} chat={chat} active={!isNewChat && selectedId === chat.id}
                            onClick={() => { setSelectedId(chat.id); setIsNewChat(false); setMainView("default") }} onToggleFlag={toggleFlag} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="px-3 py-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {statusFilter === "flagged" ? "Flagged Chats" : "Chats"}
                        {filteredChats.length > 0 && <span className="ml-1.5 text-muted-foreground/50">{filteredChats.length}</span>}
                      </span>
                    </div>
                    <div className="flex flex-col gap-px px-1">
                      {(statusFilter === "flagged" ? filteredChats : regularChats).map((chat) => (
                        <ChatListItem key={chat.id} chat={chat} active={!isNewChat && selectedId === chat.id}
                          onClick={() => { setSelectedId(chat.id); setIsNewChat(false); setMainView("default") }} onToggleFlag={toggleFlag} />
                      ))}
                      {filteredChats.length === 0 && (
                        <div className="px-3 py-6 text-center text-xs text-muted-foreground">No chats match this filter</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ── Collapsed sidebar strip ───────────────────────────────────── */
          <div className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border py-3">

            {/* New chat / expand — hover shows expand arrow */}
            <Tip label="New chat">
              <button
                onClick={() => { setSidebarOpen(true); openNewChat() }}
                className="group flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="group-hover:hidden">
                  <NewChatIcon size={16} />
                </span>
                <span className="hidden group-hover:flex items-center justify-center">
                  <svg viewBox="0 0 16 16" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="12" height="12" rx="2" />
                    <line x1="6" y1="2" x2="6" y2="14" />
                    <polyline points="7,6 9,8 7,10" />
                  </svg>
                </span>
              </button>
            </Tip>
          </div>
        )}

        {/* ── Right panel — detail ──────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {mainView === "add-skill" ? (
            <AddSkillPanel onBack={() => setMainView("default")} />
          ) : mainView === "add-connection" ? (
            <AddConnectionPanel onBack={() => setMainView("default")} />
          ) : sidebarView === "skills" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Zap size={26} className="text-muted-foreground/40" strokeWidth={1.2} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">No skill selected</p>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[280px]">
                  Choose a skill from the sidebar, or create a new one to teach Genie a specialized behavior.
                </p>
              </div>
              <button
                onClick={() => { setMainView("add-skill"); setSelectedId("") }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Zap size={12} /> Add Skill
              </button>
            </div>
          ) : sidebarView === "connections" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Cable size={26} className="text-muted-foreground/40" strokeWidth={1.2} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">No connection selected</p>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[280px]">
                  Choose a connection from the sidebar, or add a new one to give Genie access to your data sources and APIs.
                </p>
              </div>
              <button
                onClick={() => { setMainView("add-connection"); setSelectedId("") }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Cable size={12} /> Add Connection
              </button>
            </div>
          ) : isNewChat ? (
            <NewChatPanel
              onClose={() => setIsNewChat(false)}
              onSubmit={handleNewChatSubmit}
            />
          ) : selected ? (
            <DetailPanel
              chat={selected}
              onClose={() => setSelectedId("")}
              onNewChat={openNewChat}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <DbIcon icon={SparkleIcon} color="ai" size={32} />
              <p className="text-sm text-muted-foreground">Select a chat to view details</p>
              <Button size="sm" className="gap-1.5 mt-1" onClick={openNewChat}>
                <NewChatIcon size={14} />
                New Chat
              </Button>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}

// Wrap in Suspense so useSearchParams works in Next.js App Router
function GeniePageWithParams() {
  const searchParams = useSearchParams()
  const incomingQuery = searchParams.get("q") ?? ""
  return <GeniPageInner incomingQuery={incomingQuery} />
}

export default function GeniePage() {
  return (
    <Suspense fallback={<GeniPageInner incomingQuery="" />}>
      <GeniePageWithParams />
    </Suspense>
  )
}
