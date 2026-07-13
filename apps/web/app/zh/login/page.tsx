import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function LoginPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowAccount")}
        title={t(locale, "loginBinding")}
        description={t(locale, "loginDesc")}
      />
      <section className="my-12 grid gap-6 md:grid-cols-2">
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="font-mono text-xs tracking-[.08em] text-primary uppercase">{t(locale, "qqLogin")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t(locale, "qqLoginDesc")}</p>
          <span className="mt-4 inline-block rounded bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground">
            {t(locale, "pending")}
          </span>
        </div>
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="font-mono text-xs tracking-[.08em] text-primary uppercase">{t(locale, "riotLogin")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t(locale, "riotLoginDesc")}</p>
          <span className="mt-4 inline-block rounded bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground">
            {t(locale, "pending")}
          </span>
        </div>
      </section>
      <Link className="inline-flex border-b border-foreground pb-1 text-sm" href="/zh/profile">
        {t(locale, "accountBinding")}
      </Link>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: `${t(locale, "loginBinding")} | Summoner Atlas`, alternates: { canonical: canonical("/zh/login") } }
}
