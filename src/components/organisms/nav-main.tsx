"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { ChevronRight } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { useCallback, useRef, useState } from "react"
import { NavClassHoverCard } from "@/components/molecules/nav-class-hover-card"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { navMain } from "@/config/wow/nav-config"

export function NavMain() {
  const setSlug = useSetHoverSlug()
  const [openSlug, setOpenSlug] = useState<WowClassSlug | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefetchedRef = useRef<Set<string>>(new Set())
  const { open: sidebarOpen } = useSidebar()

  const handleItemEnter = useCallback(
    (item: (typeof navMain)[number]) => {
      if (timerRef.current)
        clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setOpenSlug(item.slug)
        setSlug(item.slug)
        if (!prefetchedRef.current.has(item.slug)) {
          prefetchedRef.current.add(item.slug)
          item.items.forEach((spec) => {
            fetch(`/api/prefetch/items?spec_id=${spec.id}&bracket=3v3`, { priority: "low" }).catch(
              () => {},
            )
          })
        }
      }, 80)
    },
    [setSlug],
  )

  const handleMenuLeave = useCallback(() => {
    if (timerRef.current)
      clearTimeout(timerRef.current)
    setOpenSlug(null)
    setSlug(null)
  }, [setSlug])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Guides</SidebarGroupLabel>
      <SidebarMenu onMouseLeave={handleMenuLeave}>
        {navMain.map(item => (
          <Collapsible
            key={item.title}
            asChild
            open={openSlug === item.slug}
            className="group/collapsible"
            onMouseEnter={() => handleItemEnter(item)} // item ref is stable (navMain is a module-level const)
          >
            <SidebarMenuItem>
              {sidebarOpen
                ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <span className="icon-vignette rounded-full">
                          <Image
                            src={item.iconUrl}
                            width={20}
                            height={20}
                            className="block rounded-full"
                            alt={item.title}
                          />
                        </span>
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  )
                : (
                    <NavClassHoverCard item={item} onMouseEnter={() => setSlug(item.slug)} />
                  )}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const classColor = `var(--color-class-${item.slug})`
                    const pillStyle = { "--pill-color": classColor } as React.CSSProperties
                    return (
                      <SidebarMenuSubItem key={subItem.title} className="group/spec">
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span className="icon-vignette rounded-full">
                              <Image
                                src={subItem.iconUrl}
                                width={16}
                                height={16}
                                className="block rounded-full"
                                alt={subItem.title}
                              />
                            </span>
                            <span className="capitalize">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-hover/spec:grid-rows-[1fr]">
                          <div className="overflow-hidden">
                            <div className="flex justify-center gap-1 px-2 pt-0.5 pb-1.5 opacity-0 transition-opacity delay-75 duration-150 group-hover/spec:opacity-100">
                              {(["2v2", "3v3", "shuffle"] as const).map(bracket => (
                                <Link
                                  key={bracket}
                                  href={`/${item.slug}/${subItem.title}/pvp/${bracket}`}
                                  className="class-pill rounded px-1.5 py-0.5 text-[10px] font-semibold"
                                  style={pillStyle}
                                >
                                  {bracket === "shuffle" ? "Solo" : bracket}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
