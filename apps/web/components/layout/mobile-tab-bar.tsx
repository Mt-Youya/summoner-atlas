"use client"

import Link from "next/link"
import { Home01Icon, Sword01Icon, Search01Icon, MagicWand01Icon, UserIcon } from "hugeicons-react"
import { useTranslation } from "@/hooks/use-translation"

const tabs = [
  { href: "/", icon: Home01Icon, i18nKey: "homeKicker" },
  { href: "/champions", icon: Sword01Icon, i18nKey: "champions" },
  { href: "/search", icon: Search01Icon, i18nKey: "search" },
  { href: "/builds", icon: MagicWand01Icon, i18nKey: "builds" },
  { href: "/profile", icon: UserIcon, i18nKey: "profile" },
]

export function MobileTabBar() {
  const { t } = useTranslation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t bg-background/80 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, i18nKey }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{t(i18nKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
