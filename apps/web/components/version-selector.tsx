"use client"

import { useTranslation } from "@/components/locale-provider"

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
  return (
    <select
      className="min-h-10 rounded-md border border-border bg-surface px-3 font-mono text-sm tabular-nums"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={translate("selectVersion")}
    >
      {patches.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  )
}
