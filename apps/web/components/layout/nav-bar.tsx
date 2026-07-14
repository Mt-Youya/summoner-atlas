"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search01Icon, Sun01Icon, Moon01Icon, ArrowDown01Icon } from "hugeicons-react"
import { Button, Badge, Separator } from "@summoner-atlas/ui"
import { useTheme } from "@/hooks/use-theme"
import { useTranslation, useLanguage, type Locale } from "@/hooks/use-translation"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { localeLabels } from "@summoner-atlas/i18n"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/champions", i18nKey: "champions" },
  { href: "/augments", i18nKey: "augments" },
  { href: "/builds", i18nKey: "builds" },
  { href: "/atlas", i18nKey: "openAtlas" },
  { href: "/meta", i18nKey: "meta" },
  { href: "/compare", i18nKey: "compare" },
  { href: "/patches", i18nKey: "patches" },
]

export function NavBar() {
  const { t, locale } = useTranslation()
  const theme = useTheme((s) => s.theme)
  const toggleTheme = useTheme((s) => s.toggle)
  const setLocale = useLanguage((s) => s.setLocale)
  const openCmdPalette = useCommandPalette((s) => s.open)
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: Locale) {
    setLocale(next)
    const segments = pathname.split("/")
    segments[1] = next
    router.push(segments.join("/"))
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-background/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="size-8 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-[var(--glow-mid)]">
              SA
            </div>
            <span className="hidden md:inline text-sm font-semibold tracking-widest uppercase hover:text-primary transition-colors duration-300">
              Summoner Atlas
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ href, i18nKey }) => (
              <Button
                key={href}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <Link href={href} className="text-muted-foreground hover:text-foreground">
                    {t(i18nKey)}
                  </Link>
                }
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={openCmdPalette}
            className="hidden md:inline-flex text-muted-foreground"
          >
            <Search01Icon data-icon="inline-start" />
            <span className="text-xs">{t("search")}</span>
            <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
              Ctrl+K
            </Badge>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
            {theme === "dark" ? <Sun01Icon /> : <Moon01Icon />}
          </Button>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="relative group">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
              <span className="uppercase text-xs font-semibold tracking-wider">{locale}</span>
              <ArrowDown01Icon className="size-3" />
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
              {(Object.entries(localeLabels) as [Locale, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => switchLocale(key)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg",
                    locale === key ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
