"use client"

import { useState } from "react"
import { ContextSelector } from "@/components/context-selector"
import { GlobalGameSearch } from "@/components/global-game-search"
import { BuildRecommendation, type BuildRecommendationData } from "@/components/build-recommendation"
import { DATA_CONTEXT } from "@/lib/context"
import { AVAILABLE_PATCHES } from "@/lib/data"
import { useTranslation } from "@/components/locale-provider"

export function BuildsView() {
  const translate = useTranslation()
  const [context, setContext] = useState(DATA_CONTEXT)
  const [builds] = useState<BuildRecommendationData[]>([])

  return (
    <>
      <ContextSelector context={context} patches={AVAILABLE_PATCHES} onContextChange={setContext} />
      <section className="mt-8">
        <GlobalGameSearch entries={[]} />
      </section>
      {builds.length > 0 && (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {builds.map((b, i) => (
            <BuildRecommendation key={i} build={b} />
          ))}
        </section>
      )}
      {builds.length === 0 && (
        <p className="mt-12 pb-28 text-center text-muted-foreground">
          搜索英雄以查看推荐构筑。当前覆盖召唤师峡谷和大乱斗模式。
        </p>
      )}
    </>
  )
}
