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

// Pit Stop Efficiency Analysis — stacked by year (matching screenshot style)
const pitStopByYear = [
  { team:"Ferrari",  "1990":125, "1995":110, "2000":95  },
  { team:"Mclaren",  "1990":95,  "1995":185, "2000":175 },
  { team:"Alpine",   "1990":110, "1995":90,  "2000":145 },
  { team:"Haas",     "1990":55,  "1995":30,  "2000":40  },
  { team:"Mercedes", "1990":155, "1995":200, "2000":155 },
]

// Race Win Distribution — scatter data (x = year, y = points)
const scatterFerrari = [
  {x:1990,y:310},{x:1992,y:180},{x:1994,y:260},{x:1996,y:140},{x:1998,y:290},
  {x:2000,y:230},{x:2001,y:340},{x:2003,y:190},{x:2004,y:370},{x:2006,y:210},
  {x:2007,y:320},{x:2008,y:155},{x:2010,y:290},{x:2012,y:175},{x:2019,y:240},
]
const scatterMclaren = [
  {x:1989,y:280},{x:1991,y:350},{x:1993,y:200},{x:1995,y:310},{x:1997,y:165},
  {x:1999,y:270},{x:2002,y:185},{x:2005,y:320},{x:2008,y:245},{x:2018,y:195},
  {x:2019,y:275},{x:2020,y:305},{x:2021,y:255},{x:2022,y:230},
]
const scatterAlpine = [
  {x:1990,y:150},{x:1993,y:210},{x:1996,y:175},{x:1999,y:225},{x:2002,y:160},
  {x:2005,y:240},{x:2007,y:130},{x:2010,y:200},{x:2012,y:185},{x:2015,y:215},
  {x:2018,y:170},{x:2021,y:245},{x:2022,y:195},
]

// Qualifying Performance — time-of-day x-axis
const qualifyingData = [
  { t:"6:00pm",  Ferrari:185, Mercedes:210 },
  { t:"6:30pm",  Ferrari:220, Mercedes:195 },
  { t:"7:00pm",  Ferrari:295, Mercedes:230 },
  { t:"7:30pm",  Ferrari:240, Mercedes:310 },
  { t:"8:00pm",  Ferrari:175, Mercedes:275 },
  { t:"8:30pm",  Ferrari:310, Mercedes:245 },
  { t:"9:00pm",  Ferrari:260, Mercedes:190 },
  { t:"9:30pm",  Ferrari:210, Mercedes:280 },
  { t:"10:00pm", Ferrari:155, Mercedes:185 },
]

// KPI sparklines (tiny area charts in KPI cards)
const kpiSpark1 = [{v:85},{v:90},{v:87},{v:100},{v:95},{v:108},{v:103},{v:118},{v:112},{v:124}]
const kpiSpark2 = [{v:72},{v:80},{v:76},{v:90},{v:84},{v:97},{v:91},{v:105},{v:99},{v:110}]
const kpiSpark3 = [{v:105},{v:112},{v:108},{v:122},{v:118},{v:132},{v:126},{v:140},{v:135},{v:148}]

// ─── AI chat messages ─────────────────────────────────────────────────────────

type AgentStep = { label: string; status: "pending" | "running" | "done" }
type WidgetPreviewData = { chartType: string; prompt: string; version: number }
type ChatMsg = { id: string; role: "user" | "ai"; text: string; widget?: boolean; sql?: string; agentSteps?: AgentStep[]; followUps?: string[]; preview?: WidgetPreviewData }

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

const SPECIFIC_WIDGET_WORDS = [
  "lap", "pit", "tire", "tyre", "speed", "driver", "team", "race",
  "qualifying", "sector", "degradation", "scatter", "bar", "line",
  "heat", "position", "podium", "standings", "gap", "overtake", "stint",
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
  return p.includes("tire") || p.includes("tyre") || p.includes("degradation") ? "Tire Degradation"
    : p.includes("scatter") ? "Scatter Plot"
    : p.includes("bar") ? "Bar Chart"
    : p.includes("pit") ? "Pit Stop Strategy"
    : p.includes("line") ? "Line Chart"
    : p.includes("lap") ? "Lap Time"
    : p.includes("speed") ? "Speed Trace"
    : p.includes("position") || p.includes("grid") ? "Race Position"
    : p.includes("gap") || p.includes("standings") ? "Championship Gap"
    : p.includes("qualifying") ? "Qualifying Performance"
    : "Custom Visualization"
}

function getAiResponse(prompt: string): { text: string; widget?: boolean; sql?: string; followUps?: string[]; preview?: WidgetPreviewData } {
  const p = prompt.toLowerCase()

  if (p.includes("podium")) return {
    text: "Ferrari leads with 120 gold podiums, followed by Mercedes (85) and McLaren (95). Ferrari dominates the top step overall.",
    sql: `SELECT constructor_name,\n  COUNT(*) FILTER (WHERE position = 1) AS wins,\n  COUNT(*) FILTER (WHERE position <= 3) AS podiums\nFROM f1.race_results\nGROUP BY constructor_name\nORDER BY podiums DESC;`,
  }

  if (p.includes("fastest") && !isWidgetIntent(p)) return {
    text: "The fastest recorded lap is 1:18.750 by LEC in the Canada race at lap 32.",
    sql: `SELECT driver_code, race_name, lap_number,\n  MIN(lap_time_ms) / 1000.0 AS lap_time_s\nFROM f1.lap_times\nGROUP BY driver_code, race_name, lap_number\nORDER BY lap_time_s ASC\nLIMIT 1;`,
  }

  // Generic widget request → ask clarifying questions
  if (isGenericWidgetIntent(p)) return {
    text: "Happy to add something! To make sure it's useful, what would you like to explore?",
    followUps: [
      "Lap time comparison across drivers",
      "Pit stop strategy by team",
      "Tire degradation over the race",
      "Speed trace per sector",
      "Starting grid vs. finishing position",
      "Constructor championship gap over rounds",
    ],
  }

  // Specific widget request → show preview in chat first
  if (isWidgetIntent(p)) {
    const chartType = getChartTypeFromPrompt(p)
    return {
      text: `Here's a preview of the ${chartType} widget. Does this look right? You can refine it or add it to the dashboard.`,
      preview: { chartType, prompt: p, version: 1 },
      sql: `SELECT driver_code, stint_lap,\n  AVG(lap_time_ms) AS avg_lap_ms,\n  compound\nFROM f1.stint_data\nGROUP BY driver_code, stint_lap, compound\nORDER BY stint_lap;`,
    }
  }

  if (p.includes("compare") || p.includes("driver")) return {
    text: "LEC consistently posts the lowest median lap times across teams, especially on street circuits. SAI shows more variance but peaks higher on power tracks.",
    sql: `SELECT driver_code,\n  MEDIAN(lap_time_ms) / 1000.0 AS median_lap_s,\n  STDDEV(lap_time_ms) / 1000.0 AS stddev_s\nFROM f1.lap_times\nGROUP BY driver_code\nORDER BY median_lap_s;`,
  }

  return {
    text: "Based on the dashboard data, the Canada 2026 race shows competitive lap time distributions across all teams, with Ferrari and Mercedes showing the tightest box plot ranges, indicating more consistent performance.",
    sql: `SELECT team, driver_code,\n  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY lap_time_ms) AS p25,\n  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY lap_time_ms) AS median,\n  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lap_time_ms) AS p75\nFROM f1.lap_times\nWHERE race_name = 'Canada 2026'\nGROUP BY team, driver_code;`,
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

const tireDegData = [
  { lap: 1,  soft: 100, medium: 100, hard: 100 },
  { lap: 5,  soft: 91,  medium: 96,  hard: 98  },
  { lap: 10, soft: 80,  medium: 90,  hard: 96  },
  { lap: 15, soft: 65,  medium: 84,  hard: 93  },
  { lap: 20, soft: 45,  medium: 75,  hard: 90  },
  { lap: 25, soft: 28,  medium: 65,  hard: 87  },
  { lap: 30, soft: 12,  medium: 52,  hard: 83  },
]


// Sankey: pit-entry flow  Team → Tire → Strategy → Outcome
const sankeyData = {
  nodes: [
    // Teams (0-4)
    { name: "Ferrari" },
    { name: "McLaren" },
    { name: "Mercedes" },
    { name: "Alpine" },
    { name: "Haas" },
    // Tire compounds (5-7)
    { name: "Soft" },
    { name: "Medium" },
    { name: "Hard" },
    // Outcomes (8-10)
    { name: "Podium" },
    { name: "Points" },
    { name: "DNF/Out" },
  ],
  links: [
    // Team → Tire
    { source: 0, target: 5, value: 8  },  // Ferrari → Soft
    { source: 0, target: 6, value: 12 },  // Ferrari → Medium
    { source: 1, target: 5, value: 10 },  // McLaren → Soft
    { source: 1, target: 7, value: 6  },  // McLaren → Hard
    { source: 2, target: 6, value: 14 },  // Mercedes → Medium
    { source: 2, target: 7, value: 8  },  // Mercedes → Hard
    { source: 3, target: 5, value: 5  },  // Alpine → Soft
    { source: 3, target: 6, value: 7  },  // Alpine → Medium
    { source: 4, target: 6, value: 4  },  // Haas → Medium
    { source: 4, target: 7, value: 5  },  // Haas → Hard
    // Tire → Outcome
    { source: 5, target: 8,  value: 12 }, // Soft → Podium
    { source: 5, target: 9,  value: 8  }, // Soft → Points
    { source: 5, target: 10, value: 3  }, // Soft → DNF
    { source: 6, target: 8,  value: 8  }, // Medium → Podium
    { source: 6, target: 9,  value: 22 }, // Medium → Points
    { source: 6, target: 10, value: 7  }, // Medium → DNF
    { source: 7, target: 8,  value: 4  }, // Hard → Podium
    { source: 7, target: 9,  value: 12 }, // Hard → Points
    { source: 7, target: 10, value: 3  }, // Hard → DNF
  ],
}

const SANKEY_COLORS: Record<string, string> = {
  Ferrari:  "#2272B4",
  McLaren:  "#D4A017",
  Mercedes: "#1B8A78",
  Alpine:   "#27794B",
  Haas:     "#BE501E",
  Soft:     "#C82D4C",
  Medium:   "#D4A017",
  Hard:     "#5F7281",
  Podium:   "#27794B",
  Points:   "#2272B4",
  "DNF/Out":"#BE501E",
}

// ─── @-mention autocomplete ───────────────────────────────────────────────────

const MENTION_SOURCES = [
  { id: "f1_lap_times",       label: "f1_lap_times",       type: "table",   icon: "📋" },
  { id: "race_results",       label: "race_results",       type: "table",   icon: "📋" },
  { id: "driver_standings",   label: "driver_standings",   type: "table",   icon: "📋" },
  { id: "constructor_stats",  label: "constructor_stats",  type: "table",   icon: "📋" },
  { id: "f1_dashboard_2026",  label: "f1_dashboard_2026",  type: "dashboard", icon: "📊" },
  { id: "lap_time_forecast",  label: "lap_time_forecast",  type: "model",   icon: "🤖" },
  { id: "podium_probability", label: "podium_probability", type: "model",   icon: "🤖" },
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
  "pit-stop-eff":  { title: "Pit Stop Efficiency Analysis",      subtitle: "Pit stop times and efficiency for each team.", chartType: "bar"  },
  "race-win-dist": { title: "Race Win Distribution",             subtitle: "Distribution of race wins by driver/team.",   chartType: "bar"  },
  "fastest-lap":   { title: "Fastest Lap Chart",                 subtitle: "Fastest laps recorded across teams.",         chartType: "bar"  },
  "standings":     { title: "2023 F1 Season Standings",          subtitle: "Points standings in the 2023 season.",        chartType: "bar"  },
  "qualifying":    { title: "Qualifying Performance",            subtitle: "Comparison of qualifying performances.",      chartType: "line" },
  "strategy-flow": { title: "Strategy Flow",                     subtitle: "Team → Tire compound → Race outcome.",        chartType: "bar"  },
  "tire-deg":      { title: "Tire Degradation",                  subtitle: "Grip level over laps by compound.",           chartType: "line" },
  // legacy
  "time-dist":     { title: "Time vs Distance",                  subtitle: "Lap time trend across race stints.",          chartType: "area" },
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
  if (p.includes("revenue") && (p.includes("product") || p.includes("type")))
    return { id, title: "Revenue by Product Type", subtitle: prompt, chartType: "bar" }
  if (p.includes("revenue") && p.includes("quarter"))
    return { id, title: "Product Revenue — Last 3 Quarters", subtitle: prompt, chartType: "area" }
  if (p.includes("driver") || p.includes("lap time"))
    return { id, title: "Top Drivers by Avg Lap Time", subtitle: prompt, chartType: "bar" }
  if (p.includes("pit stop") || p.includes("pit"))
    return { id, title: "Pit Stop Duration Comparison", subtitle: prompt, chartType: "bar" }
  return {
    id,
    title: prompt.length > 42 ? prompt.slice(0, 39) + "…" : prompt,
    subtitle: "Generated visualization",
    chartType: "bar",
  }
}

function DynamicWidgetChart({ widget }: { widget: DynamicWidget }) {
  const t = widget.title.toLowerCase()
  if (t.includes("product type")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueByProduct} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Bar dataKey="value" fill={C.blue} radius={[2, 2, 0, 0]} name="Revenue ($k)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("quarter")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueByQuarter} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
          <defs>
            <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis dataKey="q" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
          <Area type="monotone" dataKey="enterprise" stroke={C.blue}   fill="url(#entGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="smb"        stroke={C.teal}   fill="transparent"   strokeWidth={2} />
          <Area type="monotone" dataKey="startup"    stroke={C.yellow} fill="transparent"   strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("driver") || t.includes("lap")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={driverAvgLap} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" horizontal={false} />
          <XAxis type="number" domain={[87, 91]} tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis type="category" dataKey="driver" tick={{ fontSize: 11, fill: "#5F7281" }} width={32} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Bar dataKey="avg" fill={C.teal} radius={[0, 2, 2, 0]} name="Avg Lap (s)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (t.includes("pit")) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pitStopData} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} domain={[1.5, 3.5]} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
          <Legend verticalAlign="top" align="left" iconSize={10} wrapperStyle={{ fontSize: 11, paddingBottom: 4 }} />
          <Bar dataKey="avg"     fill={C.blue}   radius={[2, 2, 0, 0]} name="Avg (s)" />
          <Bar dataKey="fastest" fill={C.green}  radius={[2, 2, 0, 0]} name="Fastest (s)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  // Default bar chart with revenue data
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={revenueByProduct} margin={{ top: 24, right: 4, bottom: 8, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5F7281" }} />
        <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
        <Bar dataKey="value" fill={C.orange} radius={[2, 2, 0, 0]} name="Value" />
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
    case "pit-stop-eff":
      return (
        <ChartCard id="pit-stop-eff" title="Pit Stop Efficiency Analysis" subtitle="An overview of pit stop times and efficiency for each team throughout the season.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pitStopByYear} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Team", position: "insideBottom", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Points", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" align="left" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} formatter={(v) => `Year — ${v}`} />
              <Bar dataKey="1990" stackId="a" fill={C.yellow} name="1990" />
              <Bar dataKey="1995" stackId="a" fill={C.teal}   name="1995" />
              <Bar dataKey="2000" stackId="a" fill={C.blue}   name="2000" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "race-win-dist":
      return (
        <ChartCard id="race-win-dist" title="Race Win Distribution" subtitle="Chart showing the distribution of race wins among drivers in the 2023 season.">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="x" type="number" domain={[1988, 2012]} tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Team", position: "insideBottomRight", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis dataKey="y" type="number" domain={[0, 400]} tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Points", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <ZAxis range={[18, 18]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} cursor={{ strokeDasharray: "3 3" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Scatter name="Ferrari" data={scatterFerrari} fill={C.teal}   fillOpacity={0.75} />
              <Scatter name="Mclaren" data={scatterMclaren} fill={C.yellow} fillOpacity={0.75} />
              <Scatter name="Alpine"  data={scatterAlpine}  fill={C.blue}   fillOpacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "fastest-lap":
      return (
        <ChartCard id="fastest-lap" title="Fastest Lap Chart" subtitle="A visual representation of the fastest laps recorded.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={laptimesBox} margin={{ top: 8, right: 4, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Team", position: "insideBottom", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Points", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }}
                formatter={(v, name) => {
                  const labels: Record<string, string> = { base: "Min", lower: "Q1→Q2", box: "IQR", upper: "Q3→Q4", whisker: "Max" }
                  return [v, labels[name as string] ?? name]
                }}
              />
              <Bar dataKey="base"    stackId="a" fill="transparent" />
              <Bar dataKey="lower"   stackId="a" fill={C.blue} opacity={0.35} />
              <Bar dataKey="box"     stackId="a" fill={C.blue} />
              <Bar dataKey="upper"   stackId="a" fill={C.blue} opacity={0.35} />
              <Bar dataKey="whisker" stackId="a" fill="transparent" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "standings":
      return (
        <ChartCard id="standings" title="2023 Formula 1 Season Standings" subtitle="Current points standings of drivers and teams in the 2023 Formula 1 season.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 8, right: 4, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Team", position: "insideBottom", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Points", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Bar dataKey="Ferrari" stackId="a" fill={C.blue}   name="Ferrari" />
              <Bar dataKey="Mclaren" stackId="a" fill={C.yellow} name="Mclaren" />
              <Bar dataKey="Alpine"  stackId="a" fill={C.green}  name="Alpine"  radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "qualifying":
      return (
        <ChartCard id="qualifying" title="Qualifying Performance" subtitle="Comparison of qualifying performances.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualifyingData} margin={{ top: 8, right: 4, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Team", position: "insideBottom", offset: -4, fontSize: 10, fill: "#5F7281" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} label={{ value: "Points", angle: -90, position: "insideLeft", fontSize: 10, fill: "#5F7281" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Ferrari"  stroke={C.teal}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Mercedes" stroke={C.yellow} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    // Legacy aliases
    case "time-dist":
      return (
        <ChartCard id="time-dist" title="Time vs Distance" subtitle="Lap time trend across race stints">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeVsDistance} margin={{ top: 8, right: 4, bottom: 8, left: -10 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5F7281" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#E8ECF0" }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              <Area type="monotone" dataKey="Alaska"  stroke={C.blue}   fill="url(#blueGrad)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Arizona" stroke={C.orange} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Georgia" stroke={C.teal}   strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )
    case "laptimes-box":
      return <StaticOrDynamicWidget id="fastest-lap" dynWidget={undefined} onModify={onModify} />
    case "podiums":
      return <StaticOrDynamicWidget id="pit-stop-eff" dynWidget={undefined} onModify={onModify} />
    case "distribution":
      return <StaticOrDynamicWidget id="standings" dynWidget={undefined} onModify={onModify} />
    case "laptimes-line":
      return <StaticOrDynamicWidget id="qualifying" dynWidget={undefined} onModify={onModify} />
    case "tire-deg":
      return (
        <ChartCard id="tire-deg" title="Tire Degradation" subtitle="Grip level over laps by compound">
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
    case "strategy-flow":
      return (
        <ChartCard id="strategy-flow" title="Strategy Flow" subtitle="Team → Tire compound → Race outcome">
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
    default:
      return null
  }
}

// ─── New widget Genie card ────────────────────────────────────────────────────

const NEW_VIZ_SUGGESTIONS = [
  "Show revenue vs product type",
  "Product revenue over last 3 quarters",
  "Top drivers by average lap time",
  "Pit stop duration comparison",
]

function getPlan(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("tire") || p.includes("tyre") || p.includes("degradation"))
    return "I'll create a line chart showing tire degradation by stint lap using the f1_lap_times table, grouped by compound type. Does this look right?"
  if (p.includes("sankey") || p.includes("flow") || p.includes("strategy"))
    return "I'll build a Sankey diagram mapping race strategy flows — pit sequences and compound choices — from the race_results table. Does this look right?"
  if (p.includes("scatter") || p.includes("qualifying") || p.includes("race pace"))
    return "I'll create a scatter plot comparing qualifying lap time vs race pace for each driver using the f1_lap_times table. Does this look right?"
  if (p.includes("heat") || p.includes("sector") || p.includes("track"))
    return "I'll generate a heat map of sector times by driver and circuit using the race_results table. Does this look right?"
  return `I'll build a chart for "${prompt}" using the f1_lap_times and race_results tables. Does this look right?`
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
  const [revenueRange, setRevenueRange] = React.useState<[number, number]>([100, 200])
  const [showTireWidget, setShowTireWidget] = React.useState(false)
  const [activeTab, setActiveTab]   = React.useState("overview")
  const [editMode, setEditMode]         = React.useState(false)
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

  // Unified ordered widget list (static + tire + dynamic IDs)
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>([
    "pit-stop-eff", "race-win-dist", "fastest-lap", "standings", "qualifying", "strategy-flow",
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
            <h1 className="text-lg font-semibold text-foreground">Formula One</h1>
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

          {/* ── Top section: filter sidebar + KPI cards ── */}
          <div className="flex shrink-0 gap-5 border-b border-border bg-muted/20 px-6 py-5">

            {/* Left filter panel */}
            <div className="flex w-[210px] shrink-0 flex-col gap-5 rounded-md border border-border bg-background p-4 shadow-[var(--shadow-db-sm)]">
              {/* Driver Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Driver Name</label>
                <button className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors">
                  Max Verstappen
                  <ChevronDown size={11} className="text-muted-foreground" />
                </button>
              </div>
              {/* Date range */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Date range</label>
                <div className="flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground">
                  Jul 27, 2025
                  <span className="mx-1 text-muted-foreground">→</span>
                  Jul 28, 2025
                  <CalendarIcon size={11} className="ml-auto text-muted-foreground" />
                </div>
              </div>
              {/* Lap times range */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground">Lap times (s)</label>
                </div>
                <RangeSlider min={0} max={400} value={revenueRange} onChange={setRevenueRange} />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{revenueRange[0]}</span>
                  <span>{revenueRange[1]}</span>
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid flex-1 grid-cols-3 gap-4">
              {([
                { label: "Total Engagement", period: "Jun 2025", value: "511.02K", delta: "+.51%", compare: "386.87K • May 2025", spark: kpiSpark1, color: C.blue },
                { label: "Peak Performance",  period: "Jun 2025", value: "299.91K", delta: "+.51%", compare: "386.87K • May 2025", spark: kpiSpark2, color: C.teal },
                { label: "Average Speed",     period: "Jun 2025", value: "422.15K", delta: "+.51%", compare: "386.87K • May 2025", spark: kpiSpark3, color: C.green },
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
                      placeholder="Which team had the fastest pit stops?"
                      className="w-[300px] bg-transparent py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
                    />
                  ) : (
                    <button
                      onClick={() => { setAskGenieEditing(true); setAskGenieQuery("") }}
                      className="py-2.5 pr-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                    >
                      Which team had the fastest pit stops?
                    </button>
                  )}

                  {/* Gradient send circle */}
                  <button
                    onClick={() => askGenieEditing ? submitAskGenie() : submitAskGenie("Which team had the fastest pit stops?")}
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
                      placeholder="What should we change on this dashboard?"
                      className="w-[300px] bg-transparent py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
                    />
                  ) : (
                    <button
                      onClick={() => { setEditPillEditing(true); setEditPillQuery("") }}
                      className="py-2.5 pr-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                    >
                      What should we change on this dashboard today?
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
