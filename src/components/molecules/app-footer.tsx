"use client"

import { ChevronDown, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FOOTER_LINKS } from "@/config/app-config"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/locale-config"

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1]
}

function LanguageDropdown() {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const saved = getCookie(LOCALE_COOKIE) as Locale | undefined
    if (saved && SUPPORTED_LOCALES.includes(saved)) setLocale(saved)
  }, [])

  function handleChange(value: string) {
    const next = value as Locale
    setLocale(next)
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Globe className="size-3.5" />
          {LOCALE_LABELS[locale]}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {SUPPORTED_LOCALES.map((loc) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              {LOCALE_LABELS[loc]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppFooter() {
  return (
    <footer className="border-t bg-card/20 px-6 py-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <LanguageDropdown />
      </div>
    </footer>
  )
}
