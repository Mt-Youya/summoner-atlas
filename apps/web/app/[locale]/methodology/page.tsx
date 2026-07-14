import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

const cards = [
  { titleKey: "versionFixedTitle", descKey: "versionFixedDesc" },
  { titleKey: "sampleTierTitle", descKey: "sampleTierDesc" },
  { titleKey: "publiclyVerifiableTitle", descKey: "publiclyVerifiableDesc" },
  { titleKey: "notReplaceJudgmentTitle", descKey: "notReplaceJudgmentDesc" },
] as const

export default async function MethodologyPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "dataMethodology")}
        title={t(locale, "methodologyTitle")}
        description={t(locale, "methodologyDesc")}
      />
      <section className="grid gap-3 py-12 sm:grid-cols-2 md:pb-28">
        {cards.map(({ titleKey, descKey }) => (
          <div
            key={titleKey}
            className="flex min-h-[180px] flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-bold tracking-[-0.03em]">{t(locale, titleKey)}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{t(locale, descKey)}</p>
          </div>
        ))}
      </section>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "dataMethodology")} | Summoner Atlas`,
    description: t(locale, "methodologyDesc"),
    alternates: { canonical: canonical(localizePath("/zh/methodology", locale)) },
  }
}
