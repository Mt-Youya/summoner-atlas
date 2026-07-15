"use client"

import { useState, useEffect } from "react"
import { Badge, Skeleton } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"

interface MockPatch {
  version: string
  publishDate: string
  summary: string
  championChanges: { championName: string; type: "buff" | "nerf" | "adjust"; summary: string }[]
  itemChanges: { itemName: string; type: "buff" | "nerf" | "adjust"; summary: string }[]
  runeChanges: { runeName: string; type: "buff" | "nerf" | "adjust"; summary: string }[]
}

function generateMockPatches(): MockPatch[] {
  const patches = ["25.14", "25.13", "25.12", "25.11", "25.10"]
  const dates = ["2026-07-09", "2026-06-25", "2026-06-11", "2026-05-28", "2026-05-14"]
  return patches.map((v, i) => ({
    version: v,
    publishDate: dates[i],
    summary: `Patch ${v} brings balance adjustments across ARAM, addressing outliers in champion performance and augment effectiveness.`,
    championChanges: [
      { championName: "Aatrox", type: "buff" as const, summary: "Base AD +3. Health growth +5." },
      { championName: "Zed", type: "nerf" as const, summary: "Q damage -10 at all ranks." },
      { championName: "Lux", type: "adjust" as const, summary: "E AP ratio adjusted 0.7 -> 0.65. Base damage +20." },
    ],
    itemChanges: [
      { itemName: "Luden's Tempest", type: "buff" as const, summary: "AP increased 90 -> 95." },
      { itemName: "Shadowflame", type: "nerf" as const, summary: "Magic pen reduced 15 -> 12." },
    ],
    runeChanges: [{ runeName: "Electrocute", type: "adjust" as const, summary: "Cooldown 25s -> 20s. Damage -10." }],
  }))
}

const changeVariant = (type: "buff" | "nerf" | "adjust") =>
  type === "buff" ? "default" : type === "nerf" ? "destructive" : "outline"

const changeLabel = (type: "buff" | "nerf" | "adjust") =>
  type === "buff" ? "Buff" : type === "nerf" ? "Nerf" : "Adjust"

export default function PatchesPage() {
  const { t } = useTranslation()
  const [patches, setPatches] = useState<MockPatch[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = generateMockPatches()
    setPatches(data)
    setSelectedVersion(data[0].version)
    setLoading(false)
  }, [])

  const selected = patches.find((p) => p.version === selectedVersion)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-8 w-64" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowPatches")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("patchTimeline")}</h1>
      </div>

      {/* Version selector */}
      <div className="flex flex-wrap gap-2">
        {patches.map((p) => (
          <button
            key={p.version}
            onClick={() => setSelectedVersion(p.version)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              p.version === selectedVersion
                ? "bg-primary text-primary-foreground shadow-[var(--glow-mid)]"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.version}
          </button>
        ))}
      </div>

      {/* Selected patch */}
      {selected && (
        <div className="space-y-6">
          <div className="rounded-2xl card-glow bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-foreground">
                {t("version")} {selected.version}
              </h2>
              <span className="text-sm text-muted-foreground">{selected.publishDate}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{selected.summary}</p>
          </div>

          {/* Champion Changes */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t("championChanges")}
            </h3>
            <div className="space-y-3">
              {selected.championChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Badge variant={changeVariant(c.type)} className="text-[10px] w-14 justify-center">
                    {changeLabel(c.type)}
                  </Badge>
                  <span className="font-medium text-sm text-foreground">{c.championName}</span>
                  <span className="text-sm text-muted-foreground">{c.summary}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Item Changes */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t("itemChanges")}
            </h3>
            <div className="space-y-3">
              {selected.itemChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Badge variant={changeVariant(c.type)} className="text-[10px] w-14 justify-center">
                    {changeLabel(c.type)}
                  </Badge>
                  <span className="font-medium text-sm text-foreground">{c.itemName}</span>
                  <span className="text-sm text-muted-foreground">{c.summary}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rune Changes */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t("runeChanges")}
            </h3>
            <div className="space-y-3">
              {selected.runeChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Badge variant={changeVariant(c.type)} className="text-[10px] w-14 justify-center">
                    {changeLabel(c.type)}
                  </Badge>
                  <span className="font-medium text-sm text-foreground">{c.runeName}</span>
                  <span className="text-sm text-muted-foreground">{c.summary}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
