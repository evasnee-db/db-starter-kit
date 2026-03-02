"use client"

import * as React from "react"
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
} from "@/components/icons"
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

type AgentChat = {
  id: string
  title: string
  agentType: string
  status: AgentStatus
  progress?: number
  time: string
  description: string
  actions: AgentAction[]
  resultCard?: {
    title: string
    sections: { heading: string; items: string[] }[]
    summary: string
  }
  pendingCells?: number
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
    return <WarningFillIcon size={14} className="shrink-0 text-[var(--warning)]" />
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
}: {
  chat: AgentChat
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded px-3 py-2.5 text-left transition-colors",
        active ? "bg-primary/10" : "hover:bg-muted-foreground/8"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "text-sm font-semibold leading-snug truncate",
            active ? "text-primary" : "text-foreground"
          )}
        >
          {chat.title}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground mt-px">{chat.time}</span>
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
    </button>
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
        <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-primary/40">
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe what you want Genie to do…"
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(inputValue)
            }}
          />
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={!inputValue.trim()}
            onClick={() => submit(inputValue)}
            className={inputValue.trim() ? "text-primary" : "text-muted-foreground/40"}
          >
            <SendIcon size={14} />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground/60">
          Always review the accuracy of responses.
        </p>
      </div>
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
        <span className="flex-1 truncate text-sm font-semibold text-foreground">{chat.title}</span>
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

      {/* Scrollable content */}
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

      {/* Accept / Reject bar */}
      {chat.pendingCells !== undefined && (
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
        <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-primary/40">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`for '/' objects or '/' for history, '+' for history`}
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) setInputValue("")
            }}
          />
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={!inputValue.trim()}
            className={inputValue.trim() ? "text-primary" : "text-muted-foreground/40"}
          >
            <SendIcon size={14} />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground/60">
          Always review the accuracy of responses.
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeniePage() {
  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null
  const incomingQuery = searchParams?.get("q") ?? ""

  const [activeNav, setActiveNav] = React.useState("genie")
  const [selectedId, setSelectedId] = React.useState<string>("")
  const [isNewChat, setIsNewChat] = React.useState(true)
  const [allChats, setAllChats] = React.useState<AgentChat[]>(AGENT_CHATS)

  // If we arrived with a ?q= param, immediately submit it as a new chat
  React.useEffect(() => {
    if (incomingQuery) {
      handleNewChatSubmit(incomingQuery)
    } else {
      setSelectedId("1")
      setIsNewChat(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const needsAttention = allChats.filter((c) => c.status === "needs-attention")
  const chats = allChats.filter((c) => c.status !== "needs-attention")
  const selected = allChats.find((c) => c.id === selectedId)

  const openNewChat = () => {
    setIsNewChat(true)
    setSelectedId("")
  }

  const handleNewChatSubmit = (prompt: string) => {
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
  }

  return (
    <AppShell activeItem={activeNav} onNavigate={setActiveNav}>
      {/* Full-height split layout inside the white content card */}
      <div className="flex h-full overflow-hidden">

        {/* ── Left panel — agent list ───────────────────────────────────── */}
        <div className="flex w-[280px] shrink-0 flex-col border-r border-border">

          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <DbIcon icon={SparkleIcon} color="ai" size={18} className="shrink-0" />
            <span className="flex-1 text-sm font-semibold text-foreground">Genie</span>
            <Button variant="ghost" size="icon-xs" aria-label="More">
              <OverflowIcon size={14} className="text-muted-foreground" />
            </Button>
            <Button size="xs" className="gap-1" onClick={openNewChat}>
              <NewChatIcon size={12} />
              New Chat
            </Button>
          </div>

          {/* List */}
          <div className="flex flex-1 flex-col overflow-y-auto py-2">

            {/* Needs attention section */}
            {needsAttention.length > 0 && (
              <div className="mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <WarningFillIcon size={12} className="text-[var(--warning)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--warning)]">
                    Needs Attention
                  </span>
                </div>
                <div className="flex flex-col gap-px px-1">
                  {needsAttention.map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      active={!isNewChat && selectedId === chat.id}
                      onClick={() => { setSelectedId(chat.id); setIsNewChat(false) }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Chats section */}
            <div>
              <div className="px-3 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Chats
                </span>
              </div>
              <div className="flex flex-col gap-px px-1">
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    active={!isNewChat && selectedId === chat.id}
                    onClick={() => { setSelectedId(chat.id); setIsNewChat(false) }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel — detail ──────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {isNewChat ? (
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
