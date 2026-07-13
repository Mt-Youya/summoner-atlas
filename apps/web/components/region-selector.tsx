"use client"

import { type Region, REGIONS, regionLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"

export function RegionSelector({ value, onChange }: { value: Region; onChange: (region: Region) => void }) {
  const translate = useTranslation()
  return (
    <NativeSelect value={value} onChange={(e) => onChange(e.target.value as Region)} aria-label={translate("selectRegion")} className="[&>select]:min-h-10 [&>select]:border-border [&>select]:bg-surface [&>select]:font-mono [&>select]:text-sm">
      {REGIONS.map((r) => (<NativeSelectOption key={r} value={r}>{regionLabels[r]}</NativeSelectOption>))}
    </NativeSelect>
  )
}
