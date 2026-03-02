import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Design System — Databricks Starter Kit",
  description: "DuBois component reference and token guide",
};

const navItems = [
  { id: "colors",      label: "Colors" },
  { id: "typography",  label: "Typography" },
  { id: "spacing",     label: "Spacing" },
  { id: "buttons",     label: "Buttons" },
  { id: "forms",       label: "Form Controls" },
  { id: "badges",      label: "Badges & Tags" },
  { id: "alerts",      label: "Alerts" },
  { id: "tables",      label: "Tables" },
  { id: "cards",       label: "Cards" },
  { id: "dialogs",     label: "Dialogs & Sheets" },
  { id: "icons",       label: "Icons" },
  { id: "ai",          label: "AI Components" },
  { id: "shell",       label: "Shell" },
];

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-52 shrink-0 border-r border-border overflow-y-auto py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="group flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
            Design System
          </a>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 px-10 py-10 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
