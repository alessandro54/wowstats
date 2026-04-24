"use client"

import { ChevronDown, Globe } from "lucide-react"
import Image from "next/image"
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
import { cdnImage } from "@/config/cdn-config"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  type Locale,
  SUPPORTED_LOCALES,
} from "@/lib/locale-config"

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1]
}

function getLocaleLabel(locale: string): string {
  if (locale === "en_US" || locale === "es_MX") {
    return LOCALE_LABELS[locale]
  }

  return LOCALE_LABELS[DEFAULT_LOCALE]
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
          {getLocaleLabel(locale)}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {SUPPORTED_LOCALES.map((loc: Locale) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              {getLocaleLabel(loc)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border/10 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top row: logo + brand + nav */}
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src={cdnImage("/assets/logo.png", 48)}
              alt="WoW Stats"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-semibold leading-tight">WoW Stats</p>
              <p className="text-xs text-muted-foreground">PvP & PvE Meta</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row: copyright + locale */}
        <div className="flex flex-col items-center gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WoW Stats. Not affiliated with Blizzard Entertainment.
          </p>
          <LanguageDropdown />
        </div>
      </div>
    </footer>
  )
}
