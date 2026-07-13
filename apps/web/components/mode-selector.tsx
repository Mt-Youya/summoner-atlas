"use client"

import { type GameMode, GAME_MODES, modeLabels } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"

const items = GAME_MODES.map((value) => ({ label: modeLabels[value], value }))

export function ModeSelector({ value, onChange }: { value: GameMode; onChange: (mode: GameMode) => void }) {
  const translate = useTranslation()
  return (
    <Select value={value} items={items} onValueChange={(val) => onChange(val as GameMode)}>
      <SelectTrigger
        className="min-h-10 min-w-25 border-border bg-surface font-mono text-sm"
        aria-label={translate("selectMode")}
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
