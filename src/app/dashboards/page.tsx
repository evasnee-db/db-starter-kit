"use client"

import * as React from "react"
import {
  AreaChart, Area, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts"
import { AppShell } from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DbIcon } from "@/components/ui/db-icon"
import {
  SparkleIcon,
  AssistantIcon,
  SendIcon,
  CloseIcon,
  PlusIcon,
  OverflowIcon,
  CalendarIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  CheckCircleFillIcon,
} from "@/components/icons"
import { Star, Share2, Clock, CalendarClock, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Chart colours ────────────────────────────────────────────────────────────

const C = {
  blue:    "#2272B4",
  teal:    "#1B8A78",
  yellow:  "#D4A017",
  green:   "#27794B",
  orange:  "#BE501E",
  blueFill:"#2272B414",
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const timeVsDistance = [
  { x: "3:00", Alaska:280, Arizona:310, Georgia:190, Hawaii:240, Idaho:170 },
  { x: "3:30", Alaska:320, Arizona:260, Georgia:210, Hawaii:300, Idaho:200 },
  { x: "4:00", Alaska:370, Arizona:290, Georgia:380, Hawaii:260, Idaho:240 },
  { x: "4:30", Alaska:200, Arizona:310, Georgia:290, Hawaii:350, Idaho:180 },
  { x: "5:00", Alaska:150, Arizona:270, Georgia:230, Hawaii:190, Idaho:210 },
  { x: "5:30", Alaska:260, Arizona:240, Georgia:310, Hawaii:220, Idaho:290 },
  { x: "6:00", Alaska:340, Arizona:360, Georgia:270, Hawaii:380, Idaho:320 },
  { x: "6:30", Alaska:390, Arizona:400, Georgia:350, Hawaii:340, Idaho:360 },
  { x: "7:00", Alaska:310, Arizona:330, Georgia:290, Hawaii:310, Idaho:280 },
]

const laptimesBoxRaw = [
  { team:"Ferrari",  q1:160, q2:185, q3:220, q4:255, whiskerHigh:295 },
  { team:"Mclaren",  q1:155, q2:190, q3:225, q4:260, whiskerHigh:305 },
  { team:"Alpine",   q1:150, q2:180, q3:215, q4:250, whiskerHigh:290 },
  { team:"Haas",     q1:145, q2:175, q3:210, q4:245, whiskerHigh:285 },
  { team:"Mercedes", q1:160, q2:195, q3:230, q4:265, whiskerHigh:310 },
]

// Convert box data to stacked bar segments: base (invisible), iqr-low (q1–q2), box (q2–q3), iqr-high (q3–q4)
const laptimesBox = laptimesBoxRaw.map((d) => ({
  team: d.team,
  base:     d.q1,
  lower:    d.q2 - d.q1,
  box:      d.q3 - d.q2,
  upper:    d.q4 - d.q3,
  whisker:  d.whiskerHigh - d.q4,
}))

const podiums = [
  { team:"Ferrari",  gold:120, silver:95,  bronze:60  },
  { team:"Mclaren",  gold:95,  silver:105, bronze:55  },
  { team:"Alpine",   gold:70,  silver:65,  bronze:45  },
  { team:"Haas",     gold:40,  silver:35,  bronze:20  },
  { team:"Mercedes", gold:85,  silver:90,  bronze:50  },
]

const distributionData = Array.from({ length: 17 }, (_, i) => ({
  x: i * 25,
  Ferrari:  Math.round(Math.max(0, 280 * Math.exp(-0.5 * ((i - 4) / 3) ** 2))),
  Mclaren:  Math.round(Math.max(0, 230 * Math.exp(-0.5 * ((i - 5) / 3) ** 2))),
  Alpine:   Math.round(Math.max(0, 190 * Math.exp(-0.5 * ((i - 6) / 3) ** 2))),
}))

const laptimesLine = [
  { team:"Ferrari",  SAI:310, LEC:260, MSP:190 },
  { team:"Mclaren",  SAI:280, LEC:240, MSP:220 },
  { team:"Alpine",   SAI:220, LEC:310, MSP:270 },
  { team:"Haas",     SAI:300, LEC:200, MSP:310 },
  { team:"Mercedes", SAI:260, LEC:280, MSP:240 },
]

// ─── AI chat messages ─────────────────────────────────────────────────────────

type ChatMsg = { id: string; role: "user" | "ai"; text: string; widget?: boolean }

const INITIAL_MSGS: ChatMsg[] = [
  {
    id: "0",
    role: "ai",
    text: "Hi! I can answer questions about this dashboard or add new visualizations. Try asking about the data or say \"Add a tire degradation chart\".",
  },
]

const SUGGESTED = [
  "Which team had the most podiums?",
  "Add a tire degradation chart",
  "Compare driver lap time trends",
  "What's the fastest lap overall?",
]

// ─── Fake AI responses ────────────────────────────────────────────────────────

function getAiResponse(prompt: string): { text: string; widget?: boolean } {
  const p = prompt.toLowerCase()
  if (p.includes("podium")) return { text: "Ferrari leads with 120 gold podiums, followed by Mercedes (85) and Mclaren (95). Ferrari dominates the top step overall." }
  if (p.includes("fastest")) return { text: "The fastest recorded lap is 1:18.750 by LEC in the Canada race at lap 32." }
  if (p.includes("tire") || p.includes("tyre") || p.includes("degradation")) return { text: "Adding a tire degradation chart to your dashboard!", widget: true }
  if (p.includes("add") || p.includes("chart") || p.includes("plot") || p.includes("scatter") || p.includes("viz")) return { text: "Adding that visualization to your dashboard now!", widget: true }
  if (p.includes("compare") || p.includes("driver")) return { text: "LEC consistently posts the lowest median laptimes across teams, especially on street circuits. SAI shows more variance but peaks higher on power tracks." }
  return { text: "Based on the dashboard data, here's what I found: the Canada 2026 race shows competitive lap time distributions across all teams, with Ferrari and Mercedes showing the tightest box plot ranges, indicating more consistent performance." }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex h-6 items-center gap-1 rounded bg-primary/10 px-2 text-xs font-semibold text-primary">
      {label}
      <button onClick={onRemove} className="hover:text-primary/60"><X size={10} /></button>
    </span>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-[200px] w-full">{children}</div>
    </div>
  )
}

// ─── New widget preview ───────────────────────────────────────────────────────

const tireDegData = [
  { lap: 1,  soft: 100, medium: 100, hard: 100 },
  { lap: 5,  soft: 91,  medium: 96,  hard: 98  },
  { lap: 10, soft: 80,  medium: 90,  hard: 96  },
  { lap: 15, soft: 65,  medium: 84,  hard: 93  },
  { lap: 20, soft: 45,  medium: 75,  hard: 90  },
  { lap: 25, soft: 28,  medium: 65,  hard: 87  },
  { lap: 30, soft: 12,  medium: 52,  hard: 83  },
]

function TireDegChart() {
  return (
    <ChartCard title="Tire Degradation" subtitle="Grip level over laps by compound">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={tireDegData} margin={{ top: 24, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis dataKey="lap" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} domain={[0, 100]} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
          <Line type="monotone" dataKey="soft"   stroke="#C82D4C" strokeWidth={2} dot={false} name="Soft" />
          <Line type="monotone" dataKey="medium" stroke={C.yellow} strokeWidth={2} dot={false} name="Medium" />
          <Line type="monotone" dataKey="hard"   stroke="#5F7281" strokeWidth={2} dot={false} name="Hard" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ─── AI side panel ────────────────────────────────────────────────────────────

function AiPanel({
  onClose,
  onAddWidget,
}: {
  onClose: () => void
  onAddWidget: () => void
}) {
  const [msgs, setMsgs] = React.useState<ChatMsg[]>(INITIAL_MSGS)
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  const send = (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMsg = { id: String(Date.now()), role: "user", text: text.trim() }
    setMsgs((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    setTimeout(() => {
      const resp = getAiResponse(text)
      const aiMsg: ChatMsg = { id: String(Date.now() + 1), role: "ai", text: resp.text, widget: resp.widget }
      setMsgs((m) => [...m, aiMsg])
      if (resp.widget) onAddWidget()
      setLoading(false)
    }, 900)
  }

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
        <span className="flex-1 text-sm font-semibold text-foreground">Ask about this dashboard</span>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <CloseIcon size={14} className="text-muted-foreground" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {msgs.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
            {msg.role === "ai" && (
              <div className="mt-0.5 shrink-0">
                <DbIcon icon={AssistantIcon} color="ai" size={16} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[240px] rounded-md px-3 py-2 text-xs leading-relaxed",
                msg.role === "ai"
                  ? "bg-secondary text-foreground"
                  : "bg-primary text-white"
              )}
            >
              {msg.text}
              {msg.widget && (
                <div className="mt-2 flex items-center gap-1.5 rounded border border-[var(--success)]/30 bg-[var(--success)]/8 px-2 py-1.5">
                  <CheckCircleFillIcon size={12} className="text-[var(--success)] shrink-0" />
                  <span className="text-[11px] text-[var(--success)] font-semibold">Widget added to dashboard</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <DbIcon icon={AssistantIcon} color="ai" size={16} className="mt-0.5 shrink-0" />
            <div className="flex items-center gap-1 rounded-md bg-secondary px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {msgs.length <= 1 && (
        <div className="shrink-0 border-t border-border px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Suggestions</p>
          <div className="flex flex-col gap-1.5">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-secondary hover:border-primary/40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-primary/40">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or add a chart…"
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            onKeyDown={(e) => { if (e.key === "Enter") send(input) }}
          />
          <Button
            variant="ghost" size="icon-xs"
            disabled={!input.trim() || loading}
            onClick={() => send(input)}
            className={input.trim() ? "text-primary" : "text-muted-foreground/40"}
          >
            <SendIcon size={14} />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground/50">
          Always review the accuracy of responses.
        </p>
      </div>
    </div>
  )
}

// ─── Slider ───────────────────────────────────────────────────────────────────

function RangeSlider({
  min, max, value, onChange,
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="relative flex h-8 w-[160px] items-center">
      <div className="relative h-1 w-full rounded-full bg-border">
        <div
          className="absolute h-1 rounded-full bg-primary"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
      </div>
      {([0, 1] as const).map((i) => (
        <input
          key={i}
          type="range" min={min} max={max}
          value={value[i]}
          onChange={(e) => {
            const v = Number(e.target.value)
            const next: [number, number] = [...value] as [number, number]
            next[i] = v
            if (next[0] <= next[1]) onChange(next)
          }}
          className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm"
        />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardsPage() {
  const [activeNav, setActiveNav]   = React.useState("dashboards")
  const [aiOpen, setAiOpen]         = React.useState(false)
  const [drivers, setDrivers]       = React.useState(["SAI", "LEC", "MSP"])
  const [revenueRange, setRevenueRange] = React.useState<[number, number]>([100, 200])
  const [showTireWidget, setShowTireWidget] = React.useState(false)
  const [activeTab, setActiveTab]   = React.useState("overview")

  const removeDriver = (d: string) => setDrivers((prev) => prev.filter((x) => x !== d))

  return (
    <AppShell activeItem={activeNav} onNavigate={setActiveNav} onAiClick={() => setAiOpen((v) => !v)} aiActive={aiOpen}>
      <div className="flex h-full overflow-hidden">

        {/* ── Main dashboard area ───────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-y-auto">

          {/* Page header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-6 py-3">
            <h1 className="text-lg font-semibold text-foreground">Formula One</h1>
            <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
              <Star size={14} />
            </button>
            <Button variant="outline" size="xs" className="gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              View Draft
            </Button>

            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                Live
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} /> 2m ago
              </span>
              <Button variant="ghost" size="icon-xs">
                <OverflowIcon size={14} className="text-muted-foreground" />
              </Button>
              <Button variant="outline" size="xs" className="gap-1.5">
                <CalendarClock size={12} />
                Schedule
              </Button>
              <Button variant="outline" size="xs" className="gap-1.5">
                <Share2 size={12} />
                Share
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0 items-center gap-0 border-b border-border px-6">
            {[
              { id: "overview",     label: "Overview" },
              { id: "team",         label: "Team Performance" },
              { id: "drivers",      label: "Drivers Performance" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 px-4 py-2.5 text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex shrink-0 flex-wrap items-end gap-6 border-b border-border px-6 py-3">

            {/* Race */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Race</span>
              <button className="flex h-7 items-center gap-1.5 rounded border border-border bg-background px-3 text-xs hover:bg-secondary">
                Canada <ChevronDown size={11} className="text-muted-foreground" />
              </button>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Year</span>
              <button className="flex h-7 items-center gap-1.5 rounded border border-border bg-background px-3 text-xs hover:bg-secondary">
                2026 <ChevronDown size={11} className="text-muted-foreground" />
              </button>
            </div>

            {/* Drivers */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Drivers</span>
              <div className="flex h-7 items-center gap-1 rounded border border-border bg-background px-2">
                {drivers.map((d) => (
                  <FilterPill key={d} label={d} onRemove={() => removeDriver(d)} />
                ))}
                <button className="ml-1 text-muted-foreground hover:text-foreground">
                  <CalendarIcon size={13} />
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dates</span>
              <div className="flex h-7 items-center gap-1.5 rounded border border-border bg-background px-2 text-xs text-foreground">
                Jul 27, 2025
                <span className="text-muted-foreground">→</span>
                Jul 28, 2025
                <CalendarIcon size={13} className="ml-1 text-muted-foreground" />
              </div>
            </div>

            {/* Revenue range */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Revenue Range</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{revenueRange[0]}</span>
                <RangeSlider min={0} max={400} value={revenueRange} onChange={setRevenueRange} />
                <span className="text-xs text-muted-foreground">{revenueRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Charts grid */}
          <div className="flex flex-col gap-8 p-6">

            {/* Row 1 — 3 cols */}
            <div className="grid grid-cols-3 gap-6">

              {/* Time vs Distance */}
              <ChartCard title="Time vs Distance" subtitle="Combo chart showing two things here">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeVsDistance} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                    <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
                    <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
                    <Area type="monotone" dataKey="Alaska"  stroke={C.blue}   fill="url(#blueGrad)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Arizona" stroke={C.orange} strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Georgia" stroke={C.teal}   strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Hawaii"  stroke={C.yellow} strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Idaho"   stroke={C.green}  strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Laptimes box plot (stacked bars simulating box) */}
              <ChartCard title="Laptimes" subtitle="Boxplot spread over entire race">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={laptimesBox} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                    <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }}
                      formatter={(v, name) => {
                        const labels: Record<string, string> = { base: "Min", lower: "Q1→Q2", box: "IQR", upper: "Q3→Q4", whisker: "Max" }
                        return [v, labels[name as string] ?? name]
                      }}
                    />
                    <Bar dataKey="base"    stackId="a" fill="transparent" />
                    <Bar dataKey="lower"   stackId="a" fill={C.blue}   opacity={0.4} radius={[0,0,0,0]} />
                    <Bar dataKey="box"     stackId="a" fill={C.blue}   radius={[0,0,0,0]} />
                    <Bar dataKey="upper"   stackId="a" fill={C.blue}   opacity={0.4} radius={[0,0,0,0]} />
                    <Bar dataKey="whisker" stackId="a" fill="transparent" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Podiums */}
              <ChartCard title="Podiums" subtitle="Positions up there">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={podiums} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                    <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
                    <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
                    <Bar dataKey="gold"   stackId="a" fill={C.yellow} name="1st" />
                    <Bar dataKey="silver" stackId="a" fill={C.teal}   name="2nd" />
                    <Bar dataKey="bronze" stackId="a" fill={C.green}  name="3rd" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 2 — 2 cols */}
            <div className="grid grid-cols-2 gap-6">

              {/* Distribution of timelaps */}
              <ChartCard title="Distribution of timelaps" subtitle="Enter a description">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                    <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
                    <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
                    <Bar dataKey="Ferrari" stackId="a" fill={C.blue}   name="Ferrari" />
                    <Bar dataKey="Mclaren" stackId="a" fill={C.yellow} name="Mclaren" />
                    <Bar dataKey="Alpine"  stackId="a" fill={C.green}  name="Alpine" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Laptimes line */}
              <ChartCard title="Laptimes" subtitle="Enter a description">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={laptimesLine} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                    <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
                    <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
                    <Line type="monotone" dataKey="SAI" stroke={C.teal}   strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="LEC" stroke={C.yellow} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="MSP" stroke={C.blue}   strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Dynamically added widget */}
            {showTireWidget && (
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge variant="teal" className="text-[10px]">New</Badge>
                  </div>
                  <TireDegChart />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── AI side panel ─────────────────────────────────────────────── */}
        {aiOpen && (
          <AiPanel
            onClose={() => setAiOpen(false)}
            onAddWidget={() => setShowTireWidget(true)}
          />
        )}

      </div>
    </AppShell>
  )
}
