"use client"

import { useTranslation } from "@/hooks/use-translation"

const cards = [
  ["versionFixedTitle", "versionFixedDesc"],
  ["sampleTierTitle", "sampleTierDesc"],
  ["publiclyVerifiableTitle", "publiclyVerifiableDesc"],
  ["notReplaceJudgmentTitle", "notReplaceJudgmentDesc"],
] as const

export default function MethodologyPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{t("dataMethodology")}</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("methodologyTitle")}</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground leading-7">{t("methodologyDesc")}</p>

      <div className="grid gap-4 mt-10 sm:grid-cols-2">
        {cards.map(([title, description]) => (
          <section key={title} className="rounded-2xl card-glow bg-card p-6">
            <h2 className="font-semibold text-foreground">{t(title)}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-6">{t(description)}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
