"use client"

import { createContext, useContext } from "react"
import { t, type Locale, type MessageKey } from "@summoner-atlas/i18n"

const LocaleContext = createContext<Locale>("zh")

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useTranslation() {
  const locale = useLocale()
  return (key: MessageKey) => t(locale, key)
}
