import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function SupportPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "supportCompliance")}
        title={t(locale, "sources")}
        description={t(locale, "supportDesc")}
      />
      <section className="flex flex-wrap gap-6 py-12 pb-28">
        <a
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
          href="https://www.communitydragon.org/"
          target="_blank"
          rel="noreferrer"
        >
          CommunityDragon <span aria-hidden="true">&rarr;</span>
        </a>
        <a
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
          href="https://developer.riotgames.com/"
          target="_blank"
          rel="noreferrer"
        >
          Riot Developer Portal <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "supportCompliance")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath("/zh/support", locale)) },
  }
}
