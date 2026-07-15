"use client"

import * as React from "react"
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar"

import { cn } from "@/lib/utils"

function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex w-fit items-center gap-1 rounded-lg border bg-background p-1",
        className
      )}
      {...props}
    />
  )
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="toolbar-group" className={cn("flex items-center gap-1", className)} {...props} />
}

function ToolbarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar-separator"
      className={cn("mx-1 h-6 w-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

function ToolbarButton({ className, ...props }: ToolbarPrimitive.Button.Props) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-muted data-[pressed]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

export { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarButton, ToolbarLink }
