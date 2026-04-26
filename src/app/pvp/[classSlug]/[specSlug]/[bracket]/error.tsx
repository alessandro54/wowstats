"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function SpecPageError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string
  }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [
    error,
  ])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-muted-foreground text-sm">Failed to load spec data.</p>
      <button
        onClick={reset}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-card/50"
      >
        Try again
      </button>
    </div>
  )
}
