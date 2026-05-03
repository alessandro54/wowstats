"use client"

import { useEffect, useRef, useState } from "react"
import { LazyImage } from "@/components/atoms/lazy-image"
import type { WowClassConfig, WowClassSpec } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [
    onClose,
  ])
  return ref
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function DropdownItem({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors ${
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
      }`}
    >
      {children}
    </button>
  )
}

export function ClassDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useOutsideClose(() => setOpen(false))
  const cls = WOW_CLASSES.find((c) => c.slug === value)
  const color = cls ? classColor(cls.slug) : undefined

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-white/10 min-w-[160px]"
        style={
          cls
            ? {
                color,
              }
            : undefined
        }
      >
        {cls ? (
          <>
            <LazyImage
              src={cls.iconUrl}
              alt=""
              width={20}
              height={20}
              className="shrink-0 rounded-sm"
            />
            <span className="flex-1 truncate text-left">{cls.name}</span>
          </>
        ) : (
          <span className="flex-1 truncate text-left text-muted-foreground">All classes</span>
        )}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-[320px] min-w-[200px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
          <DropdownItem
            active={!value}
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            <span className="text-muted-foreground">All classes</span>
          </DropdownItem>
          {WOW_CLASSES.map((c) => (
            <DropdownItem
              key={c.slug}
              active={c.slug === value}
              onClick={() => {
                onChange(c.slug)
                setOpen(false)
              }}
            >
              <LazyImage
                src={c.iconUrl}
                alt=""
                width={20}
                height={20}
                className="shrink-0 rounded-sm"
              />
              <span
                style={{
                  color: classColor(c.slug),
                }}
              >
                {c.name}
              </span>
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  )
}

export function SpecDropdown({
  classConfig,
  value,
  onChange,
}: {
  classConfig: WowClassConfig
  value: string
  onChange: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useOutsideClose(() => setOpen(false))
  const spec = classConfig.specs.find((s) => s.name === value) ?? null
  const color = classColor(classConfig.slug)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-white/10 min-w-[160px]"
        style={
          spec
            ? {
                color,
              }
            : undefined
        }
      >
        {spec ? (
          <>
            <LazyImage
              src={spec.iconUrl}
              alt=""
              width={20}
              height={20}
              className="shrink-0 rounded-sm"
            />
            <span className="flex-1 truncate text-left capitalize">{spec.name}</span>
          </>
        ) : (
          <span className="flex-1 truncate text-left text-muted-foreground">All specs</span>
        )}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-[320px] min-w-[200px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
          <DropdownItem
            active={!value}
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            <span className="text-muted-foreground">All specs</span>
          </DropdownItem>
          {classConfig.specs.map((s: WowClassSpec) => (
            <DropdownItem
              key={s.id}
              active={s.name === value}
              onClick={() => {
                onChange(s.name)
                setOpen(false)
              }}
            >
              <LazyImage
                src={s.iconUrl}
                alt=""
                width={20}
                height={20}
                className="shrink-0 rounded-sm"
              />
              <span
                className="capitalize"
                style={{
                  color,
                }}
              >
                {s.name}
              </span>
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  )
}
