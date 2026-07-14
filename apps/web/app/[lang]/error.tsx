"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Alert01Icon } from "hugeicons-react"
import { Button } from "@summoner-atlas/ui"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-starfield opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 shadow-[var(--glow-low)]">
          <Alert01Icon className="size-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} className="shadow-[var(--glow-mid)]">
            Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/">Back to home</Link>} />
        </div>
      </div>
    </div>
  )
}
