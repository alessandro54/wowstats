"use client"

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react"
import * as React from "react"

import { TeamSwitcher } from "@/components/molecules/team-switcher"
import { NavMain } from "@/components/organisms/nav-main"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Acme Inc",
              logo: GalleryVerticalEnd,
              plan: "Enterprise",
            },
            {
              name: "Acme Corp.",
              logo: AudioWaveform,
              plan: "Startup",
            },
            {
              name: "Evil Corp.",
              logo: Command,
              plan: "Free",
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
