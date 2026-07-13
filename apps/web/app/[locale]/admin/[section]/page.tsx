import { notFound } from "next/navigation"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { getLocale } from "@/lib/i18n-server"
import { t, type MessageKey } from "@summoner-atlas/i18n"

const sectionInfo: Record<string, { titleKey: MessageKey; descKey: MessageKey }> = {
  overview: { titleKey: "systemOverview", descKey: "overviewDesc" },
  sources: { titleKey: "sourceManagement", descKey: "sourceDesc" },
  regions: { titleKey: "regionCoverage", descKey: "regionDesc" },
  versions: { titleKey: "dataVersions", descKey: "versionDesc" },
  champions: { titleKey: "championManagement", descKey: "championMgmtDesc" },
  augments: { titleKey: "augmentManagement", descKey: "augmentMgmtDesc" },
  items: { titleKey: "itemManagement", descKey: "itemMgmtDesc" },
  users: { titleKey: "userRoles", descKey: "userRolesDesc" },
}

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const locale = await getLocale()
  const info = sectionInfo[section]
  if (!info) notFound()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`${t(locale, "admin")} / ${t(locale, info.titleKey)}`}
        title={t(locale, info.titleKey)}
        description={t(locale, info.descKey)}
      />
      <section className="my-12 border border-border bg-surface p-6 md:mb-28">
        <h2 className="text-lg">{t(locale, "maintenanceUnavailable")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t(locale, "maintenanceRequired")}</p>
      </section>
    </PageFrame>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const locale = await getLocale()
  const info = sectionInfo[section]
  return { title: `${info ? t(locale, info.titleKey) : "404"} | ${t(locale, "admin")}` }
}
