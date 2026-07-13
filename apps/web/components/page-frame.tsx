import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t, translateCopy } from "@summoner-atlas/i18n"

export async function PageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const links = [
    [t(locale, "champions"), "/zh/champions"],
    [t(locale, "augments"), "/zh/augments"],
    [t(locale, "combinations"), "/zh/combinations"],
    [t(locale, "methodology"), "/zh/methodology"],
  ] as const
  return (
    <main className="mx-auto min-h-screen w-[min(100%-2rem,1280px)]">
      <header className="grid min-h-20 grid-cols-[1fr_auto] items-center border-b border-border md:grid-cols-[1fr_auto_1fr]">
        <Link
          href={localizePath("/zh", locale)}
          className="flex items-center gap-2 font-mono text-xs font-bold tracking-[.09em]"
        >
          <span className="grid size-7 place-items-center bg-primary text-primary-foreground">R</span>
          <span>summoner-atlas</span>
        </Link>
        <nav className="hidden gap-2 md:flex" aria-label="主导航">
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
      {children}
      <footer className="flex min-h-28 flex-col justify-center gap-2 border-t border-border py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>数据版本 16.13 · 公开数据快照</span>
        <span>与 Riot Games 无关联。</span>
      </footer>
    </main>
  )
}

export async function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  const locale = await getLocale()
  return (
    <section className="border-b border-border pt-[clamp(5.5rem,12vw,10.4rem)] pb-14">
      <span className="font-mono text-xs font-bold tracking-[.1em] text-primary">{translateCopy(locale, eyebrow)}</span>
      <h1 className="mt-3 max-w-[10ch] text-[clamp(3rem,7vw,6.25rem)] font-black leading-[.88] tracking-[-.1em]">
        {translateCopy(locale, title)}
      </h1>
      <p className="mt-5 max-w-[62ch] leading-8 text-muted-foreground">{translateCopy(locale, description)}</p>
    </section>
  )
}
