import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath, type MessageKey } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

const sectionKeys: [string, MessageKey, MessageKey][] = [
  ["overview", "systemOverview", "overviewDesc"],
  ["sources", "sourceManagement", "sourceDesc"],
  ["regions", "regionCoverage", "regionDesc"],
  ["versions", "dataVersions", "versionDesc"],
  ["champions", "championManagement", "championMgmtDesc"],
  ["augments", "augmentManagement", "augmentMgmtDesc"],
  ["items", "itemManagement", "itemMgmtDesc"],
  ["users", "userRoles", "userRolesDesc"],
]

export default async function AdminPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "adminAccess")}
        title={t(locale, "admin")}
        description={t(locale, "adminReadonly")}
      />
      <section className="grid gap-4 py-12 md:grid-cols-4 md:pb-28">
        {sectionKeys.map(([slug, titleKey, descKey]) => (
          <Link
            className="flex min-h-40 flex-col border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
            href={localizePath(`/zh/admin/${slug}`, locale)}
            key={slug}
          >
            <span className="font-mono text-xs text-primary">{t(locale, "admin")}</span>
            <h2 className="my-3 text-2xl tracking-[-.03em]">{t(locale, titleKey)}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{t(locale, descKey)}</p>
            <b className="mt-auto text-xs">{t(locale, "viewStatus")}</b>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "admin")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath("/zh/admin", locale)) },
  }
}
