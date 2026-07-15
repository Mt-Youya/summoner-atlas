"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Form as FormPrimitive } from "@base-ui/react/form"

import { cn } from "@/lib/utils"
import { Label } from "./label"

function Form({ className, ...props }: FormPrimitive.Props) {
  return <FormPrimitive data-slot="form" className={cn("flex flex-col gap-6", className)} {...props} />
}

function FormField({ className, ...props }: FieldPrimitive.Root.Props) {
  return <FieldPrimitive.Root data-slot="form-field" className={cn("flex flex-col gap-2", className)} {...props} />
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="form-label" className={cn("data-[invalid]:text-destructive", className)} {...props} />
}

function FormControl({ children, ...props }: FieldPrimitive.Control.Props) {
  return (
    <FieldPrimitive.Control data-slot="form-control" {...props}>
      {children}
    </FieldPrimitive.Control>
  )
}

function FormDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="form-message"
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    />
  )
}

export { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage }
