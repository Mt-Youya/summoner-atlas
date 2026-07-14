"use client"

import { Component, type ReactNode } from "react"
import { Alert01Icon } from "hugeicons-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Alert01Icon className="size-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
