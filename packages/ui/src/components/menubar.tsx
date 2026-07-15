"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"

import { cn } from "@/lib/utils"

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn("flex h-9 items-center gap-0.5 rounded-lg border bg-background p-1 shadow-xs", className)}
      {...props}
    />
  )
}

export { Menubar }
