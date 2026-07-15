"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"
import { ArrowLeft01Icon, ArrowRight01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "./button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

function PaginationLink({
  className,
  isActive,
  size,
  ...props
}: React.ComponentProps<typeof Button> & {
  isActive?: boolean
  size?: "default" | "sm"
}) {
  return (
    <Button
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "default" : "ghost"}
      size={size ?? "icon-sm"}
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink data-slot="pagination-previous" size="default" className={cn("gap-1", className)} {...props}>
      <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
    </PaginationLink>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink data-slot="pagination-next" size="default" className={cn("gap-1", className)} {...props}>
      <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
