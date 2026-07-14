"use client"

import { useRef } from "react"
import { useHeroEntrance } from "@/lib/use-hero-entrance"

export function AugmentHeroClient({
  augmentName,
  description,
  winRate,
  matches,
  confidence,
  summaryLabel,
  winRateLabel,
  matchesLabel,
  confidenceLabel,
  dataVersion,
}: {
  augmentName: string
  description: string
  winRate: string
  matches: string
  confidence: string
  summaryLabel: string
  winRateLabel: string
  matchesLabel: string
  confidenceLabel: string
  dataVersion: string
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useHeroEntrance(sectionRef, [
    {
      target: "[data-aug-eyebrow]",
      from: { opacity: 0, y: 8 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 },
    },
    {
      target: "[data-aug-name]",
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 },
    },
    {
      target: "[data-aug-desc]",
      from: { opacity: 0, y: 8 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.4 },
    },
    {
      target: "[data-aug-stat]",
      from: { opacity: 0, y: 12 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08, delay: 0.5 },
    },
  ])

  return (
    <section
      ref={sectionRef}
      className="grid gap-8 border-b border-white/[0.06] py-16 md:grid-cols-[76px_1fr_auto] md:items-center md:py-24"
    >
      <span className="grid size-16 place-items-center rounded-xl border border-primary/30 bg-primary/5 font-mono text-lg font-bold text-primary">
        A
      </span>
      <div>
        <p data-aug-eyebrow className="mb-3 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary opacity-0">
          {summaryLabel} / {dataVersion}
        </p>
        <h1 data-aug-name className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.9] tracking-[-0.07em] opacity-0">
          {augmentName}
        </h1>
        <p data-aug-desc className="mt-2 text-sm text-muted-foreground opacity-0">
          {description}
        </p>
      </div>
      <dl className="col-span-full flex gap-8 md:col-auto">
        <div data-aug-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{winRateLabel}</dt>
          <dd className="font-mono text-2xl font-bold tabular-nums text-positive">{winRate}</dd>
        </div>
        <div data-aug-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{matchesLabel}</dt>
          <dd className="font-mono text-2xl font-bold tabular-nums">{matches}</dd>
        </div>
        <div data-aug-stat className="grid gap-1 opacity-0">
          <dt className="text-[11px] text-muted-foreground">{confidenceLabel}</dt>
          <dd className="text-lg font-semibold">{confidence}</dd>
        </div>
      </dl>
    </section>
  )
}
