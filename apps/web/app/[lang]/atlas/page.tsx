"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SparklesIcon } from "@hugeicons/core-free-icons"
import { Skeleton } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import * as d3 from "d3"
import type { AtlasGraphData, AtlasGraphNode } from "@/lib/data-service"

export default function AtlasPage() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<AtlasGraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await mockDataService.getAtlasPreview({ mode: "aram" })
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!data || !svgRef.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = Math.min(600, window.innerHeight * 0.7)
    svg.attr("viewBox", `0 0 ${width} ${height}`)

    const g = svg.append("g")

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString())
      })
    svg.call(zoom)

    // Prepare data
    const nodes: (AtlasGraphNode & { index?: number; x?: number; y?: number; vx?: number; vy?: number })[] =
      data.nodes.map((n) => ({ ...n }))
    const links = data.links.map((l) => ({ ...l }))

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.size * 5 + 8)
      )

    if (prefersReduced) {
      simulation.stop()
      // Position in grid without animation
      nodes.forEach((n, i) => {
        n.x = n.x ?? 100 + (i % 6) * ((width - 200) / 5)
        n.y = n.y ?? 100 + Math.floor(i / 6) * ((height - 200) / 4)
      })
    }

    // Draw links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(0,212,255,0.15)")
      .attr("stroke-width", (d) => d.strength * 2.5)
      .attr("stroke-dasharray", "4 2")

    // Draw nodes
    const node = g
      .append("g")
      .selectAll<SVGGElement, any>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (_event: any, d: AtlasGraphNode) => {
        const path = d.type === "champion" ? `/champions/${d.id}` : `/augments/${d.id}`
        router.push(`/${locale}${path}`)
      })

    node
      .append("circle")
      .attr("r", (d) => d.size * 3 + 6)
      .attr("fill", (d) => (d.type === "champion" ? "url(#nodeChampGrad)" : "url(#nodeAugGrad)"))
      .attr("stroke", (d) => (d.type === "champion" ? "#00D4FF" : "#7B2FBE"))
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.9)

    node
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#E5E7EB")
      .attr("font-size", (d) => Math.max(9, d.size * 2.5))
      .attr("font-family", "Outfit, sans-serif")
      .attr("pointer-events", "none")
      .style("text-shadow", "0 0 6px rgba(0,0,0,0.8)")

    // Glow filters
    const defs = svg.append("defs")
    ;[
      { id: "nodeChampGrad", c1: "#00D4FF", c2: "#0066AA" },
      { id: "nodeAugGrad", c1: "#7B2FBE", c2: "#3A1570" },
    ].forEach(({ id, c1, c2 }) => {
      const grad = defs.append("radialGradient").attr("id", id)
      grad.append("stop").attr("offset", "0%").attr("stop-color", c1)
      grad.append("stop").attr("offset", "100%").attr("stop-color", c2)
    })

    // Tick
    if (!prefersReduced) {
      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      })
      simulation.alpha(1).restart()
    } else {
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      link
        .attr("x1", (d: any) => d.source.x ?? 0)
        .attr("y1", (d: any) => d.source.y ?? 0)
        .attr("x2", (d: any) => d.target.x ?? 0)
        .attr("y2", (d: any) => d.target.y ?? 0)
    }

    return () => {
      simulation.stop()
    }
  }, [data, locale, router])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 shadow-[var(--glow-low)]">
          <HugeiconsIcon icon={SparklesIcon} className="size-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("error")}</h2>
        <p className="text-muted-foreground mb-8">{t("cannotLoadPage")}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-[var(--glow-mid)]"
        >
          {t("reload")}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Atlas</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("openAtlas")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("augmentCrosstableHint")}</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#00D4FF] shadow-[0_0_6px_#00D4FF]" />
          <span className="text-muted-foreground">{t("champions")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#7B2FBE] shadow-[0_0_6px_#7B2FBE]" />
          <span className="text-muted-foreground">{t("augments")}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">{t("augmentSynergyRef")}</span>
      </div>

      {/* Graph */}
      <div className="rounded-2xl card-glow bg-card overflow-hidden">
        <svg ref={svgRef} className="w-full" style={{ minHeight: "500px" }} />
      </div>

      <p className="text-xs text-muted-foreground text-center">{t("contextHelp")}</p>
    </div>
  )
}
