"use client"

import Link from "next/link"
import { Separator } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"

export function Footer() {
  const { t } = useTranslation()

  const columns = [
    {
      title: t("dataMethod"),
      links: [
        ["/methodology", t("methodology")],
        ["/sources", t("sources")],
        ["/patches", t("patches")],
      ],
    },
    {
      title: t("menu"),
      links: [
        ["/champions", t("champions")],
        ["/augments", t("augments")],
        ["/compare", t("compare")],
        ["/builds", t("builds")],
      ],
    },
    {
      title: t("about"),
      links: [
        ["/about", t("about")],
        ["/support", t("support")],
        ["/atlas", "Atlas"],
      ],
    },
  ]

  return (
    <footer className="border-t mt-48">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              {t("supportCompliance")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footerNotAffiliated")}</p>
          </div>
        </div>

        <Separator className="mt-16 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground text-[8px] font-bold">
              SA
            </div>
            <span className="text-xs text-muted-foreground">Summoner Atlas v2</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("footerVersion")} 25.14 · {t("footerSnapshot")}
          </p>
        </div>
      </div>
    </footer>
  )
}
