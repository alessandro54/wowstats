import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { AppFooter } from "@/components/molecules/app-footer"
import { TopNav } from "@/components/molecules/top-nav"
import { AppSidebar } from "@/components/organisms/app-sidebar"
import DynamicBackground from "@/components/organisms/dynamic-background"
import { HoverProvider } from "@/components/providers/hover-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TopNavProvider } from "@/components/providers/top-nav-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"

const inter = Inter({
  subsets: [
    "latin",
  ],
  variable: "--font-inter",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: [
    "latin",
  ],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5123"),
  title: {
    default: "WoW Meta Insights | WoW PvP Meta ",
    template: "%s | WoW PvP Meta",
  },
  description:
    "PvP insights for WoW Arena, Solo Shuffle, and RBG. Best in slot gear based on real player data.",
  openGraph: {
    siteName: "WoW Meta Insights",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const widthCookie = cookieStore.get("sidebar_width")
  const stateCookie = cookieStore.get("sidebar_state")
  const defaultWidth = widthCookie ? Number(widthCookie.value) : undefined
  const defaultOpen = stateCookie ? stateCookie.value === "true" : false

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.wowinsights.xyz" />
        <link rel="preconnect" href="https://render.worldofwarcraft.com" />
      </head>
      <body className="bg-background text-foreground h-dvh overflow-hidden antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <HoverProvider>
            <SidebarProvider defaultOpen={defaultOpen} defaultWidth={defaultWidth}>
              <DynamicBackground />
              <AppSidebar />
              <SidebarInset className="h-dvh overflow-y-auto overflow-x-hidden">
                <TopNavProvider>
                  <TopNav />
                  <div className="flex-1 w-full pb-45">{children}</div>
                  <AppFooter />
                </TopNavProvider>
              </SidebarInset>
            </SidebarProvider>
          </HoverProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
