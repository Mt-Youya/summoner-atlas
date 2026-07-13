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
      <section className="flex gap-6 py-11 pb-28">
        <a
          className="border-b border-foreground pb-1 text-sm"
          href="https://www.communitydragon.org/"
          target="_blank"
          rel="noreferrer"
        >
          CommunityDragon →
        </a>
        <a
          className="border-b border-foreground pb-1 text-sm"
          href="https://developer.riotgames.com/"
          target="_blank"
          rel="noreferrer"
        >
          Riot Developer Portal →
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
