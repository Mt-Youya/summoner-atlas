"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { number, percent, type AugmentRank, type ChampionRank } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Entry = ChampionRank | AugmentRank
type Props = { type: "champion" | "augment" }

export function RankingExplorer({ type }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState(false)
  const query = params.get("q") ?? ""
  const sort = params.get("sort") ?? "winRate"
  useEffect(() => {
    const controller = new AbortController()
    setPending(true)
    setError(false)
    fetch(type === "champion" ? "/api/champions" : "/api/augments", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("榜单请求失败"))))
      .then((data: Entry[]) => setEntries(data))
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true)
      })
      .finally(() => setPending(false))
    return () => controller.abort()
  }, [type])
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setPending(true)
    router.replace(`${pathname}?${next}`)
    queueMicrotask(() => setPending(false))
  }
  const filtered = useMemo(
    () =>
      entries
        .filter(
          (entry) =>
            entry.name.toLowerCase().includes(query.toLowerCase()) ||
            ("alias" in entry && entry.alias.toLowerCase().includes(query.toLowerCase()))
        )
        .toSorted((a, b) => (sort === "matches" ? b.matches - a.matches : b.winRate - a.winRate)),
    [entries, query, sort]
  )
  const href = (id: number) => (type === "champion" ? `/zh/champions/${id}` : `/zh/augments/${id}`)
  return (
    <section className="py-8 pb-28" aria-busy={pending}>
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="min-w-[min(100%,22.5rem)] flex-1"
          value={query}
          onChange={(event) => update("q", event.target.value)}
          placeholder={type === "champion" ? "搜索英雄、拼音或外号" : "搜索海克斯名称"}
          aria-label="筛选榜单"
        />
        <select
          className="h-11 border border-black/30 bg-transparent px-3 text-sm text-[var(--award-ink)] outline-none focus-visible:border-[var(--award-ink)] focus-visible:ring-2 focus-visible:ring-[var(--award-lime)]"
          value={sort}
          onChange={(event) => update("sort", event.target.value)}
          aria-label="排序"
        >
          <option value="winRate">按胜率</option>
          <option value="matches">按场次</option>
        </select>
        {query && (
          <Button
            className="border-black/30 bg-transparent text-[var(--award-ink)] hover:bg-[var(--award-ink)] hover:text-[var(--award-paper)]"
            variant="outline"
            type="button"
            onClick={() => update("q", "")}
          >
            清除筛选
          </Button>
        )}
      </div>
      <div className="border-t-2 border-[var(--award-ink)]">
        <div className="grid min-h-11 grid-cols-[1.8fr_.65fr_.65fr_.6fr] items-center gap-4 border-b border-black/20 font-mono text-[10px] tracking-[0.08em] text-black/60">
          <span>排名 / 名称</span>
          <span>胜率</span>
          <span>场次</span>
          <span>可信度</span>
        </div>
        {filtered.map((entry, index) => (
          <Link
            href={href(entry.id)}
            className="group grid min-h-[76px] grid-cols-[1.8fr_.65fr_.65fr_.6fr] items-center gap-4 border-b border-black/20 transition-colors hover:bg-[var(--award-ink)] hover:px-3 hover:text-[var(--award-paper)]"
            key={entry.id}
          >
            <span className="grid grid-cols-[32px_1fr] gap-x-3.5 gap-y-1">
              <b className="row-span-2 self-center font-mono text-[11px] text-black/55 group-hover:text-white/60">
                {String(index + 1).padStart(2, "0")}
              </b>
              <strong>{entry.name}</strong>
              <small className="truncate text-[11px] text-black/60 group-hover:text-white/60">
                {"description" in entry ? entry.description : entry.alias}
              </small>
            </span>
            <strong className="font-mono text-[var(--positive)]">{percent(entry.winRate)}</strong>
            <span>{number(entry.matches)}</span>
            <span>{entry.matches >= 5000 ? "高可信" : entry.matches >= 1000 ? "中可信" : "样本有限"}</span>
          </Link>
        ))}
        {pending && <p className="py-8 text-black/60">正在读取榜单…</p>}
        {!pending && error && <p className="py-8 text-red-700">榜单暂时不可用，请稍后重试。</p>}
        {!pending && !error && filtered.length === 0 && (
          <p className="py-8 text-black/60">没有匹配数据。请清除筛选或换一个关键词。</p>
        )}
      </div>
    </section>
  )
}
