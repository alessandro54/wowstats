"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BRACKETS } from "@/config/wow/brackets-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { titleizeSlug } from "@/lib/utils"
import { BracketSelector } from "@/components/molecules/bracket-selector"
import { TopNavConfig } from "@/components/molecules/top-nav-config"

interface Props {
  className: string
  specSlug: string
  classSlug: WowClassSlug
}

export function PvpSpecTopNav({ className, specSlug, classSlug }: Props) {
  const pathname = usePathname()
  const isOnBracket = BRACKETS.some((b) => pathname.endsWith(`/${b.slug}`))

  const breadcrumb = (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>PvP</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbPage>{className}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/pvp/${classSlug}/${specSlug}`}>
            {titleizeSlug(specSlug)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <TopNavConfig
      key={String(isOnBracket)}
      left={breadcrumb}
      center={
        isOnBracket ? <BracketSelector classSlug={classSlug} specSlug={specSlug} /> : undefined
      }
    />
  )
}
