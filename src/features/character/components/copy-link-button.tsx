"use client"

import { useState } from "react"

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    if (typeof window === "undefined") return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard write can fail under restricted contexts (file://, http on
      // some browsers). Fail silently — there's no good UX for telling the
      // user "your browser blocked it".
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy character URL"
      className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-background/40 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:border-border hover:text-foreground"
    >
      {copied ? (
        <>
          <span aria-hidden>✓</span>
          <span>Copied</span>
        </>
      ) : (
        <>
          <span aria-hidden>⎘</span>
          <span>Copy link</span>
        </>
      )}
    </button>
  )
}
