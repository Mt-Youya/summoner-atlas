"use client"

import { useRef } from "react"
import { useHeroEntrance } from "@/lib/use-hero-entrance"

export function ChampionHeroClient({
  children,
  championName,
  alias,
  winRate,
  matches,
  confidence,
  summaryLabel,
  winRateLabel,
  matchesLabel,
  confidenceLabel,
  publicSnapshotLabel,
  dataVersion,
}: {
  children: React.ReactNode
  championName: string
  alias: string
  winRate: string
  matches: string
  confidence: string
  summaryLabel: string
  winRateLabel: string
  matchesLabel: string
  confidenceLabel: string
  publicSnapshotLabel: string
  dataVersion: string
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useHeroEntrance(sectionRef, [
    {
      target: "[data-detail-eyebrow]",
      from: { opacity: 0, y: 8 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 },
    },
    {
      target: "[data-detail-name]",
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 },
    },
    {
      target: "[data-detail-stat]",
      from: { opacity: 0, y: 12 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08, delay: 0.5 },
    },
    {
      target: "[data-detail-image]",
      from: { opacity: 0, scale: 0.9 },
      to: { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.3 },
    },
  ])

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-[80px_1fr] gap-5 border-b border-white/[0.06] py-16 md:grid-cols-[140px_1fr_auto] md:items-center md:gap-8 md:py-24"
    >
      <div data-detail-image className="opacity-0">
        {children}
      </div>
      <div>
        <p data-detail-eyebrow className="mb-3 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary opacity-0">
          {summaryLabel} / {dataVersion}
        </p>
        <h1 data-detail-name className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.9] tracking-[-0.07em] opacity-0">
          {championName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {alias} · {publicSnapshotLabel}
        </p>
      </div>
      <dl className="col-span-full flex gap-8 md:col-auto">
        <div data-detail-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{winRateLabel}</dt>
          <dd className="font-mono text-2xl font-bold tabular-nums text-positive">{winRate}</dd>
        </div>
        <div data-detail-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{matchesLabel}</dt>
          <dd className="font-mono text-2xl font-bold tabular-nums">{matches}</dd>
        </div>
        <div data-detail-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{confidenceLabel}</dt>
          <dd className="text-lg font-semibold">{confidence}</dd>
        </div>
      </dl>
    </section>
  )
}
