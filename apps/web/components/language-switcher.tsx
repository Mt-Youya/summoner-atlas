"use client"

import { usePathname, useRouter } from "next/navigation"
import { localeLabels, localizePath, locales } from "@summoner-atlas/i18n"
import { useLocale, useTranslation } from "@/components/locale-provider"

export function LanguageSwitcher() {
  const locale = useLocale()
  const translate = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  return (
    <label>
      <span className="sr-only">{translate("language")}</span>
      <select
        aria-label={translate("language")}
        className="min-h-11 border border-border bg-surface px-2 text-xs text-foreground"
        value={locale}
        onChange={(event) => router.push(localizePath(pathname, event.target.value as typeof locale))}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {localeLabels[value]}
          </option>
        ))}
      </select>
    </label>
  )
}
