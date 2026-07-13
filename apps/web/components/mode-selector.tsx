"use client"

import { type GameMode, GAME_MODES, modeLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"

export function ModeSelector({ value, onChange }: { value: GameMode; onChange: (mode: GameMode) => void }) {
  const translate = useTranslation()
  return (
    <select
      className="min-h-10 rounded-md border border-border bg-surface px-3 font-mono text-sm tabular-nums"
      value={value}
      onChange={(e) => onChange(e.target.value as GameMode)}
      aria-label={translate("selectMode")}
    >
      {GAME_MODES.map((m) => (
        <option key={m} value={m}>
          {modeLabels[m]}
        </option>
      ))}
    </select>
  )
}
