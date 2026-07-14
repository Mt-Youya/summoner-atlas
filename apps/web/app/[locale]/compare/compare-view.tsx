"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"
import { Button } from "@summoner-atlas/ui/button"
import { useTranslation, useLocale } from "@/components/locale-provider"
import { localizePath, translateChampionName } from "@summoner-atlas/i18n"
import { number, percent } from "@/lib/data"

interface ChampionData {
  id: number
  name: string
  alias: string
  winRate: number
  matches: number
}

function confidenceLabel(matches: number, t: ReturnType<typeof useTranslation>) {
  return matches >= 5000 ? t("high") : matches >= 1000 ? t("medium") : t("low")
}

const glassSelect = "min-h-11 w-full border-white/[0.08] bg-white/[0.03] text-sm backdrop-blur-sm"

export function CompareView({ champions }: { champions: ChampionData[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const translate = useTranslation()
  const locale = useLocale()

  const leftParam = searchParams.get("left")
  const rightParam = searchParams.get("right")

  const defaultLeft = String(champions[0]?.id ?? "")
  const defaultRight = String(champions[1]?.id ?? "")

  const [leftVal, setLeftVal] = useState(leftParam ?? defaultLeft)
  const [rightVal, setRightVal] = useState(rightParam ?? defaultRight)

  useEffect(() => {
    if (leftParam) setLeftVal(leftParam)
    if (rightParam) setRightVal(rightParam)
  }, [leftParam, rightParam])

  if (champions.length < 2) {
    return <p className="pb-28 text-muted-foreground">{translate("noCompareData")}</p>
  }

  const left = champions.find((c) => c.id === Number(leftVal)) ?? champions[0]
  const right = champions.find((c) => c.id === Number(rightVal)) ?? champions[1]
  const selected = [left, right].filter((c): c is ChampionData => Boolean(c))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (leftVal) params.set("left", leftVal)
    if (rightVal) params.set("right", rightVal)
    router.push(`?${params.toString()}`)
  }

  const championItems = champions.map((c) => ({
    label: translateChampionName(c.name, locale),
    value: String(c.id),
  }))

  return (
    <>
      <form onSubmit={handleSubmit} className="my-8 border-b border-white/[0.06] pb-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="grid gap-2">
            <label className="text-xs text-muted-foreground">{translate("championOne")}</label>
            <Select value={leftVal} items={championItems} onValueChange={(v) => setLeftVal(v ?? defaultLeft)}>
              <SelectTrigger className={glassSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {championItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-muted-foreground">{translate("championTwo")}</label>
            <Select value={rightVal} items={championItems} onValueChange={(v) => setRightVal(v ?? defaultRight)}>
              <SelectTrigger className={glassSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {championItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="min-h-11 self-end rounded-xl">
            {translate("startCompare")}
          </Button>
        </div>
      </form>
      {selected.length === 2 ? (
        <section className="grid gap-4 pb-28 md:grid-cols-2">
          {selected.map((champion) => (
            <div
              key={champion.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold tracking-[-0.03em]">
                {translateChampionName(champion.name, locale)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{champion.alias}</p>
              <dl className="mt-5 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-muted-foreground">{translate("winRate")}</dt>
                  <dd className="mt-1 font-mono text-xl font-bold tabular-nums text-positive">
                    {percent(champion.winRate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{translate("matches")}</dt>
                  <dd className="mt-1 font-mono text-xl font-bold tabular-nums">
                    {number(champion.matches)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{translate("confidence")}</dt>
                  <dd className="mt-1 text-sm">{confidenceLabel(champion.matches, translate)}</dd>
                </div>
              </dl>
              <Link
                className="mt-5 inline-flex min-h-11 items-center text-sm text-primary transition-colors hover:text-primary/80"
                href={localizePath(`/zh/champions/${champion.id}`, locale)}
              >
                {translate("viewFullCombos")} &rarr;
              </Link>
            </div>
          ))}
        </section>
      ) : (
        <p className="pb-28 text-muted-foreground">{translate("noCompareData")}</p>
      )}
    </>
  )
}
