"use client"

import { ChevronRight } from "lucide-react"
import type { SVGProps } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TransitionLink as Link } from "@/components/atoms/transition-link"
import { useCallback, useEffect, useRef, useState } from "react"
import { NavClassHoverCard } from "@/components/molecules/nav-class-hover-card"
import { useHoverSlug, useSetHoverSlug } from "@/components/providers/hover-provider"
import { useActiveColor } from "@/hooks/use-active-color"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
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
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import { navMain } from "@/config/wow/nav-config"

const PREFETCH_BRACKETS = BRACKETS.map((b) => b.slug)

type SvgIcon = (props: SVGProps<SVGSVGElement>) => React.ReactElement

const Icon2v2: SvgIcon = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="3" y1="2" x2="13" y2="13" />
    <line x1="1" y1="5" x2="5.5" y2="1" />
    <line x1="13" y1="2" x2="3" y2="13" />
    <line x1="15" y1="5" x2="10.5" y2="1" />
  </svg>
)

const Icon3v3: SvgIcon = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="8" y1="1" x2="8" y2="11" />
    <line x1="6" y1="3.5" x2="10" y2="3.5" />
    <line x1="2" y1="4" x2="9" y2="14" />
    <line x1="1" y1="6.5" x2="4.5" y2="3.5" />
    <line x1="14" y1="4" x2="7" y2="14" />
    <line x1="15" y1="6.5" x2="11.5" y2="3.5" />
  </svg>
)

const IconSolo: SvgIcon = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="8" r="6" />
    <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" />
    <line x1="4.5" y1="7.5" x2="7.5" y2="4.5" />
  </svg>
)

const IconBlitz: SvgIcon = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 1.5 L13.5 4 L13.5 9 Q13.5 13.5 8 15 Q2.5 13.5 2.5 9 L2.5 4 Z" />
    <polyline points="9.5,4.5 7,8.5 9,8.5 6.5,12.5" />
  </svg>
)

export function NavMain() {
  const router = useRouter()
  const setSlug = useSetHoverSlug()
  const hoverSlug = useHoverSlug()
  const metaIconColor = useActiveColor(hoverSlug ?? undefined)
  const [openSlug, setOpenSlug] = useState<WowClassSlug | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefetchedRef = useRef<Set<string>>(new Set())
  const { open: sidebarOpen } = useSidebar()
  const [isMouse, setIsMouse] = useState(false)
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (e.pointerType === "mouse") setIsMouse(true)
    }
    window.addEventListener("pointermove", handler, {
      once: true,
    })
    return () => window.removeEventListener("pointermove", handler)
  }, [])

  const handleItemEnter = useCallback(
    (item: (typeof navMain)[number]) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setOpenSlug(item.slug)
        setSlug(item.slug)
        if (!prefetchedRef.current.has(item.slug)) {
          prefetchedRef.current.add(item.slug)
          item.items.forEach((spec) => {
            if (process.env.NODE_ENV !== "development") {
              router.prefetch(spec.url)
              PREFETCH_BRACKETS.forEach((bracket) => {
                router.prefetch(`${spec.url}/${bracket}`)
              })
            }
            // Also warm Rails cache for cold ISR regeneration
            fetch(`/api/prefetch/items?spec_id=${spec.id}&bracket=3v3`, {
              priority: "low",
            }).catch(() => {})
            fetch(`/api/prefetch/talents?spec_id=${spec.id}&bracket=3v3`, {
              priority: "low",
            }).catch(() => {})
          })
        }
      }, 80)
    },
    [
      router,
      setSlug,
    ],
  )

  const handleMenuLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpenSlug(null)
    setSlug(null)
  }, [
    setSlug,
  ])

  const META_BRACKETS = [
    {
      slug: "2v2",
      label: "2v2",
      Icon: Icon2v2,
    },
    {
      slug: "3v3",
      label: "3v3",
      Icon: Icon3v3,
    },
    {
      slug: "shuffle",
      label: "Solo Shuffle",
      Icon: IconSolo,
    },
    {
      slug: "blitz",
      label: "Blitz",
      Icon: IconBlitz,
    },
  ] as const

  return (
    <>
      <SidebarGroup className="pb-1">
        <SidebarGroupLabel>PvP Meta Guides</SidebarGroupLabel>
        <SidebarMenu>
          {META_BRACKETS.map((b) => (
            <SidebarMenuItem key={b.slug}>
              <SidebarMenuButton asChild tooltip={b.label}>
                <Link href={`/pvp/meta/${b.slug}/dps`}>
                  <b.Icon
                    className="size-4 shrink-0 transition-colors duration-300"
                    style={{
                      color: metaIconColor,
                    }}
                  />
                  <span className="font-medium">{b.label}</span>
                  {sidebarOpen && <ChevronRight className="ml-auto size-4 opacity-50" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <Separator className="mx-3 my-2 w-auto" />
      <SidebarGroup>
        <SidebarGroupLabel>Class Guides</SidebarGroupLabel>
        <SidebarMenu onMouseLeave={handleMenuLeave}>
          {navMain.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              open={openSlug === item.slug}
              onOpenChange={(open) => {
                if (open) {
                  setOpenSlug(item.slug)
                  setSlug(item.slug as WowClassSlug)
                } else {
                  setOpenSlug(null)
                  setSlug(null)
                }
              }}
              className="group/collapsible"
              onMouseEnter={() => handleItemEnter(item)}
              onTouchStart={() => handleItemEnter(item)}
            >
              <SidebarMenuItem>
                {sidebarOpen || !isMouse ? (
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
                ) : (
                  <NavClassHoverCard item={item} onMouseEnter={() => setSlug(item.slug)} />
                )}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const classColor = `var(--color-class-${item.slug})`
                      const pillStyle = {
                        "--pill-color": classColor,
                      } as React.CSSProperties
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
                                {BRACKETS.map((b) => (
                                  <Link
                                    key={b.slug}
                                    href={`/pvp/${item.slug}/${subItem.title}/${b.slug}`}
                                    className="class-pill rounded px-1.5 py-0.5 text-[10px] font-semibold"
                                    style={pillStyle}
                                  >
                                    {b.label}
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
    </>
  )
}
