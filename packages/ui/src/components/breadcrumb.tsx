"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"
import { ArrowRight01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />
}

function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" className={cn("font-medium text-foreground", className)} {...props} />
}

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" className={cn("inline-flex items-center", className)} {...props}>
      <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" className={cn("flex size-5 items-center justify-center", className)} {...props}>
      <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
