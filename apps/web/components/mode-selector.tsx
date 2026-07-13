"use client"

import { type GameMode, GAME_MODES, modeLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"

export function ModeSelector({ value, onChange }: { value: GameMode; onChange: (mode: GameMode) => void }) {
  const translate = useTranslation()
  return (
    <NativeSelect value={value} onChange={(e) => onChange(e.target.value as GameMode)} aria-label={translate("selectMode")} className="[&>select]:min-h-10 [&>select]:border-border [&>select]:bg-surface [&>select]:font-mono [&>select]:text-sm">
      {GAME_MODES.map((m) => (<NativeSelectOption key={m} value={m}>{modeLabels[m]}</NativeSelectOption>))}
    </NativeSelect>
  )
}
