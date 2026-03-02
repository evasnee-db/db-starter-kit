import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">

        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <svg width="16" height="18" viewBox="0 0 300 331" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 translate-y-px">
            <path d="M283.923 136.449L150.144 213.624L6.88995 131.168L0 134.982V194.844L150.144 281.115L283.923 204.234V235.926L150.144 313.1L6.88995 230.644L0 234.458V244.729L150.144 331L300 244.729V184.867L293.11 181.052L150.144 263.215L16.0766 186.334V154.643L150.144 231.524L300 145.253V86.2713L292.536 81.8697L150.144 163.739L22.9665 90.9663L150.144 17.8998L254.641 78.055L263.828 72.773V65.4371L150.144 0L0 86.2713V95.6613L150.144 181.933L283.923 104.758V136.449Z" fill="#FF3621"/>
          </svg>
          <span className="text-base font-semibold text-foreground tracking-tight">
            Databricks UI Starter Kit
          </span>
          <Badge variant="indigo">DuBois</Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">
            Vibe coding Databricks UIs
          </h1>
          <p className="text-sm text-muted-foreground">
            DuBois-themed shadcn/ui components for PMs and designers. Start building without rebuilding.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/shell">View shell demo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/design-system">Design system</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/design-system#icons">Browse icons</Link>
          </Button>
        </div>

        <a
          href="https://github.com/gioa/db-starter-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          gioa/db-starter-kit
        </a>
      </div>
    </div>
  );
}
