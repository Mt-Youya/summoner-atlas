import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function AccountsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "profileAccounts")}
        title={t(locale, "accountBinding")}
        description={t(locale, "qqBindDesc")}
      />
      <Link
        className="my-10 inline-flex border border-border bg-surface px-4 py-3 text-sm hover:bg-surface-raised"
        href={localizePath("/zh/login", locale)}
      >
        {t(locale, "authInfo")}
      </Link>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "profileAccounts")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath("/zh/profile/accounts", locale)) },
  }
}
