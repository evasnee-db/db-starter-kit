"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ChevronDown, ArrowUp, ChevronRight, Star } from "lucide-react"
import { DbIcon } from "@/components/ui/db-icon"
import { DatabricksLogo } from "@/components/shell/DatabricksLogo"
import {
  SparkleIcon,
  AppIcon,
  AssistantIcon,
  CatalogIcon,
  WorkspacesIcon,
  BarChartIcon,
  NotebookIcon,
  StorefrontIcon,
  SpeechBubbleIcon,
  WorkflowsIcon,
  RobotIcon,
  ChevronRightIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PINNED = [
  {
    id: "p1", type: "Dashboard", label: "Dashboard",
    title: "Supply Chain Optimization",
    subtitle: "Monitoring dashboard",
    color: "bg-blue-50",
    preview: "chart",
    stats: ["52%", "0.09%"],
  },
  {
    id: "p2", type: "Genie Space", label: "Genie Space",
    title: "FY26 Campaigns Genie",
    subtitle: "",
    color: "bg-purple-50",
    preview: "genie",
    stats: [],
  },
  {
    id: "p3", type: "Dashboard", label: "Dashboard",
    title: "Sales Review",
    subtitle: "",
    color: "bg-teal-50",
    preview: "chart2",
    stats: [],
  },
  {
    id: "p4", type: "App", label: "App",
    title: "Forecasting Agent",
    subtitle: "",
    color: "bg-green-50",
    preview: "app",
    stats: [],
  },
]

const FOR_YOU_ITEMS = [
  { id: 1, icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 23 hours ago" },
  { id: 2, icon: "dashboard", name: "Sales Pipeline Manager",          reason: "You viewed · 22 hours ago" },
  { id: 3, icon: "genie",     name: "User Experience Assessment",      reason: "Trending" },
  { id: 4, icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 21 hours ago" },
  { id: 5, icon: "genie",     name: "User Experience Assessment",      reason: "You view frequently" },
  { id: 6, icon: "dashboard", name: "Sales Pipeline Manager",          reason: "Trending" },
  { id: 7, icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 20 hours ago" },
  { id: 8, icon: "genie",     name: "User Experience Assessment",      reason: "You view frequently" },
  { id: 9, icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "Shared with you · 1 day ago" },
  { id: 10,icon: "dashboard", name: "Customer Feedback in Sales Me...", reason: "You viewed · 18 hours ago" },
]

const TRENDING = [
  { id: 1, icon: "genie",     name: "FY26 Marketing Genie",    author: "Marketing Team",  time: "Today" },
  { id: 2, icon: "dashboard", name: "Restaurant Sales",        author: "Atira Richards",  time: "1 day ago" },
  { id: 3, icon: "dashboard", name: "Produce Supply Chain",    author: "Hector Cruz",     time: "5 days ago" },
  { id: 4, icon: "genie",     name: "Kitchen Sales",           author: "Sales Team",      time: "1 week ago" },
  { id: 5, icon: "dashboard", name: "Quarterly Projections",   author: "Surya Patel",     time: "2 weeks ago" },
]

const DOMAINS = [
  {
    id: "d1", name: "Marketing", type: "Domain", verified: true,
    color: "bg-green-100", iconColor: "text-green-700",
    desc: "Data, dashboards, and tools for tracking campaigns, analyzing pipeline impact, and...",
    queries: "18.4k", assets: "42 certified assets", users: "320 active users",
  },
  {
    id: "d2", name: "Finance", type: "Domain", verified: true,
    color: "bg-blue-100", iconColor: "text-blue-700",
    desc: "Core financial reporting, budgeting, forecasting, and spend analysis across busi...",
    queries: "22.7k", assets: "38 certified assets", users: "280 active users",
  },
  {
    id: "d3", name: "Supply Chain & Logistics", type: "Domain", verified: false,
    color: "bg-red-100", iconColor: "text-red-600",
    desc: "Data on inventory, shipments, suppliers, and fulfillment to optimize global operations.",
    queries: "14.6k", assets: "33 certified assets", users: "210 active users",
  },
  {
    id: "d4", name: "Retail & Commerce", type: "Domain", verified: false,
    color: "bg-blue-100", iconColor: "text-blue-700",
    desc: "Point-of-sale, e-commerce, and merchandising data for understanding cust...",
    queries: "102k", assets: "47 certified assets", users: "250 active users",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ItemIcon({ type }: { type: string }) {
  if (type === "genie")
    return <DbIcon icon={AssistantIcon} color="ai" size={14} />
  return <BarChartIcon size={14} className="text-primary" />
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Dashboard:    "bg-blue-100 text-blue-700",
    "Genie Space":"bg-purple-100 text-purple-700",
    App:          "bg-green-100 text-green-700",
    Domain:       "bg-secondary text-muted-foreground",
  }
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-secondary text-muted-foreground")}>
      {type}
    </span>
  )
}

// Mini chart preview SVGs for pinned cards
function MiniPreview({ type }: { type: string }) {
  if (type === "chart") return (
    <svg viewBox="0 0 120 60" className="w-full h-full opacity-70">
      <polyline points="0,50 20,35 40,45 60,20 80,30 100,10 120,25" fill="none" stroke="#2272B4" strokeWidth="2"/>
      <polyline points="0,55 20,50 40,52 60,40 80,45 100,35 120,42" fill="none" stroke="#1B8A78" strokeWidth="1.5"/>
    </svg>
  )
  if (type === "chart2") return (
    <svg viewBox="0 0 120 60" className="w-full h-full opacity-70">
      <rect x="5"  y="20" width="16" height="40" fill="#2272B4" opacity="0.7" rx="1"/>
      <rect x="25" y="10" width="16" height="50" fill="#1B8A78" opacity="0.7" rx="1"/>
      <rect x="45" y="30" width="16" height="30" fill="#D4A017" opacity="0.7" rx="1"/>
      <rect x="65" y="15" width="16" height="45" fill="#2272B4" opacity="0.5" rx="1"/>
      <rect x="85" y="25" width="16" height="35" fill="#1B8A78" opacity="0.5" rx="1"/>
    </svg>
  )
  if (type === "genie") return (
    <div className="flex h-full w-full items-center justify-center">
      <DbIcon icon={AssistantIcon} color="ai" size={28} />
    </div>
  )
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RobotIcon size={28} className="text-green-600 opacity-60" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState("all")
  const [activeTab, setActiveTab] = React.useState("foryou")

  const handleSearch = (q = query) => {
    if (q.trim()) router.push(`/genie?q=${encodeURIComponent(q.trim())}`)
  }

  const filters = [
    { id: "all",     label: "Domains",      icon: WorkspacesIcon },
    { id: "dash",    label: "Dashboards",   icon: BarChartIcon },
    { id: "genie",   label: "Genie Spaces", icon: AssistantIcon },
    { id: "apps",    label: "Apps",         icon: StorefrontIcon },
  ]

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between bg-[#F6F7F9] px-4">
        <DatabricksLogo height={18} />
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted-foreground/10 transition-colors">
            Cutting Edge <ChevronDown size={12} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted-foreground/10 transition-colors">
            <AppIcon size={16} className="text-muted-foreground" />
          </button>
          <button className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
            N
          </button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-5 px-4 pt-12 pb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          What would you like to know?
        </h1>

        {/* Search bar */}
        <div className="w-full max-w-[600px]">
          <div className="flex items-center gap-0 rounded-lg border border-border bg-background shadow-[var(--shadow-db-sm)] overflow-hidden">
            {/* Search side */}
            <button
              onClick={() => handleSearch()}
              className="flex items-center gap-2 border-r border-border px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary transition-colors whitespace-nowrap"
            >
              <Search size={13} /> Search
            </button>

            {/* Input */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              placeholder="Search Dashboards, Genie spaces, and Apps"
              className="flex-1 bg-transparent px-3 py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />

            {/* Ask side */}
            <button
              onClick={() => handleSearch()}
              className="flex items-center gap-2 border-l border-border px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary transition-colors whitespace-nowrap"
            >
              <SpeechBubbleIcon size={13} /> Ask
            </button>

            {/* Submit */}
            <button
              onClick={() => handleSearch()}
              className={cn(
                "flex h-full items-center justify-center px-3 transition-colors",
                query.trim() ? "text-primary hover:bg-primary/5" : "text-muted-foreground/30"
              )}
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-colors",
                activeFilter === f.id
                  ? "bg-background text-foreground font-semibold shadow-[var(--shadow-db-sm)] border border-border"
                  : "text-muted-foreground hover:bg-muted-foreground/10"
              )}
            >
              <f.icon size={13} className={activeFilter === f.id ? "text-primary" : "text-muted-foreground"} />
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[960px] flex-1 px-4 pb-12">

        {/* Pinned */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Pinned</h2>
          <div className="grid grid-cols-4 gap-3">
            {PINNED.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-[var(--shadow-db-sm)] cursor-pointer hover:shadow-[var(--shadow-db-lg)] transition-shadow"
              >
                {/* Preview area */}
                <div className={cn("h-[90px] w-full p-3", item.color)}>
                  <MiniPreview type={item.preview} />
                </div>
                {/* Info */}
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center gap-1">
                    <TypeBadge type={item.type} />
                    <Star size={10} className="ml-auto text-muted-foreground/40 hover:text-yellow-400 transition-colors" />
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">{item.title}</p>
                  {item.subtitle && <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>}
                  {item.stats.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      {item.stats.map((s, i) => (
                        <span key={i} className="text-[11px] font-semibold text-foreground">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two-column section */}
        <div className="grid grid-cols-[1fr_280px] gap-6 mb-8">

          {/* Left: For you list */}
          <div className="flex flex-col rounded-md border border-border bg-background shadow-[var(--shadow-db-sm)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: "foryou",    label: "For you" },
                { id: "recents",   label: "Recents" },
                { id: "favorites", label: "Favorites" },
                { id: "shared",    label: "Shared" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-xs transition-colors",
                    activeTab === t.id
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_180px] border-b border-border px-4 py-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Name</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Reason suggested</span>
            </div>

            {/* Rows */}
            {FOR_YOU_ITEMS.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_180px] items-center border-b border-border px-4 py-2.5 last:border-0 hover:bg-secondary cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ItemIcon type={item.icon} />
                  <span className="truncate text-xs text-foreground">{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.reason}</span>
              </div>
            ))}
          </div>

          {/* Right: What's new + Trending */}
          <div className="flex flex-col gap-4">

            {/* What's new */}
            <div className="rounded-md border border-border bg-background shadow-[var(--shadow-db-sm)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-xs font-semibold text-foreground">What&apos;s new</span>
                <button className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                  <ChevronRight size={12} />
                </button>
              </div>
              <div className="p-3">
                <div className="rounded border border-border bg-secondary p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Community Highlight</p>
                  <p className="text-xs font-semibold text-foreground leading-snug mb-2">
                    Explore Apps from the Databricks Appathon
                  </p>
                  {/* Fake app screenshots */}
                  <div className="mb-3 grid grid-cols-2 gap-1.5">
                    <div className="h-16 rounded bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <BarChartIcon size={20} className="text-blue-500 opacity-60" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-7 rounded bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                        <WorkflowsIcon size={12} className="text-teal-600 opacity-60" />
                      </div>
                      <div className="h-7 rounded bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <RobotIcon size={12} className="text-purple-500 opacity-60" />
                      </div>
                    </div>
                  </div>
                  <button className="w-full rounded border border-border bg-background py-1.5 text-xs font-semibold text-foreground hover:bg-muted-foreground/5 transition-colors">
                    Browse winning apps
                  </button>
                  {/* Carousel dots */}
                  <div className="mt-2.5 flex justify-center gap-1">
                    {[0,1,2,3].map((i) => (
                      <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-primary" : "bg-border")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="rounded-md border border-border bg-background shadow-[var(--shadow-db-sm)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-xs font-semibold text-foreground">Trending</span>
                <button className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                  <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex flex-col">
                {TRENDING.map((item, i) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-2 px-4 py-2.5 hover:bg-secondary cursor-pointer transition-colors",
                      i < TRENDING.length - 1 && "border-b border-border"
                    )}
                  >
                    <ItemIcon type={item.icon} />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs font-semibold text-foreground">{item.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        From {item.author} · {item.time}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="px-4 py-2 text-left text-xs text-primary hover:underline">
                  See more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Your top domains */}
        <section>
          <div className="mb-3 flex items-center gap-1">
            <h2 className="text-sm font-semibold text-foreground">Your top domains</h2>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DOMAINS.map((d) => (
              <div
                key={d.id}
                className="flex gap-3 rounded-md border border-border bg-background p-4 shadow-[var(--shadow-db-sm)] hover:shadow-[var(--shadow-db-lg)] cursor-pointer transition-shadow"
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", d.color)}>
                  <CatalogIcon size={18} className={d.iconColor} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground truncate">{d.name}</span>
                    <TypeBadge type={d.type} />
                    {d.verified && <span className="text-[10px] text-muted-foreground">✓</span>}
                    <Star size={10} className="ml-auto shrink-0 text-muted-foreground/40 hover:text-yellow-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{d.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{d.queries} queries</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-muted-foreground">{d.assets}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-muted-foreground">{d.users}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
