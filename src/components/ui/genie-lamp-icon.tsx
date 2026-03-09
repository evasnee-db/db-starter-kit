import * as React from "react"

interface GenieLampIconProps {
  size?: number
  className?: string
}

let _id = 0

export function GenieLampIcon({ size = 20, className }: GenieLampIconProps) {
  const id = React.useId ? React.useId().replace(/:/g, "") : String(++_id)
  const gradId = `genie-grad-${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="70" x2="92" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F06878" />
          <stop offset="55%"  stopColor="#D64EC8" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>

      {/* ── Plus / sparkle at top ───────────────────────────────── */}
      <line x1="50" y1="4"  x2="50" y2="16" stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="44" y1="10" x2="56" y2="10" stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" />

      {/* ── Stem from cross down to head ───────────────────────── */}
      <line x1="50" y1="16" x2="50" y2="26" stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" />

      {/* ── Head circle ────────────────────────────────────────── */}
      <circle cx="50" cy="37" r="11" stroke={`url(#${gradId})`} strokeWidth="4.5" />

      {/* ── Left arm: sweeps from lower-left of head outward ───── */}
      <path
        d="M 41 44 Q 28 56 20 66"
        stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
      {/* Ball at end of left arm */}
      <circle cx="15" cy="72" r="5.5" stroke={`url(#${gradId})`} strokeWidth="4.5" />

      {/* ── Right arm: mirrors left ─────────────────────────────── */}
      <path
        d="M 59 44 Q 72 56 80 66"
        stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
      {/* Ball at end of right arm */}
      <circle cx="85" cy="72" r="5.5" stroke={`url(#${gradId})`} strokeWidth="4.5" />
    </svg>
  )
}
