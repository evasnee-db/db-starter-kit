"use client"

import * as React from "react"
import {
  AreaChart, Area, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis,
  Sankey, Rectangle, Layer,
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
import {
  Star, Share2, Clock, CalendarClock, ChevronDown, X,
  Pencil, MousePointer2, Table2, Undo2, Redo2, Sparkles,
  BarChart2, LayoutGrid, Check, Copy, Trash2, AlertTriangle,
  ThumbsUp, ThumbsDown, Flag, Settings2, Maximize2,
} from "lucide-react"
import { useRouter } from "next/navigation"
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

// ─── Revenue Forecast Dashboard data ─────────────────────────────────────────

// Revenue Trend — actuals (Oct–Mar) + forecast (Apr–Sep)
const revTrendData = [
  { month:"Oct '25", actual:3.8,  forecast:null },
  { month:"Nov '25", actual:4.0,  forecast:null },
  { month:"Dec '25", actual:3.6,  forecast:null },
  { month:"Jan '26", actual:4.2,  forecast:null },
  { month:"Feb '26", actual:4.6,  forecast:null },
  { month:"Mar '26", actual:5.1,  forecast:5.1  },
  { month:"Apr '26", actual:null, forecast:5.5  },
  { month:"May '26", actual:null, forecast:5.9  },
  { month:"Jun '26", actual:null, forecast:6.3  },
  { month:"Jul '26", actual:null, forecast:6.8  },
  { month:"Aug '26", actual:null, forecast:7.1  },
  { month:"Sep '26", actual:null, forecast:7.6  },
]

// Revenue by Product — bar chart
const revByProductData = [
  { name:"Platform",  value:420 },
  { name:"Pro",       value:310 },
  { name:"Enterprise",value:580 },
  { name:"Support",   value:210 },
  { name:"Training",  value:140 },
]

// Pipeline by Stage — funnel-style bar
const pipelineStageData = [
  { stage:"Prospecting",  value:8.4, deals:142 },
  { stage:"Qualified",    value:5.1, deals:67  },
  { stage:"Proposal",     value:3.2, deals:31  },
  { stage:"Negotiation",  value:1.8, deals:14  },
  { stage:"Closing",      value:0.6, deals:6   },
]

// Quota Attainment — bar chart by rep
const quotaAttainmentData = [
  { rep:"J. Kim",      attainment:118, quota:100 },
  { rep:"A. Rivera",   attainment:109, quota:100 },
  { rep:"M. Ellis",    attainment:98,  quota:100 },
  { rep:"C. Patel",    attainment:87,  quota:100 },
  { rep:"T. Okonkwo",  attainment:122, quota:100 },
  { rep:"S. Nakamura", attainment:76,  quota:100 },
]

// Deal Velocity — scatter (x = deal size $k, y = days to close)
const dealVelocityEnt = [
  {x:120,y:42},{x:200,y:60},{x:350,y:75},{x:480,y:90},{x:600,y:105},
  {x:250,y:55},{x:400,y:80},{x:550,y:95},{x:180,y:50},{x:310,y:68},
]
const dealVelocityMid = [
  {x:40,y:18},{x:65,y:22},{x:90,y:30},{x:75,y:25},{x:55,y:20},
  {x:85,y:28},{x:50,y:21},{x:70,y:27},{x:95,y:32},{x:60,y:24},
]
const dealVelocitySMB = [
  {x:10,y:7},{x:18,y:10},{x:25,y:12},{x:15,y:8},{x:22,y:11},
  {x:12,y:9},{x:30,y:14},{x:8,y:6},{x:20,y:10},{x:28,y:13},
]

// Deal Velocity line — monthly avg days to close
const dealVelocityLine = [
  { month:"Oct", Enterprise:92, Midmarket:28, SMB:10 },
  { month:"Nov", Enterprise:87, Midmarket:26, SMB:9  },
  { month:"Dec", Enterprise:98, Midmarket:30, SMB:11 },
  { month:"Jan", Enterprise:85, Midmarket:24, SMB:8  },
  { month:"Feb", Enterprise:80, Midmarket:22, SMB:9  },
  { month:"Mar", Enterprise:78, Midmarket:21, SMB:8  },
]

// KPI sparklines (tiny area charts in KPI cards)
const kpiSpark1 = [{v:3.6},{v:3.8},{v:4.0},{v:3.7},{v:4.2},{v:4.6},{v:5.1},{v:5.5},{v:5.9},{v:6.3}]
const kpiSpark2 = [{v:82},{v:84},{v:87},{v:83},{v:89},{v:91},{v:94},{v:97},{v:96},{v:98}]
const kpiSpark3 = [{v:71},{v:74},{v:76},{v:73},{v:78},{v:80},{v:82},{v:79},{v:84},{v:86}]

// ─── AI chat messages ─────────────────────────────────────────────────────────

type AgentStep = { label: string; status: "pending" | "running" | "done" }
type WidgetPreviewData = { chartType: string; prompt: string; version: number }
type ChatMsg = { id: string; role: "user" | "ai"; text: string; widget?: boolean; sql?: string; agentSteps?: AgentStep[]; followUps?: string[]; preview?: WidgetPreviewData }

const INITIAL_MSGS: ChatMsg[] = [
  {
    id: "0",
    role: "ai",
    text: "Hi! I can answer questions about this Revenue Forecast dashboard or add new visualizations. Try asking about your pipeline, quota attainment, or say \"Add a monthly ARR chart\".",
  },
]

const SUGGESTED = [
  "Which rep has the highest quota attainment?",
  "Add a monthly ARR growth chart",
  "How does deal velocity compare by segment?",
  "What is our forecast vs. target for Q3?",
]

// ─── Fake AI responses ────────────────────────────────────────────────────────

const SPECIFIC_WIDGET_WORDS = [
  "revenue", "forecast", "pipeline", "quota", "attainment", "deal", "velocity",
  "arr", "mrr", "segment", "product", "churn", "retention", "conversion",
  "scatter", "bar", "line", "area", "trend", "rep", "region", "stage",
]

const WIDGET_CONTEXT_WORDS = [
  "comparison", "compare", "vs", "versus", "strategy", "trace", "distribution",
  "analysis", "breakdown", "trend", "over time", "per sector", "by team", "by driver",
  "across drivers", "across teams", "over the race", "over rounds", "finishing position",
]

function isWidgetIntent(p: string) {
  const hasCreation = p.includes("add") || p.includes("create") || p.includes("make") ||
    p.includes("build") || p.includes("show") || p.includes("plot") || p.includes("graph") ||
    p.includes("visualize") || p.includes("display")
  const hasChartNoun = p.includes("chart") || p.includes("widget") || p.includes("viz") ||
    p.includes("visualization") || p.includes("graph") || p.includes("plot")
  const hasSpecific = SPECIFIC_WIDGET_WORDS.some((w) => p.includes(w))
  const hasContext = WIDGET_CONTEXT_WORDS.some((w) => p.includes(w))

  // Standard: creation verb + chart noun or specific data word
  if (hasCreation && (hasChartNoun || hasSpecific)) return true
  // Follow-up chip pattern: specific data word + analysis/comparison context (no question mark)
  if (hasSpecific && hasContext && !p.includes("?")) return true
  return false
}

function isGenericWidgetIntent(p: string) {
  const hasCreation = ["add", "create", "make", "build"].some((w) => p.includes(w))
  const hasGenericNoun = ["a widget", "a chart", "a visualization", "a viz", "a graph", "something", "a new"].some((w) => p.includes(w))
  const hasSpecific = SPECIFIC_WIDGET_WORDS.some((w) => p.includes(w))
  return hasCreation && hasGenericNoun && !hasSpecific
}

function getChartTypeFromPrompt(p: string): string {
  return p.includes("trend") || p.includes("arr") || p.includes("mrr") ? "Revenue Trend"
    : p.includes("scatter") ? "Deal Scatter"
    : p.includes("bar") ? "Bar Chart"
    : p.includes("pipeline") || p.includes("stage") ? "Pipeline by Stage"
    : p.includes("line") ? "Line Chart"
    : p.includes("quota") || p.includes("attainment") ? "Quota Attainment"
    : p.includes("velocity") || p.includes("deal") ? "Deal Velocity"
    : p.includes("product") || p.includes("segment") ? "Revenue by Product"
    : p.includes("region") || p.includes("geo") ? "Revenue by Region"
    : p.includes("forecast") ? "Revenue Forecast"
    : "Custom Visualization"
}

function getAiResponse(prompt: string): { text: string; widget?: boolean; sql?: string; followUps?: string[]; preview?: WidgetPreviewData } {
  const p = prompt.toLowerCase()

  if (p.includes("quota") && !isWidgetIntent(p)) return {
    text: "T. Okonkwo leads quota attainment at 122%, followed by J. Kim at 118%. Three reps are above 100% — overall team attainment is 95% this quarter.",
    sql: `SELECT rep_name,\n  SUM(closed_won) / SUM(quota) * 100 AS attainment_pct\nFROM sales.quotas\nWHERE quarter = CURRENT_QUARTER()\nGROUP BY rep_name\nORDER BY attainment_pct DESC;`,
  }

  if (p.includes("fastest") || p.includes("best rep")) return {
    text: "J. Kim closed $1.24M with +18% growth — the highest total revenue this quarter. T. Okonkwo has the best attainment at 122%.",
    sql: `SELECT rep_name, SUM(amount) AS total_revenue\nFROM salesforce.opportunities\nWHERE stage = 'Closed Won' AND quarter = CURRENT_QUARTER()\nGROUP BY rep_name\nORDER BY total_revenue DESC LIMIT 5;`,
  }

  // Generic widget request → ask clarifying questions
  if (isGenericWidgetIntent(p)) return {
    text: "Happy to add something! To make sure it's useful, what would you like to explore?",
    followUps: [
      "Monthly ARR growth over the last 12 months",
      "Pipeline value by stage",
      "Quota attainment by rep",
      "Deal velocity by segment",
      "Revenue by product line",
      "Churn rate trend by cohort",
    ],
  }

  // Specific widget request → show preview in chat first
  if (isWidgetIntent(p)) {
    const chartType = getChartTypeFromPrompt(p)
    return {
      text: `Here's a preview of the ${chartType} widget. Does this look right? You can refine it or add it to the dashboard.`,
      preview: { chartType, prompt: p, version: 1 },
      sql: `SELECT DATE_TRUNC('month', close_date) AS month,\n  SUM(amount) AS revenue,\n  segment\nFROM salesforce.opportunities\nWHERE stage = 'Closed Won'\nGROUP BY 1, segment\nORDER BY 1;`,
    }
  }

  if (p.includes("compare") || p.includes("segment") || p.includes("velocity")) return {
    text: "Enterprise deals take ~85 days to close on average but have 4× higher ACV. SMB closes in under 10 days. Mid-market is the fastest-growing segment at +22% QoQ.",
    sql: `SELECT segment,\n  AVG(days_to_close) AS avg_days,\n  AVG(amount) AS avg_acv,\n  COUNT(*) AS deal_count\nFROM salesforce.opportunities\nWHERE stage = 'Closed Won'\nGROUP BY segment;`,
  }

  return {
    text: "Based on the current pipeline, we're tracking at $30.2M forecasted for the next 6 months — 11% ahead of the same period last year. Enterprise deals are the primary growth driver at +14% YoY.",
    sql: `SELECT DATE_TRUNC('month', forecast_date) AS month,\n  SUM(predicted_revenue) AS forecast,\n  SUM(lower_bound) AS p10,\n  SUM(upper_bound) AS p90\nFROM ml.revenue_forecast\nWHERE forecast_date BETWEEN CURRENT_DATE AND DATEADD(month, 6, CURRENT_DATE)\nGROUP BY 1 ORDER BY 1;`,
  }
}

// ─── Edit-intent detection ────────────────────────────────────────────────────

const EDIT_PHRASES = [
  "change the", "change a", "update the", "update a", "modify", "edit the", "edit a",
  "remove the", "remove a", "delete the", "delete a", "rename", "move the", "move a",
  "resize", "reorder", "adjust the", "adjust a", "set the", "set a",
  "make the", "make it", "turn the", "turn it", "switch the",
  "fix the", "fix it", "replace the", "replace a", "recolor", "color the", "colour the",
]
function isEditIntent(p: string) {
  return EDIT_PHRASES.some((phrase) => p.includes(phrase))
}
function getEditModeResponse(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("color") || p.includes("colour") || ["red","blue","green","yellow","purple","orange","dark","light"].some(c => p.includes(c)))
    return "I've switched the dashboard to **edit mode**. Select the widget you'd like to recolor and use the config panel on the right to update its color scheme."
  if (p.includes("remove") || p.includes("delete"))
    return "I've switched the dashboard to **edit mode**. Hover over the widget you'd like to remove and click the trash icon that appears."
  if (p.includes("rename") || p.includes("title") || p.includes("label"))
    return "I've switched the dashboard to **edit mode**. Click the widget to select it, then update its title in the config panel on the right."
  if (p.includes("resize") || p.includes("size") || p.includes("bigger") || p.includes("smaller"))
    return "I've switched the dashboard to **edit mode**. Drag the widget's edges to resize it."
  if (p.includes("move") || p.includes("reorder") || p.includes("rearrange"))
    return "I've switched the dashboard to **edit mode**. Drag and drop widgets to rearrange them on the canvas."
  return "I've switched the dashboard to **edit mode** so you can make your changes. Select any widget to see its configuration options in the right panel."
}

// ─── Edit mode context ────────────────────────────────────────────────────────

type EditCtx = { editMode: boolean; selectedId: string | null; onSelect: (id: string) => void }
const EditModeContext = React.createContext<EditCtx>({ editMode: false, selectedId: null, onSelect: () => {} })

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
  id = "",
  title,
  subtitle,
  children,
  className,
}: {
  id?: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  const { editMode, selectedId, onSelect } = React.useContext(EditModeContext)
  const selected = editMode && !!id && selectedId === id
  return (
    <div
      onClick={() => { if (editMode && id) onSelect(id) }}
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border bg-background p-4 shadow-[var(--shadow-db-sm)] transition-all",
        editMode && id && "cursor-pointer",
        selected && "ring-2 ring-primary ring-offset-1 bg-primary/5",
        editMode && !selected && id && "hover:ring-1 hover:ring-primary/30",
        className
      )}
    >
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-[220px] w-full">{children}</div>
    </div>
  )
}

// ─── New widget preview ───────────────────────────────────────────────────────

// Churn / retention trend (reused as "optional new widget")
const retentionTrendData = [
  { month: "Oct", Enterprise: 98, Midmarket: 94, SMB: 88 },
  { month: "Nov", Enterprise: 97, Midmarket: 93, SMB: 87 },
  { month: "Dec", Enterprise: 98, Midmarket: 92, SMB: 85 },
  { month: "Jan", Enterprise: 99, Midmarket: 94, SMB: 87 },
  { month: "Feb", Enterprise: 98, Midmarket: 95, SMB: 88 },
  { month: "Mar", Enterprise: 99, Midmarket: 96, SMB: 90 },
]

// Revenue Flow Sankey: Product Line → Customer Segment → Region
const sankeyData = {
  nodes: [
    // Product lines (0-4)
    { name: "Platform" },
    { name: "Pro" },
    { name: "Enterprise" },
    { name: "Support" },
    // Segments (4-6)
    { name: "Large Co." },
    { name: "Mid-market" },
    { name: "SMB" },
    // Regions (7-9)
    { name: "Americas" },
    { name: "EMEA" },
    { name: "APAC" },
  ],
  links: [
    // Product → Segment
    { source: 0, target: 4, value: 18 }, // Platform → Large
    { source: 0, target: 5, value: 12 }, // Platform → Mid
    { source: 1, target: 4, value: 10 }, // Pro → Large
    { source: 1, target: 5, value: 14 }, // Pro → Mid
    { source: 1, target: 6, value: 8  }, // Pro → SMB
    { source: 2, target: 4, value: 28 }, // Enterprise → Large
    { source: 2, target: 5, value: 6  }, // Enterprise → Mid
    { source: 3, target: 4, value: 5  }, // Support → Large
    { source: 3, target: 5, value: 7  }, // Support → Mid
    { source: 3, target: 6, value: 4  }, // Support → SMB
    // Segment → Region
    { source: 4, target: 7, value: 28 }, // Large → Americas
    { source: 4, target: 8, value: 20 }, // Large → EMEA
    { source: 4, target: 9, value: 13 }, // Large → APAC
    { source: 5, target: 7, value: 22 }, // Mid → Americas
    { source: 5, target: 8, value: 10 }, // Mid → EMEA
    { source: 5, target: 9, value: 7  }, // Mid → APAC
    { source: 6, target: 7, value: 8  }, // SMB → Americas
    { source: 6, target: 8, value: 3  }, // SMB → EMEA
    { source: 6, target: 9, value: 1  }, // SMB → APAC
  ],
}

const SANKEY_COLORS: Record<string, string> = {
  Platform:   "#2272B4",
  Pro:        "#27794B",
  Enterprise: "#D4A017",
  Support:    "#1B8A78",
  "Large Co.":"#2272B4",
  "Mid-market":"#27794B",
  SMB:        "#BE501E",
  Americas:   "#2272B4",
  EMEA:       "#1B8A78",
  APAC:       "#D4A017",
}

// ─── @-mention autocomplete ───────────────────────────────────────────────────

const MENTION_SOURCES = [
  { id: "salesforce.opportunities",  label: "salesforce.opportunities",  type: "table",   icon: "📋" },
  { id: "salesforce.quotas",         label: "salesforce.quotas",         type: "table",   icon: "📋" },
  { id: "ml.revenue_forecast",       label: "ml.revenue_forecast",       type: "model",   icon: "🤖" },
  { id: "customers.subscriptions",   label: "customers.subscriptions",   type: "table",   icon: "📋" },
  { id: "revenue_forecast_dashboard",label: "revenue_forecast_dashboard",type: "dashboard", icon: "📊" },
  { id: "churn_probability_model",   label: "churn_probability_model",   type: "model",   icon: "🤖" },
  { id: "pipeline_analytics",        label: "pipeline_analytics",        type: "table",   icon: "📋" },
]

function AtMentionInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask Genie…",
  className = "",
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder?: string
  className?: string
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
    if (atIdx !== -1) {
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
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  )
}

// ─── AI side panel ────────────────────────────────────────────────────────────

// ─── Widget preview chart (shown inline in chat) ──────────────────────────────

const PREVIEW_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]

// ─── Inline widget config ─────────────────────────────────────────────────────
type WidgetConfig = {
  chartKind: "line" | "bar" | "area" | "scatter"
  palette: number
  xAxis: string
  yAxis: string
  groupBy: string
}
const PALETTE_OPTIONS: string[][] = [
  ["#e8484a", "#7c3aed", "#3b82f6"],
  ["#f97316", "#f59e0b", "#16a34a"],
  ["#14b8a6", "#06b6d4", "#0ea5e9"],
  ["#374151", "#6b7280", "#9ca3af"],
]
const X_AXIS_OPTIONS = ["Lap", "Round", "Driver", "Team", "Stint", "Sector"]
const Y_AXIS_OPTIONS = ["Lap Time", "Speed", "Gap to Leader", "Position", "Pit Duration"]
const GROUP_OPTIONS = ["Driver", "Team", "Compound", "None"]

function defaultConfig(chartType: string): WidgetConfig {
  const kind: WidgetConfig["chartKind"] =
    chartType.includes("Pit Stop") || chartType.includes("Championship") || chartType.includes("Qualifying") || chartType.includes("Bar") ? "bar"
    : chartType === "Scatter Plot" ? "scatter"
    : "line"
  return { chartKind: kind, palette: 0, xAxis: "Lap", yAxis: "Lap Time", groupBy: "Driver" }
}

function mkLapData(v: number) {
  const base = [83.2, 84.1, 83.7, 85.2, 84.8, 82.9, 83.4, 86.1, 83.0, 84.5]
  return base.map((t, i) => ({ lap: i + 1, LEC: +(t + (v - 1) * 0.3).toFixed(2), SAI: +(t + 1.1 + (v - 1) * 0.2).toFixed(2), VER: +(t + 0.6 + (v - 1) * 0.1).toFixed(2) }))
}
function mkPitData(v: number) {
  return [
    { team: "Ferrari",  t: +(2.4 + (v - 1) * 0.1).toFixed(2) },
    { team: "Mercedes", t: +(2.7 + (v - 1) * 0.05).toFixed(2) },
    { team: "McLaren",  t: +(2.5 + (v - 1) * 0.08).toFixed(2) },
    { team: "RBR",      t: +(2.6 + (v - 1) * 0.06).toFixed(2) },
    { team: "Alpine",   t: +(3.1 + (v - 1) * 0.04).toFixed(2) },
  ]
}
function mkDegData(v: number) {
  return Array.from({ length: 12 }, (_, i) => ({
    lap: i + 1,
    Soft: +(84 + i * (0.18 + (v - 1) * 0.04)).toFixed(2),
    Medium: +(84 + i * (0.11 + (v - 1) * 0.02)).toFixed(2),
    Hard: +(84 + i * 0.07).toFixed(2),
  }))
}
function mkGapData(v: number) {
  return [
    { round: "R1", Ferrari: 0,  Mercedes: +(12 + v).toFixed(0), McLaren: +(8 + v).toFixed(0) },
    { round: "R4", Ferrari: 25, Mercedes: +(18 + v).toFixed(0), McLaren: +(15 + v).toFixed(0) },
    { round: "R7", Ferrari: 42, Mercedes: +(28 + v).toFixed(0), McLaren: +(30 + v).toFixed(0) },
    { round: "R10",Ferrari: 60, Mercedes: +(40 + v).toFixed(0), McLaren: +(48 + v).toFixed(0) },
    { round: "R13",Ferrari: 85, Mercedes: +(55 + v).toFixed(0), McLaren: +(70 + v).toFixed(0) },
  ]
}

function WidgetPreview({ chartType, version, config }: { chartType: string; version: number; config?: WidgetConfig }) {
  const h = 140
  const commonAxis = { tick: { fontSize: 9, fill: "#888" }, axisLine: false, tickLine: false }
  const colors = config ? PALETTE_OPTIONS[config.palette] : PREVIEW_COLORS.slice(0, 3)
  const kind = config?.chartKind ?? defaultConfig(chartType).chartKind
  const xLabel = config?.xAxis ?? "Lap"
  const yLabel = config?.yAxis ?? "Lap Time"

  // Series labels change based on groupBy, but dataKeys stay fixed to match mock data shape
  const seriesByGroup: [string, string][] =
    config?.groupBy === "Team"     ? [["LEC", "Ferrari"], ["SAI", "Mercedes"], ["VER", "McLaren"]]
    : config?.groupBy === "Compound" ? [["LEC", "Soft"], ["SAI", "Medium"], ["VER", "Hard"]]
    : [["LEC", "LEC"], ["SAI", "SAI"], ["VER", "VER"]]

  const m = { top: 4, right: 4, bottom: 0, left: -20 }

  if (kind === "line" || kind === "area") {
    const data = chartType === "Tire Degradation" && !config ? mkDegData(version) : mkLapData(version)
    const degSeries: [string, string][] = [["Soft", "Soft"], ["Medium", "Medium"], ["Hard", "Hard"]]
    const series = chartType === "Tire Degradation" && !config ? degSeries : seriesByGroup
    return (
      <ResponsiveContainer width="100%" height={h}>
        {kind === "area" ? (
          <AreaChart data={data} margin={m}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="lap" label={xLabel !== "Lap" ? { value: xLabel, position: "insideBottomRight", fontSize: 8, offset: -4 } : undefined} {...commonAxis} />
            <YAxis {...commonAxis} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ fontSize: 10 }} />
            {series.map(([dk, label], i) => (
              <Area key={dk} type="monotone" dataKey={dk} name={label} stroke={colors[i]} fill={colors[i]} fillOpacity={0.12} strokeWidth={1.5} dot={false} />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={m}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="lap" label={xLabel !== "Lap" ? { value: xLabel, position: "insideBottomRight", fontSize: 8, offset: -4 } : undefined} {...commonAxis} />
            <YAxis {...commonAxis} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ fontSize: 10 }} />
            {series.map(([dk, label], i) => (
              <Line key={dk} type="monotone" dataKey={dk} name={label} stroke={colors[i]} strokeWidth={1.5} dot={false} />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    )
  }

  if (kind === "bar") {
    const useGrouped = config?.groupBy === "Team" || (!config && (chartType === "Championship Gap" || chartType === "Qualifying Performance"))
    const data = useGrouped ? mkGapData(version) : mkPitData(version)
    const xKey = useGrouped ? "round" : "team"
    return (
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} margin={m}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey={xKey} {...commonAxis} />
          <YAxis {...commonAxis} />
          <Tooltip contentStyle={{ fontSize: 10 }} />
          {useGrouped
            ? ["Ferrari", "Mercedes", "McLaren"].map((k, i) => (
                <Bar key={k} dataKey={k} fill={colors[i]} radius={[2, 2, 0, 0]} />
              ))
            : <Bar dataKey="t" name={yLabel} radius={[3, 3, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
          }
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // scatter (default fallback)
  const scatterData = Array.from({ length: 20 }, (_, i) => ({
    x: +(80 + Math.sin(i * 0.8 + version) * 4 + Math.random() * 2).toFixed(2),
    y: +(i * 0.3 + version * 0.2 + Math.random() * 1.5).toFixed(2),
  }))
  return (
    <ResponsiveContainer width="100%" height={h}>
      <ScatterChart margin={m}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="x" name={xLabel} {...commonAxis} />
        <YAxis dataKey="y" name={yLabel} {...commonAxis} />
        <Tooltip contentStyle={{ fontSize: 10 }} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={scatterData} fill={colors[0]} opacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// ─── AiPanel ──────────────────────────────────────────────────────────────────

function AiPanel({
  onClose,
  onExpand,
  onAddWidget,
  onEnterEditMode,
  initialQuery,
  noHeader = false,
}: {
  onClose: () => void
  onExpand?: (msgs: ChatMsg[]) => void
  onAddWidget: (prompt: string, reportSteps: (steps: AgentStep[]) => void) => void
  onEnterEditMode?: () => void
  initialQuery?: string
  noHeader?: boolean
}) {
  const [msgs, setMsgs] = React.useState<ChatMsg[]>(initialQuery ? [] : INITIAL_MSGS)
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const sentInitial = React.useRef(false)

  // Answer verification state
  const [ratings, setRatings]       = React.useState<Record<string, "up" | "down" | "">>({})
  const [flags, setFlags]           = React.useState<Record<string, boolean>>({})
  const [feedbacks, setFeedbacks]   = React.useState<Record<string, string>>({})
  const [sqlOpen, setSqlOpen]       = React.useState<Record<string, boolean>>({})
  const [previewMsgId, setPreviewMsgId] = React.useState<string | null>(null)
  const [addedToCanvas, setAddedToCanvas] = React.useState<Record<string, boolean>>({})
  const [widgetConfigs, setWidgetConfigs] = React.useState<Record<string, WidgetConfig>>({})

  const getWConfig = React.useCallback((msgId: string, chartType: string): WidgetConfig =>
    widgetConfigs[msgId] ?? defaultConfig(chartType), [widgetConfigs])
  const updateWConfig = React.useCallback((msgId: string, chartType: string, patch: Partial<WidgetConfig>) =>
    setWidgetConfigs(c => ({ ...c, [msgId]: { ...getWConfig(msgId, chartType), ...patch } })), [getWConfig])

  const toggleRating = (id: string, val: "up" | "down") =>
    setRatings((r) => ({ ...r, [id]: r[id] === val ? "" : val }))
  const toggleFlag = (id: string) =>
    setFlags((f) => ({ ...f, [id]: !f[id] }))

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  const addToCanvas = React.useCallback((msgId: string, prompt: string) => {
    setAddedToCanvas((a) => ({ ...a, [msgId]: true }))
    setPreviewMsgId(null)
    const stepsMsgId = String(Date.now())
    const initialSteps: AgentStep[] = [
      { label: "Switching dashboard to edit mode", status: "running" },
      { label: "Generating widget configuration", status: "pending" },
      { label: "Adding widget to canvas", status: "pending" },
    ]
    const stepMsg: ChatMsg = { id: stepsMsgId, role: "ai", text: "Adding to dashboard now!", agentSteps: initialSteps }
    setMsgs((m) => [...m, stepMsg])
    onAddWidget(prompt, (updatedSteps) => {
      setMsgs((m) => m.map((msg) => msg.id === stepsMsgId ? { ...msg, agentSteps: updatedSteps } : msg))
    })
  }, [onAddWidget])

  const send = React.useCallback((text: string, forceWidget?: boolean) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMsg = { id: String(Date.now()), role: "user", text: text.trim() }
    setMsgs((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    setTimeout(() => {
      const p = text.toLowerCase()
      const msgId = String(Date.now() + 1)

      // If there's an active preview and this looks like a refinement, create a new preview bubble
      if (previewMsgId && !isGenericWidgetIntent(p) && !p.includes("add to") && !p.includes("looks good") && !forceWidget) {
        const prevMsg = msgs.find((m) => m.id === previewMsgId)
        const prevChartType = prevMsg?.preview?.chartType ?? "Custom Visualization"
        const newChartType = isWidgetIntent(p) ? getChartTypeFromPrompt(p) : prevChartType
        const newVersion = (prevMsg?.preview?.version ?? 1) + 1
        const newPreview: WidgetPreviewData = { chartType: newChartType, prompt: p, version: newVersion }
        const aiMsg: ChatMsg = {
          id: msgId, role: "ai",
          text: isWidgetIntent(p)
            ? `Switched to a ${newChartType}. Does this look right?`
            : "Here's the updated version based on your feedback. Anything else to tweak?",
          preview: newPreview,
          sql: prevMsg?.sql,
        }
        setMsgs((m) => [...m, aiMsg])
        setPreviewMsgId(msgId)
        setWidgetConfigs((c) => ({ ...c, [msgId]: { ...(c[previewMsgId] ?? defaultConfig(newChartType)), chartKind: defaultConfig(newChartType).chartKind } }))
        setLoading(false)
        return
      }

      // Edit intent: enter edit mode and describe the action
      if (!forceWidget && !isWidgetIntent(p) && !isGenericWidgetIntent(p) && isEditIntent(p) && onEnterEditMode) {
        const responseText = getEditModeResponse(text)
        const aiMsg: ChatMsg = { id: msgId, role: "ai", text: responseText }
        setMsgs((m) => [...m, aiMsg])
        setLoading(false)
        setTimeout(() => onEnterEditMode(), 300)
        return
      }

      const resp: ReturnType<typeof getAiResponse> = forceWidget
        ? (() => {
            const chartType = getChartTypeFromPrompt(p)
            return {
              text: `Here's a preview of the ${chartType} widget. Does this look right? You can refine it or add it to the dashboard.`,
              preview: { chartType, prompt: p, version: 1 },
              sql: `SELECT driver_code, stint_lap,\n  AVG(lap_time_ms) AS avg_lap_ms,\n  compound\nFROM f1.stint_data\nGROUP BY driver_code, stint_lap, compound\nORDER BY stint_lap;`,
            }
          })()
        : getAiResponse(text)
      if (resp.followUps) {
        const aiMsg: ChatMsg = { id: msgId, role: "ai", text: resp.text, followUps: resp.followUps }
        setMsgs((m) => [...m, aiMsg])
        setLoading(false)
      } else if (resp.preview) {
        const aiMsg: ChatMsg = { id: msgId, role: "ai", text: resp.text, preview: resp.preview, sql: resp.sql }
        setMsgs((m) => [...m, aiMsg])
        setPreviewMsgId(msgId)
        setWidgetConfigs(c => ({ ...c, [msgId]: defaultConfig(resp.preview!.chartType) }))
        setLoading(false)
      } else {
        const aiMsg: ChatMsg = { id: msgId, role: "ai", text: resp.text, sql: resp.sql }
        setMsgs((m) => [...m, aiMsg])
        setLoading(false)
      }
    }, 900)
  }, [loading, previewMsgId])

  // Auto-send the initial query from the floating button
  React.useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true
      send(initialQuery)
    }
  }, [initialQuery, send])

  return (
    <div className="flex w-full flex-col">
      {!noHeader && (
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-4 py-3">
        <DbIcon icon={SparkleIcon} color="ai" size={16} className="shrink-0" />
        <span className="flex-1 text-sm font-semibold text-foreground">Genie</span>
        {onExpand && (
          <Button variant="ghost" size="icon-xs" onClick={() => onExpand(msgs)} title="Open full Genie experience">
            <Maximize2 size={13} className="text-muted-foreground" />
          </Button>
        )}
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <CloseIcon size={14} className="text-muted-foreground" />
        </Button>
      </div>
      )}

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {msgs.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
            {msg.role === "ai" && (
              <div className="mt-0.5 shrink-0">
                <DbIcon icon={AssistantIcon} color="ai" size={16} />
              </div>
            )}
            <div className="flex flex-col gap-1" style={{ maxWidth: msg.preview ? 272 : 240 }}>
              {/* Bubble */}
              <div
                className={cn(
                  "rounded-md px-3 py-2 text-xs leading-relaxed",
                  msg.role === "ai"
                    ? "bg-secondary text-foreground"
                    : "bg-primary text-white"
                )}
              >
                {msg.text}
                {msg.agentSteps && (
                  <div className="mt-2 flex flex-col gap-1 rounded-md border border-border/60 bg-muted/30 px-2.5 py-2">
                    {msg.agentSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {step.status === "done" ? (
                          <CheckCircleFillIcon size={11} className="shrink-0 text-[var(--success)]" />
                        ) : step.status === "running" ? (
                          <svg className="shrink-0 animate-spin text-primary" width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <span className="h-[11px] w-[11px] shrink-0 rounded-full border border-border/60" />
                        )}
                        <span className={cn(
                          "text-[10px] leading-tight",
                          step.status === "done" ? "text-[var(--success)]"
                          : step.status === "running" ? "font-medium text-foreground"
                          : "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    {msg.followUps.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q, true)}
                        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-[11px] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        <svg viewBox="0 0 12 12" width={10} height={10} className="shrink-0 text-primary/60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M2 6h8M6 2l4 4-4 4"/>
                        </svg>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {msg.preview && (() => {
                  const cfg = getWConfig(msg.id, msg.preview.chartType)
                  const added = addedToCanvas[msg.id]
                  return (
                  <div className="mt-2.5 overflow-hidden rounded-lg border border-border bg-background">
                    {/* Chart title row */}
                    <div className="flex items-center gap-1.5 border-b border-border/60 px-2.5 py-1.5">
                      <span className="text-[10px] font-semibold text-foreground">{msg.preview.chartType}</span>
                      {!added && <span className="ml-1 rounded bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary">preview</span>}
                      <span className="ml-auto text-[9px] text-muted-foreground">v{msg.preview.version}</span>
                    </div>
                    {/* Live chart */}
                    <div className="px-1 py-2">
                      <WidgetPreview chartType={msg.preview.chartType} version={msg.preview.version} config={cfg} />
                    </div>
                    {/* ── Inline config controls (only when not yet added) ── */}
                    {!added && (
                      <div className="border-t border-border/60 bg-muted/30 px-2.5 py-2 space-y-2">
                        {/* Row 1: chart type + color palette */}
                        <div className="flex items-center gap-2">
                          <span className="w-8 shrink-0 text-[9px] font-medium text-muted-foreground">Type</span>
                          <div className="flex gap-0.5">
                            {(["line", "bar", "area", "scatter"] as const).map((k) => (
                              <button
                                key={k}
                                onClick={() => updateWConfig(msg.id, msg.preview!.chartType, { chartKind: k })}
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors capitalize",
                                  cfg.chartKind === k
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                                )}
                              >{k}</button>
                            ))}
                          </div>
                          <div className="ml-auto flex items-center gap-1">
                            {PALETTE_OPTIONS.map((pal, i) => (
                              <button
                                key={i}
                                onClick={() => updateWConfig(msg.id, msg.preview!.chartType, { palette: i })}
                                title={["Default", "Warm", "Cool", "Mono"][i]}
                                className={cn(
                                  "h-[14px] w-[14px] shrink-0 rounded-full border-2 transition-transform",
                                  cfg.palette === i ? "border-primary scale-125" : "border-transparent hover:border-border"
                                )}
                                style={{ background: `linear-gradient(135deg, ${pal[0]} 50%, ${pal[1]} 50%)` }}
                              />
                            ))}
                          </div>
                        </div>
                        {/* Row 2: X / Y axes */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-8 shrink-0 text-[9px] font-medium text-muted-foreground">X axis</span>
                          <select
                            value={cfg.xAxis}
                            onChange={(e) => updateWConfig(msg.id, msg.preview!.chartType, { xAxis: e.target.value })}
                            className="flex-1 rounded border border-border bg-background px-1 py-0.5 text-[9px] text-foreground"
                          >
                            {X_AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                          </select>
                          <span className="shrink-0 text-[9px] font-medium text-muted-foreground">Y</span>
                          <select
                            value={cfg.yAxis}
                            onChange={(e) => updateWConfig(msg.id, msg.preview!.chartType, { yAxis: e.target.value })}
                            className="flex-1 rounded border border-border bg-background px-1 py-0.5 text-[9px] text-foreground"
                          >
                            {Y_AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* Row 3: group by */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-8 shrink-0 text-[9px] font-medium text-muted-foreground">Group</span>
                          <div className="flex gap-0.5 flex-wrap">
                            {GROUP_OPTIONS.map((g) => (
                              <button
                                key={g}
                                onClick={() => updateWConfig(msg.id, msg.preview!.chartType, { groupBy: g })}
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors",
                                  cfg.groupBy === g
                                    ? "border border-primary/30 bg-primary/10 text-primary"
                                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                                )}
                              >{g}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ── Action row ── */}
                    {!added ? (
                      <div className="flex items-center border-t border-border/60 px-2.5 py-2">
                        <button
                          onClick={() => addToCanvas(msg.id, msg.preview!.prompt)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-[10px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Add to dashboard
                          <svg viewBox="0 0 10 10" width={8} height={8} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M2 5h6M5 2l3 3-3 3"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 border-t border-border/60 px-2.5 py-2">
                        <CheckCircleFillIcon size={11} className="text-[var(--success)]" />
                        <span className="text-[10px] font-medium text-[var(--success)]">Added to dashboard</span>
                      </div>
                    )}
                  </div>
                  )
                })()}
                {msg.role === "ai" && msg.sql && (
                  <div className="mt-2 overflow-hidden rounded border border-border/60">
                    <button
                      onClick={() => setSqlOpen((o) => ({ ...o, [msg.id]: !o[msg.id] }))}
                      className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/40 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={cn("shrink-0 transition-transform", sqlOpen[msg.id] && "rotate-90")}>
                        <path d="M4 2.5L8 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View SQL
                    </button>
                    {sqlOpen[msg.id] && (
                      <pre className="border-t border-border/60 bg-muted/40 px-2 py-2 text-[9.5px] leading-relaxed font-mono text-foreground/80 overflow-x-auto whitespace-pre">
                        {msg.sql}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* ── Verification row (AI messages only, skip the intro) ── */}
              {msg.role === "ai" && msg.id !== "0" && (
                <>
                  <div className="flex items-center gap-0.5 px-0.5">
                    {/* Thumbs up */}
                    <button
                      onClick={() => toggleRating(msg.id, "up")}
                      title="Helpful"
                      className={cn(
                        "rounded p-1 transition-colors",
                        ratings[msg.id] === "up"
                          ? "text-green-600 bg-green-50"
                          : "text-muted-foreground/50 hover:text-green-600 hover:bg-green-50"
                      )}
                    >
                      <ThumbsUp size={11} />
                    </button>
                    {/* Thumbs down */}
                    <button
                      onClick={() => toggleRating(msg.id, "down")}
                      title="Not helpful"
                      className={cn(
                        "rounded p-1 transition-colors",
                        ratings[msg.id] === "down"
                          ? "text-red-500 bg-red-50"
                          : "text-muted-foreground/50 hover:text-red-500 hover:bg-red-50"
                      )}
                    >
                      <ThumbsDown size={11} />
                    </button>

                    {/* Confirmed message */}
                    {ratings[msg.id] === "up" && (
                      <span className="ml-1 text-[10px] text-green-600">Thanks!</span>
                    )}

                    <div className="flex-1" />

                    {/* Flag for review */}
                    <button
                      onClick={() => toggleFlag(msg.id)}
                      title={flags[msg.id] ? "Flagged for review" : "Flag for review"}
                      className={cn(
                        "rounded p-1 transition-colors",
                        flags[msg.id]
                          ? "text-amber-500 bg-amber-50"
                          : "text-muted-foreground/50 hover:text-amber-500 hover:bg-amber-50"
                      )}
                    >
                      <Flag size={11} />
                    </button>
                  </div>

                  {/* Thumbs-down feedback chips */}
                  {ratings[msg.id] === "down" && (
                    <div className="flex flex-wrap gap-1 px-0.5 pt-0.5">
                      {["Inaccurate data", "Misunderstood question", "Too vague", "Off topic"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setFeedbacks((f) => ({ ...f, [msg.id]: f[msg.id] === opt ? "" : opt }))}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                            feedbacks[msg.id] === opt
                              ? "border-red-200 bg-red-50 text-red-600"
                              : "border-border bg-background text-muted-foreground hover:border-red-200 hover:text-red-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Flag confirmation badge */}
                  {flags[msg.id] && (
                    <div className="flex items-center gap-1 px-0.5">
                      <Flag size={9} className="text-amber-500 shrink-0" />
                      <span className="text-[10px] font-medium text-amber-600">Flagged for review</span>
                    </div>
                  )}
                </>
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
          <AtMentionInput
            value={input}
            onChange={setInput}
            onSubmit={() => send(input)}
            placeholder="Ask a question or add a chart… (@ to mention)"
            className="flex-1"
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

// ─── Dynamic widget generation ───────────────────────────────────────────────

type DynamicWidget = {
  id: string
  title: string
  subtitle: string
  chartType: "bar" | "line" | "area"
  sourceId?: string      // set when copied from another widget
  pendingModify?: boolean // show Genie "what to modify" prompt
}

// Metadata for static widgets so they can be copied
const STATIC_WIDGET_META: Record<string, { title: string; subtitle: string; chartType: DynamicWidget["chartType"] }> = {
  "rev-trend":      { title: "Revenue Trend",             subtitle: "Actuals vs forecast — last 6 months + next 6.",  chartType: "area" },
  "rev-by-product": { title: "Revenue by Product Line",   subtitle: "Breakdown of revenue across product lines.",     chartType: "bar"  },
  "pipeline-stage": { title: "Pipeline by Stage",         subtitle: "Total pipeline value and deal count by stage.",  chartType: "bar"  },
  "quota-attain":   { title: "Quota Attainment by Rep",   subtitle: "Attainment % vs. 100% quota target.",           chartType: "bar"  },
  "deal-velocity":  { title: "Deal Velocity by Segment",  subtitle: "Avg days to close by customer segment.",        chartType: "line" },
  "rev-flow":       { title: "Revenue Flow",              subtitle: "Product → Customer Segment → Region.",          chartType: "bar"  },
  "retention":      { title: "Retention by Segment",      subtitle: "Monthly retention rate by customer segment.",   chartType: "line" },
}

const revenueByProduct = [
  { name: "Software", value: 420 },
  { name: "Services", value: 310 },
  { name: "Hardware", value: 185 },
  { name: "Support",  value: 260 },
  { name: "Training", value: 140 },
]

const revenueByQuarter = [
  { q: "Q2 2025", enterprise: 310, smb: 180, startup: 90 },
  { q: "Q3 2025", enterprise: 370, smb: 210, startup: 115 },
  { q: "Q4 2025", enterprise: 440, smb: 245, startup: 130 },
]

const driverAvgLap = [
  { driver: "LEC", avg: 88.4 },
  { driver: "SAI", avg: 89.1 },
  { driver: "VER", avg: 87.9 },
  { driver: "HAM", avg: 90.3 },
  { driver: "NOR", avg: 89.7 },
]

const pitStopData = [
  { team: "Ferrari",  avg: 2.4, fastest: 2.1 },
  { team: "Mclaren",  avg: 2.6, fastest: 2.3 },
  { team: "Mercedes", avg: 2.7, fastest: 2.4 },
  { team: "Alpine",   avg: 2.9, fastest: 2.6 },
  { team: "Haas",     avg: 3.1, fastest: 2.8 },
]

function widgetFromPrompt(prompt: string): DynamicWidget {
  const p = prompt.toLowerCase()
  const id = `dyn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  if (p.includes("arr") || p.includes("mrr") || p.includes("trend"))
    return { id, title: "Monthly ARR Growth", subtitle: prompt, chartType: "area" }
  if (p.includes("pipeline") || p.includes("stage") || p.includes("funnel"))
    return { id, title: "Pipeline by Stage", subtitle: prompt, chartType: "bar" }
  if (p.includes("quota") || p.includes("attainment") || p.includes("rep"))
    return { id, title: "Quota Attainment by Rep", subtitle: prompt, chartType: "bar" }
  if (p.includes("deal") || p.includes("velocity") || p.includes("days"))
    return { id, title: "Deal Velocity by Segment", subtitle: prompt, chartType: "line" }
  if (p.includes("churn") || p.includes("retention"))
    return { id, title: "Retention by Segment", subtitle: prompt, chartType: "line" }
  if (p.includes("product") || p.includes("segment") || p.includes("breakdown"))
    return { id, title: "Revenue by Product Line", subtitle: prompt, chartType: "bar" }
  if (p.includes("region") || p.includes("geo") || p.includes("territory"))
    return { id, title: "Revenue by Region", subtitle: prompt, chartType: "bar" }
  return {
    id,
    title: prompt.length > 42 ? prompt.slice(0, 39) + "…" : prompt,
    subtitle: "Generated visualization",
    chartType: "bar",
  }
}

function DynamicWidgetChart({ widget }: { widget: DynamicWidget }) {
  const t = widget.title.toLowerCase()
  if (t.includes("arr") || t.includes("trend")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revTrendData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
          <defs>
            <linearGradient id="dynActualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#5F7281" }} interval={1} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Area type="monotone" dataKey="actual" stroke={C.blue} fill="url(#dynActualGrad)" strokeWidth={2} name="Actual ($M)" connectNulls />
          <Area type="monotone" dataKey="forecast" stroke={C.teal} fill="transparent" strokeWidth={2} strokeDasharray="4 3" name="Forecast ($M)" connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("pipeline") || t.includes("stage")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pipelineStageData} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: "#5F7281" }} width={72} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Bar dataKey="value" fill={C.blue} radius={[0, 2, 2, 0]} name="Value ($M)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("quota") || t.includes("attainment")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={quotaAttainmentData} margin={{ top: 8, right: 4, bottom: 24, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis dataKey="rep" tick={{ fontSize: 10, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} domain={[0, 140]} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Bar dataKey="attainment" fill={C.teal} radius={[2, 2, 0, 0]} name="Attainment %" />
          <Bar dataKey="quota" fill="#E8ECF0" radius={[2, 2, 0, 0]} name="Target (100%)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("deal") || t.includes("velocity")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dealVelocityLine} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
          <Line type="monotone" dataKey="Enterprise" stroke={C.blue}   strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Midmarket"  stroke={C.teal}   strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="SMB"        stroke={C.yellow} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("retention") || t.includes("churn")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={retentionTrendData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} domain={[80, 100]} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
          <Line type="monotone" dataKey="Enterprise" stroke={C.blue}   strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Midmarket"  stroke={C.teal}   strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="SMB"        stroke={C.yellow} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  // Default: revenue by product bar
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={revByProductData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5F7281" }} />
        <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
        <Bar dataKey="value" fill={C.blue} radius={[2, 2, 0, 0]} name="Revenue ($k)" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Genie "modify" footer (appears on copied widgets) ───────────────────────

function GenieModifyInput({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [q, setQ] = React.useState("")
  const submit = () => { if (q.trim()) { onSubmit(q.trim()); setQ("") } }
  return (
    <div className="flex flex-col gap-2 rounded-b-md border-t border-dashed border-border bg-secondary/30 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <DbIcon icon={SparkleIcon} color="ai" size={12} className="shrink-0" />
        <span className="text-[11px] font-semibold text-foreground">What would you like to modify?</span>
      </div>
      <div className="flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-primary/40">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit() }}
          placeholder="e.g. Show as line chart, filter by Ferrari…"
          className="flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={submit}
          disabled={!q.trim()}
          className={cn("shrink-0 transition-colors", q.trim() ? "text-primary hover:text-primary/70" : "text-muted-foreground/30")}
        >
          <SendIcon size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Static widget chart content lookup ──────────────────────────────────────

function StaticOrDynamicWidget({
  id,
  dynWidget,
  onModify,
}: {
  id: string
  dynWidget?: DynamicWidget
  onModify: (id: string, query: string) => void
}) {
  if (dynWidget) {
    return (
      <div className="flex flex-col">
        <ChartCard id={id} title={dynWidget.title} subtitle={dynWidget.subtitle}>
          <DynamicWidgetChart widget={dynWidget} />
        </ChartCard>
        {dynWidget.pendingModify && (
          <GenieModifyInput onSubmit={(q) => onModify(id, q)} />
        )}
      </div>
    )
  }
  switch (id) {
    case "rev-trend":
      return (
        <ChartCard id="rev-trend" title="Revenue Trend" subtitle="Actuals vs forecast — last 6 months + next 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revTrendData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#5F7281" }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "$M", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Area type="monotone" dataKey="actual"   stroke={C.blue} fill="url(#actualGrad)" strokeWidth={2} dot={false} name="Actual ($M)" connectNulls />
              <Area type="monotone" dataKey="forecast" stroke={C.teal} fill="transparent" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Forecast ($M)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "rev-by-product":
      return (
        <ChartCard id="rev-by-product" title="Revenue by Product Line" subtitle="Breakdown of revenue across product lines for the current period.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revByProductData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "$k", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Bar dataKey="value" fill={C.blue} radius={[2, 2, 0, 0]} name="Revenue ($k)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "pipeline-stage":
      return (
        <ChartCard id="pipeline-stage" title="Pipeline by Stage" subtitle="Total pipeline value and deal count at each stage of the funnel.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineStageData} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "$M", position: "insideBottomRight", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Bar dataKey="value" fill={C.teal} radius={[0, 2, 2, 0]} name="Value ($M)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "quota-attain":
      return (
        <ChartCard id="quota-attain" title="Quota Attainment by Rep" subtitle="Attainment percentage vs 100% quota target — current quarter.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotaAttainmentData} margin={{ top: 8, right: 4, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="rep" tick={{ fontSize: 10, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} domain={[0, 140]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Bar dataKey="attainment" fill={C.blue}  radius={[2, 2, 0, 0]} name="Attainment %" />
              <Bar dataKey="quota"      fill="#E8ECF0" radius={[2, 2, 0, 0]} name="Target (100%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "deal-velocity":
      return (
        <ChartCard id="deal-velocity" title="Deal Velocity by Segment" subtitle="Average days to close by customer segment over the last 6 months.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dealVelocityLine} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Days", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Enterprise" stroke={C.blue}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Midmarket"  stroke={C.teal}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SMB"        stroke={C.yellow} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "rev-flow":
      return (
        <ChartCard id="rev-flow" title="Revenue Flow" subtitle="Product Line → Customer Segment → Region">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              margin={{ top: 16, right: 8, bottom: 8, left: 8 }}
              nodePadding={6}
              nodeWidth={12}
              link={{ stroke: "#E8ECF0", strokeOpacity: 0.5 }}
              node={({ x, y, width, height, index, payload }: {
                x: number; y: number; width: number; height: number; index: number; payload: { name: string }
              }) => {
                const color = SANKEY_COLORS[payload.name] ?? "#5F7281"
                return (
                  <Layer key={`node-${index}`}>
                    <Rectangle
                      x={x} y={y} width={width} height={height}
                      fill={color} fillOpacity={0.9} radius={2}
                    />
                    <text
                      x={width > 0 ? x + width + 5 : x - 5}
                      y={y + height / 2}
                      textAnchor={width > 0 ? "start" : "end"}
                      dominantBaseline="middle"
                      fontSize={9}
                      fill="#5F7281"
                    >
                      {payload.name}
                    </text>
                  </Layer>
                )
              }}
            />
          </ResponsiveContainer>
        </ChartCard>
      )
    case "retention":
      return (
        <ChartCard id="retention" title="Retention by Segment" subtitle="Monthly retention rate by customer segment.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionTrendData} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} domain={[80, 100]} label={{ value: "%", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Enterprise" stroke={C.blue}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Midmarket"  stroke={C.teal}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SMB"        stroke={C.yellow} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    default:
      return null
  }
}

// ─── New widget Genie card ────────────────────────────────────────────────────

const NEW_VIZ_SUGGESTIONS = [
  "Monthly ARR growth over 12 months",
  "Pipeline value by stage",
  "Quota attainment by rep",
  "Deal velocity by segment",
]

function getPlan(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("arr") || p.includes("mrr") || p.includes("trend"))
    return "I'll create an area chart showing monthly ARR actuals vs. forecast using the ml.revenue_forecast table. Does this look right?"
  if (p.includes("pipeline") || p.includes("funnel") || p.includes("stage"))
    return "I'll build a horizontal bar chart showing pipeline value by stage using salesforce.opportunities. Does this look right?"
  if (p.includes("quota") || p.includes("attainment") || p.includes("rep"))
    return "I'll create a grouped bar chart comparing quota attainment vs. target by sales rep using salesforce.quotas. Does this look right?"
  if (p.includes("churn") || p.includes("retention"))
    return "I'll create a line chart showing monthly retention rates by customer segment from customers.subscriptions. Does this look right?"
  if (p.includes("region") || p.includes("geo"))
    return "I'll build a bar chart showing revenue by region from salesforce.opportunities. Does this look right?"
  return `I'll build a chart for \"${prompt}\" using the salesforce.opportunities and ml.revenue_forecast tables. Does this look right?`
}

function NewWidgetGenieCard({ onAdd }: { onAdd: (prompt: string) => void }) {
  const [query, setQuery] = React.useState("")
  const [pending, setPending] = React.useState<string | null>(null)
  const [plan, setPlan] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const proposePlan = (text: string) => {
    if (!text.trim()) return
    setPending(text.trim())
    setPlan(getPlan(text.trim()))
    setQuery("")
  }

  const confirm = () => {
    if (pending) {
      onAdd(pending)
      setPending(null)
      setPlan("")
    }
  }

  const cancel = () => {
    setPending(null)
    setPlan("")
  }

  if (pending) {
    return (
      <div className="flex h-[232px] flex-col rounded-md border-2 border-dashed border-primary/40 bg-primary/5 transition-colors">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-dashed border-primary/20 px-3 py-2.5">
          <DbIcon icon={SparkleIcon} color="ai" size={14} className="shrink-0" />
          <span className="text-xs font-semibold text-foreground">Genie's Plan</span>
        </div>

        {/* Plan text */}
        <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3">
          <p className="text-xs leading-relaxed text-foreground">{plan}</p>
          <div className="flex gap-2">
            <button
              onClick={confirm}
              className="flex-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={cancel}
              className="rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Edit
            </button>
          </div>
          <button onClick={cancel} className="text-center text-[10px] text-muted-foreground/60 hover:text-muted-foreground">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[232px] flex-col rounded-md border-2 border-dashed border-border bg-background transition-colors hover:border-primary/30">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-dashed border-border px-3 py-2.5">
        <DbIcon icon={SparkleIcon} color="ai" size={14} className="shrink-0" />
        <span className="text-xs font-semibold text-foreground">Build with Genie</span>
      </div>

      {/* Suggestions */}
      <div className="flex flex-1 flex-col justify-center gap-2 px-3 py-2">
        {NEW_VIZ_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => proposePlan(s)}
            className="group relative w-full rounded px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-secondary"
            style={{ background: "transparent", outline: "none" }}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded"
              style={{
                padding: "1px",
                background: "linear-gradient(90deg, #4299E0 0%, #CA42E0 50%, #FF5F46 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            <span className="relative z-10 line-clamp-1">{s}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex shrink-0 items-center gap-1.5 border-t border-dashed border-border px-3 py-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") proposePlan(query) }}
          placeholder="Or describe a custom chart…"
          className="flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={() => proposePlan(query)}
          disabled={!query.trim()}
          className={cn(
            "shrink-0 transition-colors",
            query.trim() ? "text-primary hover:text-primary/70" : "text-muted-foreground/30"
          )}
        >
          <SendIcon size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Widget config pane (edit mode) ──────────────────────────────────────────

const VIZ_TYPES = ["Line", "Bar", "Area", "Scatter", "Table", "Counter"]

function WidgetConfigPane({
  widgetId,
  noHeader = false,
}: {
  widgetId: string | null
  noHeader?: boolean
}) {
  const [vizType, setVizType]       = React.useState("Line")
  const [showVizDrop, setShowVizDrop] = React.useState(false)
  const [showTitle, setShowTitle]   = React.useState(true)
  const [showDesc, setShowDesc]     = React.useState(false)
  const [labelsOn, setLabelsOn]     = React.useState(false)

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      {!noHeader && (
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-3">
        <Settings2 size={14} className="text-muted-foreground" />
        <span className="flex-1 text-sm font-semibold text-foreground">Widget</span>
        <Button variant="ghost" size="icon-xs">
          <OverflowIcon size={14} className="text-muted-foreground" />
        </Button>
      </div>
      )}

      {widgetId ? (
        <div className="flex flex-col divide-y divide-border">

          {/* Title / Description checkboxes */}
          <div className="flex items-center gap-4 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-foreground">
              <input
                type="checkbox"
                checked={showTitle}
                onChange={(e) => setShowTitle(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Title
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={showDesc}
                onChange={(e) => setShowDesc(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Description
            </label>
          </div>

          {/* Dataset */}
          <div className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Dataset</span>
              <button className="text-[11px] text-primary hover:underline">Hide filters</button>
            </div>
            <div className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground">
              <span>Flights_200K</span>
              <ChevronDownIcon size={12} className="text-muted-foreground" />
            </div>
          </div>

          {/* Filter fields */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Filter fields</span>
            <Button variant="ghost" size="icon-xs">
              <PlusIcon size={13} className="text-muted-foreground" />
            </Button>
          </div>

          {/* Visualization */}
          <div className="relative flex flex-col gap-2 px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Visualization</span>
            <button
              onClick={() => setShowVizDrop((v) => !v)}
              className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-secondary"
            >
              <div className="flex items-center gap-1.5">
                <BarChart2 size={12} className="text-muted-foreground" />
                <span>{vizType}</span>
              </div>
              <ChevronDownIcon size={12} className="text-muted-foreground" />
            </button>
            {showVizDrop && (
              <div className="absolute left-4 right-4 top-[68px] z-20 rounded border border-border bg-background shadow-md">
                {VIZ_TYPES.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setVizType(v); setShowVizDrop(false) }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-secondary",
                      v === vizType && "text-primary font-semibold"
                    )}
                  >
                    {v === vizType && <Check size={10} />}
                    {v !== vizType && <span className="w-[10px]" />}
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* X axis */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold text-foreground">X axis</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-xs"><OverflowIcon size={13} className="text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon-xs"><PlusIcon size={13} className="text-muted-foreground" /></Button>
            </div>
          </div>

          {/* Y axis */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Y axis</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-xs"><OverflowIcon size={13} className="text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon-xs"><PlusIcon size={13} className="text-muted-foreground" /></Button>
            </div>
          </div>

          {/* Color By */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Color By</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-primary" />
              <Button variant="ghost" size="icon-xs"><PlusIcon size={13} className="text-muted-foreground" /></Button>
            </div>
          </div>

          {/* Labels */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Labels</span>
            <button
              onClick={() => setLabelsOn((v) => !v)}
              className={cn("relative h-5 w-9 rounded-full transition-colors", labelsOn ? "bg-primary" : "bg-border")}
            >
              <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", labelsOn ? "translate-x-4" : "translate-x-0.5")} />
            </button>
          </div>

        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <BarChart2 size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">No widget selected</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Click any widget on the canvas to configure it here.</p>
          </div>
        </div>
      )}
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
    <div className="relative flex h-6 w-full items-center">
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
  const router = useRouter()
  const [activeNav, setActiveNav]   = React.useState("dashboards")
  const [aiOpen, setAiOpen]         = React.useState(false)
  const [rightTab, setRightTab]     = React.useState<"genie" | "config">("genie")
  const [revenueRange, setRevenueRange] = React.useState<[number, number]>([1, 8])
  const [showTireWidget, setShowTireWidget] = React.useState(false)
  const [activeTab, setActiveTab]   = React.useState("overview")
  const [editMode, setEditMode]         = React.useState(true)
  const [selectedWidgetId, setSelectedWidgetId] = React.useState<string | null>(null)
  const [dynamicWidgets, setDynamicWidgets] = React.useState<DynamicWidget[]>([])

  // Floating suggestion pill — view mode
  const [askGenieVisible, setAskGenieVisible]   = React.useState(true)
  const [askGenieEditing, setAskGenieEditing]   = React.useState(false)
  const [askGenieQuery, setAskGenieQuery]       = React.useState("")
  const [pendingQuery, setPendingQuery]         = React.useState<string | undefined>(undefined)

  // Floating suggestion pill — edit mode
  const [editPillVisible, setEditPillVisible]   = React.useState(true)
  const [editPillEditing, setEditPillEditing]   = React.useState(false)
  const [editPillQuery, setEditPillQuery]       = React.useState("")

  // Auto-switch tabs: selecting a widget in edit mode → Config tab; clearing → back to Genie
  React.useEffect(() => {
    if (selectedWidgetId && editMode) {
      setAiOpen(true)
      setRightTab("config")
    } else if (!selectedWidgetId && rightTab === "config") {
      setRightTab("genie")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWidgetId, editMode])

  const submitAskGenie = React.useCallback((override?: string) => {
    const q = (override ?? askGenieQuery).trim()
    if (!q) return
    setPendingQuery(q)
    setAskGenieQuery("")
    setAskGenieEditing(false)
    setAiOpen(true)
  }, [askGenieQuery])

  // Unified ordered widget list (static + dynamic IDs)
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>([
    "rev-trend", "rev-by-product", "pipeline-stage", "quota-attain", "deal-velocity", "rev-flow",
  ])

  // Drag-and-drop state
  const [dragFrom, setDragFrom] = React.useState<number | null>(null)
  const [dragOver, setDragOver] = React.useState<number | null>(null)

  // Widget actions
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const copyWidget = React.useCallback((id: string, idx: number) => {
    const dynWidget = dynamicWidgets.find((w) => w.id === id)
    const meta = dynWidget ?? STATIC_WIDGET_META[id] ?? { title: "Copy", subtitle: "", chartType: "bar" as const }
    const newId = `copy-${id}-${Date.now()}`
    const newWidget: DynamicWidget = {
      id: newId,
      title: meta.title,
      subtitle: meta.subtitle,
      chartType: meta.chartType,
      sourceId: id,
      pendingModify: true,
    }
    setDynamicWidgets((prev) => [...prev, newWidget])
    setWidgetOrder((prev) => {
      const next = [...prev]
      next.splice(idx + 1, 0, newId)
      return next
    })
  }, [dynamicWidgets])

  const deleteWidget = React.useCallback((id: string) => {
    setWidgetOrder((prev) => prev.filter((wid) => wid !== id))
    setDynamicWidgets((prev) => prev.filter((w) => w.id !== id))
    setDeletingId(null)
  }, [])

  const handleModifyWidget = React.useCallback((id: string, query: string) => {
    setDynamicWidgets((prev) => prev.map((w) => {
      if (w.id !== id) return w
      const updated = widgetFromPrompt(query)
      return { ...updated, id: w.id, sourceId: w.sourceId, pendingModify: false }
    }))
  }, [])

  const handleDragStart = (idx: number) => setDragFrom(idx)
  const handleDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOver(idx) }
  const handleDrop      = (idx: number) => {
    if (dragFrom === null || dragFrom === idx) { setDragFrom(null); setDragOver(null); return }
    const next = [...widgetOrder]
    const [item] = next.splice(dragFrom, 1)
    next.splice(idx, 0, item)
    setWidgetOrder(next)
    setDragFrom(null)
    setDragOver(null)
  }
  const handleDragEnd = () => { setDragFrom(null); setDragOver(null) }

  const enterEditMode = (keepAiOpen = false) => {
    setEditMode(true)
    if (!keepAiOpen) setAiOpen(false)
    setAskGenieVisible(true)
    setEditPillVisible(true); setEditPillEditing(false); setEditPillQuery("")
  }
  const exitEditMode = () => {
    setEditMode(false); setSelectedWidgetId(null)
    setAskGenieVisible(true)
  }

  const addWidget = React.useCallback((prompt: string) => {
    const w = widgetFromPrompt(prompt)
    setDynamicWidgets((prev) => [...prev, w])
    setWidgetOrder((prev) => [...prev, w.id])
    setSelectedWidgetId(w.id)
  }, [])


  return (
    <EditModeContext.Provider value={{ editMode, selectedId: selectedWidgetId, onSelect: setSelectedWidgetId }}>
    <AppShell
      activeItem={activeNav}
      onNavigate={setActiveNav}
      onAiClick={() => {
        if (aiOpen && rightTab === "genie") { setAiOpen(false) }
        else { setAiOpen(true); setRightTab("genie") }
      }}
      aiActive={aiOpen}
    >
      <div className="flex h-full overflow-hidden">

        {/* ── Main dashboard area ───────────────────────────────────────── */}
        <div className={cn("relative flex flex-1 flex-col", editMode ? "overflow-hidden" : "overflow-y-auto")}>

          {/* Page header */}
          <div className={cn(
            "flex shrink-0 items-center gap-3 border-b border-border px-6 py-3",
            editMode && "bg-primary/5"
          )}>
            <h1 className="text-lg font-semibold text-foreground">Revenue Forecast</h1>
            <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
              <Star size={14} />
            </button>

            {!editMode ? (
              <Button variant="outline" size="xs" className="gap-1.5" onClick={() => enterEditMode()}>
                <Pencil size={11} />
                Edit draft
              </Button>
            ) : (
              <Button variant="outline" size="xs" className="gap-1.5 text-muted-foreground" onClick={exitEditMode}>
                View Published
              </Button>
            )}

            <div className="ml-auto flex items-center gap-3">
              {!editMode ? (
                <>
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
                </>
              ) : (
                <>
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
                  <Button
                    size="xs"
                    className="gap-1.5"
                    onClick={exitEditMode}
                  >
                    <Check size={11} />
                    Publish
                  </Button>
                  <Button variant="outline" size="xs" className="gap-1.5">
                    <Share2 size={12} />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0 items-center gap-0 border-b border-border px-6">
            {[
              { id: "overview",  label: "Overview" },
              { id: "pipeline",  label: "Pipeline" },
              { id: "regional",  label: "Regional" },
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

          {/* ── Top section: filter sidebar + KPI cards ── */}
          <div className="flex shrink-0 gap-5 border-b border-border bg-muted/20 px-6 py-5">

            {/* Left filter panel */}
            <div className="flex w-[210px] shrink-0 flex-col gap-5 rounded-md border border-border bg-background p-4 shadow-[var(--shadow-db-sm)]">
              {/* Product Line */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Product Line</label>
                <button className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors">
                  All Products
                  <ChevronDown size={11} className="text-muted-foreground" />
                </button>
              </div>
              {/* Segment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Segment</label>
                <button className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors">
                  All Segments
                  <ChevronDown size={11} className="text-muted-foreground" />
                </button>
              </div>
              {/* Date range */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Date range</label>
                <div className="flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground">
                  Oct 1, 2025
                  <span className="mx-1 text-muted-foreground">→</span>
                  Sep 30, 2026
                  <CalendarIcon size={11} className="ml-auto text-muted-foreground" />
                </div>
              </div>
              {/* Revenue range */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground">Revenue range ($M)</label>
                </div>
                <RangeSlider min={0} max={10} value={revenueRange} onChange={setRevenueRange} />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>${revenueRange[0]}M</span>
                  <span>${revenueRange[1]}M</span>
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid flex-1 grid-cols-3 gap-4">
              {([
                { label: "6-Mo Forecast",  period: "Apr – Sep 2026", value: "$30.2M", delta: "+11%", compare: "$27.2M • prior period", spark: kpiSpark1, color: C.blue  },
                { label: "Win Rate",        period: "Current quarter", value: "42%",    delta: "+4pp", compare: "38% • last quarter",   spark: kpiSpark2, color: C.teal  },
                { label: "Quota Attainment",period: "Current quarter", value: "95%",    delta: "+2pp", compare: "93% • last quarter",   spark: kpiSpark3, color: C.green },
              ] as const).map((kpi) => (
                <div key={kpi.label} className="relative flex flex-col justify-between overflow-hidden rounded-md border border-border bg-background p-4 shadow-[var(--shadow-db-sm)]">
                  {/* Sparkline in top-right */}
                  <div className="pointer-events-none absolute right-0 top-0 h-full w-3/5 opacity-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpi.spark}>
                        <defs>
                          <linearGradient id={`kpiGrad-${kpi.label}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={kpi.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={1.5} fill={`url(#kpiGrad-${kpi.label})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Top label */}
                  <div className="relative z-10">
                    <p className="text-[11px] text-muted-foreground">{kpi.period}</p>
                  </div>
                  {/* Bottom value */}
                  <div className="relative z-10 mt-3">
                    <p className="text-2xl font-bold leading-none text-foreground tabular-nums">{kpi.value}</p>
                    <p className="mt-1.5 text-[11px] font-medium text-[var(--success)]">
                      {kpi.delta} vs {kpi.compare}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts grid — single flat grid-cols-3, drag-and-drop in edit mode */}
          <div className={cn("bg-muted/20 p-6", editMode && "flex-1 overflow-y-auto")}>
            <div className="grid grid-cols-3 gap-5">

              {/* Render all widgets in order — draggable in edit mode */}
              {widgetOrder.map((id, idx) => {
                const dynWidget = dynamicWidgets.find((w) => w.id === id)
                const isNew = dynWidget !== undefined || id === "tire-deg"
                const isDragTarget = dragOver === idx && dragFrom !== idx
                const isBeingDragged = dragFrom === idx
                const isDeleting = deletingId === id

                return (
                  <div
                    key={id}
                    draggable={editMode && !isDeleting}
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group relative transition-all",
                      editMode && !isDeleting && "cursor-grab active:cursor-grabbing",
                      isBeingDragged && "opacity-40 scale-95",
                      isDragTarget && "ring-2 ring-primary ring-offset-1 rounded-md",
                    )}
                  >
                    {/* "New" badge */}
                    {isNew && !isDeleting && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <Badge variant="teal" className="text-[10px]">New</Badge>
                      </div>
                    )}

                    {/* Copy / Delete hover buttons (edit mode only) */}
                    {editMode && !isDeleting && (
                      <div
                        className="absolute right-1.5 top-1.5 z-20 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); copyWidget(id, idx) }}
                          title="Copy widget"
                          className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background shadow-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Copy size={11} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeletingId(id) }}
                          title="Delete widget"
                          className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background shadow-sm text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}

                    {/* Delete confirmation overlay */}
                    {isDeleting && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-background/97 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle size={16} className="text-red-500" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">Delete this widget?</span>
                          <span className="text-xs text-muted-foreground">This can't be undone.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="xs" onClick={() => setDeletingId(null)}>
                            Cancel
                          </Button>
                          <Button
                            size="xs"
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => deleteWidget(id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}

                    <StaticOrDynamicWidget id={id} dynWidget={dynWidget} onModify={handleModifyWidget} />
                  </div>
                )
              })}


            </div>
          </div>

          {/* ── Floating Genie suggestion (view mode) ────────────────────── */}
          {!editMode && askGenieVisible && (
            <div className="pointer-events-none fixed inset-x-0 bottom-6 flex items-end justify-center z-40">
              <div className="pointer-events-auto group/pill flex items-center gap-2">

                {/* Pill */}
                <div
                  className="flex items-center rounded-full shadow-xl"
                  style={{
                    background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #4299E0, #CA42E0, #FF5F46) border-box",
                    border: "1.5px solid transparent",
                  }}
                >
                  {/* Sparkle */}
                  <span className="flex shrink-0 items-center pl-4 pr-2 py-0">
                    <svg viewBox="0 0 16 16" width={12} height={12}>
                      <defs>
                        <linearGradient id="floatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4299E0" /><stop offset="50%" stopColor="#CA42E0" /><stop offset="100%" stopColor="#FF5F46" />
                        </linearGradient>
                      </defs>
                      <path d="M8 0.5L9.3 6.7L15.5 8L9.3 9.3L8 15.5L6.7 9.3L0.5 8L6.7 6.7Z" fill="url(#floatGrad)" />
                    </svg>
                  </span>

                  {/* Text / editable input — always an input, placeholder shows suggestion */}
                  {askGenieEditing ? (
                    <input
                      autoFocus
                      value={askGenieQuery}
                      onChange={(e) => setAskGenieQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitAskGenie()
                        if (e.key === "Escape") { setAskGenieEditing(false); setAskGenieQuery("") }
                      }}
                      placeholder="Which rep has the highest quota attainment?"
                      className="w-[300px] bg-transparent py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
                    />
                  ) : (
                    <button
                      onClick={() => { setAskGenieEditing(true); setAskGenieQuery("") }}
                      className="py-2.5 pr-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                    >
                      Which rep has the highest quota attainment?
                    </button>
                  )}

                  {/* Gradient send circle */}
                  <button
                    onClick={() => askGenieEditing ? submitAskGenie() : submitAskGenie("Which rep has the highest quota attainment?")}
                    disabled={askGenieEditing && !askGenieQuery.trim()}
                    className={cn(
                      "my-1.5 mr-1.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95",
                      askGenieEditing && !askGenieQuery.trim() ? "opacity-40 cursor-not-allowed" : ""
                    )}
                    style={{ background: "linear-gradient(135deg, #4299E0 0%, #CA42E0 60%, #FF5F46 100%)" }}
                  >
                    <SendIcon size={11} className="text-white" />
                  </button>
                </div>

                {/* Dismiss X — visible on group hover */}
                <button
                  onClick={() => { setAskGenieVisible(false); setAskGenieEditing(false); setAskGenieQuery("") }}
                  title="Dismiss"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 shadow-sm transition-all hover:text-foreground group-hover/pill:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          )}

          {/* ── Floating Genie suggestion (edit mode) ────────────────────── */}
          {editMode && editPillVisible && (
            <div className="pointer-events-none fixed inset-x-0 bottom-[80px] flex items-end justify-center z-40">
              <div className="pointer-events-auto group/editpill flex items-center gap-2">

                {/* Pill */}
                <div
                  className="flex items-center rounded-full shadow-lg"
                  style={{
                    background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #4299E0, #CA42E0, #FF5F46) border-box",
                    border: "1.5px solid transparent",
                  }}
                >
                  {/* Sparkle */}
                  <span className="flex shrink-0 items-center pl-4 pr-2 py-0">
                    <svg viewBox="0 0 16 16" width={12} height={12}>
                      <defs>
                        <linearGradient id="editFloatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4299E0" /><stop offset="50%" stopColor="#CA42E0" /><stop offset="100%" stopColor="#FF5F46" />
                        </linearGradient>
                      </defs>
                      <path d="M8 0.5L9.3 6.7L15.5 8L9.3 9.3L8 15.5L6.7 9.3L0.5 8L6.7 6.7Z" fill="url(#editFloatGrad)" />
                    </svg>
                  </span>

                  {/* Text / editable input */}
                  {editPillEditing ? (
                    <input
                      autoFocus
                      value={editPillQuery}
                      onChange={(e) => setEditPillQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (editPillQuery.trim()) {
                            submitAskGenie(editPillQuery.trim())
                            setEditPillEditing(false)
                            setEditPillQuery("")
                          }
                        }
                        if (e.key === "Escape") { setEditPillEditing(false); setEditPillQuery("") }
                      }}
                      placeholder="What should we update on this forecast?"
                      className="w-[300px] bg-transparent py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
                    />
                  ) : (
                    <button
                      onClick={() => { setEditPillEditing(true); setEditPillQuery("") }}
                      className="py-2.5 pr-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                    >
                      What should we update on this forecast today?
                    </button>
                  )}

                  {/* Gradient send circle */}
                  <button
                    onClick={() => {
                      const q = editPillQuery
                      if (q.trim()) {
                        submitAskGenie(q.trim())
                        setEditPillEditing(false)
                        setEditPillQuery("")
                      }
                    }}
                    disabled={editPillEditing && !editPillQuery.trim()}
                    className={cn(
                      "my-1.5 mr-1.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95",
                      editPillEditing && !editPillQuery.trim() ? "opacity-40 cursor-not-allowed" : ""
                    )}
                    style={{ background: "linear-gradient(135deg, #4299E0 0%, #CA42E0 60%, #FF5F46 100%)" }}
                  >
                    <SendIcon size={11} className="text-white" />
                  </button>
                </div>

                {/* Dismiss X — visible on group hover */}
                <button
                  onClick={() => { setEditPillVisible(false); setEditPillEditing(false); setEditPillQuery("") }}
                  title="Dismiss"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 shadow-sm transition-all hover:text-foreground group-hover/editpill:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          )}

          {/* ── Edit mode widget toolbar (floating pill) ─────────────────── */}
          {editMode && (
            <div className="pointer-events-none fixed inset-x-0 bottom-5 flex justify-center z-40">
              <div
                className="pointer-events-auto flex items-center gap-0.5 rounded-2xl border border-border bg-background px-2 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              >
                {/* Genie sparkle — re-shows the floating pill */}
                <button
                  title="Ask Genie"
                  onClick={() => setEditPillVisible(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-secondary"
                  style={{ background: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)" }}
                >
                  <svg viewBox="0 0 16 16" width={15} height={15}>
                    <defs>
                      <linearGradient id="tbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4299E0" />
                        <stop offset="50%" stopColor="#CA42E0" />
                        <stop offset="100%" stopColor="#FF5F46" />
                      </linearGradient>
                    </defs>
                    <path d="M8 0.5L9.3 6.7L15.5 8L9.3 9.3L8 15.5L6.7 9.3L0.5 8L6.7 6.7Z" fill="url(#tbGrad)" />
                  </svg>
                </button>

                <div className="mx-1.5 h-5 w-px bg-border" />

                {/* Select */}
                <button title="Select" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <MousePointer2 size={16} strokeWidth={1.6} />
                </button>
                {/* Visualization */}
                <button title="Add visualization" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1,12 5,7 9,10 13,4 15,6" />
                  </svg>
                </button>
                {/* Text */}
                <button title="Add text" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="12" height="12" rx="1.5" />
                    <text x="8" y="11.5" fontSize="7" fontWeight="600" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="sans-serif">T</text>
                  </svg>
                </button>
                {/* Filter */}
                <button title="Filter" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 3h13l-5 6v4l-3-1.5V9L1.5 3z"/>
                  </svg>
                </button>

                <div className="mx-1.5 h-5 w-px bg-border" />

                {/* Undo */}
                <button title="Undo" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <Undo2 size={15} strokeWidth={1.6} />
                </button>
                {/* Redo */}
                <button title="Redo" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-secondary hover:text-foreground">
                  <Redo2 size={15} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Unified right panel (Genie + Widget Config tabs) ─────────── */}
        {aiOpen && (
          <div className="mb-2 mr-2 flex w-[340px] shrink-0 flex-col overflow-hidden rounded-md border border-border bg-background">

            {/* ── Tab bar ─────────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center border-b border-border">

              {/* Genie tab */}
              <button
                onClick={() => setRightTab("genie")}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
                  rightTab === "genie"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <svg viewBox="0 0 20 20" width={12} height={12} style={{ fill: rightTab === "genie" ? "url(#tabGrad)" : "currentColor", flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="tabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4299E0" />
                      <stop offset="50%" stopColor="#CA42E0" />
                      <stop offset="100%" stopColor="#FF5F46" />
                    </linearGradient>
                  </defs>
                  <path d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z" />
                </svg>
                Genie
              </button>

              {/* Widget Config tab — only in edit mode */}
              {editMode && (
                <button
                  onClick={() => setRightTab("config")}
                  className={cn(
                    "relative flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
                    rightTab === "config"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Settings2 size={12} />
                  Widget
                  {/* Dot badge when a widget is selected */}
                  {selectedWidgetId && (
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      rightTab === "config" ? "bg-primary" : "bg-primary/60"
                    )} />
                  )}
                </button>
              )}

              {/* Spacer + actions */}
              <div className="ml-auto flex items-center gap-0.5 pr-2">
                {rightTab === "genie" && (
                  <Button
                    variant="ghost" size="icon-xs"
                    title="Open full Genie experience"
                    onClick={() => {
                      // store msgs via a dummy call — we pass a no-op here; expand is handled inside AiPanel
                      try {
                        sessionStorage.setItem("genie:pendingThread", JSON.stringify({
                          id: `f1-${Date.now()}`,
                          title: "Formula One Dashboard",
                          source: "F1 Dashboard",
                          msgs: [],
                        }))
                      } catch {}
                      router.push("/genie")
                    }}
                  >
                    <Maximize2 size={12} className="text-muted-foreground" />
                  </Button>
                )}
                <Button
                  variant="ghost" size="icon-xs"
                  onClick={() => { setAiOpen(false); setPendingQuery(undefined); setRightTab("genie") }}
                >
                  <CloseIcon size={13} className="text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* ── Genie tab content ────────────────────────────────────────── */}
            <div className={cn("flex flex-1 flex-col overflow-hidden", rightTab !== "genie" && "hidden")}>
              <AiPanel
                noHeader
                onClose={() => { setAiOpen(false); setPendingQuery(undefined); setRightTab("genie") }}
                onExpand={(msgs) => {
                  try {
                    sessionStorage.setItem("genie:pendingThread", JSON.stringify({
                      id: `f1-${Date.now()}`,
                      title: "Formula One Dashboard",
                      source: "F1 Dashboard",
                      msgs,
                    }))
                  } catch {}
                  router.push("/genie")
                }}
                onEnterEditMode={() => enterEditMode(true)}
                onAddWidget={(prompt, reportSteps) => {
                  const steps = (s1: AgentStep["status"], s2: AgentStep["status"], s3: AgentStep["status"]): AgentStep[] => [
                    { label: "Switching dashboard to edit mode", status: s1 },
                    { label: "Generating widget configuration", status: s2 },
                    { label: "Adding widget to canvas", status: s3 },
                  ]
                  enterEditMode(true)
                  reportSteps(steps("running", "pending", "pending"))
                  setTimeout(() => {
                    reportSteps(steps("done", "running", "pending"))
                    setTimeout(() => {
                      reportSteps(steps("done", "done", "running"))
                      addWidget(prompt)
                      setTimeout(() => {
                        reportSteps(steps("done", "done", "done"))
                      }, 500)
                    }, 800)
                  }, 700)
                }}
                initialQuery={pendingQuery}
              />
            </div>

            {/* ── Widget Config tab content ────────────────────────────────── */}
            {editMode && (
              <div className={cn("flex flex-1 flex-col overflow-hidden", rightTab !== "config" && "hidden")}>
                <WidgetConfigPane noHeader widgetId={selectedWidgetId} />
              </div>
            )}

          </div>
        )}

      </div>
    </AppShell>
    </EditModeContext.Provider>
  )
}
