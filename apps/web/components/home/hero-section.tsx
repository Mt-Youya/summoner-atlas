"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useTranslation } from "@/components/locale-provider"

interface SearchEntry {
  id: number
  name: string
  aliases: string[]
  kind: string
  href: string
}

export function HeroClient({
  titleA,
  titleB,
  kicker,
  description,
  entries,
  children,
}: {
  titleA: string
  titleB: string
  kicker: string
  description: string
  entries: SearchEntry[]
  children: React.ReactNode
}) {
  const translate = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-hero-kicker]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
        )
        gsap.fromTo(
          "[data-hero-line]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12, delay: 0.3 }
        )
        gsap.fromTo(
          "[data-hero-desc]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.7 }
        )
        gsap.fromTo(
          "[data-hero-search]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.85 }
        )
        gsap.fromTo(
          "[data-hero-image]",
          { opacity: 0, scale: 0.85, rotate: -2 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "power3.out", delay: 0.5 }
        )
      }, containerRef)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative pt-[clamp(5rem,10vw,8rem)] pb-20 md:pb-28">
      <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="relative z-20">
          <p
            data-hero-kicker
            className="mb-5 font-mono text-[11px] font-semibold tracking-[0.14em] text-primary opacity-0"
          >
            {kicker}
          </p>
          <h1 className="max-w-2xl text-[clamp(3.2rem,7vw,5.5rem)] font-black leading-[0.88] tracking-[-0.07em]">
            <span data-hero-line className="block opacity-0">
              {titleA}
            </span>
            <span data-hero-line className="block text-primary opacity-0">
              {titleB}
            </span>
          </h1>
          <p
            data-hero-desc
            className="mt-6 max-w-[48ch] text-base leading-7 text-muted-foreground opacity-0"
          >
            {description}
          </p>
          <div data-hero-search className="mt-8 opacity-0">
            {children}
          </div>
        </div>
        <div data-hero-image className="relative z-10 hidden opacity-0 md:block" aria-hidden="true">
          <div className="relative mx-auto aspect-square max-w-[360px]">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute inset-8 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm" />
            <div className="absolute inset-12 flex items-center justify-center rounded-full border border-white/[0.04]">
              <span className="font-mono text-[10rem] font-black leading-none text-primary/20 select-none">
                A
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { useMemo, useState } from "react"
import { useTranslation as useClientTranslation } from "@/components/locale-provider"

export function GlobalGameSearchClient({ entries }: { entries: SearchEntry[] }) {
  const translate = useClientTranslation()
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()
  const results = useMemo(
    () =>
      normalized
        ? entries
            .filter((entry) =>
              [entry.name, ...entry.aliases].some((v) => v.toLowerCase().includes(normalized))
            )
            .slice(0, 8)
        : [],
    [entries, normalized]
  )

  return (
    <div className="relative max-w-xl">
      <label className="sr-only" htmlFor="global-search">
        {translate("search")}
      </label>
      <div className="relative">
        <input
          id="global-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-14 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-base text-foreground outline-none backdrop-blur-sm transition-all placeholder:text-white/25 focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_-8px_var(--primary)]"
          placeholder={translate("searchPlaceholder")}
          autoComplete="off"
          aria-describedby="global-search-help"
          aria-controls="global-search-results"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 text-sm pointer-events-none select-none">
          /
        </span>
      </div>
      <p id="global-search-help" className="mt-2.5 text-xs text-white/25">
        {translate("searchHelp")}
      </p>
      {normalized && (
        <div
          id="global-search-results"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[oklch(0.22_0.018_250/0.95)] backdrop-blur-xl shadow-2xl"
          role="status"
          aria-live="polite"
        >
          {results.length ? (
            results.map((entry) => (
              <Link
                className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-3.5 transition-colors hover:bg-white/[0.04]"
                href={entry.href}
                key={`${entry.kind}-${entry.id}`}
              >
                <span className="min-w-[4.5rem] font-mono text-[11px] text-white/30">{entry.kind}</span>
                <strong className="flex-1 truncate">{entry.name}</strong>
                <span className="text-xs text-white/20">&rarr;</span>
              </Link>
            ))
          ) : (
            <p className="px-5 py-4 text-sm text-muted-foreground">{translate("searchEmpty")}</p>
          )}
        </div>
      )}
    </div>
  )
}
