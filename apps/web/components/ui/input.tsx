import * as React from "react"
import { cn } from "@/lib/utils"

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full min-w-0 border border-black/30 bg-transparent px-3 py-2 text-sm text-[var(--award-ink)] outline-none transition-colors placeholder:text-black/45 focus-visible:border-[var(--award-ink)] focus-visible:ring-2 focus-visible:ring-[var(--award-lime)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
