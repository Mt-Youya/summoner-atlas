"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useTranslation } from "@/components/locale-provider"

type SearchEntry = { id: number; name: string; aliases: string[]; kind: "英雄" | "海克斯"; href: string }

export function GlobalGameSearch({ entries }: { entries: SearchEntry[] }) {
  const translate = useTranslation()
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()
  const results = useMemo(
    () =>
      normalized
        ? entries
            .filter((entry) => [entry.name, ...entry.aliases].some((value) => value.toLowerCase().includes(normalized)))
            .slice(0, 8)
        : [],
    [entries, normalized]
  )

  return (
    <div className="relative max-w-2xl">
      <label
        className="mb-2 block font-mono text-xs font-bold tracking-[.1em] text-muted-foreground"
        htmlFor="global-search"
      >
        {translate("search")}
      </label>
      <input
        id="global-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-h-14 w-full border border-border bg-surface px-4 text-base text-foreground"
        placeholder={translate("searchPlaceholder")}
        autoComplete="off"
        aria-describedby="global-search-help"
        aria-controls="global-search-results"
      />
      <p id="global-search-help" className="mt-2 text-xs text-muted-foreground">
        {translate("searchHelp")}
      </p>
      {normalized && (
        <div
          id="global-search-results"
          className="absolute z-10 mt-2 w-full border border-border bg-surface-raised"
          role="status"
          aria-live="polite"
        >
          {results.length ? (
            results.map((entry) => (
              <Link
                className="grid min-h-14 grid-cols-[72px_1fr_auto] items-center gap-2 border-b border-border px-4 py-2 hover:bg-background"
                href={entry.href}
                key={`${entry.kind}-${entry.id}`}
              >
                <span className="text-xs text-muted-foreground">{entry.kind}</span>
                <strong>{entry.name}</strong>
                <b className="text-xs font-normal text-muted-foreground">{translate("details")}</b>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm leading-6 text-muted-foreground">{translate("searchEmpty")}</p>
          )}
        </div>
      )}
    </div>
  )
}
