"use client"

import { useMemo } from "react"
import { useTranslation } from "@/components/locale-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"

export function VersionSelector({
  value,
  patches,
  onChange,
}: {
  value: string
  patches: string[]
  onChange: (patch: string) => void
}) {
  const translate = useTranslation()
  const items = useMemo(() => patches.map((p) => ({ label: p, value: p })), [patches])
  return (
    <Select value={value} items={items} onValueChange={(v) => onChange(v ?? value)}>
      <SelectTrigger
        className="min-h-10 min-w-[90px] border-border bg-surface font-mono text-sm"
        aria-label={translate("selectVersion")}
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
