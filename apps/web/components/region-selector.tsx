"use client"

import { type Region, REGIONS, regionLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"

const items = REGIONS.map((value) => ({ label: regionLabels[value], value }))

export function RegionSelector({ value, onChange }: { value: Region; onChange: (region: Region) => void }) {
  const translate = useTranslation()
  return (
    <Select value={value} items={items} onValueChange={(val) => onChange(val as Region)}>
      <SelectTrigger
        className="min-h-10 min-w-20 border-border bg-surface font-mono text-sm"
        aria-label={translate("selectRegion")}
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
