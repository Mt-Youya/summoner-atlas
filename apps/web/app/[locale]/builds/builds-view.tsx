"use client"

import { ContextSelector } from "@/components/selector/context-selector"
import { DATA_CONTEXT } from "@/lib/context"
import { AVAILABLE_PATCHES } from "@/lib/data"
import { useTranslation } from "@/components/locale-provider"

export function BuildsView() {
  const translate = useTranslation()
  return (
    <>
      <ContextSelector context={DATA_CONTEXT} patches={AVAILABLE_PATCHES} />
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-4 pb-28 pt-20 text-center">
        <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
          {translate("builds")}
        </span>
        <h2 className="max-w-lg text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.04em]">
          {translate("championBuildResearch")}
        </h2>
        <p className="max-w-[48ch] text-sm leading-6 text-muted-foreground">
          构筑研究功能即将上线，届时将支持召唤师峡谷和大乱斗模式的完整出装、符文与加点推荐。
        </p>
      </section>
    </>
  )
}
