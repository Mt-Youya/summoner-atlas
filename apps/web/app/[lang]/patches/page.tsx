"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, Skeleton, ToggleGroup, ToggleGroupItem } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"

type GameVersion = { version: string; created_at: string }

export default function PatchesPage() {
  const { t } = useTranslation()
  const [versions, setVersions] = useState<GameVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/game-versions")
      .then(async (response) => (response.ok ? ((await response.json()) as { versions: GameVersion[] }).versions : []))
      .then((data) => {
        setVersions(data)
        setSelectedVersion(data[0]?.version ?? "")
      })
      .finally(() => setLoading(false))
  }, [])

  const selected = versions.find((version) => version.version === selectedVersion)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowPatches")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("patchTimeline")}</h1>
      </div>

      {versions.length === 0 ? (
        <Card className="rounded-2xl card-glow bg-card">
          <CardContent className="py-12 text-center text-muted-foreground">{t("noPatches")}</CardContent>
        </Card>
      ) : (
        <>
          <ToggleGroup
            value={selectedVersion ? [selectedVersion] : []}
            onValueChange={(value) => value.length > 0 && setSelectedVersion(value.at(-1) ?? "")}
            spacing={0}
            className="flex-wrap"
          >
            {versions.map((version) => (
              <ToggleGroupItem key={version.version} value={version.version} variant="outline" className="text-sm">
                {version.version}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {selected && (
            <Card className="rounded-2xl card-glow bg-card">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {t("version")} {selected.version}
                  </h2>
                  <time className="text-sm text-muted-foreground" dateTime={selected.created_at}>
                    {new Date(selected.created_at).toLocaleDateString()}
                  </time>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">{t("noPatches")}</CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
