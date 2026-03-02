import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import DynamicBackground from "@/components/dynamic-background";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { HoverProvider } from "@/components/wow/hover-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5123"),
  title: {
    default: "WoW PvP Meta",
    template: "%s | WoW PvP Meta",
  },
  description: "PvP insights for WoW Arena, Solo Shuffle, and RBG. Best in slot gear based on real player data.",
  openGraph: {
    siteName: "WoW PvP Meta",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <HoverProvider>
            <SidebarProvider>
              <DynamicBackground />
              <AppSidebar />
              <SidebarInset>
                <main>
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </HoverProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
