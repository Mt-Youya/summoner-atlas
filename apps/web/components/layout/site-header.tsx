import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t } from "@summoner-atlas/i18n"

export async function SiteHeader() {
  const locale = await getLocale()
  const links = [
    [t(locale, "champions"), "/zh/champions"],
    [t(locale, "augments"), "/zh/augments"],
    [t(locale, "combinations"), "/zh/combinations"],
    [t(locale, "methodology"), "/zh/methodology"],
  ] as const
  return (
    <header className="grid min-h-20 grid-cols-[1fr_auto] items-center border-b border-border md:grid-cols-[1fr_auto_1fr]">
      <Link
        href={localizePath("/zh", locale)}
        className="flex items-center gap-2 font-mono text-xs font-bold tracking-[.09em]"
      >
        <span className="grid size-7 place-items-center bg-primary text-primary-foreground">R</span>
        <span>summoner-atlas</span>
      </Link>
      <nav className="hidden gap-2 md:flex" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link
            className="inline-flex min-h-11 items-center px-3 text-xs hover:bg-surface-raised"
            href={localizePath(href, locale)}
            key={href}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="justify-self-end flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          className="justify-self-end border border-border px-3 py-2 text-xs hover:bg-surface-raised"
          href={localizePath("/zh/profile", locale)}
        >
          {t(locale, "profile")}
        </Link>
      </div>
    </header>
  )
}
