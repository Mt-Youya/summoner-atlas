"use client"

import { type Region, REGIONS, regionLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"

export function RegionSelector({
  value,
  onChange,
}: {
  value: Region
  onChange: (region: Region) => void
}) {
  const translate = useTranslation()
  return (
    <select
      className="min-h-10 rounded-md border border-border bg-surface px-3 font-mono text-sm tabular-nums"
      value={value}
      onChange={(e) => onChange(e.target.value as Region)}
      aria-label={translate("selectRegion")}
    >
      {REGIONS.map((r) => (
        <option key={r} value={r}>
          {regionLabels[r]}
        </option>
      ))}
    </select>
  )
}
