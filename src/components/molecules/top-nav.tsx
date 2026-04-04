"use client"

import { usePathname } from "next/navigation"
import { useTopNav } from "@/components/providers/top-nav-provider"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"

export function TopNav() {
  const { config } = useTopNav()
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const pathSlug = (segments[0] === "pvp" ? segments[1] : null) as WowClassSlug | null
  const activeColor = useActiveColor(pathSlug ?? undefined)

  if (config.hidden) return null

  const isHome = pathname === "/"

  return (
    <header
      className={`sticky top-0 z-20 flex h-15 shrink-0 items-center gap-2 p-4 ${isHome ? "" : "bg-background/40 border-b backdrop-blur-md"}`}
    >
      <SidebarTrigger
        className="-ml-1 transition-colors"
        style={{
          color: activeColor,
        }}
      />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <div className="hidden min-w-0 flex-1 items-center sm:flex">{config.left}</div>
      {config.center ? (
        <div className="flex flex-1 justify-center">{config.center}</div>
      ) : (
        <div className="flex-1" />
      )}
    </header>
  )
}
