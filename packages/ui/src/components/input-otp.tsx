"use client"

import * as React from "react"
import { OTPField as OtpFieldPrimitive } from "@base-ui/react/otp-field"

import { cn } from "@/lib/utils"

function InputOtp({ className, ...props }: OtpFieldPrimitive.Root.Props) {
  return (
    <OtpFieldPrimitive.Root data-slot="input-otp" className={cn("flex items-center gap-2", className)} {...props} />
  )
}

function InputOtpGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />
}

function InputOtpSlot({ className, index, ...props }: { index: number; className?: string }) {
  return (
    <OtpFieldPrimitive.Input
      data-slot="input-otp-slot"
      data-index={index}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-input bg-transparent text-center text-sm font-medium shadow-xs transition-colors outline-none caret-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputOtpSeparator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="input-otp-separator" className={cn("text-sm text-muted-foreground", className)} {...props}>
      -
    </span>
  )
}

export { InputOtp, InputOtpGroup, InputOtpSlot, InputOtpSeparator }
