"use client"

import { usePreferencesStore } from "@/stores/preferences"
import { useTranslation } from "@/components/locale-provider"

export function PreferencesPanel() {
  const { theme, version, setTheme, setVersion } = usePreferencesStore()
  const translate = useTranslation()
  return (
    <section className="grid gap-8 border-t border-border py-10">
      <div className="grid gap-3">
        <h2 className="text-2xl font-black tracking-[-0.05em]">{translate("displayPreferences")}</h2>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((value) => (
            <button
              className="border border-border bg-surface px-4 py-2 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={theme === value}
              key={value}
              onClick={() => setTheme(value)}
              type="button"
            >
              {translate(value)}
            </button>
          ))}
        </div>
      </div>
      <label className="grid max-w-xs gap-2 text-sm">
        {translate("defaultDataVersion")}
        <input
          className="h-11 border border-border bg-surface px-3"
          value={version}
          onChange={(event) => setVersion(event.target.value)}
        />
      </label>
    </section>
  )
}
