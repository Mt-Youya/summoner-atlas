"use client"

import Link from "next/link"
import { FileNotFoundIcon } from "hugeicons-react"
import { Button } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {/* Star field bg */}
      <div className="absolute inset-0 bg-starfield opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <div className="size-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-8 shadow-[var(--glow-low)]">
          <FileNotFoundIcon className="size-10 text-destructive" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
          {t("routeNotFound")}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("linkExpiredDesc")}
        </p>

        <Button
          size="lg"
          nativeButton={false}
          className="shadow-[var(--glow-mid)]"
          render={<Link href="/">{t("backToHome")}</Link>}
        />
      </div>
    </div>
  )
}
