"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/components/locale-provider"

interface PatchInfo {
  version: string
  releasedAt: string
  summary: string
  championChanges: number
  itemChanges: number
  runeChanges: number
}

export function PatchesView() {
  const translate = useTranslation()
  const [patches, setPatches] = useState<PatchInfo[]>([])
  const [pending, setPending] = useState(true)

  useEffect(() => {
    fetch("/api/patches")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("请求失败"))))
      .then(setPatches)
      .catch(() => {})
      .finally(() => setPending(false))
  }, [])

  return (
    <>
      {pending ? (
        <p className="py-12 text-muted-foreground">{translate("loadingRanking")}</p>
      ) : (
        <div className="mt-8 divide-y divide-border border-t-2 border-foreground pb-28">
          {patches.map((patch) => (
            <Link
              key={patch.version}
              href={`/zh/patches/${patch.version}`}
              className="flex flex-col gap-2 py-5 transition-colors hover:bg-surface md:flex-row md:items-center md:justify-between"
            >
              <span className="grid">
                <strong className="font-mono text-sm">{patch.version}</strong>
                <small className="text-xs text-muted-foreground">{patch.summary}</small>
              </span>
              <span className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  {translate("championChanges")}: {patch.championChanges}
                </span>
                <span>
                  {translate("itemChanges")}: {patch.itemChanges}
                </span>
                <span>
                  {translate("runeChanges")}: {patch.runeChanges}
                </span>
                <span>{patch.releasedAt}</span>
              </span>
            </Link>
          ))}
          {patches.length === 0 && <p className="py-8 text-muted-foreground">{translate("noPatchesData")}</p>}
        </div>
      )}
    </>
  )
}
