export const SUPPORTED_LOCALES = [
  "en_US",
  "es_MX",
] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_COOKIE = "locale"
export const DEFAULT_LOCALE: Locale = "en_US"

export const LOCALE_LABELS: Record<Locale, string> = {
  en_US: "English",
  es_MX: "Español",
}
