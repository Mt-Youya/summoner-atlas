"use client"

import { useTranslation } from "@/hooks/use-translation"

const sources = [
  { name: "CommunityDragon", href: "https://www.communitydragon.org/" },
  { name: "Riot Developer Portal", href: "https://developer.riotgames.com/" },
]

export default function SourcesPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{t("dataMethod")}</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("sources")}</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground leading-7">{t("supportDesc")}</p>

      <div className="flex flex-wrap gap-4 mt-10">
        {sources.map((source) => (
          <a
            key={source.href}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-border px-5 py-3 text-sm text-primary hover:bg-muted transition-colors"
          >
            {source.name} →
          </a>
        ))}
      </div>
    </div>
  )
}
