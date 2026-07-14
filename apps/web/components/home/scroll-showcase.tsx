"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation, useLocale } from "@/components/locale-provider"
import { localizePath } from "@summoner-atlas/i18n"

gsap.registerPlugin(ScrollTrigger)

interface ShowcaseChampion {
  id: number
  name: string
  alias?: string
  winRate: number
  matches: number
  imageUrl?: string
}

export function ScrollShowcase({ champions }: { champions: ShowcaseChampion[] }) {
  const translate = useTranslation()
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const topChampions = champions.slice(0, 8)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (!containerRef.current || !pinRef.current || !cardsRef.current) return
      const cards = cardsRef.current.querySelectorAll("[data-showcase-card]")

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: true,
        })
        for (const card of cards) {
          gsap.fromTo(
              card,
              { opacity: 0.2, scale: 0.88, y: 60 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  end: "top 30%",
                  toggleActions: "play reverse play reverse",
                },
              }
          )
        }
      }, containerRef)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [])

  if (topChampions.length === 0) return null

  return (
    <section
      ref={containerRef}
      className="border-t border-white/6 py-24 md:py-36"
      aria-labelledby="showcase-heading"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(240px,320px)_1fr] lg:gap-16">
        <div ref={pinRef} className="self-start">
          <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
            {translate("trendingUp")}
          </p>
          <h2
            id="showcase-heading"
            className="text-[clamp(2rem,4vw,3rem)] font-black leading-[0.94] tracking-[-0.06em]"
          >
            {translate("trendingUpTitle")}
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm leading-6 text-muted-foreground">
            {translate("contextHelp")}
          </p>
        </div>

        <div ref={cardsRef} className="grid gap-3">
          {topChampions.map((champion, i) => (
            <Link
              data-showcase-card
              key={champion.id}
              href={localizePath(`/zh/champions/${champion.id}`, locale)}
              className="group/showcase flex items-center gap-5 rounded-2xl border border-white/5 bg-white/1 p-5 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white/3"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/3 font-mono text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-lg font-bold tracking-[-0.02em]">
                  {champion.name}
                </strong>
                {champion.alias && (
                  <span className="text-xs text-muted-foreground">{champion.alias}</span>
                )}
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-mono text-lg font-bold tabular-nums text-positive">
                  {(champion.winRate * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {champion.matches >= 1000
                    ? `${(champion.matches / 1000).toFixed(1)}k`
                    : champion.matches}{" "}
                  {translate("games")}
                </span>
              </span>
              <span className="hidden shrink-0 text-white/10 transition-all duration-500 group-hover/showcase:translate-x-1 group-hover/showcase:text-primary/40 sm:block" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
