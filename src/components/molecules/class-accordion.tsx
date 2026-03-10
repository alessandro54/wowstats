"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { cn } from "@/lib/utils"

interface Props {
  classes: WowClassConfig[]
}

export function ClassAccordion({ classes }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const setHoverSlug = useSetHoverSlug()

  function toggle(slug: WowClassSlug) {
    const next = open === slug ? null : slug
    setOpen(next)
    setHoverSlug(next)
  }

  return (
    <div className="flex flex-col divide-y divide-border/50">
      {classes.map(cls => {
        const isOpen = open === cls.slug

        return (
          <div key={cls.slug}>
            {/* Class row */}
            <button
              type="button"
              onClick={() => toggle(cls.slug as WowClassSlug)}
              className="flex w-full items-center gap-3 px-4 py-3 transition-colors active:bg-muted/20"
            >
              <span className="icon-vignette shrink-0 rounded-lg">
                <Image
                  src={cls.iconUrl}
                  alt={cls.name}
                  width={32}
                  height={32}
                  className="block rounded-lg"
                />
              </span>
              <span className="flex-1 text-left text-sm font-semibold" style={{ color: cls.color }}>
                {cls.name}
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
              />
            </button>

            {/* Spec list — animated expand */}
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-0.5 bg-muted/10 px-4 pb-3 pt-1">
                  {cls.specs.map(spec => (
                    <Link
                      key={spec.id}
                      href={`/pvp/${cls.slug}/${spec.name}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground active:bg-muted/60"
                    >
                      <Image
                        src={spec.iconUrl}
                        alt={spec.name}
                        width={22}
                        height={22}
                        className="shrink-0 rounded-sm"
                      />
                      <span className="capitalize">{spec.name}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
