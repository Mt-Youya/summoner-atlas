"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"
import { Button } from "@summoner-atlas/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@summoner-atlas/ui/card"
import { Field, FieldLabel, FieldGroup } from "@summoner-atlas/ui/field"
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
      <form onSubmit={handleSubmit} className="my-8 border-b border-border pb-8">
        <FieldGroup className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field>
            <FieldLabel>{translate("championOne")}</FieldLabel>
            <Select value={leftVal} items={championItems} onValueChange={(v) => setLeftVal(v ?? defaultLeft)}>
              <SelectTrigger className="min-h-11 w-full border-border bg-surface text-sm">
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
          </Field>
          <Field>
            <FieldLabel>{translate("championTwo")}</FieldLabel>
            <Select value={rightVal} items={championItems} onValueChange={(v) => setRightVal(v ?? defaultRight)}>
              <SelectTrigger className="min-h-11 w-full border-border bg-surface text-sm">
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
          </Field>
          <Button type="submit" className="min-h-11 self-end">
            {translate("startCompare")}
          </Button>
        </FieldGroup>
      </form>
      {selected.length === 2 ? (
        <section className="grid gap-4 pb-28 md:grid-cols-2">
          {selected.map((champion) => (
            <Card key={champion.id}>
              <CardHeader>
                <CardTitle>{translateChampionName(champion.name, locale)}</CardTitle>
                <CardDescription>{champion.alias}</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">{translate("winRate")}</dt>
                    <dd className="m-0 mt-1 font-mono text-xl text-positive">{percent(champion.winRate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{translate("matches")}</dt>
                    <dd className="m-0 mt-1 font-mono text-xl">{number(champion.matches)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{translate("confidence")}</dt>
                    <dd className="m-0 mt-1 text-sm">{confidenceLabel(champion.matches, translate)}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <Link
                  className="inline-flex min-h-11 items-center text-sm text-primary"
                  href={localizePath(`/zh/champions/${champion.id}`, locale)}
                >
                  {translate("viewFullCombos")}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>
      ) : (
        <p className="pb-28 text-muted-foreground">{translate("noCompareData")}</p>
      )}
    </>
  )
}
