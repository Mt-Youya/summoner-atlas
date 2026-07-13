"use client"

import { useTranslation } from "@/components/locale-provider"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"

export function VersionSelector({ value, patches, onChange }: { value: string; patches: string[]; onChange: (patch: string) => void }) {
  const translate = useTranslation()
  return (
    <NativeSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={translate("selectVersion")}
      className="[&>select]:min-h-10 [&>select]:border-border [&>select]:bg-surface [&>select]:font-mono [&>select]:text-sm"
    >
      {patches.map((p) => (
        <NativeSelectOption key={p} value={p}>{p}</NativeSelectOption>
      ))}
    </NativeSelect>
  )
}
