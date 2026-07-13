"use client"

import { usePreferencesStore } from "@/stores/preferences"

export function PreferencesPanel() {
  const { theme, version, setTheme, setVersion } = usePreferencesStore()
  return (
    <section className="grid gap-8 border-t border-border py-10">
      <div className="grid gap-3">
        <h2 className="text-2xl font-black tracking-[-0.05em]">显示偏好</h2>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((value) => (
            <button
              className="border border-border bg-surface px-4 py-2 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={theme === value}
              key={value}
              onClick={() => setTheme(value)}
              type="button"
            >
              {value === "dark" ? "深色" : "浅色"}
            </button>
          ))}
        </div>
      </div>
      <label className="grid max-w-xs gap-2 text-sm">
        默认数据版本
        <input
          className="h-11 border border-border bg-surface px-3"
          value={version}
          onChange={(event) => setVersion(event.target.value)}
        />
      </label>
    </section>
  )
}
