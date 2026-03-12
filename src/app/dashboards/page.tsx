"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, ChevronDown, MoreHorizontal, SlidersHorizontal, Columns3 } from "lucide-react"
import { AppShell } from "@/components/shell"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUGGESTED = [
  {
    id: "revenue-forecast",
    title: "Revenue Forecast",
    reason: "You view frequently",
    href: "/dashboards/revenue-forecast",
    preview: "forecast",
  },
  {
    id: "formula-one",
    title: "Formula One Racing",
    reason: "You view frequently",
    href: "/dashboards/formula-one",
    preview: "f1",
  },
  {
    id: "pipeline-health",
    title: "Pipeline Health",
    reason: "Favorite ★",
    href: null,
    preview: "pipeline",
  },
  {
    id: "territory-insights",
    title: "Territory Insights",
    reason: "Shared with you 1d ago",
    href: null,
    preview: "territory",
  },
]

type Dashboard = {
  id: string
  name: string
  reason: string
  domain: string
  owner: string
  ownerInitial: string
  ownerColor: string
  href: string | null
  isGroup?: boolean
}

const ALL_DASHBOARDS: Dashboard[] = [
  { id: "0",  name: "Revenue Forecast",                 reason: "You view frequently",  domain: "Sales",                    owner: "Nina Adams",    ownerInitial: "N", ownerColor: "bg-blue-500",   href: "/dashboards/revenue-forecast" },
  { id: "1",  name: "Formula One Racing",               reason: "You view frequently",  domain: "Data Science & AI",        owner: "Nina Adams",    ownerInitial: "N", ownerColor: "bg-blue-500",   href: "/dashboards/formula-one" },
  { id: "2",  name: "Sales Supply Chain Optimization",  reason: "You view frequently",  domain: "Governance & Complia...",  owner: "Nina Adams",    ownerInitial: "N", ownerColor: "bg-blue-500",   href: null },
  { id: "3",  name: "Sales Pipeline Manager",           reason: "Viewed 2 hours ago",   domain: "Sales",                    owner: "Liam Baker",    ownerInitial: "L", ownerColor: "bg-green-500",  href: null },
  { id: "4",  name: "User Experience Assessment",       reason: "Trending",             domain: "Supply Chain & Logistics", owner: "Olivia Carter",  ownerInitial: "O", ownerColor: "bg-orange-500", href: null },
  { id: "5",  name: "Sales Supply Chain Optimization",  reason: "You view frequently",  domain: "Data Science & AI",        owner: "Samantha Green", ownerInitial: "S", ownerColor: "bg-teal-500",   href: null },
  { id: "6",  name: "User Experience Assessment",       reason: "Viewed 1 hour ago",    domain: "Product & R&D",            owner: "Quincy James",   ownerInitial: "Q", ownerColor: "bg-purple-500", href: null },
  { id: "7",  name: "Sales Pipeline Manager",           reason: "Viewed 45 minutes ago",domain: "Human Resources",          owner: "Some group",     ownerInitial: "G", ownerColor: "bg-gray-400",   href: null, isGroup: true },
  { id: "8",  name: "Sales Supply Chain Optimization",  reason: "Trending",             domain: "Healthcare & Life Scie...", owner: "Kylie Nelson",  ownerInitial: "K", ownerColor: "bg-emerald-500",href: null },
  { id: "9",  name: "User Experience Assessment",       reason: "You view frequently",  domain: "Data Science & AI",        owner: "Mason Price",    ownerInitial: "M", ownerColor: "bg-indigo-500", href: null },
  { id: "10", name: "Sales Supply Chain Optimization",  reason: "Trending",             domain: "Healthcare & Life Scie...", owner: "Parker Reed",   ownerInitial: "P", ownerColor: "bg-pink-500",   href: null },
  { id: "11", name: "Customer Feedback in Sales Metrics",reason:"You view frequently",  domain: "Supply Chain & Logistics", owner: "Holly Taylor",   ownerInitial: "H", ownerColor: "bg-red-500",    href: null },
  { id: "12", name: "Sales Inventory Analysis",         reason: "Viewed 45 minutes ago",domain: "Governance & Complia...",  owner: "Some group",     ownerInitial: "G", ownerColor: "bg-gray-400",   href: null, isGroup: true },
  { id: "13", name: "Current Sales Trends Overview",    reason: "Viewed 50 minutes ago",domain: "Supply Chain & Logistics", owner: "Daisy Foster",  ownerInitial: "D", ownerColor: "bg-rose-500",   href: null },
]

const FILTERS = ["Owned by me", "Modified this week", "Favorites", "Published", "Draft"]

// ─── Preview thumbnails ────────────────────────────────────────────────────────

function PreviewCard({ type }: { type: string }) {

  // ── F1: KPI row + multi-team area chart ─────────────────────────────────────
  if (type === "f1") return (
    <svg viewBox="0 0 220 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="f1r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03"/>
        </linearGradient>
        <linearGradient id="f1b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03"/>
        </linearGradient>
        <linearGradient id="f1o" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.03"/>
        </linearGradient>
      </defs>

      {/* KPI mini-cards */}
      <rect x="5" y="5" width="56" height="20" rx="3" fill="#f8fafc"/>
      <text x="9" y="13" fontSize="4.5" fill="#94a3b8">Avg Lap Time</text>
      <text x="9" y="21" fontSize="7.5" fontWeight="700" fill="#0f172a">1:23.847</text>

      <rect x="67" y="5" width="48" height="20" rx="3" fill="#f8fafc"/>
      <text x="71" y="13" fontSize="4.5" fill="#94a3b8">Pit Stop Avg</text>
      <text x="71" y="21" fontSize="7.5" fontWeight="700" fill="#0f172a">2.6s</text>

      <rect x="121" y="5" width="48" height="20" rx="3" fill="#f8fafc"/>
      <text x="125" y="13" fontSize="4.5" fill="#94a3b8">Race Wins</text>
      <text x="125" y="21" fontSize="7.5" fontWeight="700" fill="#0f172a">14</text>

      <rect x="175" y="5" width="40" height="20" rx="3" fill="#fef2f2"/>
      <text x="179" y="13" fontSize="4.5" fill="#ef4444">Top Speed</text>
      <text x="179" y="21" fontSize="7.5" fontWeight="700" fill="#dc2626">340 km/h</text>

      {/* Grid lines */}
      {[95, 80, 65, 50].map((y, i) => (
        <line key={i} x1="5" y1={y} x2="215" y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
      ))}

      {/* Area fills */}
      <path d="M5,90 L27,75 L49,82 L71,60 L93,68 L115,50 L137,56 L159,42 L181,48 L203,34 L215,28 L215,102 L5,102Z" fill="url(#f1r)"/>
      <path d="M5,93 L27,84 L49,87 L71,74 L93,80 L115,68 L137,73 L159,60 L181,65 L203,54 L215,50 L215,102 L5,102Z" fill="url(#f1b)"/>
      <path d="M5,96 L27,89 L49,92 L71,83 L93,87 L115,78 L137,83 L159,72 L181,77 L203,66 L215,62 L215,102 L5,102Z" fill="url(#f1o)"/>

      {/* Lines */}
      <polyline points="5,90 27,75 49,82 71,60 93,68 115,50 137,56 159,42 181,48 203,34 215,28" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinejoin="round"/>
      <polyline points="5,93 27,84 49,87 71,74 93,80 115,68 137,73 159,60 181,65 203,54 215,50" fill="none" stroke="#3b82f6" strokeWidth="1.4" strokeLinejoin="round"/>
      <polyline points="5,96 27,89 49,92 71,83 93,87 115,78 137,83 159,72 181,77 203,66 215,62" fill="none" stroke="#f97316" strokeWidth="1.4" strokeLinejoin="round"/>

      {/* Axis */}
      <line x1="5" y1="102" x2="215" y2="102" stroke="#cbd5e1" strokeWidth="0.6"/>

      {/* Legend */}
      <circle cx="12" cy="113" r="2.5" fill="#ef4444"/>
      <text x="17" y="116" fontSize="5" fill="#64748b">Ferrari</text>
      <circle cx="50" cy="113" r="2.5" fill="#3b82f6"/>
      <text x="55" y="116" fontSize="5" fill="#64748b">Red Bull</text>
      <circle cx="95" cy="113" r="2.5" fill="#f97316"/>
      <text x="100" y="116" fontSize="5" fill="#64748b">McLaren</text>
    </svg>
  )

  // ── Forecast: dense histogram bars, purple → orange → yellow gradient ────────
  if (type === "forecast") {
    const heights = [18,22,28,35,42,50,58,65,72,76,80,82,80,78,74,70,65,60,55,50,45,40,36,32,28,24,20,18,15,12]
    return (
      <svg viewBox="0 0 220 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hist" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7c3aed"/>
            <stop offset="35%"  stopColor="#db2777"/>
            <stop offset="65%"  stopColor="#ea580c"/>
            <stop offset="100%" stopColor="#eab308"/>
          </linearGradient>
        </defs>
        {/* Y-axis grid */}
        {[20,40,60,80,100].map((y, i) => (
          <line key={i} x1="8" y1={y} x2="214" y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
        ))}
        {/* Bars */}
        {heights.map((h, i) => {
          const bw = 6.2
          const x = 10 + i * (bw + 0.6)
          const barH = h * 0.88
          return <rect key={i} x={x} y={104 - barH} width={bw} height={barH} fill="url(#hist)" rx="0.8"/>
        })}
        {/* Axis */}
        <line x1="8" y1="104" x2="214" y2="104" stroke="#94a3b8" strokeWidth="0.8"/>
        {/* X labels */}
        {["Q1","Q2","Q3","Q4"].map((l, i) => (
          <text key={l} x={26 + i * 48} y="113" fontSize="5.5" fill="#94a3b8" textAnchor="middle">{l}</text>
        ))}
        {/* Y labels */}
        {[0,25,50,75,100].map((v, i) => (
          <text key={v} x="5" y={104 - v * 0.88 + 2} fontSize="4.5" fill="#94a3b8" textAnchor="end">{v}</text>
        ))}
      </svg>
    )
  }

  // ── Pipeline Health: stacked smooth area chart ──────────────────────────────
  if (type === "pipeline") return (
    <svg viewBox="0 0 220 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pp1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.04"/>
        </linearGradient>
        <linearGradient id="pp2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.04"/>
        </linearGradient>
        <linearGradient id="pp3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.40"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[25, 45, 65, 85].map((y, i) => (
        <line key={i} x1="4" y1={y} x2="216" y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
      ))}
      {/* Area 1 */}
      <path d="M4,30 C25,25 50,38 75,22 C100,10 125,18 150,14 C170,10 195,16 216,12 L216,102 L4,102Z" fill="url(#pp1)"/>
      <path d="M4,30 C25,25 50,38 75,22 C100,10 125,18 150,14 C170,10 195,16 216,12" fill="none" stroke="#0ea5e9" strokeWidth="1.8"/>
      {/* Area 2 */}
      <path d="M4,52 C25,46 50,58 75,44 C100,33 125,42 150,38 C170,34 195,40 216,36 L216,102 L4,102Z" fill="url(#pp2)"/>
      <path d="M4,52 C25,46 50,58 75,44 C100,33 125,42 150,38 C170,34 195,40 216,36" fill="none" stroke="#14b8a6" strokeWidth="1.8"/>
      {/* Area 3 */}
      <path d="M4,70 C25,65 50,74 75,62 C100,54 125,63 150,59 C170,55 195,62 216,58 L216,102 L4,102Z" fill="url(#pp3)"/>
      <path d="M4,70 C25,65 50,74 75,62 C100,54 125,63 150,59 C170,55 195,62 216,58" fill="none" stroke="#8b5cf6" strokeWidth="1.8"/>
      {/* Axis */}
      <line x1="4" y1="102" x2="216" y2="102" stroke="#cbd5e1" strokeWidth="0.6"/>
      {/* Legend */}
      <circle cx="10" cy="112" r="3" fill="#0ea5e9"/>
      <text x="16" y="115" fontSize="5.5" fill="#64748b">New Leads</text>
      <circle cx="60" cy="112" r="3" fill="#14b8a6"/>
      <text x="66" y="115" fontSize="5.5" fill="#64748b">Qualified</text>
      <circle cx="108" cy="112" r="3" fill="#8b5cf6"/>
      <text x="114" y="115" fontSize="5.5" fill="#64748b">Closed Won</text>
    </svg>
  )

  // ── Territory Insights: scatter plot with colored clusters ──────────────────
  const red  = [[152,44],[168,36],[175,56],[160,30],[182,50],[170,64],[157,40],[187,47],[177,32],[165,54],[180,42],[158,70],[172,27],[192,40],[163,58]]
  const teal = [[28,80],[42,64],[57,87],[47,57],[32,97],[63,72],[37,104],[58,82],[44,70],[27,112],[67,60],[52,94],[40,77],[65,90],[30,68]]
  const orng = [[98,108],[112,97],[128,90],[106,116],[120,86],[136,100],[110,79],[124,93],[140,84],[102,124],[117,110],[132,80],[107,100]]

  return (
    <svg viewBox="0 0 220 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Subtle grid */}
      {[30,60,90].map((y, i) => (
        <line key={i} x1="4" y1={y} x2="216" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      {[55,110,165].map((x, i) => (
        <line key={i} x1={x} y1="5" x2={x} y2="115" stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      {/* Red cluster */}
      {red.map(([x, y], i) => <circle key={`r${i}`} cx={x} cy={y} r={[3,4,3.5,4.5,3,5,3.5,4,3,4.5,3,5,3.5,4,3][i]} fill="#ef4444" opacity="0.75"/>)}
      {/* Teal cluster */}
      {teal.map(([x, y], i) => <circle key={`t${i}`} cx={x} cy={y} r={[4,3.5,5,3,4.5,3.5,4,5,3,4,3.5,4.5,3,5,3.5][i]} fill="#14b8a6" opacity="0.72"/>)}
      {/* Orange cluster */}
      {orng.map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r={[3.5,4,3,5,3.5,4,3,4.5,3.5,4,3,4.5,3][i]} fill="#f97316" opacity="0.72"/>)}
      {/* Legend */}
      <circle cx="10" cy="113" r="3" fill="#ef4444"/>
      <text x="16" y="116" fontSize="5.5" fill="#64748b">North</text>
      <circle cx="48" cy="113" r="3" fill="#14b8a6"/>
      <text x="54" y="116" fontSize="5.5" fill="#64748b">South</text>
      <circle cx="88" cy="113" r="3" fill="#f97316"/>
      <text x="94" y="116" fontSize="5.5" fill="#64748b">Central</text>
    </svg>
  )
}

// Dashboard grid icon
function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#888]">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardsListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("type:dashboard")
  const [activeFilters, setActiveFilters] = React.useState<string[]>(["Dashboards"])
  const [suggestedOpen, setSuggestedOpen] = React.useState(true)

  const toggleFilter = (f: string) => {
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  return (
    <AppShell activeItem="dashboards">
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-lg border border-[#d8d8d8] bg-white px-4 py-2.5 shadow-sm focus-within:border-[#aaa] mb-4">
        <Search size={14} className="shrink-0 text-[#aaa]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-[#1c1c1c] outline-none"
        />
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Active filters count */}
        <button className="flex items-center gap-1 rounded-md border border-[#d8d8d8] bg-white px-2 py-1 text-[12px] text-[#555] hover:bg-[#f5f5f5]">
          <SlidersHorizontal size={12} />
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">1</span>
        </button>

        {/* Active pill: Dashboards */}
        <button
          onClick={() => toggleFilter("Dashboards")}
          className="flex items-center gap-1.5 rounded-full border border-[#1c1c1c] bg-white px-3 py-1 text-[12.5px] font-medium text-[#1c1c1c] hover:bg-[#f5f5f5]"
        >
          Dashboards
          <X size={11} className="text-[#888]" />
        </button>

        {/* Inactive filter chips */}
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12.5px] transition-colors",
              activeFilters.includes(f)
                ? "border-[#1c1c1c] bg-white font-medium text-[#1c1c1c]"
                : "border-[#d8d8d8] bg-white text-[#555] hover:bg-[#f5f5f5]"
            )}
          >
            {f}
          </button>
        ))}

        <button className="ml-1 text-[12.5px] text-primary hover:underline">
          Reset filters
        </button>
      </div>

      {/* ── Suggested ─────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <button
          onClick={() => setSuggestedOpen(v => !v)}
          className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-[#1c1c1c] hover:text-[#444]"
        >
          <ChevronDown size={14} className={cn("transition-transform", !suggestedOpen && "-rotate-90")} />
          Suggested
        </button>

        {suggestedOpen && (
          <div className="grid grid-cols-4 gap-3">
            {SUGGESTED.map((item) => (
              <div
                key={item.id}
                onClick={() => item.href && router.push(item.href)}
                className={cn(
                  "flex flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white transition-all",
                  item.href ? "cursor-pointer hover:border-[#bbb] hover:shadow-md" : "cursor-default opacity-80"
                )}
              >
                {/* Preview area */}
                <div className="h-[140px] w-full border-b border-[#f0f0f0] bg-[#fafafa] overflow-hidden">
                  <PreviewCard type={item.preview} />
                </div>
                {/* Info */}
                <div className="flex flex-col gap-0.5 px-3 py-2.5">
                  <span className="text-[12.5px] font-medium text-[#1c1c1c] leading-snug">{item.title}</span>
                  <span className="text-[11.5px] text-[#888]">{item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── All dashboards ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[#1c1c1c]">All dashboards</span>
          <button className="flex items-center gap-1.5 text-[12px] text-[#888] hover:text-[#555]">
            Relevance
            <Columns3 size={13} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-[#e8e8e8]">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.4fr_36px] items-center border-b border-[#e8e8e8] bg-[#fafafa] px-4 py-2">
            <span className="text-[11.5px] font-medium text-[#888]">Name</span>
            <span className="text-[11.5px] font-medium text-[#888]">Reason suggested</span>
            <span className="text-[11.5px] font-medium text-[#888]">Domain</span>
            <span className="text-[11.5px] font-medium text-[#888]">Owner</span>
            <span />
          </div>

          {/* Rows */}
          {ALL_DASHBOARDS.map((row, i) => (
            <div
              key={row.id}
              onClick={() => row.href && router.push(row.href)}
              className={cn(
                "group grid grid-cols-[2fr_1.2fr_1.2fr_1.4fr_36px] items-center border-b border-[#f0f0f0] px-4 py-3 last:border-0 transition-colors",
                row.href ? "cursor-pointer hover:bg-[#f8f8f8]" : "hover:bg-[#f8f8f8] cursor-default"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <DashboardIcon />
                <span className={cn(
                  "truncate text-[13px] text-[#1c1c1c]",
                  i === 0 && "font-medium"
                )}>{row.name}</span>
              </div>
              <span className="text-[12.5px] text-[#888] truncate pr-2">{row.reason}</span>
              <span className="text-[12.5px] text-[#888] truncate pr-2">{row.domain}</span>
              <div className="flex items-center gap-2 min-w-0">
                {row.isGroup ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5e7eb] shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="4" cy="4" r="2" fill="#9ca3af"/>
                      <circle cx="8" cy="4" r="2" fill="#9ca3af"/>
                      <path d="M1 10c0-2 1.5-3 3-3s3 1 3 3" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
                      <path d="M7 10c0-2 1.5-3 3-3" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
                    </svg>
                  </div>
                ) : (
                  <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white", row.ownerColor)}>
                    {row.ownerInitial}
                  </div>
                )}
                <span className="truncate text-[12.5px] text-[#555]">{row.owner}</span>
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-[#eee] transition-all"
              >
                <MoreHorizontal size={14} className="text-[#888]" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
    </AppShell>
  )
}
