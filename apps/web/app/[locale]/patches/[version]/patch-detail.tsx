"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/components/locale-provider"

interface PatchInfo {
  version: string
  releasedAt: string
  summary: string
  championChanges: number
  itemChanges: number
  runeChanges: number
}

export function PatchDetailView({ version }: { version: string }) {
  const translate = useTranslation()
  const [patch, setPatch] = useState<PatchInfo | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/patches/${version}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then(setPatch)
      .catch(() => setError(true))
  }, [version])

  if (error) return <p className="py-8 text-negative">{translate("rankingError")}</p>
  if (!patch) return <p className="py-8 text-muted-foreground">{translate("loading")}</p>

  return (
    <section className="mt-8 pb-28">
      <p className="text-muted-foreground">{patch.summary}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded border border-border bg-surface p-4">
          <span className="text-xs text-muted-foreground">英雄变更</span>
          <strong className="mt-1 block font-mono text-lg">{patch.championChanges}</strong>
        </div>
        <div className="rounded border border-border bg-surface p-4">
          <span className="text-xs text-muted-foreground">装备变更</span>
          <strong className="mt-1 block font-mono text-lg">{patch.itemChanges}</strong>
        </div>
        <div className="rounded border border-border bg-surface p-4">
          <span className="text-xs text-muted-foreground">符文变更</span>
          <strong className="mt-1 block font-mono text-lg">{patch.runeChanges}</strong>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">发布时间: {patch.releasedAt}</p>
    </section>
  )
}
