import { headers } from "next/headers"

export type Locale = "zh" | "en" | "ko"

const supportedLocales = new Set<Locale>(["zh", "en", "ko"])

function resolveRequestLocale(headerValue: string | null | undefined): Locale {
  if (headerValue && supportedLocales.has(headerValue as Locale)) {
    return headerValue as Locale
  }
  return "zh"
}

export async function getLocale(): Promise<Locale> {
  const hdrs = await headers()
  return resolveRequestLocale(hdrs.get("x-summoner-atlas-locale"))
}
