"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Locale, localeLabels, t as translate, locales, isLocale } from "@summoner-atlas/i18n"

export type { Locale }
export { localeLabels, locales }

interface LanguageState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "zh" as Locale,
      setLocale: (locale) => set({ locale }),
    }),
    { name: "summoner-atlas-locale" }
  )
)

export function useTranslation() {
  const locale = useLanguage((s) => s.locale)

  function t(key: string, fallback?: string): string {
    return translate(locale, key as never) || fallback || key
  }

  return { t, locale }
}

export { isLocale }
