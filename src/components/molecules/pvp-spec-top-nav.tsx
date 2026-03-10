"use client"

import { usePathname } from "next/navigation"
import { BRACKETS } from "@/config/wow/brackets-config"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { BracketSelector } from "./bracket-selector"
import { TopNavConfig } from "./top-nav-config"

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
          <BreadcrumbLink href="#">{className}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">{specSlug}</BreadcrumbPage>
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
