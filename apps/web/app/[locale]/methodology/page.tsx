import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function MethodologyPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "dataMethodology")}
        title={t(locale, "methodologyTitle")}
        description={t(locale, "methodologyDesc")}
      />
      <section className="grid gap-4 py-12 md:grid-cols-2 md:pb-28">
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">01</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">{t(locale, "versionFixedTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "versionFixedDesc")}</p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">02</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">{t(locale, "sampleTierTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "sampleTierDesc")}</p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">03</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">{t(locale, "publiclyVerifiableTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "publiclyVerifiableDesc")}</p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">04</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">{t(locale, "notReplaceJudgmentTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "notReplaceJudgmentDesc")}</p>
        </article>
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
