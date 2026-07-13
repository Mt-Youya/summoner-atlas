"use client"

import { usePathname } from "next/navigation"
import { localeLabels, localizePath, locales } from "@summoner-atlas/i18n"
import { useLocale, useTranslation } from "@/components/locale-provider"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"

export function LanguageSwitcher() {
  const locale = useLocale()
  const translate = useTranslation()
  const pathname = usePathname()
  return (
    <NativeSelect
      aria-label={translate("language")}
      value={locale}
      onChange={(event) => window.location.assign(localizePath(pathname, event.target.value as typeof locale))}
      className="[&>select]:min-h-11 [&>select]:border-border [&>select]:bg-surface [&>select]:px-2 [&>select]:text-xs [&>select]:text-foreground"
    >
      {locales.map((v) => (<NativeSelectOption key={v} value={v}>{localeLabels[v]}</NativeSelectOption>))}
    </NativeSelect>
  )
}
