"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search, ArrowUp, ChevronRight, Star, ShieldCheck,
  Upload, AlertTriangle, Activity, MessageSquare, BarChart2,
  BookOpen, Table2, Cpu, History, Plus, AtSign,
} from "lucide-react"
import { AppShell } from "@/components/shell"
import { DbIcon } from "@/components/ui/db-icon"
import {
  AssistantIcon,
  CatalogIcon,
  BarChartIcon,
  SpeechBubbleIcon,
  QueryIcon,
  PipelineIcon,
  WorkflowsIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUGGESTED_ITEMS = [
  { id: 1,  icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 23 hours ago" },
  { id: 2,  icon: "dashboard", name: "Sales Pipeline Manager",          reason: "You viewed · 22 hours ago" },
  { id: 3,  icon: "genie",     name: "User Experience Assessment",      reason: "Trending" },
  { id: 4,  icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 21 hours ago" },
  { id: 5,  icon: "genie",     name: "User Experience Assessment",      reason: "You view frequently" },
  { id: 6,  icon: "dashboard", name: "Sales Pipeline Manager",          reason: "Trending" },
  { id: 7,  icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "You viewed · 20 hours ago" },
  { id: 8,  icon: "genie",     name: "User Experience Assessment",      reason: "You view frequently" },
  { id: 9,  icon: "dashboard", name: "Sales Supply Chain Optimization", reason: "Shared with you · 1 day ago" },
  { id: 10, icon: "dashboard", name: "Customer Feedback in Sales Metrics", reason: "You viewed · 18 hours ago" },
]

const ALERTS = [
  { id: 1, type: "error",   title: "Pipeline failed",        source: "Marketing Team", time: "Today" },
  { id: 2, type: "warning", title: "Quality Rule Violated",  source: "Atira Richards", time: "1 day ago" },
  { id: 3, type: "drift",   title: "Model drift detected",   source: "Hector Cruz",    time: "5 days ago" },
  { id: 4, type: "comment", title: "New notebook comment",   source: "Sales Team",     time: "1 week ago" },
]

const DOMAINS = [
  {
    id: "d1", name: "Marketing", verified: true,
    color: "bg-green-100", iconColor: "text-green-700",
    desc: "Data, dashboards, and tools for tracking campaigns, analyzing pipeline impact, and measuring ROI.",
    queries: "18.4k", assets: "42 certified assets", users: "320 active users",
  },
  {
    id: "d2", name: "Finance", verified: true,
    color: "bg-blue-100", iconColor: "text-blue-700",
    desc: "Core financial reporting, budgeting, forecasting, and spend analysis across business units.",
    queries: "22.7k", assets: "38 certified assets", users: "280 active users",
  },
  {
    id: "d3", name: "Supply Chain & Logistics", verified: false,
    color: "bg-red-100", iconColor: "text-red-600",
    desc: "Data on inventory, shipments, suppliers, and fulfillment to optimize global operations.",
    queries: "14.6k", assets: "33 certified assets", users: "210 active users",
  },
  {
    id: "d4", name: "Retail & Commerce", verified: false,
    color: "bg-blue-100", iconColor: "text-blue-700",
    desc: "Point-of-sale, e-commerce, and merchandising data for understanding customers.",
    queries: "102k", assets: "47 certified assets", users: "250 active users",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ItemIcon({ type }: { type: string }) {
  if (type === "genie")
    return <DbIcon icon={AssistantIcon} color="ai" size={14} />
  return <BarChartIcon size={14} className="text-primary" />
}

function AlertIcon({ type }: { type: string }) {
  if (type === "error")
    return <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50"><AlertTriangle size={11} className="text-red-500" /></div>
  if (type === "warning")
    return <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50"><BarChart2 size={11} className="text-amber-500" /></div>
  if (type === "drift")
    return <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50"><Activity size={11} className="text-green-600" /></div>
  return <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50"><MessageSquare size={11} className="text-blue-500" /></div>
}

function CertifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <ShieldCheck size={9} className="shrink-0" />
      Certified
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("suggested")
  const [searchMode, setSearchMode] = React.useState<"search" | "ask">("search")

  const handleSearch = (q = query) => {
    if (q.trim()) router.push(`/genie?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <AppShell activeItem="home">
    <div className="flex-1 overflow-y-auto bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-4 px-4 pt-12 pb-8">
        <h1 className="text-[26px] font-semibold text-[#111] tracking-[-0.02em]">
          What would you like to know?
        </h1>

        <div className="w-full max-w-[580px] flex flex-col">
          {/* Search box — unified card */}
          <div className="rounded-xl border border-[#e0e0e0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.10)] focus-within:border-[#c8c8c8] transition-all overflow-hidden">
            {/* Input row */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              placeholder={searchMode === "ask" ? "Ask anything..." : "Search for anything..."}
              className="w-full bg-transparent px-4 pt-3.5 pb-2 text-[13.5px] text-[#111] outline-none placeholder:text-[#bbb]"
            />

            {/* Bottom action row */}
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1">
                {/* Search toggle */}
                <button
                  onClick={() => setSearchMode("search")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                    searchMode === "search"
                      ? "border-[#d0d0d0] bg-white text-[#111] shadow-[0_1px_4px_rgba(0,0,0,0.10)]"
                      : "border-transparent text-[#888] hover:border-[#e8e8e8] hover:text-[#555]"
                  )}
                >
                  <Search size={11} strokeWidth={2.2} /> Search
                </button>
                {/* Ask toggle */}
                <button
                  onClick={() => setSearchMode("ask")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                    searchMode === "ask"
                      ? "border-[#d0d0d0] bg-white text-[#111] shadow-[0_1px_4px_rgba(0,0,0,0.10)]"
                      : "border-transparent text-[#888] hover:border-[#e8e8e8] hover:text-[#555]"
                  )}
                >
                  <SpeechBubbleIcon size={11} /> Ask
                </button>
                {/* Ask-mode extras: @ and + */}
                {searchMode === "ask" && (
                  <>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-[#aaa] hover:border-[#e8e8e8] hover:text-[#555] transition-all">
                      <AtSign size={13} strokeWidth={2} />
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-[#aaa] hover:border-[#e8e8e8] hover:text-[#555] transition-all">
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </>
                )}
              </div>

              {/* Send button */}
              <button
                onClick={() => handleSearch()}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                  query.trim()
                    ? "bg-[#111] text-white shadow-sm hover:bg-[#333]"
                    : "bg-[#f0f0f0] text-[#bbb] cursor-default"
                )}
              >
                <ArrowUp size={13} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* ── Below-box: Quick actions (Search) or Suggested questions (Ask) ── */}
          {searchMode === "search" ? (
            <div className="flex items-center gap-2 flex-wrap justify-center mt-3">
          {[
            { label: "Notebooks",  icon: BookOpen,    href: null         },
            { label: "Tables",     icon: Table2,      href: null         },
            { label: "Jobs",       icon: Cpu,         href: null         },
            { label: "Dashboards", icon: BarChart2,   href: "/dashboards"},
          ].map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              onClick={() => { if (href) router.push(href) }}
              className="flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-white px-3.5 py-1.5 text-[12.5px] text-[#444] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#ccc] hover:shadow-[0_2px_6px_rgba(0,0,0,0.09)] hover:text-[#111] transition-all"
            >
              <Icon size={12} className="text-[#666] shrink-0" strokeWidth={1.8} />
              {label}
            </button>
          ))}
            </div>
          ) : (
            <div className="mt-1 flex flex-col">
              {[
                "How are FY26 campaigns performing compared to FY25?",
                "Which campaigns have generated the most pipeline so far?",
                "Which regions are contributing the most leads for FY26 campaigns?",
                "What's the average deal size for opportunities tied to campaigns?",
                "Where are we seeing the lowest conversion rates in the funnel?",
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q); handleSearch(q) }}
                  className="group flex items-center gap-3 border-b border-[#f0f0f0] py-3 text-left text-[13px] text-[#555] hover:text-[#111] transition-colors last:border-0"
                >
                  <History size={14} className="shrink-0 text-[#ccc] group-hover:text-[#aaa] transition-colors" strokeWidth={1.8} />
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[960px] px-6 pb-12">

        {/* Two-column: Suggested list + right panel */}
        <div className="grid grid-cols-[1fr_268px] gap-6 mb-10">

          {/* Left: Suggested / Recents / Favorites / Shared */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white">
            {/* Tabs */}
            <div className="flex border-b border-[#e8e8e8]">
              {[
                { id: "suggested",  label: "Suggested" },
                { id: "recents",    label: "Recents" },
                { id: "favorites",  label: "Favorites" },
                { id: "shared",     label: "Shared" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-[13px] transition-colors",
                    activeTab === t.id
                      ? "border-[#1c1c1c] text-[#1c1c1c] font-medium"
                      : "border-transparent text-[#666] hover:text-[#1c1c1c]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_190px] border-b border-[#e8e8e8] px-4 py-2">
              <span className="text-[11px] font-medium text-[#999] uppercase tracking-wide">Name</span>
              <span className="text-[11px] font-medium text-[#999] uppercase tracking-wide">Reason suggested</span>
            </div>

            {/* Rows */}
            {SUGGESTED_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => item.icon === "dashboard" ? router.push("/dashboards") : router.push("/genie")}
                className="grid grid-cols-[1fr_190px] items-center border-b border-[#f0f0f0] px-4 py-2.5 last:border-0 hover:bg-[#f8f8f8] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ItemIcon type={item.icon} />
                  <span className="truncate text-[13px] text-[#1c1c1c]">{item.name}</span>
                </div>
                <span className="text-[12px] text-[#888]">{item.reason}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Alerts */}
            <div className="flex flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white">
              <div className="flex items-center justify-between border-b border-[#e8e8e8] px-4 py-2.5">
                <button className="flex items-center gap-0.5 text-[13px] font-medium text-[#1c1c1c] hover:text-primary transition-colors">
                  Alerts <ChevronRight size={13} className="text-[#aaa]" />
                </button>
              </div>
              <div className="flex flex-col px-4 py-2">
                {ALERTS.map((alert, i) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-2.5 py-2.5 cursor-pointer hover:opacity-80 transition-opacity",
                      i < ALERTS.length - 1 && "border-b border-[#f0f0f0]"
                    )}
                  >
                    <AlertIcon type={alert.type} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-medium text-[#1c1c1c] leading-snug">{alert.title}</span>
                      <span className="text-[11px] text-[#999]">From {alert.source} · {alert.time}</span>
                    </div>
                  </div>
                ))}
                <button className="py-2 text-left text-[12px] text-primary hover:underline">
                  See more
                </button>
              </div>
            </div>

            {/* Start something new */}
            <div className="flex flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white">
              <div className="border-b border-[#e8e8e8] px-4 py-2.5">
                <span className="text-[13px] font-medium text-[#1c1c1c]">Start something new</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {[
                  { label: "Upload data",   icon: Upload,     href: null },
                  { label: "Query",         icon: QueryIcon,  href: null },
                  { label: "Dashboard",     icon: BarChartIcon, href: "/dashboards" },
                  { label: "Pipeline",      icon: PipelineIcon, href: null },
                  { label: "Notebook",      icon: BookOpen,   href: null, wide: true },
                ].map(({ label, icon: Icon, href, wide }) => (
                  <button
                    key={label}
                    onClick={() => href ? router.push(href) : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-[#e8e8e8] bg-[#fafafa] px-3 py-2.5 text-left text-[12px] text-[#444] hover:bg-[#f2f2f2] transition-colors",
                      wide && "col-span-2"
                    )}
                  >
                    <Icon size={13} className="text-[#777] shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* What's new */}
        <section className="mb-8">
          <button className="mb-3 flex items-center gap-0.5 text-[13px] font-medium text-[#1c1c1c] hover:text-primary transition-colors">
            What&apos;s new <ChevronRight size={13} className="text-[#aaa]" />
          </button>
          <div
            className="relative flex overflow-hidden rounded-xl"
            style={{ background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 40%, #FBBF24 70%, #F59E0B 100%)", minHeight: 180 }}
          >
            {/* Left content */}
            <div className="flex flex-col justify-between p-6 w-[320px] shrink-0 z-10">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800/70">New App</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F97316] shadow-sm">
                    <span className="text-[10px] font-bold text-white leading-none">db</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#1c1c1c]">Databricks One</span>
                </div>
                <p className="text-[12px] text-[#444] leading-relaxed">
                  Databricks One brings a modern, simplified experience built for business users.
                </p>
              </div>
              <button className="mt-4 w-fit rounded-lg bg-white px-4 py-1.5 text-[12px] font-medium text-[#1c1c1c] shadow-sm hover:bg-white/90 transition-colors">
                Get started
              </button>
            </div>

            {/* Right: UI preview mockup */}
            <div className="flex flex-1 items-center justify-end pr-6 py-4">
              <div className="rounded-xl border border-white/40 bg-white/80 shadow-xl w-[340px] overflow-hidden backdrop-blur-sm">
                {/* Mock browser bar */}
                <div className="flex items-center gap-1.5 border-b border-[#eee] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                  <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                </div>
                {/* Mock content */}
                <div className="flex flex-col items-center gap-2.5 px-6 py-4">
                  <p className="text-[11px] font-medium text-[#1c1c1c]">What would you like to know?</p>
                  <div className="w-full rounded-md border border-[#e0e0e0] bg-[#f9f9f9] px-3 py-1.5">
                    <span className="text-[10px] text-[#bbb]">Search for anything...</span>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-1.5">
                    {["#dbeafe","#dcfce7","#fce7f3"].map((c,i) => (
                      <div key={i} className="h-8 rounded-md" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="w-full rounded-md border border-[#e8e8e8] bg-white">
                    {[0,1,2].map(i => (
                      <div key={i} className="flex items-center gap-2 border-b border-[#f0f0f0] px-2 py-1.5 last:border-0">
                        <div className="h-2 w-2 rounded-full bg-[#ddd]" />
                        <div className="h-1.5 flex-1 rounded-full bg-[#f0f0f0]" />
                        <div className="h-1.5 w-12 rounded-full bg-[#f0f0f0]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {[0,1,2].map(i => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === 0 ? "w-4 bg-amber-800/50" : "w-1.5 bg-amber-800/25")} />
              ))}
            </div>
          </div>
        </section>

        {/* Your top domains */}
        <section>
          <button className="mb-3 flex items-center gap-0.5 text-[13px] font-medium text-[#1c1c1c] hover:text-primary transition-colors">
            Your top domains <ChevronRight size={13} className="text-[#aaa]" />
          </button>
          <div className="grid grid-cols-2 gap-3">
            {DOMAINS.map((d) => (
              <div
                key={d.id}
                className="flex gap-3 rounded-lg border border-[#e8e8e8] bg-white p-4 hover:border-[#ccc] hover:shadow-sm cursor-pointer transition-all"
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", d.color)}>
                  <CatalogIcon size={17} className={d.iconColor} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-medium text-[#1c1c1c] truncate">{d.name}</span>
                    <span className="text-[11px] text-[#888] font-normal">Domain</span>
                    {d.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#888]">
                        <ShieldCheck size={9} className="text-[#aaa]" />
                      </span>
                    )}
                    <Star size={11} className="ml-auto shrink-0 text-[#ddd] hover:text-yellow-400 transition-colors" />
                  </div>
                  <p className="text-[11.5px] text-[#888] leading-snug line-clamp-2 mt-0.5">{d.desc}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-[#aaa]">{d.queries} queries</span>
                    <span className="text-[#ddd]">·</span>
                    <span className="text-[11px] text-[#aaa]">{d.assets}</span>
                    <span className="text-[#ddd]">·</span>
                    <span className="text-[11px] text-[#aaa]">{d.users}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
    </AppShell>
  )
}
