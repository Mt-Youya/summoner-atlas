"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@summoner-atlas/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@summoner-atlas/ui/dialog"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@summoner-atlas/ui/command"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useTranslation } from "@/hooks/use-translation"
import { mockDataService } from "@/lib/mock-data"
import type { ChampionSearchResult, AugmentRank } from "@/lib/data-service"

export function CommandPalette() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const { isOpen, open, close } = useCommandPalette()
  const [query, setQuery] = useState("")
  const [champions, setChampions] = useState<ChampionSearchResult[]>([])
  const [augments, setAugments] = useState<AugmentRank[]>([])

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      setChampions([])
      setAugments([])
      return
    }
    const t = setTimeout(async () => {
      const [champResults, augResults] = await Promise.all([
        mockDataService.searchChampions({ query, mode: "aram" }),
        mockDataService.getTopAugments({ mode: "aram", limit: 50 }),
      ])
      setChampions(champResults)
      setAugments(
        augResults.filter(
          (a) => a.augment.name.toLowerCase().includes(query.toLowerCase()) || a.augment.nameZh.includes(query)
        )
      )
    }, 150)
    return () => clearTimeout(t)
  }, [query])

  const navigate = useCallback(
    (path: string) => {
      close()
      setQuery("")
      router.push(`/${locale}${path}`)
    },
    [close, locale, router]
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) close()
      }}
    >
      <DialogContent className="sm:max-w-[560px] p-0 shadow-[var(--glow-high)]">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("search")}</DialogTitle>
          <DialogDescription>{t("commandPalettePlaceholder")}</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder={t("commandPalettePlaceholder")} value={query} onValueChange={setQuery} autoFocus />
          <CommandList>
            <CommandEmpty>{t("searchEmpty")}</CommandEmpty>
            {champions.length > 0 && (
              <CommandGroup heading={t("champions")}>
                {champions.slice(0, 6).map((c) => (
                  <CommandItem key={c.champion.id} onSelect={() => navigate(`/champions/${c.champion.id}`)}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">{c.champion.nameZh}</span>
                      <span className="text-xs text-muted-foreground">{c.champion.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {c.winRate.toFixed(1)}%
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {augments.length > 0 && (
              <CommandGroup heading={t("augments")}>
                {augments.slice(0, 6).map((a) => (
                  <CommandItem key={a.augment.id} onSelect={() => navigate(`/augments/${a.augment.id}`)}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">{a.augment.nameZh}</span>
                      <span className="text-xs text-muted-foreground">{a.augment.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {a.winRate.toFixed(1)}%
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <div className="border-t px-3 py-2 text-[11px] text-muted-foreground flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd> {t("sort")}
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> Open
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> Close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
