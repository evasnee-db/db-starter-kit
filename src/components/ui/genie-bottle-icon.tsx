import * as React from "react"

interface GenieBottleIconProps {
  size?: number
  className?: string
}

export function GenieBottleIcon({ size = 20, className }: GenieBottleIconProps) {
  const uid = React.useId().replace(/:/g, "")
  const gId = `gb-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left-to-right: blue → purple → pink, matching the image */}
        <linearGradient id={gId} x1="0" y1="44" x2="100" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5B8FE8" />
          <stop offset="48%"  stopColor="#9B59E8" />
          <stop offset="100%" stopColor="#F06898" />
        </linearGradient>
      </defs>

      {/* ── 4-pointed sparkle / star at top ───────────────────────── */}
      <path
        d="M50 6 L53.2 17.4 L64.8 20 L53.2 22.6 L50 34 L46.8 22.6 L35.2 20 L46.8 17.4 Z"
        fill={`url(#${gId})`}
      />

      {/* ── Left sweeping arm ─────────────────────────────────────── */}
      {/* Starts near sparkle, sweeps outward-left, curves down */}
      <path
        d="M 44 28 C 28 24 10 36 10 52 C 10 60 16 66 28 68"
        stroke={`url(#${gId})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Right sweeping arm ────────────────────────────────────── */}
      <path
        d="M 56 28 C 72 24 90 36 90 52 C 90 60 84 66 72 68"
        stroke={`url(#${gId})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Bottom U curve connecting both arms ───────────────────── */}
      <path
        d="M 28 68 Q 50 80 72 68"
        stroke={`url(#${gId})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Base bar ──────────────────────────────────────────────── */}
      <rect x="36" y="80" width="28" height="7" rx="3.5" fill="#F06060" />
    </svg>
  )
}
