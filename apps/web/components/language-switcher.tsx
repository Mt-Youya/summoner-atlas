"use client"

import { usePathname } from "next/navigation"
import { localeLabels, localizePath, locales } from "@summoner-atlas/i18n"
import { useLocale, useTranslation } from "@/components/locale-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"

const items = locales.map((v) => ({ label: localeLabels[v], value: v }))

export function LanguageSwitcher() {
  const locale = useLocale()
  const translate = useTranslation()
  const pathname = usePathname()
  return (
    <Select
      value={locale}
      items={items}
      onValueChange={(val) => window.location.assign(localizePath(pathname, val as typeof locale))}
    >
      <SelectTrigger
        className="min-h-11 min-w-25 border-border bg-surface text-xs text-foreground"
        aria-label={translate("language")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
