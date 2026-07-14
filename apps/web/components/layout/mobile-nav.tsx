"use client"

import { useState } from "react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale, useTranslation } from "@/components/locale-provider"
import { localizePath } from "@summoner-atlas/i18n"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const translate = useTranslation()
  const links = [
    [translate("champions"), "/zh/champions"],
    [translate("augments"), "/zh/augments"],
    [translate("meta"), "/zh/meta"],
  ] as const

  return (
    <>
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm md:hidden"
        onClick={() => setOpen(true)}
        aria-label={translate("menu")}
        aria-expanded={open}
      >
        <span className="grid gap-1">
          <span className="block h-[2px] w-4 rounded-full bg-foreground" />
          <span className="block h-[2px] w-4 rounded-full bg-foreground" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] md:hidden" role="dialog" aria-modal="true" aria-label={translate("menu")}>
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-4 top-20 rounded-2xl border border-white/[0.08] bg-[oklch(0.2_0.018_250/0.97)] p-6 backdrop-blur-xl shadow-2xl">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {links.map(([label, href]) => (
                <Link
                  className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors hover:bg-white/[0.06]"
                  href={localizePath(href, locale)}
                  key={href}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <hr className="my-2 border-white/[0.06]" />
              <Link
                className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors hover:bg-white/[0.06]"
                href={localizePath("/zh/methodology", locale)}
                onClick={() => setOpen(false)}
              >
                {translate("dataMethod")}
              </Link>
              <Link
                className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors hover:bg-white/[0.06]"
                href={localizePath("/zh/profile", locale)}
                onClick={() => setOpen(false)}
              >
                {translate("profile")}
              </Link>
            </nav>
            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
              <LanguageSwitcher />
              <span className="ml-auto text-xs text-muted-foreground">
                SUMMONER <span className="text-primary">ATLAS</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
