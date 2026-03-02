import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // DuBois: rectangular (rounded not rounded-full), 600 weight, compact
  "inline-flex items-center justify-center rounded border border-transparent px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // DuBois secondary palette — light bg, dark text
        coral:     "bg-coral-100 text-coral-700 dark:bg-coral-700/20 dark:text-coral-500",
        brown:     "bg-brown-100 text-brown-700 dark:bg-brown-700/20 dark:text-brown-500",
        indigo:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-700/20 dark:text-indigo-500",
        lemon:     "bg-lemon-100 text-lemon-700 dark:bg-lemon-700/20 dark:text-lemon-500",
        lime:      "bg-lime-100 text-lime-700 dark:bg-lime-700/20 dark:text-lime-500",
        pink:      "bg-pink-100 text-pink-700 dark:bg-pink-700/20 dark:text-pink-500",
        purple:    "bg-purple-100 text-purple-700 dark:bg-purple-700/20 dark:text-purple-500",
        teal:      "bg-teal-100 text-teal-700 dark:bg-teal-700/20 dark:text-teal-500",
        turquoise: "bg-turquoise-100 text-turquoise-700 dark:bg-turquoise-700/20 dark:text-turquoise-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
