import { cookies } from "next/headers"
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from "@/lib/locale-config"

export type { Locale } from "@/lib/locale-config"
export { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from "@/lib/locale-config"

/** Read the locale from the cookie store (server-side only). */
export async function getLocale(): Promise<(typeof SUPPORTED_LOCALES)[number]> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return SUPPORTED_LOCALES.includes(value as (typeof SUPPORTED_LOCALES)[number])
    ? (value as (typeof SUPPORTED_LOCALES)[number])
    : DEFAULT_LOCALE
}
