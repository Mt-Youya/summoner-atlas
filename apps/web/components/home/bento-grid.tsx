"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TierMark } from "@/components/display/tier-mark"
import { MetricValue } from "@/components/display/metric-value"
import { useTranslation, useLocale } from "@/components/locale-provider"
import { localizePath } from "@summoner-atlas/i18n"

gsap.registerPlugin(ScrollTrigger)

interface BentoChampion {
  id: number
  name: string
  alias?: string
  winRate: number
  matches: number
  imageUrl?: string
}

export function BentoGrid({
  champions,
  augmentsHref,
}: {
  champions: BentoChampion[]
  augmentsHref: string
}) {
  const translate = useTranslation()
  const locale = useLocale()
  const sectionRef = useRef<HTMLElement>(null)

  const featured = champions.slice(0, 6)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-bento-card]",
          { opacity: 0, y: 32, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }, sectionRef)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [])

  if (featured.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">{translate("rankingEmpty")}</p>
    )
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-36" aria-labelledby="bento-heading">
      <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
            {translate("stablePicks")}
          </p>
          <h2
            id="bento-heading"
            className="max-w-xl text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-[0.92] tracking-[-0.06em]"
          >
            {translate("homeKicker")}
          </h2>
        </div>
        <Link
          href={localizePath("/zh/champions", locale)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
        >
          {translate("allChampions")} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {/* Featured card: spans 2 cols, 2 rows */}
        {featured[0] && (
          <Link
            data-bento-card
            href={localizePath(`/zh/champions/${featured[0].id}`, locale)}
            className="group/bento relative col-span-2 row-span-2 flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            {featured[0].imageUrl && (
              <Image
                src={featured[0].imageUrl}
                alt={featured[0].name}
                width={200}
                height={200}
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 transition-all duration-700 ease-out group-hover/bento:scale-110 group-hover/bento:opacity-50"
              />
            )}
            <div className="relative z-10">
              <TierMark tier="S" size="sm" />
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em]">{featured[0].name}</h3>
              {featured[0].alias && (
                <p className="mt-1 text-xs text-muted-foreground">{featured[0].alias}</p>
              )}
              <div className="mt-4 flex gap-4">
                <span>
                  <MetricValue value={featured[0].winRate} type="percent" className="text-lg font-bold text-positive" />
                  <span className="ml-1 text-[10px] text-muted-foreground">{translate("winRate")}</span>
                </span>
                <span>
                  <MetricValue value={featured[0].matches} type="number" className="text-lg font-bold" />
                  <span className="ml-1 text-[10px] text-muted-foreground">{translate("matches")}</span>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Stat cards: 1 col each */}
        {featured.slice(1, 5).map((champion, i) => (
          <Link
            data-bento-card
            key={champion.id}
            href={localizePath(`/zh/champions/${champion.id}`, locale)}
            className="group/bento relative col-span-1 flex min-h-[160px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.01] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            {champion.imageUrl && (
              <Image
                src={champion.imageUrl}
                alt={champion.name}
                width={80}
                height={80}
                className="absolute -right-3 -top-3 opacity-20 transition-all duration-700 ease-out group-hover/bento:scale-125 group-hover/bento:opacity-35"
              />
            )}
            <div className="relative z-10">
              <span className="font-mono text-[10px] text-muted-foreground">
                #{String(i + 2).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-base font-bold tracking-[-0.02em] truncate">{champion.name}</h3>
              <div className="mt-2 flex items-center gap-3">
                <MetricValue value={champion.winRate} type="percent" className="text-sm font-bold text-positive" />
              </div>
            </div>
          </Link>
        ))}

        {/* Augments teaser card: spans 2 cols */}
        <Link
          data-bento-card
          href={augmentsHref}
          className="group/bento relative col-span-2 flex min-h-[140px] items-center justify-between overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.01] px-6 py-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]"
        >
          <div>
            <span className="font-mono text-[10px] tracking-[0.08em] text-primary">
              {translate("augments")}
            </span>
            <h3 className="mt-1 text-lg font-bold tracking-[-0.02em]">{translate("researchAugments")}</h3>
            <p className="mt-1 max-w-[36ch] text-xs text-muted-foreground line-clamp-1">
              {translate("augmentDescription")}
            </p>
          </div>
          <span className="shrink-0 text-3xl text-white/10 transition-all duration-500 group-hover/bento:translate-x-1 group-hover/bento:text-primary/40" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  )
}
