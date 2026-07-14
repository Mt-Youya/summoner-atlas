import { headers } from "next/headers"
import { resolveRequestLocale, type Locale } from "@summoner-atlas/i18n/request"

export async function getLocale(): Promise<Locale> {
  return resolveRequestLocale((await headers()).get("x-summoner-atlas-locale"))
}
