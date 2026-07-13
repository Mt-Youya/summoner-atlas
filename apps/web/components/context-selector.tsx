"use client"

import { type DataContext } from "@/lib/context"
import { RegionSelector } from "@/components/region-selector"
import { ModeSelector } from "@/components/mode-selector"
import { VersionSelector } from "@/components/version-selector"
import { useTranslation } from "@/components/locale-provider"

export function ContextSelector({
  context,
  patches,
  onContextChange,
  updatedAt,
}: {
  context: DataContext
  patches: string[]
  onContextChange: (next: DataContext) => void
  updatedAt?: string
}) {
  const translate = useTranslation()
  return (
    <section
      className="flex flex-wrap items-center gap-3 border border-border bg-surface p-4"
      aria-label={translate("dataScope")}
    >
      <RegionSelector
        value={context.region}
        onChange={(region) => onContextChange({ ...context, region })}
      />
      <ModeSelector
        value={context.mode}
        onChange={(mode) => onContextChange({ ...context, mode })}
      />
      <VersionSelector
        value={context.patch}
        patches={patches}
        onChange={(patch) => onContextChange({ ...context, patch })}
      />
      {updatedAt && (
        <span className="ml-auto text-xs text-muted-foreground">
          {translate("updated")}: {updatedAt}
        </span>
      )}
    </section>
  )
}
