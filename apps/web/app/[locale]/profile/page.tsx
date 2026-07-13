import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { PreferencesPanel } from "@/components/preferences-panel"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function ProfilePage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "profilePage")}
        title={t(locale, "profile")}
        description={t(locale, "profileDesc")}
      />
      <section className="grid gap-4 py-12 md:grid-cols-3">
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">{t(locale, "patchTracking")}</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">{t(locale, "currentPatch")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "patchPersistDesc")}</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">{t(locale, "qqBinding")}</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">{t(locale, "noAuthDetected")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "qqBindDesc")}</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">{t(locale, "riotBinding")}</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">{t(locale, "noAuthDetected")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "riotBindDesc")}</p>
        </article>
      </section>
      <section className="mt-8 border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm tracking-[.06em]">{t(locale, "preferences")}</h2>
        <PreferencesPanel />
      </section>
      <div className="mt-8 flex gap-4">
        <Link
          className="inline-flex border-b border-foreground pb-1 text-sm"
          href={localizePath("/zh/profile/accounts", locale)}
        >
          {t(locale, "accountBinding")}
        </Link>
        <Link
          className="inline-flex border-b border-foreground pb-1 text-sm"
          href={localizePath("/zh/profile/preferences", locale)}
        >
          {t(locale, "morePreferences")}
        </Link>
      </div>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "profilePage")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath("/zh/profile", locale)) },
  }
}
