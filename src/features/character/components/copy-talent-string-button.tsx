"use client"

import { useState } from "react"

interface Props {
  /** Raw WoW in-game import string. */
  code: string
}

export function CopyTalentStringButton({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    if (typeof window === "undefined") return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // No reliable fallback in restricted clipboard contexts.
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy talent import string"
      className={`group inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.03] hover:shadow-lg active:scale-100 ${
        copied
          ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-400"
          : "border-[var(--color-quality-legendary)]/70 bg-[var(--color-quality-legendary)]/15 text-[var(--color-quality-legendary)] hover:bg-[var(--color-quality-legendary)]/25"
      }`}
    >
      {copied ? (
        <>
          <span aria-hidden className="text-base leading-none">
            ✓
          </span>
          <span>Copied to clipboard</span>
        </>
      ) : (
        <>
          <span aria-hidden className="text-base leading-none">
            ⎘
          </span>
          <span>Copy talent string</span>
        </>
      )}
    </button>
  )
}
