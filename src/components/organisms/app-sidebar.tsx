"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { ThemeDropdown } from "@/components/atoms/theme-dropdown"
import { ThemeSwitcher } from "@/components/atoms/theme-switcher"
import { NavMain } from "@/components/organisms/nav-main"
import {
  SidebarHeader,
  SidebarFooter,
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, isMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-3.5">
        <Link
          href="/"
          className="flex items-center rounded-md hover:bg-sidebar-accent transition-colors translate-x-0.5"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={90}
            height={90}
            className={`block shrink-0 rounded-full object-contain transition-all duration-200 ${open ? "size-12" : "size-8"}`}
          />
          {open && <span className="text-sm font-semibold truncate">WoW Insights</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center pb-4 group-data-[collapsible=icon]:hidden">
        {isMobile ? <ThemeDropdown /> : <ThemeSwitcher />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
