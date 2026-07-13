import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 border text-sm font-medium transition-[transform,background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground hover:-translate-y-0.5",
        outline: "border-border bg-transparent text-foreground hover:bg-surface",
      },
      size: {
        default: "px-4 py-2",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
)

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
