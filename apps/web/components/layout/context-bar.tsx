"use client"

import { type DataContext } from "@/lib/context"
import { useTranslation } from "@/components/locale-provider"

export function ContextBar({ context, updatedAt }: { context: DataContext; updatedAt?: string }) {
  const translate = useTranslation()
  return (
    <section
      className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-[repeat(3,minmax(0,1fr))_2fr]"
      aria-label={translate("dataScope")}
    >
      <div className="grid min-h-20 gap-1.5 bg-surface p-4">
        <span className="text-xs text-muted-foreground">{translate("dataScope")}</span>
        <strong className="font-mono text-sm">{translate("globalSample")}</strong>
      </div>
      <div className="grid min-h-20 gap-1.5 bg-surface p-4">
        <span className="text-xs text-muted-foreground">{translate("mode")}</span>
        <strong className="font-mono text-sm">{translate("aram")}</strong>
      </div>
      <div className="grid min-h-20 gap-1.5 bg-surface p-4">
        <span className="text-xs text-muted-foreground">{translate("version")}</span>
        <strong className="font-mono text-sm">{context.patch}</strong>
      </div>
      <p className="col-span-2 m-0 grid min-h-20 content-center bg-surface p-4 text-xs leading-5 text-muted-foreground md:col-span-1">
        {updatedAt ?? translate("contextHelp")}
      </p>
    </section>
  )
}
