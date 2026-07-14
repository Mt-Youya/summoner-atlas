import en from "./locales/en/common.json"
import ko from "./locales/ko/common.json"
import zh from "./locales/zh/common.json"

export const locales = ["zh", "en", "ko"] as const
export type Locale = (typeof locales)[number]
export const localeLabels: Record<Locale, string> = { zh: "中文", en: "English", ko: "한국어" }

const messages = { zh, en, ko } as const
export type MessageKey = keyof typeof zh

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function t(locale: Locale, key: MessageKey) {
  return messages[locale][key]
}

export function localizePath(path: string, locale: Locale) {
  return path.replace(/^\/(zh|en|ko)(?=\/|$)/, `/${locale}`)
}

// Legacy: PageTitle still uses this, but all pages now pre-translate via t()
export function translateCopy(_locale: Locale, value: string) {
  return value
}

export { translateChampionName } from "./data-translations"
export { translateAugmentName, translateAugmentDesc } from "./augment-translations"
