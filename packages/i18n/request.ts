import { isLocale, type Locale } from "./src"

export type { Locale } from "./src"

export function resolveRequestLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : "zh"
}
