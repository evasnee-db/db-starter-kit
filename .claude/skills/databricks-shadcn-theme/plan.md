# Designer Starter Kit — Build Plan

## Goal

Create a local Next.js project that serves as the **foundation for peer designers to vibe code on top of**. It should:

1. Be fully themed with DuBois tokens via shadcn/ui
2. Include a visual reference page of all styled components
3. Have DuBois icons extracted and ready to use
4. Be pre-configured so that Claude Code (with the skill installed) generates on-brand UI automatically

---

## Prerequisites

- Node.js 18+
- Claude Code CLI (`claude`) installed
- `@databricks/design-system` accessible via npm

---

## Phase 1: Project Scaffold

### 1.1 Create Next.js + shadcn/ui project

```bash
npx create-next-app@latest db-starter-kit \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"

cd db-starter-kit
npx shadcn@latest init
```

During shadcn init, choose:
- Style: **New York** (closer to DuBois's tighter spacing)
- Base color: **Slate** (will be overwritten by DuBois grey)
- CSS variables: **Yes**

### 1.2 Install the skill

```bash
# Copy the skill into the project
mkdir -p .claude/skills
cp -r /path/to/databricks-shadcn-theme .claude/skills/databricks-shadcn-theme
```

Or if published to a repo:
```bash
npx skills add your-org/your-repo --skill databricks-shadcn-theme
```

### 1.3 Add a CLAUDE.md at project root

```markdown
# CLAUDE.md

This is the Databricks Designer Starter Kit built on Next.js + shadcn/ui.

## Key context
- All UI must follow the DuBois design system — see `.claude/skills/databricks-shadcn-theme/SKILL.md`
- Always read the skill before generating any UI components
- Use the themed `globals.css` and Tailwind extensions already configured in this project
- For icons: use Lucide for generic icons, use extracted DuBois icons from `src/components/icons/` for Databricks-specific ones
- Base font size is 13px, not 16px
- Default border-radius for interactive elements is 4px, not 8px
- Font weight bold = 600, never 700

## Project structure
- `src/components/ui/` — shadcn components (themed)
- `src/components/icons/` — extracted DuBois icons
- `src/app/design-system/` — visual reference page
- `src/lib/utils.ts` — cn() utility
```

---

## Phase 2: Apply DuBois Theme

### 2.1 Replace globals.css

Copy `references/globals.css` from the skill into `src/app/globals.css`, replacing the shadcn defaults.

### 2.2 Extend Tailwind config

Merge `references/tailwind-extend.js` into `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import duboisExtend from "./.claude/skills/databricks-shadcn-theme/references/tailwind-extend";

const config: Config = {
  // ... existing config
  theme: {
    extend: {
      ...duboisExtend,
      // any project-specific additions
    },
  },
};
export default config;
```

### 2.3 Set font

Install Helvetica Neue fallback handling in `src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Helvetica Neue", ui-sans-serif, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
```

---

## Phase 3: Add shadcn Components

### 3.1 Install the core component set

These are the most commonly used across Databricks UIs:

```bash
npx shadcn@latest add button input label textarea select \
  checkbox radio-group switch toggle toggle-group \
  dialog drawer sheet popover tooltip hover-card \
  dropdown-menu context-menu menubar command \
  table tabs card badge alert separator \
  avatar breadcrumb pagination skeleton \
  form scroll-area collapsible accordion \
  toast sonner
```

### 3.2 Apply component overrides

Using guidance from `references/component-overrides.md`, customize:

| Priority | Component | Key Changes |
|----------|-----------|-------------|
| P0 | `button.tsx` | DuBois variants, 40/32/24px heights, 4px radius |
| P0 | `input.tsx` | 40px height, 13px font, grey300 border |
| P0 | `badge.tsx` | Add DuBois secondary color variants |
| P1 | `dialog.tsx` | 40px padding, no header/footer borders |
| P1 | `table.tsx` | DuBois hover/selected row colors |
| P1 | `alert.tsx` | DuBois colored backgrounds per severity |
| P2 | `tabs.tsx` | Blue indicator, 600 weight active label |
| P2 | `tooltip.tsx` | grey800 bg, 12px font |
| P2 | `card.tsx` | 8px radius, db-sm shadow |

> **Tip for Claude Code**: Open each component file and ask Claude to apply the DuBois
> overrides. With the skill installed, it should reference `component-overrides.md` automatically.

---

## Phase 4: Extract DuBois Icons

### 4.1 Install the design system package (for icon extraction only)

```bash
npm i --save-dev @databricks/design-system
```

### 4.2 Run the extraction script

```bash
# Default: ~105 Databricks-specific icons
node .claude/skills/databricks-shadcn-theme/scripts/extract-dubois-icons.js \
  --output src/components/icons

# Or extract all 413 if you want full parity
node .claude/skills/databricks-shadcn-theme/scripts/extract-dubois-icons.js \
  --output src/components/icons --all
```

### 4.3 Add the DbIcon wrapper

Create `src/components/ui/db-icon.tsx` using the unified wrapper from `references/icons.md`.
This gives designers one component that works with both Lucide and DuBois icons.

---

## Phase 5: Build the Reference Page

Create `src/app/design-system/page.tsx` — a living styleguide that designers browse to
understand what's available and copy patterns from.

### Sections to include

| Section | Contents |
|---------|----------|
| **Colors** | Render DuBois primitive + semantic palette as swatches with hex + CSS var names |
| **Typography** | Show all heading levels, body, small, code at correct sizes/weights |
| **Spacing** | Visual boxes at xs/sm/md/lg scale |
| **Buttons** | All variants × all sizes (grid), with hover/active states |
| **Form Controls** | Input, Select, Checkbox, Radio, Switch, Textarea — default + error + disabled states |
| **Badges/Tags** | All DuBois secondary colors + semantic variants |
| **Dialogs & Sheets** | Trigger buttons that open styled modals |
| **Tables** | Sample data table with hover, selection, sorting |
| **Alerts** | Error, Warning, Info, Success |
| **Icons** | Grid of all extracted DuBois icons with names (searchable) |
| **Cards & Layouts** | Common card patterns, sidebar layout |
| **AI Components** | Gradient border, sparkle icon with AI gradient fill |

> **Tip**: Ask Claude Code to generate each section one at a time. The skill will ensure
> correct tokens are used. Review each section before moving on.

---

## Phase 6: Add Snippet Library (Optional but High-Value)

Create `src/app/design-system/patterns/` with pages showing composed patterns:

- **Form layout**: Label + Input + FormMessage + Submit — vertical and horizontal
- **Data table with toolbar**: Search + Filter + Table + Pagination
- **Dashboard card**: Metric number + sparkline + badge
- **Settings panel**: Grouped form sections with switches and selects
- **Command palette**: Cmd+K dialog with search
- **Empty state**: Icon + message + CTA button
- **Sidebar navigation**: Collapsible nav with DuBois icons

Each pattern page should have a "View Code" toggle so designers can copy the JSX.

---

## Phase 7: Polish & Ship

### 7.1 Dark mode toggle

Add a theme toggle using `next-themes`:

```bash
npm i next-themes
```

Wire up a `<ThemeProvider>` in layout and add a Sun/Moon toggle to the reference page header.
DuBois dark mode tokens are already in `globals.css`.

### 7.2 README for designers

Create a `README.md` aimed at designers who will vibe code:

```markdown
# Databricks Designer Starter Kit

## Quick start
1. Clone this repo
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000/design-system to see all components

## How to build new pages
- Start a Claude Code session in this project
- The DuBois skill is pre-installed — Claude will use DB tokens automatically
- Browse /design-system for component reference
- Copy patterns from /design-system/patterns

## Rules
- Always use CSS variables, not raw hex colors
- Base font: 13px, bold weight: 600
- Border radius: 4px for buttons/inputs, 8px for cards/modals
- Use DuBois icons from `src/components/icons/` for DB concepts
- Use Lucide icons for generic UI (arrows, close, settings, etc.)
```

### 7.3 Git & share

```bash
git init
git add .
git commit -m "Initial Databricks Designer Starter Kit"
```

Push to your team's repo. Designers clone it and start vibe coding with Claude Code.

---

## Execution Sequence in Claude Code

Here's the order to run things in a Claude Code session:

```
Step 1:  "Create a new Next.js app with shadcn/ui, TypeScript, Tailwind, App Router"
Step 2:  "Install the databricks-shadcn-theme skill" (copy the skill folder)
Step 3:  "Replace globals.css with the DuBois theme from the skill"
Step 4:  "Extend tailwind.config with DuBois tokens from the skill"
Step 5:  "Install these shadcn components: button, input, label, ..."
Step 6:  "Apply DuBois overrides to button.tsx using the component-overrides reference"
         (repeat for each P0/P1 component)
Step 7:  "Extract DuBois icons into src/components/icons"
Step 8:  "Create the DbIcon wrapper component"
Step 9:  "Build a design system reference page at /design-system with color swatches,
          typography samples, and all button variants"
         (iterate section by section)
Step 10: "Add dark mode support with next-themes"
Step 11: "Create a composed patterns page showing form layout, data table, and dashboard card"
Step 12: "Write a README for designers"
```

Each step is a prompt to Claude Code. The skill ensures it uses DuBois tokens at every step.

---

## Final Directory Structure

```
db-starter-kit/
├── .claude/
│   ├── skills/
│   │   └── databricks-shadcn-theme/    ← the skill (this repo)
│   │       ├── SKILL.md
│   │       ├── references/
│   │       │   ├── globals.css
│   │       │   ├── tailwind-extend.js
│   │       │   ├── component-overrides.md
│   │       │   └── icons.md
│   │       └── scripts/
│   │           └── extract-dubois-icons.js
│   └── CLAUDE.md                       ← project context for Claude
├── src/
│   ├── app/
│   │   ├── globals.css                 ← copied from skill references/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── design-system/
│   │       ├── page.tsx                ← visual reference
│   │       └── patterns/
│   │           └── page.tsx            ← composed patterns
│   ├── components/
│   │   ├── ui/                         ← shadcn components (themed)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── db-icon.tsx
│   │   │   └── ...
│   │   └── icons/                      ← extracted DuBois icons
│   │       ├── CatalogIcon.tsx
│   │       ├── NotebookIcon.tsx
│   │       ├── ...
│   │       └── index.ts
│   └── lib/
│       └── utils.ts
├── tailwind.config.ts                  ← extended with DuBois tokens
├── CLAUDE.md
├── README.md
└── package.json
```
