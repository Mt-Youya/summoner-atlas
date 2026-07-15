"use client"

import * as React from "react"
import { Meter as MeterPrimitive } from "@base-ui/react/meter"

import { cn } from "@/lib/utils"

function Meter({
  className,
  value = 0,
  max = 100,
  ...props
}: MeterPrimitive.Root.Props & {
  value?: number
  max?: number
}) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/10", className)}
      {...props}
    >
      <MeterPrimitive.Track
        data-slot="meter-track"
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all",
          value >= (max * 0.66) ? "bg-primary" : value >= (max * 0.33) ? "bg-amber-400" : "bg-destructive"
        )}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </MeterPrimitive.Root>
  )
}

export { Meter }
